require('dotenv').config({ path: 'D:/SM-WEB/FEMTECH-AFRICA/.env' });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('./generated/prisma-client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'femtech-secret-key-2026';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Store OTPs temporarily (in production use Redis)
const otpStore = new Map();

// ═══════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════

// Request OTP
app.post('/api/v1/auth/request-otp', async (req, res) => {
  try {
    const { phone, country } = req.body;
    
    if (!phone || !country) {
      return res.status(400).json({ error: 'Phone and country required' });
    }

    const otp = generateOTP();
    otpStore.set(phone, { otp, country, expiresAt: Date.now() + 5 * 60 * 1000 });
    
    // In production, send SMS here
    console.log(`OTP for ${phone}: ${otp}`);
    
    res.json({ 
      message: 'OTP sent successfully',
      // Remove in production:
      debug_otp: otp 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP & Login/Register
app.post('/api/v1/auth/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    const stored = otpStore.get(phone);
    if (!stored || stored.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          country: stored.country,
          phoneVerified: true,
          status: 'active'
        }
      });
    } else {
      await prisma.user.update({
  where: { id: user.id },
  data: { 
    phoneVerified: true,
    lastLoginAt: new Date()
  }
});
    }

    otpStore.delete(phone);

    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        country: user.country,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
app.get('/api/v1/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    
    const pregnancies = await prisma.pregnancy.findMany({
      where: { userId: req.user.userId, status: 'active' }
    });
    
    const milestones = await prisma.userMilestone.findMany({
      where: { userId: req.user.userId },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ 
      data: {
        ...user,
        pregnancies,
        milestones
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ═══════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════

app.get('/health', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      users: userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════

app.get('/api/v1/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        country: true,
        role: true,
        status: true,
        createdAt: true
      }
    });
    res.json({ data: users, count: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/partners', async (req, res) => {
  try {
    const { country } = req.query;
    const where = country ? { country } : {};
    const partners = await prisma.partner.findMany({
      where,
      include: { partnerProducts: true }
    });
    res.json({ data: partners, count: partners.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/milestones', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};
    const milestones = await prisma.milestoneDefinition.findMany({
      where,
      orderBy: { sortOrder: 'asc' }
    });
    res.json({ data: milestones, count: milestones.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/products', async (req, res) => {
  try {
    const { country, category } = req.query;
    const products = await prisma.partnerProduct.findMany({
      where: {
        isAvailable: true,
        ...(category && { category })
      },
      include: {
        partner: { 
          select: { id: true, name: true, type: true, country: true }
        }
      }
    });
    
    const filtered = country 
      ? products.filter(p => p.partner.country === country)
      : products;
    
    res.json({ data: filtered, count: filtered.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/pregnancies', async (req, res) => {
  try {
    const pregnancies = await prisma.pregnancy.findMany({
      include: {
        user: { select: { id: true, phone: true, country: true } }
      }
    });
    res.json({ data: pregnancies, count: pregnancies.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PROTECTED ROUTES (Require Auth)
// ═══════════════════════════════════════════════════════════════

// User Milestones
app.get('/api/v1/my/milestones', authMiddleware, async (req, res) => {
  try {
    const milestones = await prisma.userMilestone.findMany({
      where: { userId: req.user.userId },
      include: { 
        milestoneDefinition: true,
        pregnancy: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: milestones, count: milestones.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Pregnancies
app.get('/api/v1/my/pregnancies', authMiddleware, async (req, res) => {
  try {
    const pregnancies = await prisma.pregnancy.findMany({
      where: { userId: req.user.userId },
      include: {
        userMilestones: { include: { milestoneDefinition: true } }
      }
    });
    res.json({ data: pregnancies, count: pregnancies.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Pregnancy
app.post('/api/v1/my/pregnancies', authMiddleware, async (req, res) => {
  try {
    const { lastPeriodDate, estimatedDueDate, gravida, parity } = req.body;
    
    const pregnancy = await prisma.pregnancy.create({
      data: {
        userId: req.user.userId,
        last_period_date: new Date(lastPeriodDate),
        estimated_due_date: new Date(estimatedDueDate),
        gravida: gravida || 1,
        parity: parity || 0,
        status: 'active'
      }
    });
    
    res.status(201).json({ data: pregnancy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Token Transactions
app.get('/api/v1/my/transactions', authMiddleware, async (req, res) => {
  try {
    const transactions = await prisma.tokenTransaction.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json({ data: transactions, count: transactions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Redemptions
app.get('/api/v1/my/redemptions', authMiddleware, async (req, res) => {
  try {
    const redemptions = await prisma.redemption.findMany({
      where: { userId: req.user.userId },
      include: {
        partner: true,
        redemptionItems: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: redemptions, count: redemptions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Redemption
app.post('/api/v1/my/redemptions', authMiddleware, async (req, res) => {
  try {
    const { partnerId, products } = req.body;
    
    // Calculate total tokens
    const productIds = products.map(p => p.productId);
    const productData = await prisma.partnerProduct.findMany({
      where: { id: { in: productIds } }
    });
    
    const totalTokens = products.reduce((sum, p) => {
      const product = productData.find(pd => pd.id === p.productId);
      return sum + (product?.tokenCost || 0) * (p.quantity || 1);
    }, 0);
    
    const redemption = await prisma.redemption.create({
      data: {
        userId: req.user.userId,
        partnerId,
        totalTokens,
        status: 'pending',
        redemptionItems: {
          create: products.map(p => ({
            productId: p.productId,
            quantity: p.quantity || 1,
            tokenCost: productData.find(pd => pd.id === p.productId)?.tokenCost || 0
          }))
        }
      },
      include: {
        redemptionItems: { include: { product: true } }
      }
    });
    
    res.status(201).json({ data: redemption });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log('==================================================');
  console.log('  FEMTECH AFRICA API v1.0');
  console.log('==================================================');
  console.log('  Server: http://localhost:' + PORT);
  console.log('  Health: http://localhost:' + PORT + '/health');
  console.log('');
  console.log('  Public Endpoints:');
  console.log('    GET  /api/v1/users');
  console.log('    GET  /api/v1/partners');
  console.log('    GET  /api/v1/products');
  console.log('    GET  /api/v1/milestones');
  console.log('    GET  /api/v1/pregnancies');
  console.log('');
  console.log('  Auth Endpoints:');
  console.log('    POST /api/v1/auth/request-otp');
  console.log('    POST /api/v1/auth/verify-otp');
  console.log('    GET  /api/v1/auth/me');
  console.log('');
  console.log('  Protected Endpoints (require Bearer token):');
  console.log('    GET  /api/v1/my/milestones');
  console.log('    GET  /api/v1/my/pregnancies');
  console.log('    POST /api/v1/my/pregnancies');
  console.log('    GET  /api/v1/my/transactions');
  console.log('    GET  /api/v1/my/redemptions');
  console.log('    POST /api/v1/my/redemptions');
  console.log('==================================================');
});
