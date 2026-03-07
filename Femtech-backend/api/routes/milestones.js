const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { mintTokens } = require('../utils/stellar');

const prisma = new PrismaClient();

// Get all milestone definitions (public)
router.get('/', async (req, res) => {
  try {
    const milestones = await prisma.milestoneDefinition.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' }
    });
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's milestones
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const milestones = await prisma.userMilestone.findMany({
      where: { user_id: req.user.userId },
      include: { milestone_definition: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mint reward for completed milestone
router.post('/mint', authenticateToken, async (req, res) => {
  try {
    const { milestoneId } = req.body;

    const userMilestone = await prisma.userMilestone.findFirst({
      where: {
        user_id: req.user.userId,
        milestone_id: milestoneId,
        status: 'completed',
        reward_minted: false
      },
      include: { milestone_definition: true }
    });

    if (!userMilestone) {
      return res.status(400).json({ error: 'No eligible milestone found' });
    }

    const wallet = await prisma.wallet.findFirst({
      where: { user_id: req.user.userId }
    });

    if (!wallet) {
      return res.status(400).json({ error: 'Wallet not found. Please create a wallet first.' });
    }

    const amount = parseFloat(userMilestone.milestone_definition.token_reward);
    const txHash = await mintTokens(wallet.stellar_address, amount);

    await prisma.userMilestone.update({
      where: { id: userMilestone.id },
      data: { reward_minted: true, reward_minted_at: new Date() }
    });

    await prisma.tokenTransaction.create({
      data: {
        user_id: req.user.userId,
        type: 'mint_milestone',
        amount,
        tx_hash: txHash,
        status: 'confirmed',
        milestone_id: milestoneId
      }
    });

    res.json({
      success: true,
      tokensEarned: amount,
      txHash,
      stellarExpert: `https://stellar.expert/explorer/testnet/tx/${txHash}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
