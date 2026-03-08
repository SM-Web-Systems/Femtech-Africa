const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');
const { createWallet, importWallet, getBalance } = require('../utils/stellar');

const prisma = new PrismaClient();

// Create wallet
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true }
    });

    if (user?.walletAddress) {
      return res.status(400).json({ error: 'User already has a wallet' });
    }

    const { publicKey, secretKey, encryptedSecret } = await createWallet();

    await prisma.user.update({
      where: { id: userId },
      data: {
        walletAddress: publicKey,
        walletSecretEncrypted: encryptedSecret,
        walletCreatedAt: new Date()
      }
    });

    res.json({
      success: true,
      publicKey,
      secretKey, // Return once for user to backup
      message: 'Wallet created successfully. Please save your secret key!'
    });
  } catch (error) {
    console.error('Create wallet error:', error);
    res.status(500).json({ error: 'Failed to create wallet' });
  }
});

// Import wallet
router.post('/import', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { secretKey } = req.body;

    if (!secretKey) {
      return res.status(400).json({ error: 'Secret key required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true }
    });

    if (user?.walletAddress) {
      return res.status(400).json({ error: 'User already has a wallet' });
    }

    const { publicKey, encryptedSecret } = await importWallet(secretKey);

    // Check if wallet is already used
    const existing = await prisma.user.findFirst({
      where: { walletAddress: publicKey }
    });

    if (existing) {
      return res.status(400).json({ error: 'Wallet already in use by another account' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        walletAddress: publicKey,
        walletSecretEncrypted: encryptedSecret,
        walletCreatedAt: new Date()
      }
    });

    res.json({
      success: true,
      publicKey,
      message: 'Wallet imported successfully'
    });
  } catch (error) {
    console.error('Import wallet error:', error);
    res.status(500).json({ error: 'Failed to import wallet. Invalid secret key?' });
  }
});

// Get balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true }
    });

    if (!user?.walletAddress) {
      return res.json({
        hasWallet: false,
        stellarAddress: null,
        mamaBalance: '0',
        xlmBalance: '0'
      });
    }

    const balance = await getBalance(user.walletAddress);

    res.json({
      hasWallet: true,
      stellarAddress: user.walletAddress,
      ...balance
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Failed to get balance' });
  }
});

// Get transactions
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const transactions = await prisma.tokenTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

module.exports = router;
