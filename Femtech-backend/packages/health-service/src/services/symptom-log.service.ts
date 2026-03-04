// ============================================
// SYMPTOM LOG SERVICE - MONGODB DATA ACCESS
// ============================================

import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { Logger } from '@momentum/shared/logger';

// ============================================
// INTERFACES
// ============================================

export interface SymptomLogDocument {
  _id?: ObjectId;
  userId: string;
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
    heartRate?: number;
  };
  mood?: 'great' | 'good' | 'okay' | 'low' | 'very_low';
  fetalMovement?: 'normal' | 'increased' | 'decreased' | 'none';
  gestationalWeek?: number;
  triageResult?: {
    urgency: string;
    recommendation: string;
    actions: string[];
  };
  country?: string;
  deviceId?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  syncedFromOffline?: boolean;
  offlineCreatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SymptomTrends {
  mostCommonSymptoms: { type: string; count: number }[];
  moodTrend: { date: string; mood: string }[];
  urgencyBreakdown: { urgency: string; count: number }[];
  averageVitals?: {
    bloodPressure?: { systolic: number; diastolic: number };
    weight?: number;
  };
}

// ============================================
// SERVICE IMPLEMENTATION
// ============================================

export class SymptomLogService {
  private db: Db;
  private collection: Collection<SymptomLogDocument>;
  private logger: Logger;

  constructor(mongoClient: MongoClient, logger: Logger) {
    this.db = mongoClient.db('momentum_health');
    this.collection = this.db.collection<SymptomLogDocument>('symptom_logs');
    this.logger = logger.child({ service: 'SymptomLogService' });

    // Ensure indexes
    this.ensureIndexes();
  }

  private async ensureIndexes(): Promise<void> {
    await this.collection.createIndexes([
      { key: { userId: 1, createdAt: -1 } },
      { key: { pregnancyId: 1, createdAt: -1 } },
      { key: { 'symptoms.type': 1 } },
      { key: { 'triageResult.urgency': 1 } },
      { key: { createdAt: 1 }, expireAfterSeconds: 365 * 24 * 60 * 60 * 2 }, // 2 years TTL
    ]);
  }

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  async createLog(data: Omit<SymptomLogDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();

    const doc: SymptomLogDocument = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(doc);

    this.logger.debug({ logId: result.insertedId.toString() }, 'Symptom log created');

    return result.insertedId.toString();
  }

  async updateTriageResult(
    logId: string,
    triageResult: SymptomLogDocument['triageResult']
  ): Promise<void> {
    await this.collection.updateOne(
      { _id: new ObjectId(logId) },
      {
        $set: {
          triageResult,
          updatedAt: new Date(),
        },
      }
    );
  }

  async findById(logId: string): Promise<SymptomLogDocument | null> {
    return this.collection.findOne({ _id: new ObjectId(logId) });
  }

  async findByPregnancy(
    pregnancyId: string,
    options?: {
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<SymptomLogDocument[]> {
    const query: any = { pregnancyId };

    if (options?.startDate || options?.endDate) {
      query.createdAt = {};
      if (options.startDate) query.createdAt.$gte = options.startDate;
      if (options.endDate) query.createdAt.$lte = options.endDate;
    }

    return this.collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(options?.limit || 50)
      .toArray();
  }

  // ============================================
  // ANALYTICS & TRENDS
  // ============================================

  async analyzeTrends(
    pregnancyId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<SymptomTrends> {
    const matchStage: any = { pregnancyId };

    if (options?.startDate || options?.endDate) {
      matchStage.createdAt = {};
      if (options.startDate) matchStage.createdAt.$gte = options.startDate;
      if (options.endDate) matchStage.createdAt.$lte = options.endDate;
    }

    // Run aggregation pipelines in parallel
    const [symptomCounts, moodTrend, urgencyBreakdown, vitalAverages] = await Promise.all([
      // Most common symptoms
      this.collection.aggregate([
        { $match: matchStage },
        { $unwind: '$symptoms' },
        { $group: { _id: '$symptoms.type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { type: '$_id', count: 1, _id: 0 } },
      ]).toArray(),

      // Mood trend over time
      this.collection.aggregate([
        { $match: { ...matchStage, mood: { $exists: true } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            mood: { $last: '$mood' },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { date: '$_id', mood: 1, _id: 0 } },
      ]).toArray(),

      // Urgency breakdown
      this.collection.aggregate([
        { $match: { ...matchStage, 'triageResult.urgency': { $exists: true } } },
        { $group: { _id: '$triageResult.urgency', count: { $sum: 1 } } },
        { $project: { urgency: '$_id', count: 1, _id: 0 } },
      ]).toArray(),

      // Average vitals
      this.collection.aggregate([
        { $match: { ...matchStage, vitals: { $exists: true } } },
        {
          $group: {
            _id: null,
            avgSystolic: { $avg: '$vitals.bloodPressureSystolic' },
            avgDiastolic: { $avg: '$vitals.bloodPressureDiastolic' },
            avgWeight: { $avg: '$vitals.weight' },
          },
        },
      ]).toArray(),
    ]);

    return {
      mostCommonSymptoms: symptomCounts as any,
      moodTrend: moodTrend as any,
      urgencyBreakdown: urgencyBreakdown as any,
      averageVitals: vitalAverages[0]
        ? {
            bloodPressure: vitalAverages[0].avgSystolic
              ? {
                  systolic: Math.round(vitalAverages[0].avgSystolic),
                  diastolic: Math.round(vitalAverages[0].avgDiastolic),
                }
              : undefined,
            weight: vitalAverages[0].avgWeight
              ? Math.round(vitalAverages[0].avgWeight * 10) / 10
              : undefined,
          }
        : undefined,
    };
  }

  /**
   * Calculate symptom streak (consecutive days with check-ins)
   */
  async getSymptomStreak(pregnancyId: string): Promise<number> {
    const logs = await this.collection
      .find({ pregnancyId })
      .sort({ createdAt: -1 })
      .limit(30)
      .project({ createdAt: 1 })
      .toArray();

    if (logs.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const logDates = new Set(
      logs.map(log => {
        const d = new Date(log.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.toISOString();
      })
    );

    // Check consecutive days starting from today
    while (true) {
      if (logDates.has(currentDate.toISOString())) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // ============================================
  // OFFLINE SYNC
  // ============================================

  /**
   * Bulk insert offline logs
   */
  async syncOfflineLogs(logs: Omit<SymptomLogDocument, '_id'>[]): Promise<{
    inserted: number;
    duplicates: number;
  }> {
    let inserted = 0;
    let duplicates = 0;

    for (const log of logs) {
      // Check for duplicate based on offline timestamp
      if (log.offlineCreatedAt) {
        const existing = await this.collection.findOne({
          pregnancyId: log.pregnancyId,
          offlineCreatedAt: log.offlineCreatedAt,
        });

        if (existing) {
          duplicates++;
          continue;
        }
      }

      await this.createLog({
        ...log,
        syncedFromOffline: true,
      });
      inserted++;
    }

    return { inserted, duplicates };
  }

  // ============================================
  // ADMIN QUERIES
  // ============================================

  /**
   * Get emergency alerts (admin dashboard)
   */
  async getEmergencyAlerts(options: {
    country?: string;
    since?: Date;
    limit?: number;
  }): Promise<SymptomLogDocument[]> {
    const query: any = {
      'triageResult.urgency': { $in: ['emergency', 'urgent'] },
    };

    if (options.country) query.country = options.country;
    if (options.since) query.createdAt = { $gte: options.since };

    return this.collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(options.limit || 100)
      .toArray();
  }

  /**
   * Get symptom statistics by country (admin)
   */
  async getCountryStatistics(country: string, days: number = 30): Promise<{
    totalLogs: number;
    uniqueUsers: number;
    emergencyCount: number;
    topSymptoms: { type: string; count: number }[];
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [stats, topSymptoms] = await Promise.all([
      this.collection.aggregate([
        {
          $match: {
            country,
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            totalLogs: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' },
            emergencyCount: {
              $sum: {
                $cond: [{ $eq: ['$triageResult.urgency', 'emergency'] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            totalLogs: 1,
            uniqueUsers: { $size: '$uniqueUsers' },
            emergencyCount: 1,
          },
        },
      ]).toArray(),

      this.collection.aggregate([
        {
          $match: {
            country,
            createdAt: { $gte: startDate },
          },
        },
        { $unwind: '$symptoms' },
        { $group: { _id: '$symptoms.type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { type: '$_id', count: 1, _id: 0 } },
      ]).toArray(),
    ]);

    return {
      totalLogs: stats[0]?.totalLogs || 0,
      uniqueUsers: stats[0]?.uniqueUsers || 0,
      emergencyCount: stats[0]?.emergencyCount || 0,
      topSymptoms: topSymptoms as any,
    };
  }
}
