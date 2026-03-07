const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('../generated/prisma-client');
const { adminAuth } = require('../middleware/auth');

const prisma = new PrismaClient();

// Admin login (hardcoded for now)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email === 'admin@mamatokens.com' && password === 'admin123') {
      const token = jwt.sign(
        { userId: 'admin', role: 'admin', email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({ token, user: { email, role: 'admin' } });
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const [totalUsers, activeUsers, totalRedemptions, milestonesCompleted] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { updatedAt: { gte: oneDayAgo } }
      }),
      prisma.redemption.count(),
      prisma.userMilestone.count({
        where: { status: 'completed' }
      })
    ]);
    
    // Get total tokens minted (using correct enum values)
    const mintTransactions = await prisma.tokenTransaction.aggregate({
      where: { 
        type: { in: ['mint_milestone', 'mint_referral', 'mint_grant'] }
      },
      _sum: { amount: true }
    });
    
    // Get pending rewards
    const pendingRewards = await prisma.userMilestone.count({
      where: { status: 'completed', reward_minted: false }
    });
    
    res.json({
      totalUsers,
      activeUsers,
      totalTokensMinted: mintTransactions._sum.amount || 0,
      totalRedemptions,
      milestonesCompleted,
      pendingRewards
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get users list
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          phone: true,
          country: true,
          status: true,
          walletAddress: true,
          createdAt: true,
          _count: {
            select: { milestones: true }
          }
        }
      }),
      prisma.user.count()
    ]);
    
    const formattedUsers = users.map(u => ({
      id: u.id,
      phone: u.phone,
      country: u.country,
      status: u.status,
      walletAddress: u.walletAddress,
      milestones: u._count.milestones,
      createdAt: u.createdAt
    }));
    
    res.json({
      users: formattedUsers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get transactions list
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [transactions, total] = await Promise.all([
      prisma.tokenTransaction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { phone: true } }
        }
      }),
      prisma.tokenTransaction.count()
    ]);
    
    const formattedTx = transactions.map(tx => ({
      id: tx.id,
      type: tx.type,
      userPhone: tx.user?.phone || 'Unknown',
      amount: tx.amount,
      status: tx.status,
      txHash: tx.stellarTxId ? tx.stellarTxId.substring(0, 8) + '...' : null,
      fullTxHash: tx.stellarTxId,
      createdAt: tx.createdAt
    }));
    
    res.json({
      transactions: formattedTx,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get redemptions list
router.get('/redemptions', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [redemptions, total] = await Promise.all([
      prisma.redemption.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { phone: true } },
          product: { 
            select: { 
              name: true,
              partner: { select: { name: true } }
            } 
          }
        }
      }),
      prisma.redemption.count()
    ]);
    
    const formattedRedemptions = redemptions.map(r => ({
      id: r.id,
      userPhone: r.user?.phone || 'Unknown',
      partnerName: r.product?.partner?.name || 'Unknown',
      productName: r.product?.name || 'Unknown',
      tokensSpent: r.tokensSpent,
      voucherCode: r.voucherCode,
      status: r.status,
      createdAt: r.createdAt
    }));
    
    res.json({
      redemptions: formattedRedemptions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Redemptions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get milestones stats
router.get('/milestones', adminAuth, async (req, res) => {
  try {
    const milestones = await prisma.milestoneDefinition.findMany({
      include: {
        _count: {
          select: { user_milestones: true }
        }
      }
    });
    
    const formattedMilestones = milestones.map(m => ({
      id: m.id,
      name: m.name,
      category: m.category,
      rewardAmount: m.rewardAmount,
      completions: m._count.user_milestones,
      active: m.active
    }));
    
    res.json({ milestones: formattedMilestones });
  } catch (error) {
    console.error('Milestones error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get recent activity
router.get('/activity', adminAuth, async (req, res) => {
  try {
    const [recentTransactions, recentUsers] = await Promise.all([
      prisma.tokenTransaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { phone: true } } }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, phone: true, createdAt: true }
      })
    ]);
    
    const activities = [
      ...recentTransactions.map(tx => ({
        type: 'transaction',
        description: `${tx.type} ${tx.amount} MAMA`,
        user: tx.user?.phone,
        timestamp: tx.createdAt
      })),
      ...recentUsers.map(u => ({
        type: 'signup',
        description: 'New user registered',
        user: u.phone,
        timestamp: u.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    
    res.json({ activities });
  } catch (error) {
    console.error('Activity error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
