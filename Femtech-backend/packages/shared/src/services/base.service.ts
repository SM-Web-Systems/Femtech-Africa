// ============================================
// BASE SERVICE - SHARED PATTERNS
// ============================================

import { Logger } from '../logger';
import { EventBus, DomainEvent } from '../events';
import { CacheService } from '../cache';
import { PrismaClient } from '@momentum/prisma-client';

export interface ServiceContext {
  userId?: string;
  requestId: string;
  country?: string;
  language?: string;
  deviceId?: string;
  ip?: string;
}

export interface ServiceDependencies {
  prisma: PrismaClient;
  logger: Logger;
  eventBus: EventBus;
  cache: CacheService;
}

export abstract class BaseService {
  protected prisma: PrismaClient;
  protected logger: Logger;
  protected eventBus: EventBus;
  protected cache: CacheService;

  constructor(deps: ServiceDependencies) {
    this.prisma = deps.prisma;
    this.logger = deps.logger.child({ service: this.constructor.name });
    this.eventBus = deps.eventBus;
    this.cache = deps.cache;
  }

  // ============================================
  // EVENT PUBLISHING
  // ============================================

  protected async publishEvent<T>(
    type: string,
    payload: T,
    context?: ServiceContext
  ): Promise<void> {
    const event: DomainEvent<T> = {
      id: crypto.randomUUID(),
      type,
      payload,
      metadata: {
        timestamp: new Date().toISOString(),
        source: this.constructor.name,
        userId: context?.userId,
        requestId: context?.requestId,
        correlationId: context?.requestId,
      },
    };

    await this.eventBus.publish(event);
    this.logger.debug({ eventType: type }, 'Event published');
  }

  // ============================================
  // CACHING HELPERS
  // ============================================

  protected async withCache<T>(
    key: string,
    ttlSeconds: number,
    factory: () => Promise<T>
  ): Promise<T> {
    const cached = await this.cache.get<T>(key);
    if (cached !== null) {
      this.logger.debug({ key }, 'Cache hit');
      return cached;
    }

    const result = await factory();
    await this.cache.set(key, result, ttlSeconds);
    return result;
  }

  protected async invalidateCache(pattern: string): Promise<void> {
    await this.cache.delPattern(pattern);
  }

  // ============================================
  // TRANSACTION WRAPPER
  // ============================================

  protected async withTransaction<T>(
    fn: (tx: PrismaClient) => Promise<T>,
    options?: { timeout?: number; isolationLevel?: string }
  ): Promise<T> {
    return this.prisma.$transaction(fn as any, {
      maxWait: 5000,
      timeout: options?.timeout || 10000,
    });
  }

  // ============================================
  // ERROR HANDLING
  // ============================================

  protected handleError(error: unknown, operation: string): never {
    this.logger.error({ error, operation }, 'Service error');
    
    if (error instanceof ServiceError) {
      throw error;
    }

    throw new ServiceError(
      'INTERNAL_ERROR',
      `Failed to ${operation}`,
      error
    );
  }
}

// ============================================
// CUSTOM ERRORS
// ============================================

export type ErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'INSUFFICIENT_BALANCE'
  | 'RATE_LIMITED'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'INTERNAL_ERROR';

export class ServiceError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public cause?: unknown,
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'ServiceError';
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      metadata: this.metadata,
    };
  }
}