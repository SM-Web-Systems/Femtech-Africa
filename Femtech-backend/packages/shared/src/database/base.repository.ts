// ============================================
// BASE REPOSITORY - SHARED PATTERNS
// ============================================

import { PrismaClient, Prisma } from '@momentum/prisma-client';
import { Logger } from '../logger';
import { CacheService } from '../cache';
import { EventBus } from '../events';

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextCursor?: string;
  };
}

export interface RepositoryOptions {
  prisma: PrismaClient;
  logger: Logger;
  cache?: CacheService;
  eventBus?: EventBus;
}

export abstract class BaseRepository<
  TModel,
  TCreateInput,
  TUpdateInput,
  TWhereInput,
  TOrderByInput
> {
  protected prisma: PrismaClient;
  protected logger: Logger;
  protected cache?: CacheService;
  protected eventBus?: EventBus;
  
  protected abstract modelName: string;
  protected abstract cachePrefix: string;
  protected abstract cacheTTL: number; // seconds

  constructor(options: RepositoryOptions) {
    this.prisma = options.prisma;
    this.logger = options.logger.child({ repository: this.constructor.name });
    this.cache = options.cache;
    this.eventBus = options.eventBus;
  }

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  async findById(id: string): Promise<TModel | null> {
    const cacheKey = `${this.cachePrefix}:${id}`;
    
    // Try cache first
    if (this.cache) {
      const cached = await this.cache.get<TModel>(cacheKey);
      if (cached) {
        this.logger.debug({ id }, 'Cache hit');
        return cached;
      }
    }

    const result = await this.executeQuery('findById', () =>
      (this.prisma[this.modelName as keyof PrismaClient] as any).findUnique({
        where: { id },
      })
    );

    // Cache result
    if (result && this.cache) {
      await this.cache.set(cacheKey, result, this.cacheTTL);
    }

    return result;
  }

  async findMany(params: {
    where?: TWhereInput;
    orderBy?: TOrderByInput;
    pagination?: PaginationParams;
    include?: Record<string, boolean | object>;
  }): Promise<PaginatedResult<TModel>> {
    const { where, orderBy, pagination = {}, include } = params;
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.executeQuery('findMany', () =>
        (this.prisma[this.modelName as keyof PrismaClient] as any).findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include,
        })
      ),
      this.executeQuery('count', () =>
        (this.prisma[this.modelName as keyof PrismaClient] as any).count({ where })
      ),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async create(data: TCreateInput): Promise<TModel> {
    const result = await this.executeQuery('create', () =>
      (this.prisma[this.modelName as keyof PrismaClient] as any).create({ data })
    );

    await this.invalidateCache(result);
    await this.emitEvent('created', result);

    return result;
  }

  async update(id: string, data: TUpdateInput): Promise<TModel> {
    const result = await this.executeQuery('update', () =>
      (this.prisma[this.modelName as keyof PrismaClient] as any).update({
        where: { id },
        data,
      })
    );

    await this.invalidateCache(result);
    await this.emitEvent('updated', result);

    return result;
  }

  async delete(id: string): Promise<TModel> {
    const result = await this.executeQuery('delete', () =>
      (this.prisma[this.modelName as keyof PrismaClient] as any).delete({
        where: { id },
      })
    );

    await this.invalidateCache(result);
    await this.emitEvent('deleted', result);

    return result;
  }

  async upsert(params: {
    where: { id: string } | Record<string, any>;
    create: TCreateInput;
    update: TUpdateInput;
  }): Promise<TModel> {
    const result = await this.executeQuery('upsert', () =>
      (this.prisma[this.modelName as keyof PrismaClient] as any).upsert(params)
    );

    await this.invalidateCache(result);
    await this.emitEvent('upserted', result);

    return result;
  }

  // ============================================
  // TRANSACTION SUPPORT
  // ============================================

  async withTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return this.prisma.$transaction(fn, {
      maxWait: 5000,
      timeout: 10000,
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    });
  }

  // ============================================
  // HELPERS
  // ============================================

  protected async executeQuery<T>(
    operation: string,
    query: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await query();
      
      this.logger.debug({
        operation,
        duration: Date.now() - startTime,
      }, 'Query executed');
      
      return result;
    } catch (error) {
      this.logger.error({
        operation,
        duration: Date.now() - startTime,
        error,
      }, 'Query failed');
      
      throw this.transformError(error);
    }
  }

  protected async invalidateCache(entity: TModel & { id?: string }): Promise<void> {
    if (!this.cache || !entity.id) return;
    
    await this.cache.del(`${this.cachePrefix}:${entity.id}`);
    await this.invalidateListCache();
  }

  protected async invalidateListCache(): Promise<void> {
    if (!this.cache) return;
    await this.cache.delPattern(`${this.cachePrefix}:list:*`);
  }

  protected async emitEvent(action: string, data: TModel): Promise<void> {
    if (!this.eventBus) return;
    
    await this.eventBus.publish({
      type: `${this.modelName}.${action}`,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  protected transformError(error: unknown): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return new UniqueConstraintError(
            `Duplicate value for ${(error.meta?.target as string[])?.join(', ')}`
          );
        case 'P2025':
          return new NotFoundError(`${this.modelName} not found`);
        case 'P2003':
          return new ForeignKeyError('Related record not found');
        default:
          return new DatabaseError(`Database error: ${error.code}`);
      }
    }
    return error as Error;
  }
}

// ============================================
// CUSTOM ERRORS
// ============================================

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UniqueConstraintError extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = 'UniqueConstraintError';
  }
}

export class ForeignKeyError extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ForeignKeyError';
  }
}
