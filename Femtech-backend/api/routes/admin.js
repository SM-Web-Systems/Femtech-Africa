const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('../generated/prisma-client');

const prisma = new PrismaClient();

// Middleware to verify admin token
const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await prisma.admin.findUnique({ where: { id: decoded.adminId } });

    if (!admin || !admin.isActive) return res.status(401).json({ error: 'Invalid or inactive admin' });

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.admin.role !== 'super_admin') return res.status(403).json({ error: 'Super admin access required' });
  next();
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    if (!admin.isActive) return res.status(401).json({ error: 'Account is disabled' });

    const validPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

    const token = jwt.sign({ adminId: admin.id, role: admin.role, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current admin
router.get('/me', adminAuth, (req, res) => {
  res.json({ id: req.admin.id, email: req.admin.email, name: req.admin.name, role: req.admin.role });
});

// List admins
router.get('/admins', adminAuth, superAdminOnly, async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, email: true, name: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create admin
router.post('/admins', adminAuth, superAdminOnly, async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Email, password, and name required' });

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: { email, passwordHash, name, role: role || 'admin', createdBy: req.admin.id },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true }
    });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update admin
router.put('/admins/:id', adminAuth, superAdminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role, isActive, password } = req.body;

    if (id === req.admin.id && isActive === false) return res.status(400).json({ error: 'Cannot deactivate yourself' });

    const updateData = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true, isActive: true, lastLoginAt: true, createdAt: true }
    });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete admin
router.delete('/admins/:id', adminAuth, superAdminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.admin.id) return res.status(400).json({ error: 'Cannot delete yourself' });
    await prisma.admin.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalUsers, activeUsers, totalRedemptions, milestonesCompleted, pendingRewards, totalMinted] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { lastLoginAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
      prisma.redemption.count(),
      prisma.userMilestone.count({ where: { status: 'completed' } }),
      prisma.userMilestone.count({ where: { status: 'completed', reward_minted: false } }),
      prisma.tokenTransaction.aggregate({ where: { type: { in: ['mint_milestone', 'mint_referral', 'mint_grant'] } }, _sum: { amount: true } })
    ]);
    res.json({ totalUsers, activeUsers, totalTokensMinted: totalMinted._sum.amount || 0, totalRedemptions, milestonesCompleted, pendingRewards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, phone: true, country: true, status: true, walletAddress: true, createdAt: true, _count: { select: { user_milestones: true } } } }),
      prisma.user.count()
    ]);

    res.json({ users: users.map(u => ({ id: u.id, phone: u.phone, country: u.country, status: u.status, walletAddress: u.walletAddress, milestones: u._count.user_milestones, createdAt: u.createdAt })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transactions
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.tokenTransaction.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { user: { select: { phone: true } } } }),
      prisma.tokenTransaction.count()
    ]);

    res.json({ transactions: transactions.map(t => ({ id: t.id, userPhone: t.user.phone, type: t.type, amount: t.amount, status: t.status, txHash: t.tx_hash, createdAt: t.createdAt })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Redemptions
router.get('/redemptions', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [redemptions, total] = await Promise.all([
      prisma.redemption.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { user: { select: { phone: true } }, partner: { select: { name: true } }, items: { include: { product: { select: { name: true } } } } } }),
      prisma.redemption.count()
    ]);

    res.json({ redemptions: redemptions.map(r => ({ id: r.id, userPhone: r.user.phone, partnerName: r.partner?.name || 'Unknown', productName: r.items[0]?.product?.name || 'Unknown', tokensSpent: r.totalTokens, voucherCode: r.items[0]?.voucherCode || null, status: r.status, createdAt: r.createdAt })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Milestones
router.get('/milestones', adminAuth, async (req, res) => {
  try {
    const milestones = await prisma.milestoneDefinition.findMany({ orderBy: { sortOrder: 'asc' }, include: { _count: { select: { user_milestones: true } } } });
    res.json(milestones.map(m => ({ id: m.id, code: m.code, name: m.name, category: m.category, rewardAmount: m.rewardAmount, completions: m._count.user_milestones })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Activity
router.get('/activity', adminAuth, async (req, res) => {
  try {
    const [recentTx, recentUsers] = await Promise.all([
      prisma.tokenTransaction.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: { select: { phone: true } } } }),
      prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { phone: true, createdAt: true } })
    ]);

    const activity = [...recentTx.map(t => ({ type: 'transaction', description: t.type.replace(/_/g, ' ') + ' ' + t.amount + ' MAMA', user: t.user.phone, timestamp: t.createdAt })), ...recentUsers.map(u => ({ type: 'signup', description: 'New user registered', user: u.phone, timestamp: u.createdAt }))].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
