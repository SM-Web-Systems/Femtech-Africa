// ============================================
// PREGNANCY REPOSITORY
// ============================================

import {
  Pregnancy,
  PregnancyStatus,
  Prisma,
  CountryCode,
} from '@momentum/prisma-client';
import {
  BaseRepository,
  RepositoryOptions,
  PaginatedResult,
} from '@momentum/shared/database';

export interface PregnancyWithRelations extends Pregnancy {
  primaryFacility?: { id: string; name: string; type: string } | null;
  _count?: {
    appointments: number;
    milestones: number;
    kickSessions: number;
  };
}

export interface CreatePregnancyInput {
  userId: string;
  lmpDate?: Date;
  eddDate?: Date;
  gravida?: number;
  parity?: number;
  primaryFacilityId?: string;
}

export interface PregnancyFilters {
  userId?: string;
  status?: PregnancyStatus;
  isHighRisk?: boolean;
  facilityId?: string;
  country?: CountryCode;
  eddBefore?: Date;
  eddAfter?: Date;
  gestationalWeekMin?: number;
  gestationalWeekMax?: number;
}

export class PregnancyRepository extends BaseRepository<
  Pregnancy,
  Prisma.PregnancyCreateInput,
  Prisma.PregnancyUpdateInput,
  Prisma.PregnancyWhereInput,
  Prisma.PregnancyOrderByWithRelationInput
> {
  protected modelName = 'pregnancy';
  protected cachePrefix = 'pregnancy';
  protected cacheTTL = 300;

  constructor(options: RepositoryOptions) {
    super(options);
  }

  // ============================================
  // CUSTOM QUERIES
  // ============================================

  async findActiveByUser(userId: string): Promise<PregnancyWithRelations | null> {
    const cacheKey = `${this.cachePrefix}:active:${userId}`;
    
    if (this.cache) {
      const cached = await this.cache.get<PregnancyWithRelations>(cacheKey);
      if (cached) return cached;
    }

    const pregnancy = await this.executeQuery('findActiveByUser', () =>
      this.prisma.pregnancy.findFirst({
        where: {
          userId,
          status: 'active',
        },
        include: {
          primaryFacility: {
            select: { id: true, name: true, type: true },
          },
          _count: {
            select: {
              appointments: true,
              milestones: true,
              kickSessions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    );

    if (pregnancy && this.cache) {
      await this.cache.set(cacheKey, pregnancy, 60); // Short TTL for active pregnancy
    }

    return pregnancy;
  }

  async findByIdWithDetails(id: string): Promise<PregnancyWithRelations | null> {
    return this.executeQuery('findByIdWithDetails', () =>
      this.prisma.pregnancy.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, phone: true, country: true, walletAddress: true },
          },
          primaryFacility: true,
          medicalHistory: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
          },
          emergencyContacts: {
            orderBy: { isPrimary: 'desc' },
          },
          _count: {
            select: {
              appointments: true,
              milestones: true,
              kickSessions: true,
            },
          },
        },
      })
    );
  }

  async findWithFilters(
    filters: PregnancyFilters,
    pagination?: { page?: number; limit?: number }
  ): Promise<PaginatedResult<PregnancyWithRelations>> {
    const where: Prisma.PregnancyWhereInput = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.status) where.status = filters.status;
    if (filters.isHighRisk !== undefined) where.isHighRisk = filters.isHighRisk;
    if (filters.facilityId) where.primaryFacilityId = filters.facilityId;
    
    if (filters.country) {
      where.user = { country: filters.country };
    }

    if (filters.eddBefore || filters.eddAfter) {
      where.eddDate = {};
      if (filters.eddBefore) where.eddDate.lte = filters.eddBefore;
      if (filters.eddAfter) where.eddDate.gte = filters.eddAfter;
    }

    return this.findMany({
      where,
      orderBy: { eddDate: 'asc' },
      pagination,
      include: {
        primaryFacility: { select: { id: true, name: true, type: true } },
        _count: { select: { appointments: true, milestones: true } },
      },
    }) as Promise<PaginatedResult<PregnancyWithRelations>>;
  }

  async createPregnancy(data: CreatePregnancyInput): Promise<Pregnancy> {
    // Calculate EDD if LMP provided
    let eddDate = data.eddDate;
    if (!eddDate && data.lmpDate) {
      eddDate = new Date(data.lmpDate);
      eddDate.setDate(eddDate.getDate() + 280); // 40 weeks
    }

    return this.create({
      user: { connect: { id: data.userId } },
      lmpDate: data.lmpDate,
      eddDate,
      gravida: data.gravida || 1,
      parity: data.parity || 0,
      status: 'active',
      primaryFacility: data.primaryFacilityId
        ? { connect: { id: data.primaryFacilityId } }
        : undefined,
    });
  }

  async updateRiskStatus(
    id: string,
    isHighRisk: boolean,
    riskFactors: string[]
  ): Promise<Pregnancy> {
    const pregnancy = await this.update(id, {
      isHighRisk,
      riskFactors,
    });

    if (isHighRisk) {
      await this.emitEvent('high_risk_flagged', pregnancy);
    }

    return pregnancy;
  }

  async markDelivered(
    id: string,
    deliveryDate: Date
  ): Promise<Pregnancy> {
    const pregnancy = await this.update(id, {
      status: 'delivered',
      deliveryDate,
    });

    await this.emitEvent('delivered', pregnancy);
    return pregnancy;
  }

  async getGestationalWeek(pregnancy: Pregnancy): Promise<number | null> {
    if (!pregnancy.lmpDate) return null;
    
    const today = new Date();
    const diffMs = today.getTime() - new Date(pregnancy.lmpDate).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    
    return Math.min(weeks, 42); // Cap at 42 weeks
  }

  async getDueSoonPregnancies(
    withinDays: number = 14,
    country?: CountryCode
  ): Promise<Pregnancy[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + withinDays);

    const where: Prisma.PregnancyWhereInput = {
      status: 'active',
      eddDate: {
        gte: new Date(),
        lte: targetDate,
      },
    };

    if (country) {
      where.user = { country };
    }

    return this.executeQuery('getDueSoonPregnancies', () =>
      this.prisma.pregnancy.findMany({
        where,
        include: {
          user: { select: { id: true, phone: true, country: true } },
        },
        orderBy: { eddDate: 'asc' },
      })
    );
  }

  // Override cache invalidation
  protected async invalidateCache(entity: Pregnancy): Promise<void> {
    await super.invalidateCache(entity);
    if (this.cache) {
      await this.cache.del(`${this.cachePrefix}:active:${entity.userId}`);
    }
  }
}
