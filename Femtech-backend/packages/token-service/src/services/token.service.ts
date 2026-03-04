// ============================================
// TOKEN SERVICE - DATA ACCESS PATTERNS
// ============================================

import {
  BaseService,
  ServiceDependencies,
  ServiceContext,
  ServiceError,
} from '@momentum/shared/services';
import { TokenRepository, TokenBalance, TokenStats } from '../repositories/token.repository';
import { StellarService } from './stellar.service';
import { FeeSponsorService } from './fee-sponsor.service';
import { TokenTxType, TokenTxStatus } from '@momentum/prisma-client';

// ============================================
// INTERFACES
// ============================================

export interface MintRequest {
  userId: string;
  amount: number;
  type: 'milestone' | 'referral' | 'bonus' | 'airdrop';
  milestoneId?: string;
  referenceId?: string;
}

export interface BurnRequest {
  userId: string;
  amount: number;
  redemptionId: string;
}

export interface TransferRequest {
  fromUserId: string;
  toUserId: string;
  amount: number;
  memo?: string;
}

export interface WalletInfo {
  address: string;
  balance: TokenBalance;
  stellarBalance?: bigint;
  canTransact: boolean;
  sponsorshipRemaining: {
    daily: number;
    lifetime: number;
  };
}

// ============================================
// SERVICE IMPLEMENTATION
// ============================================

export class TokenService extends BaseService {
  private tokenRepo: TokenRepository;
  private stellar: StellarService;
  private feeSponsor: FeeSponsorService;

  constructor(
    deps: ServiceDependencies,
    stellar: StellarService,
    feeSponsor: FeeSponsorService
  ) {
    super(deps);

    this.tokenRepo = new TokenRepository({
      prisma: deps.prisma,
      logger: deps.logger,
      cache: deps.cache,
      eventBus: deps.eventBus,
    });

    this.stellar = stellar;
    this.feeSponsor = feeSponsor;

    // Subscribe to milestone completion events
    this.subscribeToEvents();
  }

  // ============================================
  // EVENT SUBSCRIPTIONS
  // ============================================

  private subscribeToEvents(): void {
    // Listen for milestone completions to auto-mint rewards
    this.eventBus.subscribe('milestone.completed', async (event) => {
      await this.mintForMilestone({
        userId: event.payload.userId,
        amount: event.payload.rewardAmount,
        milestoneId: event.payload.milestoneId,
      });
    });

    // Listen for redemption confirmations to process burns
    this.eventBus.subscribe('redemption.burn_requested', async (event) => {
      await this.processBurn({
        userId: event.payload.userId,
        amount: event.payload.amount,
        redemptionId: event.payload.redemptionId,
      });
    });
  }

  // ============================================
  // WALLET MANAGEMENT
  // ============================================

  /**
   * Get or create wallet for user
   * Pattern: Check existing → Create if needed → Return wallet info
   */
  async getOrCreateWallet(
    userId: string,
    context: ServiceContext
  ): Promise<WalletInfo> {
    this.logger.info({ userId }, 'Getting or creating wallet');

    // Check for existing wallet
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true, country: true },
    });

    if (!user) {
      throw new ServiceError('NOT_FOUND', 'User not found');
    }

    let walletAddress = user.walletAddress;

    // Create wallet if not exists
    if (!walletAddress) {
      walletAddress = await this.createWallet(userId, context);
    }

    // Get balances and sponsorship info
    const [balance, stellarBalance, sponsorship] = await Promise.all([
      this.tokenRepo.getBalance(userId),
      this.stellar.getTokenBalance(walletAddress),
      this.feeSponsor.getRemainingSponsorship(userId),
    ]);

    return {
      address: walletAddress,
      balance,
      stellarBalance,
      canTransact: sponsorship.daily > 0 || sponsorship.lifetime > 0,
      sponsorshipRemaining: sponsorship,
    };
  }

  /**
   * Create new Stellar wallet for user
   * Pattern: Generate keypair → Sponsor account creation → Set up trustline → Store address
   */
  private async createWallet(
    userId: string,
    context: ServiceContext
  ): Promise<string> {
    this.logger.info({ userId }, 'Creating new wallet');

    // Generate new Stellar keypair
    const { publicKey, secretKey } = await this.stellar.generateKeypair();

    // Create sponsored account on Stellar
    await this.stellar.createSponsoredAccount(publicKey);

    // Set up MTK trustline
    await this.stellar.setupTrustline(publicKey, secretKey);

    // Store wallet address (secret key stored in secure vault)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        walletAddress: publicKey,
        walletCreatedAt: new Date(),
      },
    });

    // Store secret key securely (KMS or vault)
    await this.stellar.storeSecretKey(userId, secretKey);

    await this.publishEvent('token.wallet.created', {
      userId,
      walletAddress: publicKey,
    }, context);

    return publicKey;
  }

  // ============================================
  // MINTING
  // ============================================

  /**
   * Mint tokens for milestone completion
   * Pattern: Check sponsorship → Create DB record → Submit to Stellar → Confirm
   */
  async mintForMilestone(data: {
    userId: string;
    amount: number;
    milestoneId: string;
  }): Promise<string> {
    this.logger.info({ userId: data.userId, amount: data.amount }, 'Minting for milestone');

    // Check if user has wallet
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
      select: { walletAddress: true },
    });

    if (!user?.walletAddress) {
      // Create wallet first
      await this.createWallet(data.userId, { requestId: crypto.randomUUID() });
    }

    // Check sponsorship availability
    const canSponsor = await this.feeSponsor.canSponsor(data.userId, 'mint');

    if (!canSponsor) {
      throw new ServiceError(
        'FORBIDDEN',
        'Daily sponsorship limit reached',
        null,
        { userId: data.userId }
      );
    }

    // Create pending transaction in DB
    const tx = await this.tokenRepo.createMintTransaction({
      userId: data.userId,
      amount: BigInt(data.amount * 10_000_000), // 7 decimals for Stellar
      type: 'mint_milestone',
      milestoneId: data.milestoneId,
    });

    try {
      // Submit to Stellar
      const stellarResult = await this.stellar.mintTokens({
        destinationAddress: user!.walletAddress!,
        amount: data.amount,
        memoHash: tx.id,
      });

      // Confirm transaction
      await this.tokenRepo.confirmTransaction(tx.id, {
        txHash: stellarResult.hash,
        ledger: stellarResult.ledger,
        feePaid: BigInt(stellarResult.fee),
      });

      // Record sponsorship usage
      await this.feeSponsor.recordUsage(data.userId, 'mint', stellarResult.fee);

      // Update milestone with reward tx ID
      await this.prisma.userMilestone.update({
        where: { id: data.milestoneId },
        data: { rewardTxId: tx.id },
      });

      await this.publishEvent('token.minted', {
        transactionId: tx.id,
        userId: data.userId,
        amount: data.amount,
        milestoneId: data.milestoneId,
        stellarTxHash: stellarResult.hash,
      });

      return tx.id;
    } catch (error) {
      // Mark transaction as failed
      await this.tokenRepo.failTransaction(tx.id, (error as Error).message);
      throw error;
    }
  }

  /**
   * Mint tokens for referral bonus
   */
  async mintForReferral(
    referrerId: string,
    referredUserId: string,
    amount: number,
    context: ServiceContext
  ): Promise<string> {
    this.logger.info({ referrerId, amount }, 'Minting for referral');

    const user = await this.prisma.user.findUnique({
      where: { id: referrerId },
      select: { walletAddress: true },
    });

    if (!user?.walletAddress) {
      throw new ServiceError('VALIDATION_ERROR', 'User does not have a wallet');
    }

    const canSponsor = await this.feeSponsor.canSponsor(referrerId, 'mint');

    if (!canSponsor) {
      throw new ServiceError('FORBIDDEN', 'Daily sponsorship limit reached');
    }

    const tx = await this.tokenRepo.createMintTransaction({
      userId: referrerId,
      amount: BigInt(amount * 10_000_000),
      type: 'mint_referral',
      referenceId: referredUserId,
    });

    try {
      const stellarResult = await this.stellar.mintTokens({
        destinationAddress: user.walletAddress,
        amount,
        memoHash: tx.id,
      });

      await this.tokenRepo.confirmTransaction(tx.id, {
        txHash: stellarResult.hash,
        ledger: stellarResult.ledger,
        feePaid: BigInt(stellarResult.fee),
      });

      await this.feeSponsor.recordUsage(referrerId, 'mint', stellarResult.fee);

      await this.publishEvent('token.referral_minted', {
        transactionId: tx.id,
        referrerId,
        referredUserId,
        amount,
      }, context);

      return tx.id;
    } catch (error) {
      await this.tokenRepo.failTransaction(tx.id, (error as Error).message);
      throw error;
    }
  }

  // ============================================
  // BURNING
  // ============================================

  /**
   * Process burn for redemption
   * Pattern: Validate balance → Create DB record → Submit burn to Stellar → Confirm
   */
  async processBurn(data: BurnRequest): Promise<string> {
    this.logger.info({ userId: data.userId, amount: data.amount }, 'Processing burn');

    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
      select: { walletAddress: true },
    });

    if (!user?.walletAddress) {
      throw new ServiceError('VALIDATION_ERROR', 'User does not have a wallet');
    }

    // Check balance
    const balance = await this.tokenRepo.getBalance(data.userId);

    if (balance.available < BigInt(data.amount * 10_000_000)) {
      throw new ServiceError(
        'INSUFFICIENT_BALANCE',
        'Insufficient token balance',
        null,
        {
          required: data.amount,
          available: Number(balance.available) / 10_000_000,
        }
      );
    }

    // Check sponsorship for burn
    const canSponsor = await this.feeSponsor.canSponsor(data.userId, 'burn');

    if (!canSponsor) {
      throw new ServiceError('FORBIDDEN', 'Daily sponsorship limit reached');
    }

    // Create pending transaction
    const tx = await this.tokenRepo.createBurnTransaction({
      userId: data.userId,
      amount: BigInt(data.amount * 10_000_000),
      redemptionId: data.redemptionId,
    });

    try {
      // Get user's secret key from vault
      const secretKey = await this.stellar.getSecretKey(data.userId);

      // Submit burn to Stellar
      const stellarResult = await this.stellar.burnTokens({
        sourceAddress: user.walletAddress,
        sourceSecret: secretKey,
        amount: data.amount,
        memoHash: tx.id,
      });

      // Confirm transaction
      await this.tokenRepo.confirmTransaction(tx.id, {
        txHash: stellarResult.hash,
        ledger: stellarResult.ledger,
        feePaid: BigInt(stellarResult.fee),
      });

      // Record sponsorship usage
      await this.feeSponsor.recordUsage(data.userId, 'burn', stellarResult.fee);

      // Update redemption with burn tx ID
      await this.prisma.redemption.update({
        where: { id: data.redemptionId },
        data: {
          burnTxId: tx.id,
          status: 'burn_confirmed',
        },
      });

      await this.publishEvent('token.burned', {
        transactionId: tx.id,
        userId: data.userId,
        amount: data.amount,
        redemptionId: data.redemptionId,
        stellarTxHash: stellarResult.hash,
      });

      return tx.id;
    } catch (error) {
      await this.tokenRepo.failTransaction(tx.id, (error as Error).message);

      // Update redemption status
      await this.prisma.redemption.update({
        where: { id: data.redemptionId },
        data: {
          status: 'failed',
          failureReason: (error as Error).message,
        },
      });

      throw error;
    }
  }

  // ============================================
  // QUERIES
  // ============================================

  /**
   * Get user's token balance with caching
   */
  async getBalance(
    userId: string,
    context: ServiceContext
  ): Promise<TokenBalance> {
    return this.withCache(
      `token:balance:${userId}`,
      30,
      () => this.tokenRepo.getBalance(userId)
    );
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      type?: TokenTxType;
      status?: TokenTxStatus;
    },
    context: ServiceContext
  ): Promise<{
    transactions: any[];
    pagination: any;
    summary: {
      totalEarned: bigint;
      totalSpent: bigint;
    };
  }> {
    const [result, stats] = await Promise.all([
      this.tokenRepo.findWithFilters(
        {
          userId,
          type: options.type,
          status: options.status,
        },
        { page: options.page, limit: options.limit }
      ),
      this.tokenRepo.getUserStats(userId),
    ]);

    return {
      transactions: result.data,
      pagination: result.pagination,
      summary: {
        totalEarned: stats.totalEarned,
        totalSpent: stats.totalSpent,
      },
    };
  }

  /**
   * Get global token statistics (admin)
   */
  async getGlobalStats(context: ServiceContext): Promise<TokenStats> {
    return this.withCache(
      'token:stats:global',
      300,
      () => this.tokenRepo.getGlobalStats()
    );
  }

  // ============================================
  // RETRY MECHANISM
  // ============================================

  /**
   * Retry failed transactions
   * Called by scheduler
   */
  async retryFailedTransactions(): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
  }> {
    const pendingTxs = await this.tokenRepo.findPendingTransactions(5);

    let succeeded = 0;
    let failed = 0;

    for (const tx of pendingTxs) {
      try {
        if (tx.retryCount >= 3) {
          // Max retries reached, mark as permanently failed
          await this.tokenRepo.failTransaction(tx.id, 'Max retries exceeded');
          failed++;
          continue;
        }

        if (tx.type.startsWith('mint_')) {
          // Retry mint
          const stellarResult = await this.stellar.mintTokens({
            destinationAddress: tx.user.walletAddress!,
            amount: Number(tx.amount) / 10_000_000,
            memoHash: tx.id,
          });

          await this.tokenRepo.confirmTransaction(tx.id, {
            txHash: stellarResult.hash,
            ledger: stellarResult.ledger,
            feePaid: BigInt(stellarResult.fee),
          });

          succeeded++;
        } else if (tx.type === 'burn_redemption') {
          // Retry burn
          const secretKey = await this.stellar.getSecretKey(tx.userId);

          const stellarResult = await this.stellar.burnTokens({
            sourceAddress: tx.user.walletAddress!,
            sourceSecret: secretKey,
            amount: Number(tx.amount) / 10_000_000,
            memoHash: tx.id,
          });

          await this.tokenRepo.confirmTransaction(tx.id, {
            txHash: stellarResult.hash,
            ledger: stellarResult.ledger,
            feePaid: BigInt(stellarResult.fee),
          });

          succeeded++;
        }
      } catch (error) {
        this.logger.error({ txId: tx.id, error }, 'Transaction retry failed');
        await this.tokenRepo.failTransaction(tx.id, (error as Error).message);
        failed++;
      }
    }

    return {
      processed: pendingTxs.length,
      succeeded,
      failed,
    };
  }
}