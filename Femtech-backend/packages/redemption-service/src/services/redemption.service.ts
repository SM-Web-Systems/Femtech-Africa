// ============================================
// REDEMPTION SERVICE - DATA ACCESS PATTERNS
// ============================================

import {
  BaseService,
  ServiceDependencies,
  ServiceContext,
  ServiceError,
} from '@momentum/shared/services';
import {
  RedemptionRepository,
  RedemptionWithDetails,
} from '../repositories/redemption.repository';
import { TokenRepository } from '@momentum/token-service/repositories';
import { PartnerIntegrationService } from './partner-integration.service';
import { RedemptionStatus, PartnerType, CountryCode } from '@momentum/prisma-client';

// ============================================
// INTERFACES
// ============================================

export interface RedemptionCart {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface RedemptionResult {
  redemption: RedemptionWithDetails;
  voucherCodes?: string[];
  deliveryInfo?: Record<string, any>;
}

export interface ProductCatalog {
  partners: {
    id: string;
    name: string;
    type: PartnerType;
    logoUrl?: string;
    products: {
      id: string;
      name: string;
      description?: string;
      category: string;
      tokenCost: number;
      fiatValue?: number;
      imageUrl?: string;
      inStock: boolean;
    }[];
  }[];
  categories: string[];
}

// ============================================
// SERVICE IMPLEMENTATION
// ============================================

export class RedemptionService extends BaseService {
  private redemptionRepo: RedemptionRepository;
  private tokenRepo: TokenRepository;
  private partnerIntegration: PartnerIntegrationService;

  constructor(
    deps: ServiceDependencies,
    partnerIntegration: PartnerIntegrationService
  ) {
    super(deps);

    this.redemptionRepo = new RedemptionRepository({
      prisma: deps.prisma,
      logger: deps.logger,
      cache: deps.cache,
      eventBus: deps.eventBus,
    });

    this.tokenRepo = new TokenRepository({
      prisma: deps.prisma,
      logger: deps.logger,
      cache: deps.cache,
    });

    this.partnerIntegration = partnerIntegration;

    // Subscribe to events
    this.subscribeToEvents();
  }

  // ============================================
  // EVENT SUBSCRIPTIONS
  // ============================================

  private subscribeToEvents(): void {
    // Listen for burn confirmations to proceed with fulfillment
    this.eventBus.subscribe('token.burned', async (event) => {
      if (event.payload.redemptionId) {
        await this.processFulfillment(event.payload.redemptionId);
      }
    });
  }

  // ============================================
  // CATALOG
  // ============================================

  /**
   * Get product catalog for user's country
   * Pattern: Fetch partners → Filter by country → Format response
   */
  async getCatalog(
    country: CountryCode,
    options?: {
      category?: string;
      maxTokens?: number;
    },
    context?: ServiceContext
  ): Promise<ProductCatalog> {
    const cacheKey = `catalog:${country}:${JSON.stringify(options || {})}`;

    return this.withCache(cacheKey, 300, async () => {
      const products = await this.redemptionRepo.findProducts({
        country,
        category: options?.category,
        maxTokenCost: options?.maxTokens,
        isActive: true,
      });

      // Group by partner
      const partnerMap = new Map<string, any>();
      const categories = new Set<string>();

      for (const product of products) {
        categories.add(product.category);

        if (!partnerMap.has(product.partner.id)) {
          partnerMap.set(product.partner.id, {
            id: product.partner.id,
            name: product.partner.name,
            type: product.partner.type,
            logoUrl: product.partner.logoUrl,
            products: [],
          });
        }

        partnerMap.get(product.partner.id).products.push({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          tokenCost: product.tokenCost,
          fiatValue: product.fiatValue ? Number(product.fiatValue) : undefined,
          imageUrl: product.imageUrl,
          inStock: product.stockQuantity === null || product.stockQuantity > 0,
        });
      }

      return {
        partners: Array.from(partnerMap.values()),
        categories: Array.from(categories).sort(),
      };
    });
  }

  /**
   * Get product details
   */
  async getProduct(
    productId: string,
    context: ServiceContext
  ): Promise<any> {
    const product = await this.redemptionRepo.findProductById(productId);

    if (!product) {
      throw new ServiceError('NOT_FOUND', 'Product not found');
    }

    return {
      ...product,
      partner: {
        id: product.partner.id,
        name: product.partner.name,
        type: product.partner.type,
        logoUrl: product.partner.logoUrl,
      },
      inStock: product.stockQuantity === null || product.stockQuantity > 0,
    };
  }

  // ============================================
  // REDEMPTION FLOW
  // ============================================

  /**
   * Validate cart before redemption
   * Pattern: Check products → Validate stock → Check balance → Return summary
   */
  async validateCart(
    userId: string,
    cart: RedemptionCart,
    context: ServiceContext
  ): Promise<{
    valid: boolean;
    totalTokens: number;
    balance: bigint;
    items: {
      productId: string;
      name: string;
      tokenCost: number;
      quantity: number;
      subtotal: number;
      inStock: boolean;
    }[];
    errors?: string[];
  }> {
    const errors: string[] = [];
    let totalTokens = 0;
    const items: any[] = [];

    // Get balance
    const balance = await this.tokenRepo.getBalance(userId);

    // Validate each item
    for (const item of cart.items) {
      const product = await this.redemptionRepo.findProductById(item.productId);

      if (!product) {
        errors.push(`Product ${item.productId} not found`);
        continue;
      }

      if (!product.isActive) {
        errors.push(`${product.name} is no longer available`);
        continue;
      }

      const inStock = product.stockQuantity === null || product.stockQuantity >= item.quantity;
      
      if (!inStock) {
        errors.push(`${product.name} has insufficient stock`);
      }

      const subtotal = product.tokenCost * item.quantity;
      totalTokens += subtotal;

      items.push({
        productId: product.id,
        name: product.name,
        tokenCost: product.tokenCost,
        quantity: item.quantity,
        subtotal,
        inStock,
      });
    }

    // Check balance
    if (balance.available < BigInt(totalTokens * 10_000_000)) {
      errors.push('Insufficient token balance');
    }

    return {
      valid: errors.length === 0,
      totalTokens,
      balance: balance.available,
      items,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Create redemption
   * Pattern: Validate → Create redemption → Request burn → Wait for confirmation
   */
  async createRedemption(
    userId: string,
    cart: RedemptionCart,
    deliveryInfo?: Record<string, any>,
    context?: ServiceContext
  ): Promise<RedemptionWithDetails> {
    this.logger.info({ userId, itemCount: cart.items.length }, 'Creating redemption');

    // Validate cart
    const validation = await this.validateCart(userId, cart, context!);

    if (!validation.valid) {
      throw new ServiceError(
        'VALIDATION_ERROR',
        'Cart validation failed',
        null,
        { errors: validation.errors }
      );
    }

    // Create redemption record
    const redemption = await this.redemptionRepo.createRedemption({
      userId,
      items: cart.items,
    });

    // Update with delivery info if provided
    if (deliveryInfo) {
      for (const item of redemption.items) {
        await this.prisma.redemptionItem.update({
          where: { id: item.id },
          data: { deliveryData: deliveryInfo },
        });
      }
    }

    // Request token burn
    await this.publishEvent('redemption.burn_requested', {
      redemptionId: redemption.id,
      userId,
      amount: redemption.totalTokens,
    }, context);

    // Update status
    await this.redemptionRepo.updateStatus(redemption.id, 'pending_burn');

    return this.redemptionRepo.findByIdWithDetails(redemption.id) as Promise<RedemptionWithDetails>;
  }

  /**
   * Process fulfillment after burn confirmation
   * Pattern: Call partner API → Get voucher codes → Update redemption → Notify user
   */
  async processFulfillment(redemptionId: string): Promise<void> {
    this.logger.info({ redemptionId }, 'Processing fulfillment');

    const redemption = await this.redemptionRepo.findByIdWithDetails(redemptionId);

    if (!redemption) {
      throw new ServiceError('NOT_FOUND', 'Redemption not found');
    }

    if (redemption.status !== 'burn_confirmed') {
      this.logger.warn({ redemptionId, status: redemption.status }, 'Invalid status for fulfillment');
      return;
    }

    // Update status to processing
    await this.redemptionRepo.updateStatus(redemptionId, 'processing');

    try {
      const voucherCodes: { itemId: string; code: string }[] = [];

      // Process each item through partner integration
      for (const item of redemption.items) {
        const partner = item.product.partner;

        const result = await this.partnerIntegration.fulfillItem({
          partnerId: partner.id,
          partnerType: partner.type,
          productSku: item.product.externalSku || item.product.id,
          quantity: item.quantity,
          recipientPhone: redemption.user?.phone,
          deliveryData: item.deliveryData as Record<string, any>,
        });

        if (result.voucherCode) {
          voucherCodes.push({
            itemId: item.id,
            code: result.voucherCode,
          });
        }
      }

      // Update redemption as completed
      await this.redemptionRepo.updateStatus(redemptionId, 'completed', {
        voucherCodes,
        externalReference: voucherCodes.map(v => v.code).join(','),
      });

      // Notify user
      await this.publishEvent('redemption.completed', {
        redemptionId,
        userId: redemption.userId,
        totalTokens: redemption.totalTokens,
        itemCount: redemption.items.length,
        voucherCodes: voucherCodes.map(v => v.code),
      });

    } catch (error) {
      this.logger.error({ redemptionId, error }, 'Fulfillment failed');

      await this.redemptionRepo.updateStatus(redemptionId, 'failed', {
        failureReason: (error as Error).message,
      });

      // Trigger refund process
      await this.publishEvent('redemption.failed', {
        redemptionId,
        userId: redemption.userId,
        totalTokens: redemption.totalTokens,
        reason: (error as Error).message,
      });

      throw error;
    }
  }

  // ============================================
  // QUERIES
  // ============================================

  /**
   * Get user's redemption history
   */
  async getRedemptionHistory(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      status?: RedemptionStatus;
    },
    context?: ServiceContext
  ): Promise<{
    redemptions: RedemptionWithDetails[];
    pagination: any;
    summary: {
      totalRedemptions: number;
      totalTokensSpent: number;
      completedCount: number;
    };
  }> {
    const result = await this.redemptionRepo.findWithFilters(
      {
        userId,
        status: options?.status,
      },
      { page: options?.page, limit: options?.limit }
    );

    // Calculate summary
    const allRedemptions = await this.prisma.redemption.findMany({
      where: { userId },
      select: { totalTokens: true, status: true },
    });

    const summary = {
      totalRedemptions: allRedemptions.length,
      totalTokensSpent: allRedemptions
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + r.totalTokens, 0),
      completedCount: allRedemptions.filter(r => r.status === 'completed').length,
    };

    return {
      redemptions: result.data,
      pagination: result.pagination,
      summary,
    };
  }

  /**
   * Get single redemption details
   */
  async getRedemption(
    redemptionId: string,
    userId: string,
    context: ServiceContext
  ): Promise<RedemptionWithDetails> {
    const redemption = await this.redemptionRepo.findByIdWithDetails(redemptionId);

    if (!redemption) {
      throw new ServiceError('NOT_FOUND', 'Redemption not found');
    }

    // Verify ownership
    if (redemption.userId !== userId) {
      throw new ServiceError('FORBIDDEN', 'Access denied');
    }

    return redemption;
  }

  // ============================================
  // SCHEDULED TASKS
  // ============================================

  /**
   * Cancel expired redemptions
   * Called by scheduler
   */
  async cancelExpiredRedemptions(): Promise<number> {
    const count = await this.redemptionRepo.cancelExpired();
    
    this.logger.info({ count }, 'Cancelled expired redemptions');

    return count;
  }

  /**
   * Retry failed fulfillments
   * Called by scheduler
   */
  async retryFailedFulfillments(): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
  }> {
    const failedRedemptions = await this.prisma.redemption.findMany({
      where: {
        status: 'failed',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    let succeeded = 0;
    let failed = 0;

    for (const redemption of failedRedemptions) {
      try {
        // Reset status and retry
        await this.redemptionRepo.updateStatus(redemption.id, 'burn_confirmed');
        await this.processFulfillment(redemption.id);
        succeeded++;
      } catch (error) {
        failed++;
      }
    }

    return {
      processed: failedRedemptions.length,
      succeeded,
      failed,
    };
  }
}