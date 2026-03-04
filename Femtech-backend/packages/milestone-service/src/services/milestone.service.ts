// ============================================
// MILESTONE SERVICE - DATA ACCESS PATTERNS
// ============================================

import {
  BaseService,
  ServiceDependencies,
  ServiceContext,
  ServiceError,
} from '@momentum/shared/services';
import {
  MilestoneRepository,
  MilestoneWithDefinition,
  MilestoneProgress,
} from '../repositories/milestone.repository';
import { VerificationRepository } from '../repositories/verification.repository';
import { QrCodeService } from './qr-code.service';
import {
  MilestoneStatus,
  MilestoneCategory,
  CountryCode,
} from '@momentum/prisma-client';

// ============================================
// INTERFACES
// ============================================

export interface MilestoneListResponse {
  milestones: MilestoneWithDefinition[];
  progress: MilestoneProgress;
  nextMilestone?: MilestoneWithDefinition;
  recentlyCompleted: MilestoneWithDefinition[];
}

export interface VerificationInput {
  milestoneId: string;
  verifierId: string;
  qrData?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  notes?: string;
}

export interface AutoCompleteCondition {
  type: 'symptom_streak' | 'kick_session_count' | 'quiz_completion' | 'appointment_verified';
  params: Record<string, any>;
}

// ============================================
// SERVICE IMPLEMENTATION
// ============================================

export class MilestoneService extends BaseService {
  private milestoneRepo: MilestoneRepository;
  private verificationRepo: VerificationRepository;
  private qrService: QrCodeService;

  constructor(deps: ServiceDependencies, qrService: QrCodeService) {
    super(deps);

    this.milestoneRepo = new MilestoneRepository({
      prisma: deps.prisma,
      logger: deps.logger,
      cache: deps.cache,
      eventBus: deps.eventBus,
    });
    this.verificationRepo = new VerificationRepository({
      prisma: deps.prisma,
      logger: deps.logger,
    });
    this.qrService = qrService;

    // Subscribe to events for auto-completion
    this.subscribeToEvents();
  }

  // ============================================
  // EVENT SUBSCRIPTIONS
  // ============================================

  private subscribeToEvents(): void {
    // Listen for pregnancy registration to initialize milestones
    this.eventBus.subscribe('health.pregnancy.registered', async (event) => {
      await this.initializeMilestones(
        event.payload.userId,
        event.payload.pregnancyId,
        event.payload.country,
        event.payload.gestationalWeek
      );
    });

    // Listen for symptom logs to check streak milestones
    this.eventBus.subscribe('health.symptoms.logged', async (event) => {
      await this.checkSymptomStreak(event.payload.pregnancyId, event.payload.userId);
    });

    // Listen for kick sessions to check kick milestones
    this.eventBus.subscribe('health.kick_session.completed', async (event) => {
      await this.checkKickMilestones(event.payload.pregnancyId);
    });

    // Listen for appointment verification to complete clinical milestones
    this.eventBus.subscribe('health.appointment.verified', async (event) => {
      await this.checkAppointmentMilestones(
        event.payload.pregnancyId,
        event.payload.type
      );
    });
  }

  // ============================================
  // MILESTONE INITIALIZATION
  // ============================================

  /**
   * Initialize milestones for new pregnancy
   * Pattern: Fetch definitions → Create user milestones → Calculate availability
   */
  async initializeMilestones(
    userId: string,
    pregnancyId: string,
    country: CountryCode,
    gestationalWeek?: number
  ): Promise<void> {
    this.logger.info({ userId, pregnancyId, gestationalWeek }, 'Initializing milestones');

    await this.milestoneRepo.initializeMilestones(
      userId,
      pregnancyId,
      country,
      gestationalWeek
    );

    // Invalidate cache
    await this.invalidateCache(`milestones:${pregnancyId}:*`);
  }

  // ============================================
  // MILESTONE QUERIES
  // ============================================

  /**
   * Get all milestones for pregnancy with progress
   * Pattern: Fetch all → Calculate progress → Find next actionable → Find recent
   */
  async getMilestones(
    pregnancyId: string,
    filters?: {
      status?: MilestoneStatus;
      category?: MilestoneCategory;
    },
    context?: ServiceContext
  ): Promise<MilestoneListResponse> {
    const cacheKey = `milestones:${pregnancyId}:list:${JSON.stringify(filters || {})}`;

    return this.withCache(cacheKey, 120, async () => {
      const [milestones, progress] = await Promise.all([
        this.milestoneRepo.findForPregnancy(pregnancyId, filters),
        this.milestoneRepo.getProgress(pregnancyId),
      ]);

      // Find next actionable milestone
      const nextMilestone = milestones.find(
        (m) => m.status === 'available' || m.status === 'in_progress'
      );

      // Find recently completed (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentlyCompleted = milestones.filter(
        (m) =>
          m.status === 'completed' &&
          m.completedAt &&
          new Date(m.completedAt) > sevenDaysAgo
      );

      return {
        milestones,
        progress,
        nextMilestone,
        recentlyCompleted,
      };
    });
  }

  /**
   * Get single milestone with verification requirements
   */
  async getMilestone(
    milestoneId: string,
    context: ServiceContext
  ): Promise<{
    milestone: MilestoneWithDefinition;
    verificationOptions: string[];
    qrCode?: string;
  }> {
    const milestone = await this.milestoneRepo.findById(milestoneId) as MilestoneWithDefinition;

    if (!milestone) {
      throw new ServiceError('NOT_FOUND', 'Milestone not found');
    }

    const verificationOptions = milestone.milestoneDefinition.verificationTypes || [];

    // Generate QR code if QR verification is an option
    let qrCode: string | undefined;
    if (verificationOptions.includes('qr_scan')) {
      qrCode = await this.qrService.generateMilestoneQr({
        milestoneId,
        userId: context.userId!,
        type: milestone.milestoneDefinition.code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      });
    }

    return { milestone, verificationOptions, qrCode };
  }

  // ============================================
  // MILESTONE PROGRESSION
  // ============================================

  /**
   * Start working on a milestone
   * Pattern: Validate status → Update → Emit event
   */
  async startMilestone(
    milestoneId: string,
    context: ServiceContext
  ): Promise<MilestoneWithDefinition> {
    const milestone = await this.milestoneRepo.findById(milestoneId) as MilestoneWithDefinition;

    if (!milestone) {
      throw new ServiceError('NOT_FOUND', 'Milestone not found');
    }

    if (milestone.status !== 'available') {
      throw new ServiceError(
        'VALIDATION_ERROR',
        `Cannot start milestone in ${milestone.status} status`
      );
    }

    const updated = await this.milestoneRepo.startMilestone(milestoneId);

    await this.invalidateCache(`milestones:${milestone.pregnancyId}:*`);

    return updated as MilestoneWithDefinition;
  }

  /**
   * Update milestone progress (for progressive milestones)
   * Pattern: Validate → Update progress → Check auto-complete
   */
  async updateProgress(
    milestoneId: string,
    progressPercent: number,
    progressData?: Record<string, any>,
    context?: ServiceContext
  ): Promise<MilestoneWithDefinition> {
    const milestone = await this.milestoneRepo.findById(milestoneId) as MilestoneWithDefinition;

    if (!milestone) {
      throw new ServiceError('NOT_FOUND', 'Milestone not found');
    }

    if (!['available', 'in_progress'].includes(milestone.status)) {
      throw new ServiceError('VALIDATION_ERROR', 'Milestone cannot be updated');
    }

    const updated = await this.milestoneRepo.update(milestoneId, {
      progressPercent: Math.min(100, progressPercent),
      progressData,
      status: milestone.status === 'available' ? 'in_progress' : milestone.status,
      startedAt: milestone.startedAt || new Date(),
    });

    // Check for auto-completion
    if (progressPercent >= 100 && milestone.milestoneDefinition.autoComplete) {
      return this.autoCompleteMilestone(milestoneId, context);
    }

    await this.invalidateCache(`milestones:${milestone.pregnancyId}:*`);

    return updated as MilestoneWithDefinition;
  }

  /**
   * Submit milestone for verification
   * Pattern: Validate → Update status → Notify verifiers
   */
  async submitForVerification(
    milestoneId: string,
    progressData?: Record<string, any>,
    context?: ServiceContext
  ): Promise<MilestoneWithDefinition> {
    const milestone = await this.milestoneRepo.findById(milestoneId) as MilestoneWithDefinition;

    if (!milestone) {
      throw new ServiceError('NOT_FOUND', 'Milestone not found');
    }

    if (!['available', 'in_progress'].includes(milestone.status)) {
      throw new ServiceError('VALIDATION_ERROR', 'Milestone cannot be submitted');
    }

    if (!milestone.milestoneDefinition.requiresVerification) {
      // Auto-complete if no verification required
      return this.autoCompleteMilestone(milestoneId, context);
    }

    const updated = await this.milestoneRepo.submitForVerification(
      milestoneId,
      progressData
    );

    // Notify available verifiers
    await this.publishEvent('milestone.submitted_for_verification', {
      milestoneId,
      userId: milestone.userId,
      pregnancyId: milestone.pregnancyId,
      milestoneCode: milestone.milestoneDefinition.code,
      category: milestone.milestoneDefinition.category,
    }, context);

    await this.invalidateCache(`milestones:${milestone.pregnancyId}:*`);

    return updated as MilestoneWithDefinition;
  }

  // ============================================
  // VERIFICATION FLOW
  // ============================================

  /**
   * Verify milestone completion (by verifier)
   * Pattern: Validate verifier → Record verification → Complete milestone → Trigger reward
   */
  async verifyMilestone(
    input: VerificationInput,
    context: ServiceContext
  ): Promise<MilestoneWithDefinition> {
    this.logger.info({ milestoneId: input.milestoneId, verifierId: input.verifierId }, 'Verifying milestone');

    const milestone = await this.milestoneRepo.findById(input.milestoneId) as MilestoneWithDefinition;

    if (!milestone) {
      throw new ServiceError('NOT_FOUND', 'Milestone not found');
    }

    if (milestone.status !== 'pending_verification') {
      throw new ServiceError(
        'VALIDATION_ERROR',
        `Cannot verify milestone in ${milestone.status} status`
      );
    }

    // Validate QR code if provided
    if (input.qrData) {
      const qrValid = await this.qrService.validateMilestoneQr(input.qrData, {
        milestoneId: input.milestoneId,
        userId: milestone.userId,
      });

      if (!qrValid) {
        throw new ServiceError('VALIDATION_ERROR', 'Invalid or expired QR code');
      }
    }

    // Generate verification hash
    const verificationHash = await this.generateVerificationHash({
      milestoneId: input.milestoneId,
      verifierId: input.verifierId,
      timestamp: new Date().toISOString(),
      location: input.latitude && input.longitude
        ? { lat: input.latitude, lng: input.longitude }
        : undefined,
    });

    // Record verification
    await this.verificationRepo.create({
      userMilestoneId: input.milestoneId,
      verifierId: input.verifierId,
      verificationType: input.qrData ? 'qr_scan' : 'manual',
      verificationHash,
      qrCodeData: input.qrData,
      latitude: input.latitude,
      longitude: input.longitude,
      photoUrl: input.photoUrl,
      notes: input.notes,
      deviceId: context.deviceId,
    });

    // Complete milestone
    const completed = await this.milestoneRepo.completeMilestone(
      input.milestoneId,
      input.verifierId
    );

    // Emit event for token service to mint reward
    await this.publishEvent('milestone.completed', {
      milestoneId: input.milestoneId,
      userId: milestone.userId,
      pregnancyId: milestone.pregnancyId,
      milestoneCode: milestone.milestoneDefinition.code,
      rewardAmount: milestone.milestoneDefinition.rewardAmount,
      verifierId: input.verifierId,
      verificationHash,
    }, context);

    await this.invalidateCache(`milestones:${milestone.pregnancyId}:*`);

    return completed as MilestoneWithDefinition;
  }

  /**
   * Auto-complete milestone (no verification required)
   * Pattern: Validate → Complete → Trigger reward
   */
  private async autoCompleteMilestone(
    milestoneId: string,
    context?: ServiceContext
  ): Promise<MilestoneWithDefinition> {
    const milestone = await this.milestoneRepo.findById(milestoneId) as MilestoneWithDefinition;

    if (!milestone) {
      throw new ServiceError('NOT_FOUND', 'Milestone not found');
    }

    const completed = await this.milestoneRepo.autoCompleteMilestone(milestoneId);

    // Emit event for token service
    await this.publishEvent('milestone.completed', {
      milestoneId,
      userId: milestone.userId,
      pregnancyId: milestone.pregnancyId,
      milestoneCode: milestone.milestoneDefinition.code,
      rewardAmount: milestone.milestoneDefinition.rewardAmount,
      autoCompleted: true,
    }, context);

    await this.invalidateCache(`milestones:${milestone.pregnancyId}:*`);

    return completed as MilestoneWithDefinition;
  }

  // ============================================
  // AUTO-COMPLETION CHECKS (Event-driven)
  // ============================================

  /**
   * Check symptom streak milestones
   * Called when symptom log is created
   */
  private async checkSymptomStreak(pregnancyId: string, userId: string): Promise<void> {
    this.logger.debug({ pregnancyId }, 'Checking symptom streak milestones');

    // Find streak milestones that are available or in progress
    const streakMilestones = await this.prisma.userMilestone.findMany({
      where: {
        pregnancyId,
        status: { in: ['available', 'in_progress'] },
        milestoneDefinition: {
          code: { startsWith: 'CHECKIN_' },
          autoComplete: true,
        },
      },
      include: { milestoneDefinition: true },
    });

    for (const milestone of streakMilestones) {
      const conditions = milestone.milestoneDefinition.autoCompleteConditions as AutoCompleteCondition[];
      
      if (!conditions) continue;

      const streakCondition = conditions.find((c) => c.type === 'symptom_streak');
      
      if (streakCondition) {
        const requiredStreak = streakCondition.params.days || 7;
        
        // Query symptom logs for streak (would call MongoDB service)
        const currentStreak = await this.getSymptomStreak(pregnancyId);

        const progressPercent = Math.min(100, (currentStreak / requiredStreak) * 100);

        await this.updateProgress(milestone.id, progressPercent, {
          currentStreak,
          requiredStreak,
        });
      }
    }
  }

  /**
   * Check kick counter milestones
   */
  private async checkKickMilestones(pregnancyId: string): Promise<void> {
    this.logger.debug({ pregnancyId }, 'Checking kick milestones');

    const kickMilestones = await this.prisma.userMilestone.findMany({
      where: {
        pregnancyId,
        status: { in: ['available', 'in_progress'] },
        milestoneDefinition: {
          code: { startsWith: 'KICK_' },
          autoComplete: true,
        },
      },
      include: { milestoneDefinition: true },
    });

    for (const milestone of kickMilestones) {
      const conditions = milestone.milestoneDefinition.autoCompleteConditions as AutoCompleteCondition[];
      
      if (!conditions) continue;

      const kickCondition = conditions.find((c) => c.type === 'kick_session_count');
      
      if (kickCondition) {
        const requiredSessions = kickCondition.params.count || 5;
        const periodDays = kickCondition.params.days || 7;

        // Query kick sessions
        const sessionsCount = await this.getKickSessionCount(pregnancyId, periodDays);

        const progressPercent = Math.min(100, (sessionsCount / requiredSessions) * 100);

        await this.updateProgress(milestone.id, progressPercent, {
          sessionsCount,
          requiredSessions,
          periodDays,
        });
      }
    }
  }

  /**
   * Check appointment-based milestones
   */
  private async checkAppointmentMilestones(
    pregnancyId: string,
    appointmentType: string
  ): Promise<void> {
    this.logger.debug({ pregnancyId, appointmentType }, 'Checking appointment milestones');

    // Map appointment types to milestone codes
    const appointmentMilestoneMap: Record<string, string[]> = {
      anc_visit: ['ANC_VISIT_1', 'ANC_VISIT_2', 'ANC_VISIT_3', 'ANC_VISIT_4'],
      ultrasound: ['ULTRASOUND_1', 'ULTRASOUND_2'],
      lab_test: ['LAB_HIV', 'LAB_BLOOD_TYPE', 'LAB_GLUCOSE'],
    };

    const possibleCodes = appointmentMilestoneMap[appointmentType] || [];

    if (possibleCodes.length === 0) return;

    // Find first uncompleted milestone of this type
    const milestone = await this.prisma.userMilestone.findFirst({
      where: {
        pregnancyId,
        status: { in: ['available', 'in_progress', 'pending_verification'] },
        milestoneDefinition: {
          code: { in: possibleCodes },
        },
      },
      include: { milestoneDefinition: true },
      orderBy: { milestoneDefinition: { sortOrder: 'asc' } },
    });

    if (milestone) {
      // Auto-complete if appointment verification is sufficient
      if (milestone.milestoneDefinition.autoComplete) {
        await this.autoCompleteMilestone(milestone.id);
      } else {
        // Submit for final verification
        await this.submitForVerification(milestone.id, {
          appointmentType,
          verifiedByAppointment: true,
        });
      }
    }
  }

  // ============================================
  // WEEKLY UNLOCK CHECK
  // ============================================

  /**
   * Check and unlock milestones based on gestational week
   * Called by scheduler weekly or when pregnancy data updates
   */
  async checkWeeklyUnlocks(
    pregnancyId: string,
    gestationalWeek: number,
    context?: ServiceContext
  ): Promise<MilestoneWithDefinition[]> {
    const unlocked = await this.milestoneRepo.unlockEligibleMilestones(
      pregnancyId,
      gestationalWeek
    );

    if (unlocked.length > 0) {
      await this.publishEvent('milestone.batch_unlocked', {
        pregnancyId,
        gestationalWeek,
        unlockedCount: unlocked.length,
        milestoneIds: unlocked.map((m) => m.id),
      }, context);

      await this.invalidateCache(`milestones:${pregnancyId}:*`);
    }

    return unlocked as MilestoneWithDefinition[];
  }

  // ============================================
  // HELPERS
  // ============================================

  private async generateVerificationHash(data: Record<string, any>): Promise<string> {
    const crypto = await import('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(data));
    return hash.digest('hex');
  }

  private async getSymptomStreak(pregnancyId: string): Promise<number> {
    // This would query MongoDB through symptom service
    // Simplified implementation
    return 0;
  }

  private async getKickSessionCount(pregnancyId: string, days: number): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const count = await this.prisma.kickSession.count({
      where: {
        pregnancyId,
        reachedTarget: true,
        startedAt: { gte: startDate },
      },
    });

    return count;
  }
}