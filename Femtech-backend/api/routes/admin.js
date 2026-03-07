const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { adminAuth } = require('../middleware/auth');

const prisma = new PrismaClient();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === 'admin@mamatokens.com' && password === 'admin123') {
      const token = jwt.sign(
        { userId: 'admin', role: 'admin', email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.json({ token, user: { email, role: 'admin' } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalTransactions, totalRedemptions, totalMilestones, pendingRewards] = await Promise.all([
      prisma.user.count(),
      prisma.tokenTransaction.aggregate({ _sum: { amount: true }, where: { amount: { gt: 0 } } }),
      prisma.redemption.count(),
      prisma.userMilestone.count({ where: { status: 'completed' } }),
      prisma.userMilestone.count({ where: { status: 'completed', reward_minted: false } })
    ]);

    const activeUsers = await prisma.user.count({
      where: { updated_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
    });

    res.json({
      totalUsers,
      activeUsers,
      totalTokensMinted: parseFloat(totalTransactions._sum.amount || 0),
      totalRedemptions,
      milestonesCompleted: totalMilestones,
      pendingRewards
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          wallets: { select: { balance: true } },
          _count: { select: { user_milestones: true } }
        }
      }),
      prisma.user.count()
    ]);

    const formattedUsers = users.map(u => ({
      id: u.id,
      phone: u.phone,
      country: u.country,
      status: u.status || 'active',
      balance: parseFloat(u.wallets[0]?.balance || 0),
      milestones: u._count.user_milestones,
      createdAt: u.created_at
    }));

    res.json({ users: formattedUsers, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transactions
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.tokenTransaction.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { phone: true } } }
      }),
      prisma.tokenTransaction.count()
    ]);

    const formattedTx = transactions.map(tx => ({
      id: tx.id,
      type: tx.type,
      user: tx.user?.phone || 'Unknown',
      amount: parseFloat(tx.amount),
      status: tx.status,
      txHash: tx.tx_hash ? `${tx.tx_hash.slice(0, 8)}...${tx.tx_hash.slice(-6)}` : null,
      fullTxHash: tx.tx_hash,
      createdAt: tx.created_at
    }));

    res.json({ transactions: formattedTx, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get redemptions
router.get('/redemptions', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [redemptions, total] = await Promise.all([
      prisma.redemption.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: { select: { phone: true } },
          partner: { select: { name: true } },
          redemption_items: {
            include: { product: { select: { name: true, token_cost: true } } }
          }
        }
      }),
      prisma.redemption.count()
    ]);

    const formattedRedemptions = redemptions.map(r => ({
      id: r.id,
      user: r.user?.phone || 'Unknown',
      partner: r.partner?.name || 'Unknown',
      product: r.redemption_items[0]?.product?.name || 'Unknown',
      tokens: parseFloat(r.total_tokens || 0),
      voucherCode: r.redemption_items[0]?.voucherCode || null,
      status: r.status,
      createdAt: r.created_at
    }));

    res.json({ redemptions: formattedRedemptions, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get milestones
router.get('/milestones', adminAuth, async (req, res) => {
  try {
    const milestones = await prisma.milestoneDefinition.findMany({
      include: {
        _count: { select: { user_milestones: { where: { status: 'completed' } } } }
      }
    });

    const formattedMilestones = milestones.map(m => ({
      id: m.id,
      name: m.name,
      category: m.category,
      reward: parseFloat(m.token_reward),
      completions: m._count.user_milestones,
      active: m.is_active
    }));

    res.json({ milestones: formattedMilestones });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent activity
router.get('/activity', adminAuth, async (req, res) => {
  try {
    const recentTx = await prisma.tokenTransaction.findMany({
      take: 10,
      orderBy: { created_at: 'desc' },
      include: { user: { select: { phone: true } } }
    });

    const activity = recentTx.map(tx => ({
      id: tx.id,
      type: parseFloat(tx.amount) > 0 ? 'mint' : 'redeem',
      user: tx.user?.phone ? `${tx.user.phone.slice(0, 6)}***${tx.user.phone.slice(-4)}` : 'Unknown',
      amount: parseFloat(tx.amount),
      time: tx.created_at
    }));

    res.json({ activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
