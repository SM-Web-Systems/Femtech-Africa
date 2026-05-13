const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');
const { mintTokens } = require('../utils/stellar');

const prisma = new PrismaClient();

// Get all milestone definitions (public)
router.get('/', async (req, res) => {
  try {
    const milestones = await prisma.milestoneDefinition.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json(milestones);
  } catch (error) {
    console.error('Get milestones error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's milestones
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const milestones = await prisma.userMilestone.findMany({
      where: { userId: req.user.userId },
      include: { milestone_definitions: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(milestones);
  } catch (error) {
    console.error('Get user milestones error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mint reward for completed milestone
router.post('/mint', authenticateToken, async (req, res) => {
  try {
    const { milestoneId } = req.body;

    const userMilestone = await prisma.userMilestone.findFirst({
      where: {
        userId: req.user.userId,
        id: milestoneId,
        status: 'completed',
        reward_minted: false
      },
      include: { milestone_definitions: true }
    });

    if (!userMilestone) {
      return res.status(400).json({ error: 'No eligible milestone found' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user?.walletAddress) {
      return res.status(400).json({ error: 'Wallet not found. Please create a wallet first.' });
    }

    const amount = userMilestone.rewardAmount || userMilestone.milestone_definitions.rewardAmount;
    const txHash = await mintTokens(user.walletAddress, amount);

    await prisma.userMilestone.update({
      where: { id: userMilestone.id },
      data: { 
        reward_minted: true, 
        reward_minted_at: new Date(),
        reward_tx_hash: txHash
      }
    });

    await prisma.tokenTransaction.create({
      data: {
        userId: req.user.userId,
        type: 'mint_milestone',
        amount,
        tx_hash: txHash,
        status: 'completed',
        milestoneId: userMilestone.id
      }
    });

    res.json({
      success: true,
      tokensEarned: amount,
      txHash,
      stellarExpert: `https://stellar.expert/explorer/testnet/tx/${txHash}`
    });
  } catch (error) {
    console.error('Mint error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
