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

// Get available partners for redemption
router.get('/partners', authenticateToken, async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      where: { is_active: true },
      select: {
        id: true,
        name: true,
        description: true,
        logo_url: true,
        category: true,
        min_tokens: true,
        exchange_rate: true,
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
    
    const products = await prisma.product.findMany({
      where: {
        partner_id: partnerId,
        is_active: true,
        stock: { gt: 0 },
      },
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        token_cost: true,
        stock: true,
        category: true,
      },
      orderBy: { token_cost: 'asc' },
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

    // Validate input
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

    // Check user balance
    const balance = await getBalance(user.walletAddress);
    if (parseFloat(balance.mamaBalance) < tokenAmount) {
      return res.status(400).json({ 
        error: 'Insufficient MAMA balance',
        required: tokenAmount,
        available: balance.mamaBalance,
      });
    }

    // Get partner details
    const partner = await prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner || !partner.is_active) {
      return res.status(404).json({ error: 'Partner not found or inactive' });
    }

    // Check minimum tokens
    if (tokenAmount < parseFloat(partner.min_tokens || 0)) {
      return res.status(400).json({ 
        error: `Minimum ${partner.min_tokens} MAMA required for this partner` 
      });
    }

    // Get product if specified
    let product = null;
    if (productId) {
      product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product || !product.is_active) {
        return res.status(404).json({ error: 'Product not found or unavailable' });
      }

      if (product.stock <= 0) {
        return res.status(400).json({ error: 'Product out of stock' });
      }

      if (parseFloat(product.token_cost) > tokenAmount) {
        return res.status(400).json({ 
          error: `Product requires ${product.token_cost} MAMA tokens` 
        });
      }
    }

    // Calculate voucher value
    const exchangeRate = parseFloat(partner.exchange_rate || 0.10);
    const voucherValue = calculateVoucherValue(tokenAmount, exchangeRate);

    // Burn tokens on Stellar
    const burnResult = await burnTokens(user.walletAddress, tokenAmount);
    
    if (!burnResult.success) {
      return res.status(500).json({ error: 'Failed to burn tokens', details: burnResult.error });
    }

    // Generate voucher code and QR
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

    // Create redemption and voucher in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create redemption record
      const redemption = await tx.redemption.create({
        data: {
          user_id: userId,
          partner_id: partnerId,
          product_id: productId || null,
          total_tokens: tokenAmount,
          status: 'completed',
          tx_hash: burnResult.txHash,
          completed_at: new Date(),
        },
      });

      // Create voucher
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
          partner: { select: { name: true, logo_url: true } },
          product: { select: { name: true, image_url: true } },
        },
      });

      // Record token transaction
      await tx.tokenTransaction.create({
        data: {
          user_id: userId,
          type: 'burn',
          amount: -tokenAmount,
          status: 'completed',
          tx_hash: burnResult.txHash,
          description: `Redeemed for voucher at ${partner.name}`,
        },
      });

      // Decrease product stock if applicable
      if (productId) {
        await tx.product.update({
          where: { id: productId },
          data: { stock: { decrement: 1 } },
        });
      }

      return { redemption, voucher };
    });

    // Get updated balance
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
      redemption: {
        id: result.redemption.id,
        txHash: result.redemption.tx_hash,
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
    if (status) {
      where.status = status;
    }

    const vouchers = await prisma.voucher.findMany({
      where,
      include: {
        partner: { select: { name: true, logo_url: true, category: true } },
        product: { select: { name: true, image_url: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check and update expired vouchers
    const now = new Date();
    const updatedVouchers = await Promise.all(
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

    res.json(updatedVouchers.map(v => ({
      id: v.id,
      code: v.code,
      barcode: v.barcode,
      qrCode: v.qrCode,
      tokensBurned: parseFloat(v.tokensBurned),
      value: {
        amount: parseFloat(v.valueAmount),
        currency: v.valueCurrency,
      },
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

// Get single voucher details
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
      value: {
        amount: parseFloat(voucher.valueAmount),
        currency: voucher.valueCurrency,
      },
      partner: voucher.partner,
      product: voucher.product,
      status: voucher.status,
      expiresAt: voucher.expiresAt,
      usedAt: voucher.usedAt,
      usedAtLocation: voucher.usedAtLocation,
      createdAt: voucher.createdAt,
      txHash: voucher.redemption?.tx_hash,
    });

  } catch (error) {
    console.error('Get voucher error:', error);
    res.status(500).json({ error: 'Failed to fetch voucher' });
  }
});

// Partner endpoint to validate/use voucher
router.post('/vouchers/:code/validate', async (req, res) => {
  try {
    const { code } = req.params;
    const { partnerKey, location } = req.body;

    // Validate partner API key (you'd implement proper auth)
    // For now, just check the voucher

    const voucher = await prisma.voucher.findUnique({
      where: { code },
      include: {
        partner: true,
        product: true,
        user: { select: { phone: true } },
      },
    });

    if (!voucher) {
      return res.status(404).json({ valid: false, error: 'Voucher not found' });
    }

    if (voucher.status === 'used') {
      return res.status(400).json({ 
        valid: false, 
        error: 'Voucher already used',
        usedAt: voucher.usedAt,
      });
    }

    if (voucher.status === 'expired' || voucher.expiresAt < new Date()) {
      return res.status(400).json({ valid: false, error: 'Voucher expired' });
    }

    if (voucher.status === 'cancelled') {
      return res.status(400).json({ valid: false, error: 'Voucher cancelled' });
    }

    res.json({
      valid: true,
      voucher: {
        code: voucher.code,
        value: {
          amount: parseFloat(voucher.valueAmount),
          currency: voucher.valueCurrency,
        },
        partner: voucher.partner?.name,
        product: voucher.product?.name,
        expiresAt: voucher.expiresAt,
      },
    });

  } catch (error) {
    console.error('Validate voucher error:', error);
    res.status(500).json({ valid: false, error: 'Validation failed' });
  }
});

// Partner endpoint to mark voucher as used
router.post('/vouchers/:code/use', async (req, res) => {
  try {
    const { code } = req.params;
    const { partnerKey, location } = req.body;

    const voucher = await prisma.voucher.findUnique({
      where: { code },
    });

    if (!voucher) {
      return res.status(404).json({ success: false, error: 'Voucher not found' });
    }

    if (voucher.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        error: `Voucher is ${voucher.status}` 
      });
    }

    if (voucher.expiresAt < new Date()) {
      await prisma.voucher.update({
        where: { id: voucher.id },
        data: { status: 'expired' },
      });
      return res.status(400).json({ success: false, error: 'Voucher expired' });
    }

    // Mark as used
    const updatedVoucher = await prisma.voucher.update({
      where: { id: voucher.id },
      data: {
        status: 'used',
        usedAt: new Date(),
        usedAtLocation: location || null,
      },
    });

    res.json({
      success: true,
      message: 'Voucher redeemed successfully',
      voucher: {
        code: updatedVoucher.code,
        usedAt: updatedVoucher.usedAt,
        location: updatedVoucher.usedAtLocation,
      },
    });

  } catch (error) {
    console.error('Use voucher error:', error);
    res.status(500).json({ success: false, error: 'Failed to use voucher' });
  }
});

module.exports = router;