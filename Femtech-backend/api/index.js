require('dotenv').config({ path: '/home/christopher-fourquier/Femtech-Africa/.env' });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('./generated/prisma-client');
const StellarSdk = require('@stellar/stellar-sdk');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'femtech-secret-key-2026';

// Stellar Config
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const DISTRIBUTOR_SECRET = 'SDD3D5XDOIIZ4Y2T47BD3SZXUPLVW6QH46XTBUSCHDZDGGONBETP3AIM';
const ISSUER_PUBLIC = 'GA5CGTJ6X4HZVQB6PEZNFRVU2V3KRLXVALV7QGXYT6XAIUNGNSM6FZ6V';
const ASSET_CODE = 'MAMA';

const stellarServer = new StellarSdk.Horizon.Server(HORIZON_URL);
const distributorKeypair = StellarSdk.Keypair.fromSecret(DISTRIBUTOR_SECRET);
const MAMA = new StellarSdk.Asset(ASSET_CODE, ISSUER_PUBLIC);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// OTP Store
const otpStore = new Map();
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Stellar mint function
async function mintTokens(userPublicKey, amount, memo = '') {
  const distributorAccount = await stellarServer.loadAccount(distributorKeypair.publicKey());
  let txBuilder = new StellarSdk.TransactionBuilder(distributorAccount, {
    fee: '100',
    networkPassphrase: StellarSdk.Networks.TESTNET
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: userPublicKey,
      asset: MAMA,
      amount: amount.toString()
    }))
    .setTimeout(30);
  if (memo) txBuilder = txBuilder.addMemo(StellarSdk.Memo.text(memo));
  const tx = txBuilder.build();
  tx.sign(distributorKeypair);
  return await stellarServer.submitTransaction(tx);
}

// ═══════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════
app.get('/health', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({ status: 'healthy', database: 'connected', users: userCount, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════
app.post('/api/v1/auth/request-otp', async (req, res) => {
  try {
    const { phone, country } = req.body;
    if (!phone || !country) return res.status(400).json({ error: 'Phone and country required' });
    const otp = generateOTP();
    otpStore.set(phone, { otp, country, expiresAt: Date.now() + 5 * 60 * 1000 });
    console.log(`OTP for ${phone}: ${otp}`);
    res.json({ message: 'OTP sent successfully', debug_otp: otp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/auth/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const stored = otpStore.get(phone);
    if (!stored || stored.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (Date.now() > stored.expiresAt) { otpStore.delete(phone); return res.status(400).json({ error: 'OTP expired' }); }

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { phone, country: stored.country, phoneVerified: true, status: 'active' } });
    } else {
      await prisma.user.update({ where: { id: user.id }, data: { phoneVerified: true, lastLoginAt: new Date() } });
    }
    otpStore.delete(phone);

    const token = jwt.sign({ userId: user.id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { id: user.id, phone: user.phone, country: user.country, role: user.role, status: user.status } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    const pregnancies = await prisma.pregnancy.findMany({ where: { userId: req.user.userId, status: 'active' } });
    const milestones = await prisma.userMilestone.findMany({ where: { userId: req.user.userId }, take: 10, orderBy: { createdAt: 'desc' } });
    res.json({ data: { ...user, pregnancies, milestones } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════
app.get('/api/v1/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, phone: true, country: true, role: true, status: true, createdAt: true } });
    res.json({ data: users, count: users.length });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/v1/partners', async (req, res) => {
  try {
    const { country } = req.query;
    const partners = await prisma.partner.findMany({ where: country ? { country } : {}, include: { partnerProducts: true } });
    res.json({ data: partners, count: partners.length });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/v1/milestones', async (req, res) => {
  try {
    const { category } = req.query;
    const milestones = await prisma.milestoneDefinition.findMany({ where: category ? { category } : {}, orderBy: { sortOrder: 'asc' } });
    res.json({ data: milestones, count: milestones.length });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/v1/products', async (req, res) => {
  try {
    const { country, category } = req.query;
    const products = await prisma.partnerProduct.findMany({
      where: { isAvailable: true, ...(category && { category }) },
      include: { partner: { select: { id: true, name: true, type: true, country: true } } }
    });
    const filtered = country ? products.filter(p => p.partner.country === country) : products;
    res.json({ data: filtered, count: filtered.length });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/v1/pregnancies', async (req, res) => {
  try {
    const pregnancies = await prisma.pregnancy.findMany({ include: { user: { select: { id: true, phone: true, country: true } } } });
    res.json({ data: pregnancies, count: pregnancies.length });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ═══════════════════════════════════════════════════════════════
// PROTECTED ROUTES
// ═══════════════════════════════════════════════════════════════
app.get('/api/v1/my/milestones', authMiddleware, async (req, res) => {
  try {
    const milestones = await prisma.userMilestone.findMany({
      where: { userId: req.user.userId },
      include: { milestone_definitions: true, pregnancy: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: milestones, count: milestones.length });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/v1/my/pregnancies', authMiddleware, async (req, res) => {
  try {
    const pregnancies = await prisma.pregnancy.findMany({
      where: { userId: req.user.userId },
      include: { userMilestones: true }
    });
    res.json({ data: pregnancies, count: pregnancies.length });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/v1/my/pregnancies', authMiddleware, async (req, res) => {
  try {
    const { lastPeriodDate, estimatedDueDate, gravida, parity } = req.body;
    const pregnancy = await prisma.pregnancy.create({
      data: { userId: req.user.userId, lastPeriodDate: new Date(lastPeriodDate), estimatedDueDate: new Date(estimatedDueDate), gravida: gravida || 1, parity: parity || 0, status: 'active' }
    });
    res.status(201).json({ data: pregnancy });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/v1/my/transactions', authMiddleware, async (req, res) => {
  try {
    const transactions = await prisma.tokenTransaction.findMany({ where: { userId: req.user.userId }, orderBy: { createdAt: 'desc' }, take: 50 });
    res.json({ data: transactions, count: transactions.length });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/v1/my/redemptions', authMiddleware, async (req, res) => {
  try {
    const redemptions = await prisma.redemption.findMany({
      where: { userId: req.user.userId },
      include: { partner: true, redemptionItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: redemptions, count: redemptions.length });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/v1/my/redemptions', authMiddleware, async (req, res) => {
  try {
    const { partnerId, products } = req.body;
    const productIds = products.map(p => p.productId);
    const productData = await prisma.partnerProduct.findMany({ where: { id: { in: productIds } } });
    const totalTokens = products.reduce((sum, p) => {
      const product = productData.find(pd => pd.id === p.productId);
      return sum + (product?.tokenCost || 0) * (p.quantity || 1);
    }, 0);
    const redemption = await prisma.redemption.create({
      data: {
        userId: req.user.userId, partnerId, totalTokens, status: 'pending',
        redemptionItems: { create: products.map(p => ({ productId: p.productId, quantity: p.quantity || 1, tokenCost: productData.find(pd => pd.id === p.productId)?.tokenCost || 0 })) }
      },
      include: { redemptionItems: { include: { product: true } } }
    });
    res.status(201).json({ data: redemption });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ═══════════════════════════════════════════════════════════════
// STELLAR MINT ENDPOINT
// ═══════════════════════════════════════════════════════════════
app.post('/api/v1/mint', authMiddleware, async (req, res) => {
  try {
    const { milestoneId } = req.body;
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.walletAddress) return res.status(400).json({ error: 'User has no wallet address' });

    const milestone = await prisma.userMilestone.findUnique({ where: { id: milestoneId } });
    if (!milestone || milestone.userId !== userId) return res.status(404).json({ error: 'Milestone not found' });
    if (milestone.reward_minted) return res.status(400).json({ error: 'Reward already minted' });

    const milestoneDef = await prisma.milestoneDefinition.findUnique({ where: { id: milestone.milestone_def_id } });
    const amount = milestoneDef.rewardAmount;

    const result = await mintTokens(user.walletAddress, amount, `Milestone: ${milestoneDef.code}`);

    await prisma.userMilestone.update({
      where: { id: milestoneId },
      data: { reward_minted: true, reward_tx_hash: result.hash, reward_minted_at: new Date() }
    });

    res.json({ success: true, amount, txHash: result.hash, stellarExpert: `https://stellar.expert/explorer/testnet/tx/${result.hash}` });
  } catch (error) {
    console.error('Mint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log('==================================================');
  console.log('  MAMATOKENS API v1.0');
  console.log('==================================================');
  console.log(`  Server: http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/health`);
  console.log('  Stellar: MAMA token on testnet');
  console.log('==================================================');
});