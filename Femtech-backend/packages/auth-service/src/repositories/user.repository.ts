// ============================================
// USER REPOSITORY
// ============================================

import {
  User,
  UserProfile,
  Prisma,
  UserStatus,
  UserRole,
  CountryCode,
} from '@momentum/prisma-client';
import {
  BaseRepository,
  RepositoryOptions,
  PaginatedResult,
} from '@momentum/shared/database';

export interface UserWithProfile extends User {
  profile?: UserProfile | null;
}

export interface CreateUserInput {
  phone: string;
  country: CountryCode;
  language?: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  phoneVerified?: boolean;
  email?: string;
  emailVerified?: boolean;
  language?: string;
  status?: UserStatus;
  role?: UserRole;
  walletAddress?: string;
  walletCreatedAt?: Date;
  lastLoginAt?: Date;
}

export interface UserFilters {
  country?: CountryCode;
  status?: UserStatus;
  role?: UserRole;
  phoneVerified?: boolean;
  hasWallet?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  search?: string; // phone prefix search
}

export class UserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserWhereInput,
  Prisma.UserOrderByWithRelationInput
> {
  protected modelName = 'user';
  protected cachePrefix = 'user';
  protected cacheTTL = 300; // 5 minutes

  constructor(options: RepositoryOptions) {
    super(options);
  }

  // ============================================
  // CUSTOM QUERIES
  // ============================================

  async findByPhone(phone: string): Promise<UserWithProfile | null> {
    const cacheKey = `${this.cachePrefix}:phone:${phone}`;
    
    if (this.cache) {
      const cached = await this.cache.get<UserWithProfile>(cacheKey);
      if (cached) return cached;
    }

    const user = await this.executeQuery('findByPhone', () =>
      this.prisma.user.findUnique({
        where: { phone },
        include: { profile: true },
      })
    );

    if (user && this.cache) {
      await this.cache.set(cacheKey, user, this.cacheTTL);
    }

    return user;
  }

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    return this.executeQuery('findByWalletAddress', () =>
      this.prisma.user.findUnique({
        where: { walletAddress },
      })
    );
  }

  async findWithFilters(
    filters: UserFilters,
    pagination?: { page?: number; limit?: number }
  ): Promise<PaginatedResult<UserWithProfile>> {
    const where: Prisma.UserWhereInput = {};

    if (filters.country) where.country = filters.country;
    if (filters.status) where.status = filters.status;
    if (filters.role) where.role = filters.role;
    if (filters.phoneVerified !== undefined) where.phoneVerified = filters.phoneVerified;
    
    if (filters.hasWallet !== undefined) {
      where.walletAddress = filters.hasWallet ? { not: null } : null;
    }
    
    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};
      if (filters.createdAfter) where.createdAt.gte = filters.createdAfter;
      if (filters.createdBefore) where.createdAt.lte = filters.createdBefore;
    }
    
    if (filters.search) {
      where.phone = { startsWith: filters.search };
    }

    return this.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      pagination,
      include: { profile: true },
    }) as Promise<PaginatedResult<UserWithProfile>>;
  }

  async createWithProfile(
    userData: CreateUserInput,
    profileData?: {
      firstNameEncrypted: Buffer;
      lastNameEncrypted: Buffer;
      encryptionKeyId: string;
    }
  ): Promise<UserWithProfile> {
    return this.withTransaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          phone: userData.phone,
          country: userData.country,
          language: userData.language || 'en',
          role: userData.role || 'mother',
          status: 'pending_verification',
        },
      });

      if (profileData) {
        await tx.userProfile.create({
          data: {
            userId: user.id,
            ...profileData,
          },
        });
      }

      return tx.user.findUnique({
        where: { id: user.id },
        include: { profile: true },
      }) as Promise<UserWithProfile>;
    });
  }

  async updateWallet(
    userId: string,
    walletAddress: string
  ): Promise<User> {
    const user = await this.update(userId, {
      walletAddress,
      walletCreatedAt: new Date(),
    });

    await this.emitEvent('wallet_created', user);
    return user;
  }

  async deactivate(userId: string, reason?: string): Promise<User> {
    const user = await this.update(userId, {
      status: 'deactivated',
    });

    await this.emitEvent('deactivated', { ...user, reason });
    return user;
  }

  async getStatsByCountry(): Promise<
    { country: CountryCode; total: number; active: number; withWallet: number }[]
  > {
    const stats = await this.executeQuery('getStatsByCountry', () =>
      this.prisma.user.groupBy({
        by: ['country'],
        _count: { id: true },
        where: { status: 'active' },
      })
    );

    // Get wallet counts separately
    const walletStats = await this.executeQuery('getWalletStats', () =>
      this.prisma.user.groupBy({
        by: ['country'],
        _count: { id: true },
        where: { walletAddress: { not: null } },
      })
    );

    const walletMap = new Map(
      walletStats.map((s) => [s.country, s._count.id])
    );

    return stats.map((s) => ({
      country: s.country,
      total: s._count.id,
      active: s._count.id,
      withWallet: walletMap.get(s.country) || 0,
    }));
  }

  // Override cache invalidation to also clear phone-based cache
  protected async invalidateCache(entity: User): Promise<void> {
    await super.invalidateCache(entity);
    if (this.cache && entity.phone) {
      await this.cache.del(`${this.cachePrefix}:phone:${entity.phone}`);
    }
  }
}
