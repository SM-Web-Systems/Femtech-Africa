const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { createWallet, getBalance } = require('../utils/stellar');

const prisma = new PrismaClient();

// Create wallet
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const existingWallet = await prisma.wallet.findFirst({
      where: { user_id: req.user.userId }
    });

    if (existingWallet) {
      return res.status(400).json({ error: 'Wallet already exists' });
    }

    const { publicKey, secretKey } = await createWallet();

    await prisma.wallet.create({
      data: {
        user_id: req.user.userId,
        stellar_address: publicKey,
        balance: 0
      }
    });

    res.json({
      success: true,
      publicKey,
      secretKey,
      message: 'IMPORTANT: Save your secret key securely. It cannot be recovered!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const wallet = await prisma.wallet.findFirst({
      where: { user_id: req.user.userId }
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const { xlmBalance, mamaBalance } = await getBalance(wallet.stellar_address);

    res.json({
      stellarAddress: wallet.stellar_address,
      xlmBalance,
      mamaBalance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
