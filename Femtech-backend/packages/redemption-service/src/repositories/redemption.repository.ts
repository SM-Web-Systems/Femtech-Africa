// ============================================
// REDEMPTION REPOSITORY
// ============================================

import {
  Redemption,
  RedemptionItem,
  Partner,
  PartnerProduct,
  RedemptionStatus,
  PartnerType,
  Prisma,
  CountryCode,
} from '@momentum/prisma-client';
import {
  BaseRepository,
  RepositoryOptions,
  PaginatedResult,
} from '@momentum/shared/database';

export interface RedemptionWithDetails extends Redemption {
  items: (RedemptionItem & {
    product: PartnerProduct & {
      partner: Partner;
    };
  })[];
  user?: { id: string; phone: string; walletAddress: string | null };
}

export interface PartnerWithProducts extends Partner {
  products: PartnerProduct[];
  _count: { products: number };
}

export interface RedemptionFilters {
  userId?: string;
  status?: RedemptionStatus;
  partnerId?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

export class RedemptionRepository extends BaseRepository<
  Redemption,
  Prisma.RedemptionCreateInput,
  Prisma.RedemptionUpdateInput,
  Prisma.RedemptionWhereInput,
  Prisma.RedemptionOrderByWithRelationInput
> {
  protected modelName = 'redemption';
  protected cachePrefix = 'redemption';
  protected cacheTTL = 60;

  constructor(options: RepositoryOptions) {
    super(options);
  }

  // ============================================
  // PARTNER & PRODUCT QUERIES
  // ============================================

  async findPartners(params: {
    type?: PartnerType;
    country?: CountryCode;
    isActive?: boolean;
  }): Promise<PartnerWithProducts[]> {
    const where: Prisma.PartnerWhereInput = {};

    if (params.type) where.type = params.type;
    if (params.country) where.country = params.country;
    if (params.isActive !== undefined) where.isActive = params.isActive;

    return this.executeQuery('findPartners', () =>
      this.prisma.partner.findMany({
        where,
        include: {
          products: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
          },
          _count: { select: { products: true } },
        },
        orderBy: { name: 'asc' },
      })
    );
  }

  async findProducts(params: {
    partnerId?: string;
    category?: string;
    country?: CountryCode;
    maxTokenCost?: number;
    isActive?: boolean;
  }): Promise<(PartnerProduct & { partner: Partner })[]> {
    const where: Prisma.PartnerProductWhereInput = {};

    if (params.partnerId) where.partnerId = params.partnerId;
    if (params.category) where.category = params.category;
    if (params.isActive !== undefined) where.isActive = params.isActive;
    if (params.maxTokenCost) where.tokenCost = { lte: params.maxTokenCost };
    
    if (params.country) {
      where.partner = { country: params.country, isActive: true };
    }

    return this.executeQuery('findProducts', () =>
      this.prisma.partnerProduct.findMany({
        where,
        include: { partner: true },
        orderBy: [
          { partner: { name: 'asc' } },
          { sortOrder: 'asc' },
        ],
      })
    );
  }

  async findProductById(id: string): Promise<(PartnerProduct & { partner: Partner }) | null> {
    return this.executeQuery('findProductById', () =>
      this.prisma.partnerProduct.findUnique({
        where: { id },
        include: { partner: true },
      })
    );
  }

  // ============================================
  // REDEMPTION QUERIES
  // ============================================

  async findByIdWithDetails(id: string): Promise<RedemptionWithDetails | null> {
    return this.executeQuery('findByIdWithDetails', () =>
      this.prisma.redemption.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, phone: true, walletAddress: true },
          },
          items: {
            include: {
              product: {
                include: { partner: true },
              },
            },
          },
        },
      })
    );
  }

  async findByUser(
    userId: string,
    pagination?: { page?: number; limit?: number }
  ): Promise<PaginatedResult<RedemptionWithDetails>> {
    return this.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      pagination,
      include: {
        items: {
          include: {
            product: {
              include: { partner: { select: { name: true, type: true, logoUrl: true } } },
            },
          },
        },
      },
    }) as Promise<PaginatedResult<RedemptionWithDetails>>;
  }

  async findWithFilters(
    filters: RedemptionFilters,
    pagination?: { page?: number; limit?: number }
  ): Promise<PaginatedResult<RedemptionWithDetails>> {
    const where: Prisma.RedemptionWhereInput = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.status) where.status = filters.status;
    
    if (filters.partnerId) {
      where.items = {
        some: {
          product: { partnerId: filters.partnerId },
        },
      };
    }

    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};
      if (filters.createdAfter) where.createdAt.gte = filters.createdAfter;
      if (filters.createdBefore) where.createdAt.lte = filters.createdBefore;
    }

    return this.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      pagination,
      include: {
        user: { select: { id: true, phone: true } },
        items: {
          include: {
            product: { include: { partner: true } },
          },
        },
      },
    }) as Promise<PaginatedResult<RedemptionWithDetails>>;
  }

  // ============================================
  // REDEMPTION CREATION
  // ============================================

  async createRedemption(data: {
    userId: string;
    items: { productId: string; quantity: number }[];
  }): Promise<RedemptionWithDetails> {
    return this.withTransaction(async (tx) => {
      // Fetch products and calculate total
      const products = await tx.partnerProduct.findMany({
        where: {
          id: { in: data.items.map(i => i.productId) },
          isActive: true,
        },
      });

      if (products.length !== data.items.length) {
        throw new Error('One or more products not found or inactive');
      }

      const productMap = new Map(products.map(p => [p.id, p]));
      let totalTokens = 0;

      const itemsData = data.items.map(item => {
        const product = productMap.get(item.productId)!;
        const cost = product.tokenCost * item.quantity;
        totalTokens += cost;
        
        return {
          productId: item.productId,
          quantity: item.quantity,
          tokenCost: cost,
        };
      });

      // Check stock
      for (const item of data.items) {
        const product = productMap.get(item.productId)!;
        if (product.stockQuantity !== null && product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
      }

      // Create redemption
      const redemption = await tx.redemption.create({
        data: {
          userId: data.userId,
          status: 'initiated',
          totalTokens,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
          items: {
            create: itemsData,
          },
        },
        include: {
          items: {
            include: {
              product: { include: { partner: true } },
            },
          },
        },
      });

      // Decrement stock
      for (const item of data.items) {
        const product = productMap.get(item.productId)!;
        if (product.stockQuantity !== null) {
          await tx.partnerProduct.update({
            where: { id: item.productId },
            data: { stockQuantity: { decrement: item.quantity } },
          });
        }
      }

      await this.emitEvent('created', redemption);
      return redemption as RedemptionWithDetails;
    });
  }

  async updateStatus(
    id: string,
    status: RedemptionStatus,
    data?: {
      burnTxId?: string;
      externalReference?: string;
      failureReason?: string;
      voucherCodes?: { itemId: string; code: string }[];
    }
  ): Promise<Redemption> {
    return this.withTransaction(async (tx) => {
      const updateData: Prisma.RedemptionUpdateInput = {
        status,
      };

      if (data?.burnTxId) updateData.burnTxId = data.burnTxId;
      if (data?.externalReference) updateData.externalReference = data.externalReference;
      if (data?.failureReason) updateData.failureReason = data.failureReason;
      if (status === 'completed') updateData.completedAt = new Date();

      // Update voucher codes if provided
      if (data?.voucherCodes) {
        for (const vc of data.voucherCodes) {
          await tx.redemptionItem.update({
            where: { id: vc.itemId },
            data: { voucherCode: vc.code },
          });
        }
      }

      const redemption = await tx.redemption.update({
        where: { id },
        data: updateData,
      });

      await this.emitEvent(`status_${status}`, redemption);
      return redemption;
    });
  }

  async cancelExpired(): Promise<number> {
    const result = await this.prisma.redemption.updateMany({
      where: {
        status: { in: ['initiated', 'pending_burn'] },
        expiresAt: { lt: new Date() },
      },
      data: {
        status: 'expired',
        failureReason: 'Redemption expired',
      },
    });

    this.logger.info({ count: result.count }, 'Cancelled expired redemptions');
    return result.count;
  }

  // ============================================
  // STATISTICS
  // ============================================

  async getPartnerStats(partnerId: string): Promise<{
    totalRedemptions: number;
    totalTokensRedeemed: number;
    completedRedemptions: number;
    popularProducts: { productId: string; name: string; count: number }[];
  }> {
    const [totals, completed, popular] = await Promise.all([
      this.prisma.redemptionItem.aggregate({
        where: {
          product: { partnerId },
          redemption: { status: { not: 'failed' } },
        },
        _sum: { tokenCost: true },
        _count: true,
      }),
      this.prisma.redemption.count({
        where: {
          status: 'completed',
          items: { some: { product: { partnerId } } },
        },
      }),
      this.prisma.redemptionItem.groupBy({
        by: ['productId'],
        where: {
          product: { partnerId },
          redemption: { status: 'completed' },
        },
        _count: true,
        orderBy: { _count: { productId: 'desc' } },
        take: 5,
      }),
    ]);

    // Get product names
    const productIds = popular.map(p => p.productId);
    const products = await this.prisma.partnerProduct.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });
    const productNames = new Map(products.map(p => [p.id, p.name]));

    return {
      totalRedemptions: totals._count,
      totalTokensRedeemed: totals._sum.tokenCost || 0,
      completedRedemptions: completed,
      popularProducts: popular.map(p => ({
        productId: p.productId,
        name: productNames.get(p.productId) || 'Unknown',
        count: p._count,
      })),
    };
  }
}
