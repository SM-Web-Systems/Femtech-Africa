const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('../generated/prisma-client');
const { adminAuth } = require('../middleware/auth');

const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === 'admin@mamatokens.com' && password === 'admin123') {
      const token = jwt.sign({ userId: 'admin', role: 'admin', email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { email, role: 'admin' } });
    }
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [totalUsers, activeUsers, totalRedemptions, milestonesCompleted] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { updatedAt: { gte: oneDayAgo } } }),
      prisma.redemption.count(),
      prisma.userMilestone.count({ where: { status: 'completed' } })
    ]);
    const mintTx = await prisma.tokenTransaction.aggregate({
      where: { type: { in: ['mint_milestone', 'mint_referral', 'mint_grant'] } },
      _sum: { amount: true }
    });
    const pendingRewards = await prisma.userMilestone.count({ where: { status: 'completed', reward_minted: false } });
    res.json({ totalUsers, activeUsers, totalTokensMinted: mintTx._sum.amount || 0, totalRedemptions, milestonesCompleted, pendingRewards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip, take: limit, orderBy: { createdAt: 'desc' },
        select: { id: true, phone: true, country: true, status: true, walletAddress: true, createdAt: true, _count: { select: { milestones: true } } }
      }),
      prisma.user.count()
    ]);
    res.json({
      users: users.map(u => ({ id: u.id, phone: u.phone, country: u.country, status: u.status, walletAddress: u.walletAddress, milestones: u._count.milestones, createdAt: u.createdAt })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      prisma.tokenTransaction.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { user: { select: { phone: true } } } }),
      prisma.tokenTransaction.count()
    ]);
    res.json({
      transactions: transactions.map(tx => ({ id: tx.id, type: tx.type, userPhone: tx.user?.phone || 'Unknown', amount: tx.amount, status: tx.status, txHash: tx.stellar_tx_id ? tx.stellar_tx_id.substring(0, 8) + '...' : null, fullTxHash: tx.stellar_tx_id, createdAt: tx.createdAt })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/redemptions', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const [redemptions, total] = await Promise.all([
      prisma.redemption.findMany({
        skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { phone: true } }, partners: { select: { name: true } }, items: { include: { product: { select: { name: true } } } } }
      }),
      prisma.redemption.count()
    ]);
    res.json({
      redemptions: redemptions.map(r => ({ id: r.id, userPhone: r.user?.phone || 'Unknown', partnerName: r.partners?.name || 'Unknown', productName: r.items?.[0]?.product?.name || 'Multiple', tokensSpent: r.totalTokens, voucherCode: r.items?.[0]?.voucherCode || null, status: r.status, createdAt: r.createdAt })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Redemptions error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/milestones', adminAuth, async (req, res) => {
  try {
    const milestones = await prisma.milestoneDefinition.findMany({ include: { _count: { select: { user_milestones: true } } } });
    res.json({ milestones: milestones.map(m => ({ id: m.id, name: m.name, category: m.category, rewardAmount: m.rewardAmount, completions: m._count.user_milestones, active: m.active })) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/activity', adminAuth, async (req, res) => {
  try {
    const [tx, users] = await Promise.all([
      prisma.tokenTransaction.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: { select: { phone: true } } } }),
      prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { phone: true, createdAt: true } })
    ]);
    const activities = [
      ...tx.map(t => ({ type: 'transaction', description: `${t.type} ${t.amount} MAMA`, user: t.user?.phone, timestamp: t.createdAt })),
      ...users.map(u => ({ type: 'signup', description: 'New user registered', user: u.phone, timestamp: u.createdAt }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    res.json({ activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
