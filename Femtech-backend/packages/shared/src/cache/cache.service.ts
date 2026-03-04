// ============================================
// CACHE SERVICE - REDIS DATA ACCESS
// ============================================

import Redis from 'ioredis';
import { Logger } from '../logger';

export interface CacheOptions {
  redis: Redis;
  logger: Logger;
  defaultTTL?: number;
  keyPrefix?: string;
}

export class CacheService {
  private redis: Redis;
  private logger: Logger;
  private defaultTTL: number;
  private keyPrefix: string;

  constructor(options: CacheOptions) {
    this.redis = options.redis;
    this.logger = options.logger.child({ service: 'CacheService' });
    this.defaultTTL = options.defaultTTL || 300;
    this.keyPrefix = options.keyPrefix || 'momentum:';
  }

  // ============================================
  // BASIC OPERATIONS
  // ============================================

  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.keyPrefix + key;
    
    try {
      const value = await this.redis.get(fullKey);
      
      if (!value) return null;
      
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error({ key, error }, 'Cache get error');
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const fullKey = this.keyPrefix + key;
    const ttl = ttlSeconds || this.defaultTTL;
    
    try {
      await this.redis.setex(fullKey, ttl, JSON.stringify(value));
    } catch (error) {
      this.logger.error({ key, error }, 'Cache set error');
    }
  }

  async del(key: string): Promise<void> {
    const fullKey = this.keyPrefix + key;
    
    try {
      await this.redis.del(fullKey);
    } catch (error) {
      this.logger.error({ key, error }, 'Cache delete error');
    }
  }

  async delPattern(pattern: string): Promise<void> {
    const fullPattern = this.keyPrefix + pattern;
    
    try {
      const keys = await this.redis.keys(fullPattern);
      
      if (keys.length > 0) {
        await this.redis.del(...keys);
        this.logger.debug({ pattern, count: keys.length }, 'Cache pattern delete');
      }
    } catch (error) {
      this.logger.error({ pattern, error }, 'Cache pattern delete error');
    }
  }

  // ============================================
  // SPECIALIZED OPERATIONS
  // ============================================

  /**
   * Get or set with factory function
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttlSeconds);
    
    return value;
  }

  /**
   * Increment counter
   */
  async incr(key: string, amount: number = 1): Promise<number> {
    const fullKey = this.keyPrefix + key;
    return this.redis.incrby(fullKey, amount);
  }

  /**
   * Decrement counter
   */
  async decr(key: string, amount: number = 1): Promise<number> {
    const fullKey = this.keyPrefix + key;
    return this.redis.decrby(fullKey, amount);
  }

  /**
   * Set with expiry only if not exists
   */
  async setNX(key: string, value: any, ttlSeconds: number): Promise<boolean> {
    const fullKey = this.keyPrefix + key;
    const result = await this.redis.set(
      fullKey,
      JSON.stringify(value),
      'EX',
      ttlSeconds,
      'NX'
    );
    return result === 'OK';
  }

  // ============================================
  // HASH OPERATIONS
  // ============================================

  async hget<T>(key: string, field: string): Promise<T | null> {
    const fullKey = this.keyPrefix + key;
    
    try {
      const value = await this.redis.hget(fullKey, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error({ key, field, error }, 'Cache hget error');
      return null;
    }
  }

  async hset(key: string, field: string, value: any): Promise<void> {
    const fullKey = this.keyPrefix + key;
    await this.redis.hset(fullKey, field, JSON.stringify(value));
  }

  async hgetall<T>(key: string): Promise<Record<string, T>> {
    const fullKey = this.keyPrefix + key;
    const result = await this.redis.hgetall(fullKey);
    
    const parsed: Record<string, T> = {};
    for (const [field, value] of Object.entries(result)) {
      parsed[field] = JSON.parse(value);
    }
    
    return parsed;
  }

  // ============================================
  // LIST OPERATIONS
  // ============================================

  async lpush(key: string, ...values: any[]): Promise<number> {
    const fullKey = this.keyPrefix + key;
    return this.redis.lpush(fullKey, ...values.map(v => JSON.stringify(v)));
  }

  async rpop<T>(key: string): Promise<T | null> {
    const fullKey = this.keyPrefix + key;
    const value = await this.redis.rpop(fullKey);
    return value ? JSON.parse(value) : null;
  }

  async lrange<T>(key: string, start: number, stop: number): Promise<T[]> {
    const fullKey = this.keyPrefix + key;
    const values = await this.redis.lrange(fullKey, start, stop);
    return values.map(v => JSON.parse(v));
  }

  // ============================================
  // SET OPERATIONS
  // ============================================

  async sadd(key: string, ...members: string[]): Promise<number> {
    const fullKey = this.keyPrefix + key;
    return this.redis.sadd(fullKey, ...members);
  }

  async sismember(key: string, member: string): Promise<boolean> {
    const fullKey = this.keyPrefix + key;
    return (await this.redis.sismember(fullKey, member)) === 1;
  }

  async smembers(key: string): Promise<string[]> {
    const fullKey = this.keyPrefix + key;
    return this.redis.smembers(fullKey);
  }

  // ============================================
  // SORTED SET OPERATIONS (Leaderboards, etc.)
  // ============================================

  async zadd(key: string, score: number, member: string): Promise<number> {
    const fullKey = this.keyPrefix + key;
    return this.redis.zadd(fullKey, score, member);
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    const fullKey = this.keyPrefix + key;
    return this.redis.zrange(fullKey, start, stop);
  }

  async zrangeWithScores(
    key: string,
    start: number,
    stop: number
  ): Promise<{ member: string; score: number }[]> {
    const fullKey = this.keyPrefix + key;
    const result = await this.redis.zrange(fullKey, start, stop, 'WITHSCORES');
    
    const parsed: { member: string; score: number }[] = [];
    for (let i = 0; i < result.length; i += 2) {
      parsed.push({
        member: result[i],
        score: parseFloat(result[i + 1]),
      });
    }
    
    return parsed;
  }

  async zrank(key: string, member: string): Promise<number | null> {
    const fullKey = this.keyPrefix + key;
    return this.redis.zrank(fullKey, member);
  }

  // ============================================
  // DISTRIBUTED LOCKING
  // ============================================

  async acquireLock(
    lockKey: string,
    ttlSeconds: number = 30
  ): Promise<string | null> {
    const lockId = crypto.randomUUID();
    const acquired = await this.setNX(`lock:${lockKey}`, lockId, ttlSeconds);
    
    return acquired ? lockId : null;
  }

  async releaseLock(lockKey: string, lockId: string): Promise<boolean> {
    const fullKey = this.keyPrefix + `lock:${lockKey}`;
    
    // Lua script for atomic check-and-delete
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    
    const result = await this.redis.eval(script, 1, fullKey, lockId);
    return result === 1;
  }

  async withLock<T>(
    lockKey: string,
    fn: () => Promise<T>,
    options?: { ttlSeconds?: number; retries?: number; retryDelayMs?: number }
  ): Promise<T> {
    const { ttlSeconds = 30, retries = 3, retryDelayMs = 100 } = options || {};
    
    let lockId: string | null = null;
    let attempts = 0;

    while (attempts < retries) {
      lockId = await this.acquireLock(lockKey, ttlSeconds);
      
      if (lockId) break;
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, retryDelayMs * attempts));
    }

    if (!lockId) {
      throw new Error(`Failed to acquire lock: ${lockKey}`);
    }

    try {
      return await fn();
    } finally {
      await this.releaseLock(lockKey, lockId);
    }
  }
}
