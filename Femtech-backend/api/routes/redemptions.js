const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');
const { burnTokens, getBalance } = require('../utils/stellar');
const {
  generateVoucherCode,
  generateQRCode,
  generateBarcode,
  calculateVoucherValue,
  getExpiryDate,
} = require('../utils/voucher');

const prisma = new PrismaClient();

// Get available partners
router.get('/partners', authenticateToken, async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        type: true,
        country: true,
      },
      orderBy: { name: 'asc' },
    });
    res.json(partners);
  } catch (error) {
    console.error('Get partners error:', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// Get partner products
router.get('/partners/:partnerId/products', authenticateToken, async (req, res) => {
  try {
    const { partnerId } = req.params;
    
    const products = await prisma.partnerProduct.findMany({
      where: {
        partnerId: partnerId,
        is_available: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        tokenCost: true,
        stockQuantity: true,
        category: true,
      },
      orderBy: { tokenCost: 'asc' },
    });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create redemption and generate voucher
router.post('/redeem', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId, productId, tokenAmount } = req.body;

    if (!partnerId || !tokenAmount || tokenAmount <= 0) {
      return res.status(400).json({ error: 'Partner and token amount required' });
    }

    // Get user with wallet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, walletAddress: true, phone: true },
    });

    if (!user?.walletAddress) {
      return res.status(400).json({ error: 'Wallet required for redemption' });
    }

    // Check balance
    const balance = await getBalance(user.walletAddress);
    if (parseFloat(balance.mamaBalance) < tokenAmount) {
      return res.status(400).json({ 
        error: 'Insufficient MAMA balance',
        required: tokenAmount,
        available: balance.mamaBalance,
      });
    }

    // Get partner
    const partner = await prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner || !partner.isActive) {
      return res.status(404).json({ error: 'Partner not found or inactive' });
    }

    // Get product if specified
    let product = null;
    if (productId) {
      product = await prisma.partnerProduct.findUnique({
        where: { id: productId },
      });

      if (!product || !product.is_available) {
        return res.status(404).json({ error: 'Product not found or unavailable' });
      }

      if (product.tokenCost > tokenAmount) {
        return res.status(400).json({ 
          error: `Product requires ${product.tokenCost} MAMA tokens` 
        });
      }
    }

    // Calculate voucher value (1 MAMA = 0.10 ZAR default)
    const exchangeRate = 0.10;
    const voucherValue = calculateVoucherValue(tokenAmount, exchangeRate);

    // Burn tokens
    const burnResult = await burnTokens(user.walletAddress, tokenAmount);
    
    if (!burnResult.success) {
      return res.status(500).json({ error: 'Failed to burn tokens', details: burnResult.error });
    }

    // Generate voucher
    const voucherCode = generateVoucherCode('MAMA');
    const barcode = generateBarcode();
    const expiresAt = getExpiryDate(30);

    const qrData = {
      code: voucherCode,
      partner: partner.name,
      value: voucherValue,
      currency: 'ZAR',
      expires: expiresAt.toISOString(),
      product: product?.name || null,
    };
    const qrCode = await generateQRCode(qrData);

    // Create redemption and voucher
    const result = await prisma.$transaction(async (tx) => {
      const redemption = await tx.redemption.create({
        data: {
          userId: userId,
          partner_id: partnerId,
          type: partner.type,
          totalTokens: tokenAmount,
          status: 'completed',
          burn_tx_hash: burnResult.txHash,
          burn_confirmed_at: new Date(),
          completedAt: new Date(),
        },
      });

      const voucher = await tx.voucher.create({
        data: {
          code: voucherCode,
          userId: userId,
          redemptionId: redemption.id,
          partnerId: partnerId,
          productId: productId || null,
          tokensBurned: tokenAmount,
          valueCurrency: 'ZAR',
          valueAmount: voucherValue,
          status: 'active',
          expiresAt: expiresAt,
          qrCode: qrCode,
          barcode: barcode,
        },
        include: {
          partner: { select: { name: true, logoUrl: true } },
          product: { select: { name: true, imageUrl: true } },
        },
      });

      await tx.tokenTransaction.create({
        data: {
          userId: userId,
          type: 'burn_redemption',
          amount: -tokenAmount,
          status: 'confirmed',
          tx_hash: burnResult.txHash,
          redemptionId: redemption.id,
        },
      });

      if (productId && product?.stockQuantity) {
        await tx.partnerProduct.update({
          where: { id: productId },
          data: { stockQuantity: { decrement: 1 } },
        });
      }

      return { redemption, voucher };
    });

    const newBalance = await getBalance(user.walletAddress);

    res.status(201).json({
      success: true,
      message: 'Redemption successful! Your voucher is ready.',
      voucher: {
        id: result.voucher.id,
        code: result.voucher.code,
        barcode: result.voucher.barcode,
        qrCode: result.voucher.qrCode,
        tokensBurned: parseFloat(result.voucher.tokensBurned),
        value: {
          amount: parseFloat(result.voucher.valueAmount),
          currency: result.voucher.valueCurrency,
        },
        partner: result.voucher.partner,
        product: result.voucher.product,
        status: result.voucher.status,
        expiresAt: result.voucher.expiresAt,
        createdAt: result.voucher.createdAt,
      },
      newBalance: {
        mamaBalance: newBalance.mamaBalance,
        xlmBalance: newBalance.xlmBalance,
      },
    });

  } catch (error) {
    console.error('Redemption error:', error);
    res.status(500).json({ error: 'Redemption failed', details: error.message });
  }
});

// Get user's vouchers
router.get('/my/vouchers', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const where = { userId };
    if (status) where.status = status;

    const vouchers = await prisma.voucher.findMany({
      where,
      include: {
        partner: { select: { name: true, logoUrl: true, type: true } },
        product: { select: { name: true, imageUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check expired
    const now = new Date();
    const result = await Promise.all(
      vouchers.map(async (v) => {
        if (v.status === 'active' && v.expiresAt < now) {
          await prisma.voucher.update({
            where: { id: v.id },
            data: { status: 'expired' },
          });
          return { ...v, status: 'expired' };
        }
        return v;
      })
    );

    res.json(result.map(v => ({
      id: v.id,
      code: v.code,
      barcode: v.barcode,
      qrCode: v.qrCode,
      tokensBurned: parseFloat(v.tokensBurned),
      value: { amount: parseFloat(v.valueAmount), currency: v.valueCurrency },
      partner: v.partner,
      product: v.product,
      status: v.status,
      expiresAt: v.expiresAt,
      usedAt: v.usedAt,
      createdAt: v.createdAt,
    })));

  } catch (error) {
    console.error('Get vouchers error:', error);
    res.status(500).json({ error: 'Failed to fetch vouchers' });
  }
});

// Get single voucher
router.get('/my/vouchers/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const voucher = await prisma.voucher.findFirst({
      where: { id, userId },
      include: {
        partner: true,
        product: true,
        redemption: true,
      },
    });

    if (!voucher) {
      return res.status(404).json({ error: 'Voucher not found' });
    }

    res.json({
      id: voucher.id,
      code: voucher.code,
      barcode: voucher.barcode,
      qrCode: voucher.qrCode,
      tokensBurned: parseFloat(voucher.tokensBurned),
      value: { amount: parseFloat(voucher.valueAmount), currency: voucher.valueCurrency },
      partner: voucher.partner,
      product: voucher.product,
      status: voucher.status,
      expiresAt: voucher.expiresAt,
      usedAt: voucher.usedAt,
      usedAtLocation: voucher.usedAtLocation,
      createdAt: voucher.createdAt,
      txHash: voucher.redemption?.burn_tx_hash,
    });

  } catch (error) {
    console.error('Get voucher error:', error);
    res.status(500).json({ error: 'Failed to fetch voucher' });
  }
});

module.exports = router;
