const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');
const { createWallet, getBalance } = require('../utils/stellar');

const prisma = new PrismaClient();

// Create wallet
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.walletAddress) {
      return res.status(400).json({ error: 'Wallet already exists' });
    }

    const { publicKey, secretKey } = await createWallet();

    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        walletAddress: publicKey,
        walletCreatedAt: new Date()
      }
    });

    res.json({
      success: true,
      publicKey,
      secretKey,
      message: 'IMPORTANT: Save your secret key securely. It cannot be recovered!'
    });
  } catch (error) {
    console.error('Create wallet error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.walletAddress) {
      return res.json({
        stellarAddress: null,
        xlmBalance: '0',
        mamaBalance: '0',
        hasWallet: false
      });
    }

    try {
      const { xlmBalance, mamaBalance } = await getBalance(user.walletAddress);
      res.json({
        stellarAddress: user.walletAddress,
        xlmBalance,
        mamaBalance,
        hasWallet: true
      });
    } catch (stellarError) {
      // Wallet exists but not funded on Stellar yet
      res.json({
        stellarAddress: user.walletAddress,
        xlmBalance: '0',
        mamaBalance: '0',
        hasWallet: true,
        note: 'Wallet not yet funded on Stellar network'
      });
    }
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
