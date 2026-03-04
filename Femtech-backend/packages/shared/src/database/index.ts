// ============================================
// DATABASE MODULE EXPORTS
// ============================================

// Base
export * from './base.repository';
export * from './prisma.client';
export * from './cache.service';

// Repositories (re-exported from services)
export { UserRepository } from '@momentum/auth-service/repositories';
export { PregnancyRepository } from '@momentum/health-service/repositories';
export { MilestoneRepository } from '@momentum/milestone-service/repositories';
export { TokenRepository } from '@momentum/token-service/repositories';
export { RedemptionRepository } from '@momentum/redemption-service/repositories';

// Types
export type {
  PaginationParams,
  PaginatedResult,
  RepositoryOptions,
} from './base.repository';
