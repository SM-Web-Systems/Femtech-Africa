// ============================================
// MILESTONE REPOSITORY
// ============================================

import {
  UserMilestone,
  MilestoneDefinition,
  MilestoneStatus,
  MilestoneCategory,
  Prisma,
  CountryCode,
} from '@momentum/prisma-client';
import {
  BaseRepository,
  RepositoryOptions,
  PaginatedResult,
} from '@momentum/shared/database';

export interface MilestoneWithDefinition extends UserMilestone {
  milestoneDefinition: MilestoneDefinition;
  verifier?: { id: string; type: string; verificationCode: string } | null;
}

export interface MilestoneProgress {
  total: number;
  completed: number;
  inProgress: number;
  available: number;
  locked: number;
  tokensEarned: number;
  tokensPending: number;
}

export interface MilestoneFilters {
  userId?: string;
  pregnancyId?: string;
  status?: MilestoneStatus;
  category?: MilestoneCategory;
  requiresVerification?: boolean;
}

export class MilestoneRepository extends BaseRepository<
  UserMilestone,
  Prisma.UserMilestoneCreateInput,
  Prisma.UserMilestoneUpdateInput,
  Prisma.UserMilestoneWhereInput,
  Prisma.UserMilestoneOrderByWithRelationInput
> {
  protected modelName = 'userMilestone';
  protected cachePrefix = 'milestone';
  protected cacheTTL = 180;

  constructor(options: RepositoryOptions) {
    super(options);
  }

  // ============================================
  // DEFINITION QUERIES
  // ============================================

  async findDefinitions(params: {
    category?: MilestoneCategory;
    country?: CountryCode;
    gestationalWeek?: number;
    isActive?: boolean;
  }): Promise<MilestoneDefinition[]> {
    const where: Prisma.MilestoneDefinitionWhereInput = {};

    if (params.category) where.category = params.category;
    if (params.isActive !== undefined) where.isActive = params.isActive;
    
    if (params.country) {
      where.OR = [
        { countries: { has: params.country } },
        { countries: { isEmpty: true } },
      ];
    }

    if (params.gestationalWeek !== undefined) {
      where.AND = [
        {
          OR: [
            { gestationalWeekMin: null },
            { gestationalWeekMin: { lte: params.gestationalWeek } },
          ],
        },
        {
          OR: [
            { gestationalWeekMax: null },
            { gestationalWeekMax: { gte: params.gestationalWeek } },
          ],
        },
      ];
    }

    return this.executeQuery('findDefinitions', () =>
      this.prisma.milestoneDefinition.findMany({
        where,
        orderBy: [
          { category: 'asc' },
          { sortOrder: 'asc' },
        ],
      })
    );
  }

  async findDefinitionByCode(code: string): Promise<MilestoneDefinition | null> {
    const cacheKey = `milestone:def:${code}`;
    
    if (this.cache) {
      const cached = await this.cache.get<MilestoneDefinition>(cacheKey);
      if (cached) return cached;
    }

    const definition = await this.executeQuery('findDefinitionByCode', () =>
      this.prisma.milestoneDefinition.findUnique({
        where: { code },
      })
    );

    if (definition && this.cache) {
      await this.cache.set(cacheKey, definition, 3600); // 1 hour
    }

    return definition;
  }

  // ============================================
  // USER MILESTONE QUERIES
  // ============================================

  async findForPregnancy(
    pregnancyId: string,
    filters?: { status?: MilestoneStatus; category?: MilestoneCategory }
  ): Promise<MilestoneWithDefinition[]> {
    const where: Prisma.UserMilestoneWhereInput = {
      pregnancyId,
    };

    if (filters?.status) where.status = filters.status;
    if (filters?.category) {
      where.milestoneDefinition = { category: filters.category };
    }

    return this.executeQuery('findForPregnancy', () =>
      this.prisma.userMilestone.findMany({
        where,
        include: {
          milestoneDefinition: true,
          verifier: {
            select: { id: true, type: true, verificationCode: true },
          },
        },
        orderBy: [
          { milestoneDefinition: { category: 'asc' } },
          { milestoneDefinition: { sortOrder: 'asc' } },
        ],
      })
    );
  }

  async getProgress(pregnancyId: string): Promise<MilestoneProgress> {
    const cacheKey = `${this.cachePrefix}:progress:${pregnancyId}`;
    
    if (this.cache) {
      const cached = await this.cache.get<MilestoneProgress>(cacheKey);
      if (cached) return cached;
    }

    const milestones = await this.prisma.userMilestone.findMany({
      where: { pregnancyId },
      include: { milestoneDefinition: true },
    });

    const progress: MilestoneProgress = {
      total: milestones.length,
      completed: 0,
      inProgress: 0,
      available: 0,
      locked: 0,
      tokensEarned: 0,
      tokensPending: 0,
    };

    for (const m of milestones) {
      switch (m.status) {
        case 'completed':
          progress.completed++;
          progress.tokensEarned += m.rewardAmount || 0;
          break;
        case 'in_progress':
        case 'pending_verification':
          progress.inProgress++;
          progress.tokensPending += m.milestoneDefinition.rewardAmount;
          break;
        case 'available':
          progress.available++;
          break;
        case 'locked':
          progress.locked++;
          break;
      }
    }

    if (this.cache) {
      await this.cache.set(cacheKey, progress, 60);
    }

    return progress;
  }

  async initializeMilestones(
    userId: string,
    pregnancyId: string,
    country: CountryCode,
    gestationalWeek?: number
  ): Promise<UserMilestone[]> {
    // Get applicable definitions
    const definitions = await this.findDefinitions({
      country,
      isActive: true,
    });

    // Create milestones in transaction
    return this.withTransaction(async (tx) => {
      const milestones: UserMilestone[] = [];

      for (const def of definitions) {
        // Determine initial status
        let status: MilestoneStatus = 'locked';
        
        if (gestationalWeek !== undefined) {
          const minWeek = def.gestationalWeekMin ?? 0;
          const maxWeek = def.gestationalWeekMax ?? 99;
          
          if (gestationalWeek >= minWeek && gestationalWeek <= maxWeek) {
            status = 'available';
          }
        }

        const milestone = await tx.userMilestone.create({
          data: {
            userId,
            pregnancyId,
            milestoneDefinitionId: def.id,
            status,
            rewardAmount: def.rewardAmount,
            unlockedAt: status === 'available' ? new Date() : null,
          },
        });

        milestones.push(milestone);
      }

      return milestones;
    });
  }

  async startMilestone(id: string): Promise<UserMilestone> {
    const milestone = await this.update(id, {
      status: 'in_progress',
      startedAt: new Date(),
    });

    await this.emitEvent('started', milestone);
    return milestone;
  }

  async submitForVerification(
    id: string,
    progressData?: Record<string, any>
  ): Promise<UserMilestone> {
    const milestone = await this.update(id, {
      status: 'pending_verification',
      progressPercent: 100,
      progressData,
    });

    await this.emitEvent('submitted_for_verification', milestone);
    return milestone;
  }

  async completeMilestone(
    id: string,
    verifierId: string,
    rewardTxId?: string
  ): Promise<UserMilestone> {
    const milestone = await this.update(id, {
      status: 'completed',
      completedAt: new Date(),
      verifiedAt: new Date(),
      verifiedBy: verifierId,
      rewardTxId,
    });

    await this.emitEvent('completed', milestone);
    await this.invalidateProgressCache(milestone.pregnancyId);
    
    return milestone;
  }

  async autoCompleteMilestone(
    id: string,
    rewardTxId?: string
  ): Promise<UserMilestone> {
    const milestone = await this.update(id, {
      status: 'completed',
      completedAt: new Date(),
      rewardTxId,
    });

    await this.emitEvent('auto_completed', milestone);
    await this.invalidateProgressCache(milestone.pregnancyId);
    
    return milestone;
  }

  async unlockEligibleMilestones(
    pregnancyId: string,
    gestationalWeek: number
  ): Promise<UserMilestone[]> {
    const unlocked: UserMilestone[] = [];

    const lockedMilestones = await this.prisma.userMilestone.findMany({
      where: {
        pregnancyId,
        status: 'locked',
      },
      include: { milestoneDefinition: true },
    });

    for (const m of lockedMilestones) {
      const def = m.milestoneDefinition;
      const minWeek = def.gestationalWeekMin ?? 0;
      const maxWeek = def.gestationalWeekMax ?? 99;

      if (gestationalWeek >= minWeek && gestationalWeek <= maxWeek) {
        const updated = await this.update(m.id, {
          status: 'available',
          unlockedAt: new Date(),
        });
        unlocked.push(updated);
        await this.emitEvent('unlocked', updated);
      }
    }

    if (unlocked.length > 0) {
      await this.invalidateProgressCache(pregnancyId);
    }

    return unlocked;
  }

  async getPendingVerifications(
    verifierId?: string,
    facilityId?: string
  ): Promise<MilestoneWithDefinition[]> {
    const where: Prisma.UserMilestoneWhereInput = {
      status: 'pending_verification',
    };

    if (verifierId) {
      where.verifiedBy = verifierId;
    }

    return this.executeQuery('getPendingVerifications', () =>
      this.prisma.userMilestone.findMany({
        where,
        include: {
          milestoneDefinition: true,
          user: { select: { id: true, phone: true } },
          pregnancy: { select: { id: true, eddDate: true } },
        },
        orderBy: { updatedAt: 'asc' },
      })
    ) as Promise<MilestoneWithDefinition[]>;
  }

  private async invalidateProgressCache(pregnancyId: string): Promise<void> {
    if (this.cache) {
      await this.cache.del(`${this.cachePrefix}:progress:${pregnancyId}`);
    }
  }
}
