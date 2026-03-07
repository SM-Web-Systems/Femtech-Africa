const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');
const { burnTokens, getBalance } = require('../utils/stellar');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Get partners (public)
router.get('/partners', async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products (public)
router.get('/products', async (req, res) => {
  try {
    const { partnerId } = req.query;
    const where = { is_available: true };
    if (partnerId) where.partner_id = partnerId;

    const products = await prisma.partnerProduct.findMany({
      where,
      include: { partner: { select: { name: true } } },
      orderBy: { token_cost: 'asc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's redemptions
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const redemptions = await prisma.redemption.findMany({
      where: { user_id: req.user.userId },
      include: {
        partner: { select: { name: true } },
        redemption_items: {
          include: { product: { select: { name: true, token_cost: true } } }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(redemptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create redemption
router.post('/my', authenticateToken, async (req, res) => {
  try {
    const { partnerId, products, recipientPhone, userSecretKey } = req.body;

    if (!userSecretKey) {
      return res.status(400).json({ error: 'Secret key required for redemption' });
    }

    const wallet = await prisma.wallet.findFirst({
      where: { user_id: req.user.userId }
    });

    if (!wallet) {
      return res.status(400).json({ error: 'Wallet not found' });
    }

    // Calculate total cost
    let totalCost = 0;
    for (const item of products) {
      const product = await prisma.partnerProduct.findUnique({
        where: { id: item.productId }
      });
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      totalCost += parseFloat(product.token_cost) * item.quantity;
    }

    // Check balance
    const { mamaBalance } = await getBalance(wallet.stellar_address);
    if (parseFloat(mamaBalance) < totalCost) {
      return res.status(400).json({
        error: 'Insufficient MAMA balance',
        required: totalCost,
        available: parseFloat(mamaBalance)
      });
    }

    // Burn tokens
    const txHash = await burnTokens(userSecretKey, totalCost);

    // Create redemption record
    const redemption = await prisma.redemption.create({
      data: {
        user_id: req.user.userId,
        partner_id: partnerId,
        total_tokens: totalCost,
        status: 'completed',
        tx_hash: txHash,
        recipient_phone: recipientPhone
      }
    });

    // Create redemption items with voucher codes
    for (const item of products) {
      const product = await prisma.partnerProduct.findUnique({
        where: { id: item.productId }
      });

      const voucherCode = `VOUCHER-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      await prisma.redemptionItem.create({
        data: {
          redemption_id: redemption.id,
          product_id: item.productId,
          quantity: item.quantity,
          token_cost: product.token_cost,
          voucherCode,
          voucher_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }

    // Log transaction
    await prisma.tokenTransaction.create({
      data: {
        user_id: req.user.userId,
        type: 'burn_redemption',
        amount: -totalCost,
        tx_hash: txHash,
        status: 'confirmed',
        redemption_id: redemption.id
      }
    });

    const fullRedemption = await prisma.redemption.findUnique({
      where: { id: redemption.id },
      include: {
        redemption_items: {
          include: { product: true }
        }
      }
    });

    res.json({
      success: true,
      redemption: fullRedemption,
      txHash,
      stellarExpert: `https://stellar.expert/explorer/testnet/tx/${txHash}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
