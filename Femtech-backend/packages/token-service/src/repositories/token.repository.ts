// ============================================
// TOKEN TRANSACTION REPOSITORY
// ============================================

import {
  TokenTransaction,
  TokenTxType,
  TokenTxStatus,
  Prisma,
} from '@momentum/prisma-client';
import {
  BaseRepository,
  RepositoryOptions,
  PaginatedResult,
} from '@momentum/shared/database';

export interface TokenBalance {
  available: bigint;
  pending: bigint;
  total: bigint;
  lastUpdated: Date;
}

export interface TokenStats {
  totalMinted: bigint;
  totalBurned: bigint;
  totalCirculating: bigint;
  transactionCount: number;
}

export interface TransactionFilters {
  userId?: string;
  type?: TokenTxType;
  status?: TokenTxStatus;
  minAmount?: bigint;
  maxAmount?: bigint;
  createdAfter?: Date;
  createdBefore?: Date;
  hasStellarTx?: boolean;
}

export class TokenRepository extends BaseRepository<
  TokenTransaction,
  Prisma.TokenTransactionCreateInput,
  Prisma.TokenTransactionUpdateInput,
  Prisma.TokenTransactionWhereInput,
  Prisma.TokenTransactionOrderByWithRelationInput
> {
  protected modelName = 'tokenTransaction';
  protected cachePrefix = 'token:tx';
  protected cacheTTL = 60;

  constructor(options: RepositoryOptions) {
    super(options);
  }

  // ============================================
  // BALANCE QUERIES
  // ============================================

  async getBalance(userId: string): Promise<TokenBalance> {
    const cacheKey = `token:balance:${userId}`;
    
    if (this.cache) {
      const cached = await this.cache.get<TokenBalance>(cacheKey);
      if (cached) return cached;
    }

    // Calculate balance from confirmed transactions
    const aggregations = await this.prisma.tokenTransaction.groupBy({
      by: ['type', 'status'],
      where: { userId },
      _sum: { amount: true },
    });

    let available = BigInt(0);
    let pending = BigInt(0);

    for (const agg of aggregations) {
      const amount = agg._sum.amount || BigInt(0);
      const isCredit = ['mint_milestone', 'mint_referral', 'mint_bonus', 'mint_airdrop', 'transfer_in']
        .includes(agg.type);

      if (agg.status === 'confirmed') {
        if (isCredit) {
          available += amount;
        } else {
          available -= amount;
        }
      } else if (agg.status === 'pending' || agg.status === 'submitted') {
        if (isCredit) {
          pending += amount;
        }
      }
    }

    const balance: TokenBalance = {
      available,
      pending,
      total: available + pending,
      lastUpdated: new Date(),
    };

    if (this.cache) {
      await this.cache.set(cacheKey, balance, 30); // Short TTL
    }

    return balance;
  }

  async getBalanceFromBlockchain(walletAddress: string): Promise<bigint> {
    // This would call Stellar/Horizon API
    // Implemented in StellarService, cached here
    const cacheKey = `token:stellar:${walletAddress}`;
    
    if (this.cache) {
      const cached = await this.cache.get<string>(cacheKey);
      if (cached) return BigInt(cached);
    }

    // Placeholder - actual implementation in StellarService
    return BigInt(0);
  }

  // ============================================
  // TRANSACTION QUERIES
  // ============================================

  async findByUser(
    userId: string,
    pagination?: { page?: number; limit?: number }
  ): Promise<PaginatedResult<TokenTransaction>> {
    return this.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      pagination,
    });
  }

  async findByStellarHash(hash: string): Promise<TokenTransaction | null> {
    return this.executeQuery('findByStellarHash', () =>
      this.prisma.tokenTransaction.findUnique({
        where: { stellarTxHash: hash },
      })
    );
  }

  async findPendingTransactions(
    olderThanMinutes: number = 5
  ): Promise<TokenTransaction[]> {
    const cutoff = new Date();
    cutoff.setMinutes(cutoff.getMinutes() - olderThanMinutes);

    return this.executeQuery('findPendingTransactions', () =>
      this.prisma.tokenTransaction.findMany({
        where: {
          status: { in: ['pending', 'submitted'] },
          createdAt: { lt: cutoff },
        },
        include: {
          user: { select: { id: true, walletAddress: true } },
        },
        orderBy: { createdAt: 'asc' },
      })
    );
  }

  async findWithFilters(
    filters: TransactionFilters,
    pagination?: { page?: number; limit?: number }
  ): Promise<PaginatedResult<TokenTransaction>> {
    const where: Prisma.TokenTransactionWhereInput = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    
    if (filters.minAmount || filters.maxAmount) {
      where.amount = {};
      if (filters.minAmount) where.amount.gte = filters.minAmount;
      if (filters.maxAmount) where.amount.lte = filters.maxAmount;
    }

    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};
      if (filters.createdAfter) where.createdAt.gte = filters.createdAfter;
      if (filters.createdBefore) where.createdAt.lte = filters.createdBefore;
    }

    if (filters.hasStellarTx !== undefined) {
      where.stellarTxHash = filters.hasStellarTx ? { not: null } : null;
    }

    return this.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      pagination,
    });
  }

  // ============================================
  // TRANSACTION CREATION
  // ============================================

  async createMintTransaction(data: {
    userId: string;
    amount: bigint;
    type: 'mint_milestone' | 'mint_referral' | 'mint_bonus' | 'mint_airdrop';
    milestoneId?: string;
    referenceId?: string;
  }): Promise<TokenTransaction> {
    const balance = await this.getBalance(data.userId);

    const tx = await this.create({
      user: { connect: { id: data.userId } },
      type: data.type,
      status: 'pending',
      amount: data.amount,
      balanceBefore: balance.available,
      milestoneId: data.milestoneId,
      referenceId: data.referenceId,
      feeSponsored: true,
    });

    await this.invalidateBalanceCache(data.userId);
    return tx;
  }

  async createBurnTransaction(data: {
    userId: string;
    amount: bigint;
    redemptionId: string;
  }): Promise<TokenTransaction> {
    const balance = await this.getBalance(data.userId);

    if (balance.available < data.amount) {
      throw new Error('Insufficient balance');
    }

    const tx = await this.create({
      user: { connect: { id: data.userId } },
      type: 'burn_redemption',
      status: 'pending',
      amount: data.amount,
      balanceBefore: balance.available,
      redemption: { connect: { id: data.redemptionId } },
      feeSponsored: true,
    });

    await this.invalidateBalanceCache(data.userId);
    return tx;
  }

  async confirmTransaction(
    id: string,
    stellarData: {
      txHash: string;
      ledger: number;
      feePaid?: bigint;
    }
  ): Promise<TokenTransaction> {
    const tx = await this.executeQuery('findById', () =>
      this.prisma.tokenTransaction.findUnique({ where: { id } })
    );

    if (!tx) throw new Error('Transaction not found');

    const balanceAfter = tx.type.startsWith('mint_')
      ? (tx.balanceBefore || BigInt(0)) + tx.amount
      : (tx.balanceBefore || BigInt(0)) - tx.amount;

    const updated = await this.update(id, {
      status: 'confirmed',
      stellarTxHash: stellarData.txHash,
      stellarLedger: stellarData.ledger,
      feePaid: stellarData.feePaid,
      balanceAfter,
      confirmedAt: new Date(),
    });

    await this.invalidateBalanceCache(tx.userId);
    await this.emitEvent('confirmed', updated);
    
    return updated;
  }

  async failTransaction(
    id: string,
    errorMessage: string
  ): Promise<TokenTransaction> {
    const tx = await this.update(id, {
      status: 'failed',
      errorMessage,
      retryCount: { increment: 1 },
    });

    await this.emitEvent('failed', tx);
    return tx;
  }

  // ============================================
  // STATISTICS
  // ============================================

  async getGlobalStats(): Promise<TokenStats> {
    const cacheKey = 'token:stats:global';
    
    if (this.cache) {
      const cached = await this.cache.get<TokenStats>(cacheKey);
      if (cached) return cached;
    }

    const [mintAgg, burnAgg, txCount] = await Promise.all([
      this.prisma.tokenTransaction.aggregate({
        where: {
          type: { in: ['mint_milestone', 'mint_referral', 'mint_bonus', 'mint_airdrop'] },
          status: 'confirmed',
        },
        _sum: { amount: true },
      }),
      this.prisma.tokenTransaction.aggregate({
        where: {
          type: { in: ['burn_redemption', 'burn_penalty', 'clawback'] },
          status: 'confirmed',
        },
        _sum: { amount: true },
      }),
      this.prisma.tokenTransaction.count({
        where: { status: 'confirmed' },
      }),
    ]);

    const totalMinted = mintAgg._sum.amount || BigInt(0);
    const totalBurned = burnAgg._sum.amount || BigInt(0);

    const stats: TokenStats = {
      totalMinted,
      totalBurned,
      totalCirculating: totalMinted - totalBurned,
      transactionCount: txCount,
    };

    if (this.cache) {
      await this.cache.set(cacheKey, stats, 300); // 5 minutes
    }

    return stats;
  }

  async getUserStats(userId: string): Promise<{
    totalEarned: bigint;
    totalSpent: bigint;
    transactionCount: number;
    firstTransaction?: Date;
    lastTransaction?: Date;
  }> {
    const [earned, spent, count, first, last] = await Promise.all([
      this.prisma.tokenTransaction.aggregate({
        where: {
          userId,
          type: { in: ['mint_milestone', 'mint_referral', 'mint_bonus'] },
          status: 'confirmed',
        },
        _sum: { amount: true },
      }),
      this.prisma.tokenTransaction.aggregate({
        where: {
          userId,
          type: { in: ['burn_redemption'] },
          status: 'confirmed',
        },
        _sum: { amount: true },
      }),
      this.prisma.tokenTransaction.count({
        where: { userId, status: 'confirmed' },
      }),
      this.prisma.tokenTransaction.findFirst({
        where: { userId, status: 'confirmed' },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      }),
      this.prisma.tokenTransaction.findFirst({
        where: { userId, status: 'confirmed' },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    return {
      totalEarned: earned._sum.amount || BigInt(0),
      totalSpent: spent._sum.amount || BigInt(0),
      transactionCount: count,
      firstTransaction: first?.createdAt,
      lastTransaction: last?.createdAt,
    };
  }

  // ============================================
  // HELPERS
  // ============================================

  private async invalidateBalanceCache(userId: string): Promise<void> {
    if (this.cache) {
      await this.cache.del(`token:balance:${userId}`);
    }
  }
}
