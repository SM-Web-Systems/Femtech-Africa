// ============================================
// HEALTH SERVICE - DATA ACCESS PATTERNS
// ============================================

import {
  BaseService,
  ServiceDependencies,
  ServiceContext,
  ServiceError,
} from '@momentum/shared/services';
import { PregnancyRepository, PregnancyWithRelations } from '../repositories/pregnancy.repository';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { KickSessionRepository } from '../repositories/kick-session.repository';
import { MedicalHistoryRepository } from '../repositories/medical-history.repository';
import { SymptomLogService } from './symptom-log.service'; // MongoDB
import { TriageEngine } from './triage-engine.service';
import {
  Pregnancy,
  PregnancyStatus,
  AppointmentType,
  CountryCode,
  BloodType,
} from '@momentum/prisma-client';

// ============================================
// INTERFACES
// ============================================

export interface RegisterPregnancyInput {
  userId: string;
  lmpDate?: Date;
  eddDate?: Date;
  gravida?: number;
  parity?: number;
  bloodType?: BloodType;
  facilityId?: string;
  medicalHistory?: {
    conditionType: string;
    description: string;
    icdCode?: string;
  }[];
  emergencyContacts?: {
    name: string;
    phone: string;
    relationship: string;
    isPrimary?: boolean;
  }[];
}

export interface SymptomCheckInInput {
  pregnancyId: string;
  symptoms: {
    type: string;
    severity: 'mild' | 'moderate' | 'severe';
    duration?: string;
    notes?: string;
  }[];
  vitals?: {
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    weight?: number;
    temperature?: number;
  };
  mood?: 'great' | 'good' | 'okay' | 'low' | 'very_low';
  fetalMovement?: 'normal' | 'increased' | 'decreased' | 'none';
}

export interface TriageResult {
  urgency: 'emergency' | 'urgent' | 'routine' | 'self_care';
  recommendation: string;
  actions: string[];
  nextSteps?: string[];
  emergencyNumber?: string;
}

export interface KickCounterSession {
  id: string;
  startedAt: Date;
  kickCount: number;
  targetKicks: number;
  durationMinutes?: number;
  status: 'active' | 'completed' | 'abandoned';
}

// ============================================
// SERVICE IMPLEMENTATION
// ============================================

export class HealthService extends BaseService {
  private pregnancyRepo: PregnancyRepository;
  private appointmentRepo: AppointmentRepository;
  private kickRepo: KickSessionRepository;
  private historyRepo: MedicalHistoryRepository;
  private symptomService: SymptomLogService;
  private triageEngine: TriageEngine;

  constructor(
    deps: ServiceDependencies,
    symptomService: SymptomLogService,
    triageEngine: TriageEngine
  ) {
    super(deps);

    this.pregnancyRepo = new PregnancyRepository({
      prisma: deps.prisma,
      logger: deps.logger,
      cache: deps.cache,
      eventBus: deps.eventBus,
    });
    this.appointmentRepo = new AppointmentRepository({
      prisma: deps.prisma,
      logger: deps.logger,
    });
    this.kickRepo = new KickSessionRepository({
      prisma: deps.prisma,
      logger: deps.logger,
    });
    this.historyRepo = new MedicalHistoryRepository({
      prisma: deps.prisma,
      logger: deps.logger,
    });

    this.symptomService = symptomService;
    this.triageEngine = triageEngine;
  }

  // ============================================
  // PREGNANCY MANAGEMENT
  // ============================================

  /**
   * Register new pregnancy
   * Pattern: Validate → Create pregnancy → Add history → Add contacts → Initialize milestones (event)
   */
  async registerPregnancy(
    input: RegisterPregnancyInput,
    context: ServiceContext
  ): Promise<PregnancyWithRelations> {
    this.logger.info({ userId: input.userId }, 'Registering pregnancy');

    // Check for existing active pregnancy
    const existingActive = await this.pregnancyRepo.findActiveByUser(input.userId);
    
    if (existingActive) {
      throw new ServiceError(
        'CONFLICT',
        'User already has an active pregnancy',
        null,
        { existingPregnancyId: existingActive.id }
      );
    }

    const pregnancy = await this.withTransaction(async (tx) => {
      // Create pregnancy
      const preg = await this.pregnancyRepo.createPregnancy({
        userId: input.userId,
        lmpDate: input.lmpDate,
        eddDate: input.eddDate,
        gravida: input.gravida,
        parity: input.parity,
        primaryFacilityId: input.facilityId,
      });

      // Update blood type if provided
      if (input.bloodType) {
        await this.pregnancyRepo.update(preg.id, { bloodType: input.bloodType });
      }

      // Add medical history
      if (input.medicalHistory?.length) {
        for (const history of input.medicalHistory) {
          await this.historyRepo.create({
            pregnancyId: preg.id,
            conditionType: history.conditionType as any,
            description: history.description,
            icdCode: history.icdCode,
          });
        }
      }

      // Add emergency contacts
      if (input.emergencyContacts?.length) {
        for (const contact of input.emergencyContacts) {
          await tx.emergencyContact.create({
            data: {
              pregnancyId: preg.id,
              ...contact,
            },
          });
        }
      }

      return preg;
    });

    // Calculate gestational week for milestone initialization
    const gestationalWeek = await this.pregnancyRepo.getGestationalWeek(pregnancy);

    // Publish event for milestone service to initialize milestones
    await this.publishEvent('health.pregnancy.registered', {
      pregnancyId: pregnancy.id,
      userId: input.userId,
      gestationalWeek,
      country: context.country,
    }, context);

    // Fetch full pregnancy with relations
    return this.pregnancyRepo.findByIdWithDetails(pregnancy.id) as Promise<PregnancyWithRelations>;
  }

  /**
   * Get active pregnancy with all details
   * Pattern: Cache check → Fetch with relations → Calculate derived data
   */
  async getActivePregnancy(
    userId: string,
    context: ServiceContext
  ): Promise<{
    pregnancy: PregnancyWithRelations;
    gestationalWeek: number | null;
    daysUntilDue: number | null;
    trimester: 1 | 2 | 3 | null;
  } | null> {
    const cacheKey = `pregnancy:active:${userId}:full`;

    return this.withCache(cacheKey, 60, async () => {
      const pregnancy = await this.pregnancyRepo.findActiveByUser(userId);

      if (!pregnancy) {
        return null;
      }

      const gestationalWeek = await this.pregnancyRepo.getGestationalWeek(pregnancy);
      
      let daysUntilDue: number | null = null;
      if (pregnancy.eddDate) {
        const today = new Date();
        const edd = new Date(pregnancy.eddDate);
        daysUntilDue = Math.ceil((edd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      }

      let trimester: 1 | 2 | 3 | null = null;
      if (gestationalWeek !== null) {
        if (gestationalWeek <= 12) trimester = 1;
        else if (gestationalWeek <= 27) trimester = 2;
        else trimester = 3;
      }

      return {
        pregnancy,
        gestationalWeek,
        daysUntilDue,
        trimester,
      };
    });
  }

  /**
   * Update pregnancy risk status
   * Pattern: Validate → Update → Emit alert if high risk
   */
  async updateRiskStatus(
    pregnancyId: string,
    isHighRisk: boolean,
    riskFactors: string[],
    context: ServiceContext
  ): Promise<Pregnancy> {
    const pregnancy = await this.pregnancyRepo.updateRiskStatus(
      pregnancyId,
      isHighRisk,
      riskFactors
    );

    if (isHighRisk) {
      await this.publishEvent('health.pregnancy.high_risk', {
        pregnancyId,
        userId: pregnancy.userId,
        riskFactors,
      }, context);
    }

    // Invalidate cache
    await this.invalidateCache(`pregnancy:active:${pregnancy.userId}:*`);

    return pregnancy;
  }

  // ============================================
  // SYMPTOM TRACKING (MongoDB)
  // ============================================

  /**
   * Log symptoms and run triage
   * Pattern: Store in MongoDB → Run triage → Return recommendations → Emit events
   */
  async logSymptoms(
    input: SymptomCheckInInput,
    context: ServiceContext
  ): Promise<{ logId: string; triage: TriageResult }> {
    this.logger.info({ pregnancyId: input.pregnancyId }, 'Logging symptoms');

    // Get pregnancy for context
    const pregnancy = await this.pregnancyRepo.findById(input.pregnancyId);
    
    if (!pregnancy) {
      throw new ServiceError('NOT_FOUND', 'Pregnancy not found');
    }

    const gestationalWeek = await this.pregnancyRepo.getGestationalWeek(pregnancy);

    // Store symptom log in MongoDB
    const logId = await this.symptomService.createLog({
      userId: context.userId!,
      pregnancyId: input.pregnancyId,
      symptoms: input.symptoms,
      vitals: input.vitals,
      mood: input.mood,
      fetalMovement: input.fetalMovement,
      gestationalWeek,
      country: pregnancy.user?.country || context.country,
      deviceId: context.deviceId,
    });

    // Run triage engine
    const triage = await this.triageEngine.evaluate({
      symptoms: input.symptoms,
      vitals: input.vitals,
      fetalMovement: input.fetalMovement,
      gestationalWeek,
      isHighRisk: pregnancy.isHighRisk,
      riskFactors: pregnancy.riskFactors,
      medicalHistory: await this.historyRepo.findByPregnancy(input.pregnancyId),
    });

    // Update symptom log with triage result
    await this.symptomService.updateTriageResult(logId, triage);

    // Emit events based on urgency
    await this.publishEvent('health.symptoms.logged', {
      logId,
      pregnancyId: input.pregnancyId,
      userId: context.userId,
      urgency: triage.urgency,
      symptomCount: input.symptoms.length,
    }, context);

    if (triage.urgency === 'emergency') {
      await this.publishEvent('health.emergency.detected', {
        logId,
        pregnancyId: input.pregnancyId,
        userId: context.userId,
        symptoms: input.symptoms.map(s => s.type),
        recommendation: triage.recommendation,
      }, context);
    }

    return { logId, triage };
  }

  /**
   * Get symptom history
   * Pattern: Query MongoDB with pagination → Aggregate trends
   */
  async getSymptomHistory(
    pregnancyId: string,
    options: {
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    },
    context: ServiceContext
  ): Promise<{
    logs: any[];
    trends: {
      mostCommonSymptoms: { type: string; count: number }[];
      moodTrend: { date: string; mood: string }[];
      urgencyBreakdown: { urgency: string; count: number }[];
    };
  }> {
    const logs = await this.symptomService.findByPregnancy(pregnancyId, options);
    const trends = await this.symptomService.analyzeTrends(pregnancyId, options);

    return { logs, trends };
  }

  // ============================================
  // KICK COUNTER
  // ============================================

  /**
   * Start kick counting session
   * Pattern: Check for active session → Create new session → Return session
   */
  async startKickSession(
    pregnancyId: string,
    targetKicks: number = 10,
    context: ServiceContext
  ): Promise<KickCounterSession> {
    // Check for existing active session
    const existingSession = await this.kickRepo.findActiveSession(pregnancyId);
    
    if (existingSession) {
      // Return existing session instead of creating new
      return {
        id: existingSession.id,
        startedAt: existingSession.startedAt,
        kickCount: existingSession.kickCount,
        targetKicks: existingSession.targetKicks,
        status: 'active',
      };
    }

    const session = await this.kickRepo.createSession({
      pregnancyId,
      targetKicks,
    });

    return {
      id: session.id,
      startedAt: session.startedAt,
      kickCount: 0,
      targetKicks,
      status: 'active',
    };
  }

  /**
   * Record kick
   * Pattern: Increment counter → Check if target reached → Update session
   */
  async recordKick(
    sessionId: string,
    context: ServiceContext
  ): Promise<KickCounterSession> {
    const session = await this.kickRepo.incrementKick(sessionId);

    // Check if target reached
    if (session.kickCount >= session.targetKicks && !session.reachedTarget) {
      const duration = Math.floor(
        (new Date().getTime() - session.startedAt.getTime()) / 60000
      );

      await this.kickRepo.completeSession(sessionId, duration);

      // Emit event for potential milestone completion
      await this.publishEvent('health.kick_session.completed', {
        sessionId,
        pregnancyId: session.pregnancyId,
        kickCount: session.kickCount,
        durationMinutes: duration,
      }, context);
    }

    return {
      id: session.id,
      startedAt: session.startedAt,
      kickCount: session.kickCount,
      targetKicks: session.targetKicks,
      status: session.kickCount >= session.targetKicks ? 'completed' : 'active',
    };
  }

  /**
   * End kick session (manual completion or abandon)
   */
  async endKickSession(
    sessionId: string,
    context: ServiceContext
  ): Promise<KickCounterSession> {
    const session = await this.kickRepo.findById(sessionId);

    if (!session) {
      throw new ServiceError('NOT_FOUND', 'Session not found');
    }

    const duration = Math.floor(
      (new Date().getTime() - session.startedAt.getTime()) / 60000
    );

    const completed = session.kickCount >= session.targetKicks;

    if (completed) {
      await this.kickRepo.completeSession(sessionId, duration);
    } else {
      await this.kickRepo.update(sessionId, {
        endedAt: new Date(),
        durationMinutes: duration,
      });
    }

    // Check for concerning pattern (low kick count)
    if (session.kickCount < 5 && duration >= 60) {
      await this.publishEvent('health.kick_session.concerning', {
        sessionId,
        pregnancyId: session.pregnancyId,
        kickCount: session.kickCount,
        durationMinutes: duration,
      }, context);
    }

    return {
      id: session.id,
      startedAt: session.startedAt,
      kickCount: session.kickCount,
      targetKicks: session.targetKicks,
      durationMinutes: duration,
      status: completed ? 'completed' : 'abandoned',
    };
  }

  /**
   * Get kick session history with statistics
   */
  async getKickHistory(
    pregnancyId: string,
    options: { limit?: number; days?: number },
    context: ServiceContext
  ): Promise<{
    sessions: any[];
    statistics: {
      averageKicksPerSession: number;
      averageDurationMinutes: number;
      sessionsThisWeek: number;
      concerningSessions: number;
    };
  }> {
    const sessions = await this.kickRepo.findByPregnancy(pregnancyId, options);
    const statistics = await this.kickRepo.getStatistics(pregnancyId, options.days || 30);

    return { sessions, statistics };
  }

  // ============================================
  // APPOINTMENTS
  // ============================================

  /**
   * Schedule appointment
   * Pattern: Check for conflicts → Create appointment → Schedule reminder
   */
  async scheduleAppointment(
    input: {
      pregnancyId: string;
      facilityId: string;
      type: AppointmentType;
      scheduledDate: Date;
      scheduledTime?: Date;
      notes?: string;
    },
    context: ServiceContext
  ): Promise<any> {
    // Check for conflicts
    const conflicts = await this.appointmentRepo.findConflicts(
      input.pregnancyId,
      input.scheduledDate
    );

    if (conflicts.length > 0) {
      this.logger.warn({ conflicts }, 'Appointment conflicts found');
      // Could throw error or return warning
    }

    const appointment = await this.appointmentRepo.create({
      pregnancy: { connect: { id: input.pregnancyId } },
      facility: { connect: { id: input.facilityId } },
      type: input.type,
      scheduledDate: input.scheduledDate,
      scheduledTime: input.scheduledTime,
    });

    // Emit event for notification service to schedule reminders
    await this.publishEvent('health.appointment.scheduled', {
      appointmentId: appointment.id,
      pregnancyId: input.pregnancyId,
      userId: context.userId,
      type: input.type,
      scheduledDate: input.scheduledDate,
    }, context);

    return appointment;
  }

  /**
   * Get upcoming appointments
   */
  async getUpcomingAppointments(
    pregnancyId: string,
    context: ServiceContext
  ): Promise<any[]> {
    return this.appointmentRepo.findUpcoming(pregnancyId);
  }

  /**
   * Verify appointment completion
   * Pattern: Validate verifier → Update appointment → Emit for milestone check
   */
  async verifyAppointment(
    appointmentId: string,
    verifierId: string,
    verificationHash: string,
    context: ServiceContext
  ): Promise<any> {
    const appointment = await this.appointmentRepo.verify(
      appointmentId,
      verifierId,
      verificationHash
    );

    // Emit event for milestone service to check completion
    await this.publishEvent('health.appointment.verified', {
      appointmentId,
      pregnancyId: appointment.pregnancyId,
      type: appointment.type,
      verifierId,
    }, context);

    return appointment;
  }
}
