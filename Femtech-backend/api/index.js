require('dotenv').config({ path: '/home/christopher-fourquier/Femtech-Africa/.env' });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('./generated/prisma-client');
const StellarSdk = require('@stellar/stellar-sdk');
const { encryptProfile, decryptProfile } = require('./utils/encryption');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'femtech-secret-key-2026';

// Stellar Config
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const DISTRIBUTOR_SECRET = process.env.STELLAR_DISTRIBUTOR_SECRET || 'SDD3D5XDOIIZ4Y2T47BD3SZXUPLVW6QH46XTBUSCHDZDGGONBETP3AIM';
const ISSUER_PUBLIC = process.env.STELLAR_ISSUER_PUBLIC || 'GA5CGTJ6X4HZVQB6PEZNFRVU2V3KRLXVALV7QGXYT6XAIUNGNSM6FZ6V';
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

// Admin Middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// OTP Store (use Redis in production)
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

// Burn tokens (user sends back to distributor for redemption)
async function burnTokens(userSecretKey, amount, memo = "") {
  const userKeypair = StellarSdk.Keypair.fromSecret(userSecretKey);
  const userAccount = await stellarServer.loadAccount(userKeypair.publicKey());
  let txBuilder = new StellarSdk.TransactionBuilder(userAccount, {
    fee: "100",
    networkPassphrase: StellarSdk.Networks.TESTNET
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: distributorKeypair.publicKey(),
      asset: MAMA,
      amount: amount.toString()
    }))
    .setTimeout(30);
  if (memo) txBuilder = txBuilder.addMemo(StellarSdk.Memo.text(memo.substring(0, 28)));
  const tx = txBuilder.build();
  tx.sign(userKeypair);
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
// AUTH & ONBOARDING
// ═══════════════════════════════════════════════════════════════

// Step 1: Request OTP
app.post('/api/v1/auth/request-otp', async (req, res) => {
  try {
    const { phone, country } = req.body;
    if (!phone || !country) return res.status(400).json({ error: 'Phone and country required' });
    
    const otp = generateOTP();
    otpStore.set(phone, { otp, country, expiresAt: Date.now() + 5 * 60 * 1000 });
    
    // Store OTP in database too
    await prisma.otpCode.create({
      data: { phone, code: otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) }
    }).catch(() => {}); // Ignore if table doesn't exist yet
    
    console.log(`OTP for ${phone}: ${otp}`);
    res.json({ message: 'OTP sent successfully', debug_otp: otp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 2: Verify OTP & Create/Login User
app.post('/api/v1/auth/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const stored = otpStore.get(phone);
    if (!stored || stored.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (Date.now() > stored.expiresAt) { otpStore.delete(phone); return res.status(400).json({ error: 'OTP expired' }); }

    let user = await prisma.user.findUnique({ where: { phone } });
    let isNewUser = false;
    
    if (!user) {
      isNewUser = true;
      user = await prisma.user.create({ 
        data: { 
          phone, 
          country: stored.country, 
          phoneVerified: true, 
          status: 'active',
          role: 'mother'
        } 
      });
    } else {
      await prisma.user.update({ 
        where: { id: user.id }, 
        data: { phoneVerified: true, lastLoginAt: new Date() } 
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
      isNewUser,
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

// Step 3: Complete Profile (Onboarding)
app.post('/api/v1/onboarding/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, language, preferredName } = req.body;
    
    const profile = await prisma.userProfile.upsert({
      where: { userId: req.user.userId },
      update: { firstName, lastName, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, preferredName },
      create: { userId: req.user.userId, firstName, lastName, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, preferredName }
    });

    if (language) {
      await prisma.user.update({
        where: { id: req.user.userId },
        data: { language }
      });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 4: Add Pregnancy Info (Onboarding)
app.post('/api/v1/onboarding/pregnancy', authMiddleware, async (req, res) => {
  try {
    const { lastPeriodDate, estimatedDueDate, gravida, parity, isHighRisk, bloodType } = req.body;
    
    if (!estimatedDueDate) {
      return res.status(400).json({ error: 'Estimated due date is required' });
    }

    const pregnancy = await prisma.pregnancy.create({
      data: {
        userId: req.user.userId,
        lastPeriodDate: lastPeriodDate ? new Date(lastPeriodDate) : null,
        estimatedDueDate: new Date(estimatedDueDate),
        gravida: gravida || 1,
        parity: parity || 0,
        isHighRisk: isHighRisk || false,
        bloodType: bloodType || 'unknown',
        status: 'active'
      }
    });

    res.status(201).json({ success: true, data: pregnancy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 5: Add Emergency Contact (Onboarding)
app.post('/api/v1/onboarding/emergency-contact', authMiddleware, async (req, res) => {
  try {
    const { name, relationship, phone, priority } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const contact = await prisma.emergencyContact.create({
      data: {
        userId: req.user.userId,
        name,
        relationship: relationship || 'other',
        phone,
        priority: priority || false
      }
    });

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 6: Accept Consents (Onboarding)
app.post('/api/v1/onboarding/consents', authMiddleware, async (req, res) => {
  try {
    const { consents } = req.body; // Array of { type, accepted }
    
    const results = await Promise.all(
      consents.map(c => prisma.consent.create({
        data: {
          userId: req.user.userId,
          consentType: c.type,
          accepted: c.accepted,
          acceptedAt: c.accepted ? new Date() : null,
          ipAddress: req.ip
        }
      }))
    );

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 7: Complete Onboarding & Create Wallet
app.post('/api/v1/onboarding/complete', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { userProfile: true, pregnancies: true }
    });

    // Check if onboarding is complete
    const hasProfile = !!user.userProfile;
    const hasPregnancy = user.pregnancies.length > 0;

    if (!hasProfile) {
      return res.status(400).json({ error: 'Profile not completed', step: 'profile' });
    }

    // Create wallet if not exists
    let walletCreated = false;
    if (!user.walletAddress) {
      const keypair = StellarSdk.Keypair.random();
      const publicKey = keypair.publicKey();
      const secretKey = keypair.secret();

      // Fund on testnet
      await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);

      // Create trustline
      const account = await stellarServer.loadAccount(publicKey);
      const trustlineTx = new StellarSdk.TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
        .addOperation(StellarSdk.Operation.changeTrust({ asset: MAMA }))
        .setTimeout(30)
        .build();
      trustlineTx.sign(keypair);
      await stellarServer.submitTransaction(trustlineTx);

      await prisma.user.update({
        where: { id: userId },
        data: { walletAddress: publicKey, walletCreatedAt: new Date() }
      });

      walletCreated = true;
      
      // Return secret key ONCE - user must save it
      return res.json({
        success: true,
        onboardingComplete: true,
        walletCreated: true,
        walletAddress: publicKey,
        secretKey: secretKey,
        warning: 'SAVE YOUR SECRET KEY! It cannot be recovered.'
      });
    }

    res.json({
      success: true,
      onboardingComplete: true,
      walletCreated: false,
      walletAddress: user.walletAddress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Current User with all details
app.get('/api/v1/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.userId },
      include: {
        userProfile: true,
        pregnancies: { where: { status: 'active' } },
        emergencyContacts: true,
        consents: true
      }
    });
    
    const milestones = await prisma.userMilestone.findMany({ 
      where: { userId: req.user.userId }, 
      include: { milestone_definitions: true },
      take: 10, 
      orderBy: { createdAt: 'desc' } 
    });
    
    res.json({ data: { ...user, milestones } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// USER PROFILE
// ═══════════════════════════════════════════════════════════════

// Get Profile
app.get("/api/v1/profile", authMiddleware, async (req, res) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.user.userId }
    });
    const decrypted = decryptProfile(profile);
    res.json({ data: decrypted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile
app.put("/api/v1/profile", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, avatarUrl } = req.body;
    const encrypted = encryptProfile({ firstName, lastName, dateOfBirth, avatarUrl });
    
    const profile = await prisma.userProfile.upsert({
      where: { userId: req.user.userId },
      update: encrypted,
      create: { userId: req.user.userId, ...encrypted }
    });
    
    const decrypted = decryptProfile(profile);
    res.json({ data: decrypted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ═══════════════════════════════════════════════════════════════
// PREGNANCIES
// ═══════════════════════════════════════════════════════════════

// List user's pregnancies
app.get('/api/v1/my/pregnancies', authMiddleware, async (req, res) => {
  try {
    const pregnancies = await prisma.pregnancy.findMany({
      where: { userId: req.user.userId },
      include: { milestones: true, appointments: true, kickSessions: { take: 5, orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: pregnancies, count: pregnancies.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single pregnancy
app.get('/api/v1/my/pregnancies/:id', authMiddleware, async (req, res) => {
  try {
    const pregnancy = await prisma.pregnancy.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      include: { 
        milestones: { include: { milestone_definitions: true } }, 
        appointments: true, 
        kickSessions: true,
        medicalHistory: true
      }
    });
    if (!pregnancy) return res.status(404).json({ error: 'Pregnancy not found' });
    res.json({ data: pregnancy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create pregnancy
app.post('/api/v1/my/pregnancies', authMiddleware, async (req, res) => {
  try {
    const { lastPeriodDate, estimatedDueDate, gravida, parity, isHighRisk, bloodType, riskFactors } = req.body;
    
    const pregnancy = await prisma.pregnancy.create({
      data: {
        userId: req.user.userId,
        lastPeriodDate: lastPeriodDate ? new Date(lastPeriodDate) : null,
        estimatedDueDate: new Date(estimatedDueDate),
        gravida: gravida || 1,
        parity: parity || 0,
        isHighRisk: isHighRisk || false,
        bloodType: bloodType || 'unknown',
        riskFactors: riskFactors || null,
        status: 'active'
      }
    });
    res.status(201).json({ data: pregnancy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update pregnancy
app.put('/api/v1/my/pregnancies/:id', authMiddleware, async (req, res) => {
  try {
    const { status, isHighRisk, riskFactors, bloodType, actualDeliveryDate } = req.body;
    
    const pregnancy = await prisma.pregnancy.updateMany({
      where: { id: req.params.id, userId: req.user.userId },
      data: { 
        status, 
        isHighRisk, 
        riskFactors, 
        bloodType,
        actualDeliveryDate: actualDeliveryDate ? new Date(actualDeliveryDate) : undefined
      }
    });
    
    if (pregnancy.count === 0) return res.status(404).json({ error: 'Pregnancy not found' });
    
    const updated = await prisma.pregnancy.findUnique({ where: { id: req.params.id } });
    res.json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// MEDICAL HISTORY
// ═══════════════════════════════════════════════════════════════

// Get medical history
app.get('/api/v1/my/medical-history', authMiddleware, async (req, res) => {
  try {
    const history = await prisma.medicalHistory.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: history, count: history.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add medical history record
app.post('/api/v1/my/medical-history', authMiddleware, async (req, res) => {
  try {
    const { pregnancyId, recordType, data, notes } = req.body;
    
    const record = await prisma.medicalHistory.create({
      data: {
        userId: req.user.userId,
        pregnancyId,
        recordType,
        data,
        notes,
        createdAt: new Date()
      }
    });
    res.status(201).json({ data: record });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// APPOINTMENTS
// ═══════════════════════════════════════════════════════════════

// List appointments
app.get('/api/v1/my/appointments', authMiddleware, async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    const where = { user_id: req.user.userId };
    if (status) where.status = status;
    if (upcoming === 'true') where.scheduled_at = { gte: new Date() };
    
    const appointments = await prisma.appointment.findMany({
      where,
      include: { facility: true, pregnancy: true },
      orderBy: { scheduled_at: 'asc' }
    });
    res.json({ data: appointments, count: appointments.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create appointment
app.post('/api/v1/my/appointments', authMiddleware, async (req, res) => {
  try {
    const { pregnancyId, facilityId, appointmentType, scheduled_at, notes } = req.body;
    
    const appointment = await prisma.appointment.create({
      data: {
        userId: req.user.userId,
        pregnancyId,
        facilityId,
        appointmentType,
        scheduled_at: new Date(scheduled_at),
        notes,
        status: 'scheduled'
      }
    });
    res.status(201).json({ data: appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update appointment
app.put('/api/v1/my/appointments/:id', authMiddleware, async (req, res) => {
  try {
    const { status, scheduled_at, notes, completedAt } = req.body;
    
    const appointment = await prisma.appointment.updateMany({
      where: { id: req.params.id, userId: req.user.userId },
      data: { 
        status, 
        scheduled_at: scheduled_at ? new Date(scheduled_at) : undefined, 
        notes,
        completedAt: completedAt ? new Date(completedAt) : undefined
      }
    });
    
    if (appointment.count === 0) return res.status(404).json({ error: 'Appointment not found' });
    
    const updated = await prisma.appointment.findUnique({ where: { id: req.params.id } });
    res.json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete appointment
app.delete('/api/v1/my/appointments/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await prisma.appointment.deleteMany({
      where: { id: req.params.id, userId: req.user.userId }
    });
    if (deleted.count === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// KICK SESSIONS (Baby Kick Counter)
// ═══════════════════════════════════════════════════════════════

// List kick sessions
app.get('/api/v1/my/kick-sessions', authMiddleware, async (req, res) => {
  try {
    const { pregnancyId } = req.query;
    const where = { user_id: req.user.userId };
    if (pregnancyId) where.pregnancyId = pregnancyId;
    
    const sessions = await prisma.kickSession.findMany({
      where,
      orderBy: { start_time: 'desc' },
      take: 50
    });
    res.json({ data: sessions, count: sessions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start kick session
app.post('/api/v1/my/kick-sessions', authMiddleware, async (req, res) => {
  try {
    const { pregnancyId } = req.body;
    
    const session = await prisma.kickSession.create({
      data: {
        userId: req.user.userId,
        pregnancyId,
        start_time: new Date(),
        kickCount: 0
      }
    });
    res.status(201).json({ data: session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update kick session (add kicks)
app.put('/api/v1/my/kick-sessions/:id', authMiddleware, async (req, res) => {
  try {
    const { kickCount, endedAt, notes } = req.body;
    
    const session = await prisma.kickSession.updateMany({
      where: { id: req.params.id, userId: req.user.userId },
      data: { 
        kickCount, 
        endedAt: endedAt ? new Date(endedAt) : undefined,
        notes
      }
    });
    
    if (session.count === 0) return res.status(404).json({ error: 'Session not found' });
    
    const updated = await prisma.kickSession.findUnique({ where: { id: req.params.id } });
    res.json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record single kick
app.post('/api/v1/my/kick-sessions/:id/kick', authMiddleware, async (req, res) => {
  try {
    const session = await prisma.kickSession.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });
    
    if (!session) return res.status(404).json({ error: 'Session not found' });
    
    const updated = await prisma.kickSession.update({
      where: { id: req.params.id },
      data: { kickCount: session.kickCount + 1 }
    });
    
    res.json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// EMERGENCY CONTACTS
// ═══════════════════════════════════════════════════════════════

// List emergency contacts
app.get('/api/v1/my/emergency-contacts', authMiddleware, async (req, res) => {
  try {
    const contacts = await prisma.emergencyContact.findMany({
      where: { userId: req.user.userId },
      orderBy: { priority: 'desc' }
    });
    res.json({ data: contacts, count: contacts.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add emergency contact
app.post('/api/v1/my/emergency-contacts', authMiddleware, async (req, res) => {
  try {
    const { name, relationship, phone, priority } = req.body;
    
    // If setting as primary, unset other primaries
    if (priority) {
      await prisma.emergencyContact.updateMany({
        where: { userId: req.user.userId },
        data: { priority: false }
      });
    }
    
    const contact = await prisma.emergencyContact.create({
      data: { userId: req.user.userId, name, relationship, phone, priority: priority || false }
    });
    res.status(201).json({ data: contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update emergency contact
app.put('/api/v1/my/emergency-contacts/:id', authMiddleware, async (req, res) => {
  try {
    const { name, relationship, phone, priority } = req.body;
    
    if (priority) {
      await prisma.emergencyContact.updateMany({
        where: { userId: req.user.userId },
        data: { priority: false }
      });
    }
    
    const contact = await prisma.emergencyContact.updateMany({
      where: { id: req.params.id, userId: req.user.userId },
      data: { name, relationship, phone, priority }
    });
    
    if (contact.count === 0) return res.status(404).json({ error: 'Contact not found' });
    
    const updated = await prisma.emergencyContact.findUnique({ where: { id: req.params.id } });
    res.json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete emergency contact
app.delete('/api/v1/my/emergency-contacts/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await prisma.emergencyContact.deleteMany({
      where: { id: req.params.id, userId: req.user.userId }
    });
    if (deleted.count === 0) return res.status(404).json({ error: 'Contact not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// MILESTONES
// ═══════════════════════════════════════════════════════════════

// List all milestone definitions
app.get('/api/v1/milestones', async (req, res) => {
  try {
    const { category, country } = req.query;
    const where = { isActive: true };
    if (category) where.category = category;
    if (country) where.country = country;
    
    const milestones = await prisma.milestoneDefinition.findMany({
      where,
      orderBy: { sortOrder: 'asc' }
    });
    res.json({ data: milestones, count: milestones.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's milestones
app.get('/api/v1/my/milestones', authMiddleware, async (req, res) => {
  try {
    const { status, pregnancyId } = req.query;
    const where = { userId: req.user.userId };
    if (status) where.status = status;
    if (pregnancyId) where.pregnancyId = pregnancyId;
    
    const milestones = await prisma.userMilestone.findMany({
      where,
      include: { milestone_definitions: true, pregnancy: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: milestones, count: milestones.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start a milestone
app.post('/api/v1/my/milestones', authMiddleware, async (req, res) => {
  try {
    const { milestoneDefId, pregnancyId } = req.body;
    
    // Check if already exists
    const existing = await prisma.userMilestone.findFirst({
      where: { userId: req.user.userId, milestone_def_id: milestoneDefId, pregnancyId }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Milestone already started', data: existing });
    }
    
    const milestone = await prisma.userMilestone.create({
      data: {
        userId: req.user.userId,
        milestone_def_id: milestoneDefId,
        pregnancyId,
        status: 'in_progress',
        progress: 0,
        start_time: new Date()
      },
      include: { milestone_definitions: true }
    });
    
    res.status(201).json({ data: milestone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update milestone progress
app.put('/api/v1/my/milestones/:id', authMiddleware, async (req, res) => {
  try {
    const { progress, status, progressData } = req.body;
    
    const updateData = {};
    if (progress !== undefined) updateData.progress = progress;
    if (status) updateData.status = status;
    if (progressData) updateData.progressData = progressData;
    
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }
    
    const milestone = await prisma.userMilestone.updateMany({
      where: { id: req.params.id, userId: req.user.userId },
      data: updateData
    });
    
    if (milestone.count === 0) return res.status(404).json({ error: 'Milestone not found' });
    
    const updated = await prisma.userMilestone.findUnique({ 
      where: { id: req.params.id },
      include: { milestone_definitions: true }
    });
    res.json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// MINT TOKENS
// ═══════════════════════════════════════════════════════════════

app.post('/api/v1/mint', authMiddleware, async (req, res) => {
  try {
    const { milestoneId } = req.body;
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.walletAddress) return res.status(400).json({ error: 'User has no wallet address' });

    const milestone = await prisma.userMilestone.findUnique({ where: { id: milestoneId } });
    if (!milestone || milestone.userId !== userId) return res.status(404).json({ error: 'Milestone not found' });
    if (milestone.status !== 'completed') return res.status(400).json({ error: 'Milestone not completed' });
    if (milestone.reward_minted) return res.status(400).json({ error: 'Reward already minted' });

    const milestoneDef = await prisma.milestoneDefinition.findUnique({ where: { id: milestone?.milestone_def_id } });
    const amount = milestoneDef.rewardAmount;

    const result = await mintTokens(user.walletAddress, amount, `Milestone: ${milestoneDef.code}`);

    await prisma.userMilestone.update({
      where: { id: milestoneId },
      data: { reward_minted: true, reward_tx_hash: result.hash, reward_minted_at: new Date() }
    });

    // Record transaction
    await prisma.tokenTransaction.create({
      data: {
        userId,
        milestoneId,
        type: 'mint',
        amount,
        txHash: result.hash,
        status: 'completed'
      }
    }).catch(() => {});

    res.json({ success: true, amount, txHash: result.hash, stellarExpert: `https://stellar.expert/explorer/testnet/tx/${result.hash}` });
  } catch (error) {
    console.error('Mint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// WALLET
// ═══════════════════════════════════════════════════════════════

// Create wallet
app.post('/api/v1/wallet/create', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user.walletAddress) {
      return res.status(400).json({ error: 'User already has a wallet', walletAddress: user.walletAddress });
    }

    const keypair = StellarSdk.Keypair.random();
    const publicKey = keypair.publicKey();
    const secretKey = keypair.secret();

    await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);

    const account = await stellarServer.loadAccount(publicKey);
    const trustlineTx = new StellarSdk.TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.changeTrust({ asset: MAMA }))
      .setTimeout(30)
      .build();
    trustlineTx.sign(keypair);
    await stellarServer.submitTransaction(trustlineTx);

    await prisma.user.update({
      where: { id: userId },
      data: { walletAddress: publicKey, walletCreatedAt: new Date() }
    });

    res.json({
      success: true,
      walletAddress: publicKey,
      secretKey: secretKey,
      message: 'SAVE YOUR SECRET KEY - it cannot be recovered!',
      stellarExpert: `https://stellar.expert/explorer/testnet/account/${publicKey}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get wallet balance
app.get('/api/v1/wallet/balance', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user.walletAddress) return res.status(400).json({ error: 'User has no wallet' });

    const account = await stellarServer.loadAccount(user.walletAddress);
    const balances = account.balances.map(b => ({
      asset: b.asset_type === 'native' ? 'XLM' : b.asset_code,
      balance: b.balance,
      issuer: b.asset_issuer || null
    }));
    const mamaBalance = balances.find(b => b.asset === 'MAMA') || { asset: 'MAMA', balance: '0' };

    res.json({
      walletAddress: user.walletAddress,
      balances,
      mamaBalance: mamaBalance.balance,
      stellarExpert: `https://stellar.expert/explorer/testnet/account/${user.walletAddress}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get wallet transactions
app.get('/api/v1/wallet/transactions', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user.walletAddress) return res.status(400).json({ error: 'User has no wallet' });

    const transactions = await stellarServer.transactions().forAccount(user.walletAddress).order('desc').limit(20).call();
    const txList = transactions.records.map(tx => ({
      id: tx.id,
      hash: tx.hash,
      createdAt: tx.created_at,
      memo: tx.memo || null,
      stellarExpert: `https://stellar.expert/explorer/testnet/tx/${tx.hash}`
    }));

    res.json({ walletAddress: user.walletAddress, transactions: txList, count: txList.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PARTNERS & PRODUCTS
// ═══════════════════════════════════════════════════════════════

// List partners
app.get('/api/v1/partners', async (req, res) => {
  try {
    const { country, type } = req.query;
    const where = { isActive: true };
    if (country) where.country = country;
    if (type) where.type = type;
    
    const partners = await prisma.partner.findMany({
      where,
      include: { products: { where: { is_available: true } } }
    });
    res.json({ data: partners, count: partners.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get partner details
app.get('/api/v1/partners/:id', async (req, res) => {
  try {
    const partner = await prisma.partner.findUnique({
      where: { id: req.params.id },
      include: { products: { where: { is_available: true } } }
    });
    if (!partner) return res.status(404).json({ error: 'Partner not found' });
    res.json({ data: partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List products
app.get('/api/v1/products', async (req, res) => {
  try {
    const { country, category, partnerId } = req.query;
    const where = { is_available: true };
    if (category) where.category = category;
    if (partnerId) where.partnerId = partnerId;
    
    const products = await prisma.partnerProduct.findMany({
      where,
      include: { partner: { select: { id: true, name: true, type: true, country: true } } }
    });
    
    const filtered = country ? products.filter(p => p.partner.country === country) : products;
    res.json({ data: filtered, count: filtered.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// REDEMPTIONS
// ═══════════════════════════════════════════════════════════════

// List user redemptions
app.get("/api/v1/my/redemptions", authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.userId };
    if (status) where.status = status;
    
    const redemptions = await prisma.redemption.findMany({
      where,
      include: { partners: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json({ data: redemptions, count: redemptions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single redemption
app.get("/api/v1/my/redemptions/:id", authMiddleware, async (req, res) => {
  try {
    const redemption = await prisma.redemption.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      include: { partners: true, items: { include: { product: true } } }
    });
    if (!redemption) return res.status(404).json({ error: "Redemption not found" });
    res.json({ data: redemption });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create redemption with token burn
app.post("/api/v1/my/redemptions", authMiddleware, async (req, res) => {
  try {
    const { partnerId, products, recipientPhone, recipientName, userSecretKey } = req.body;
    
    if (!userSecretKey) {
      return res.status(400).json({ error: "User secret key required to burn tokens" });
    }
    
    // Validate user and wallet
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user.walletAddress) {
      return res.status(400).json({ error: "User has no wallet" });
    }
    
    // Verify the secret key matches the wallet
    try {
      const keypair = StellarSdk.Keypair.fromSecret(userSecretKey);
      if (keypair.publicKey() !== user.walletAddress) {
        return res.status(400).json({ error: "Secret key does not match wallet address" });
      }
    } catch (e) {
      return res.status(400).json({ error: "Invalid secret key format" });
    }
    
    // Get partner info
    const partner = await prisma.partner.findUnique({ where: { id: partnerId } });
    if (!partner || !partner.isActive) {
      return res.status(400).json({ error: "Partner not found or inactive" });
    }
    
    // Get product details and calculate total
    const productIds = products.map(p => p.productId);
    const productData = await prisma.partnerProduct.findMany({
      where: { id: { in: productIds }, is_available: true }
    });
    
    if (productData.length !== productIds.length) {
      return res.status(400).json({ error: "One or more products not available" });
    }
    
    const totalTokens = products.reduce((sum, p) => {
      const product = productData.find(pd => pd.id === p.productId);
      return sum + (product.tokenCost * (p.quantity || 1));
    }, 0);
    
    // Check user balance on Stellar
    const account = await stellarServer.loadAccount(user.walletAddress);
    const mamaBalance = account.balances.find(b => b.asset_code === "MAMA");
    const balance = parseFloat(mamaBalance?.balance || "0");
    
    if (balance < totalTokens) {
      return res.status(400).json({
        error: "Insufficient MAMA balance",
        required: totalTokens,
        available: balance
      });
    }
    
    // Burn tokens on Stellar
    let burnResult;
    try {
      burnResult = await burnTokens(userSecretKey, totalTokens, "Redeem:" + partnerId.substring(0, 18));
    } catch (stellarError) {
      console.error("Stellar burn error:", stellarError);
      return res.status(500).json({
        error: "Failed to burn tokens on Stellar",
        details: stellarError.message
      });
    }
    
    // Create redemption record
    const redemption = await prisma.redemption.create({
      data: {
        userId: req.user.userId,
        partner_id: partnerId,
        type: partner.type,
        totalTokens,
        status: "processing",
        recipient_phone: recipientPhone || user.phone,
        recipient_name: recipientName || null,
        burn_tx_hash: burnResult.hash,
        burn_confirmed_at: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        items: {
          create: products.map(p => {
            const product = productData.find(pd => pd.id === p.productId);
            return {
              productId: p.productId,
              quantity: p.quantity || 1,
              tokenCost: product.tokenCost
            };
          })
        }
      },
      include: { partners: true, items: { include: { product: true } } }
    });
    
    // Record token transaction
    await prisma.tokenTransaction.create({
      data: {
        userId: req.user.userId,
        redemptionId: redemption.id,
        type: "burn_redemption",
        amount: -totalTokens,
        tx_hash: burnResult.hash,
        status: "confirmed"
      }
    });
    
    // For MVP, auto-complete with voucher codes (simulate partner fulfillment)
    const voucherCodes = products.map((p, i) => ({
      itemId: redemption.items[i].id,
      code: "VOUCHER-" + Math.random().toString(36).substring(2, 10).toUpperCase()
    }));
    
    // Update items with voucher codes
    for (const vc of voucherCodes) {
      await prisma.redemptionItem.update({
        where: { id: vc.itemId },
        data: { voucherCode: vc.code, voucher_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
      });
    }
    
    // Mark as completed
    const completedRedemption = await prisma.redemption.update({
      where: { id: redemption.id },
      data: { status: "completed", completedAt: new Date() },
      include: { partners: true, items: { include: { product: true } } }
    });
    
    res.status(201).json({
      success: true,
      data: completedRedemption,
      burnTxHash: burnResult.hash,
      stellarExpert: "https://stellar.expert/explorer/testnet/tx/" + burnResult.hash,
      message: "Redemption completed successfully"
    });
  } catch (error) {
    console.error("Redemption error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel pending redemption (admin or if not yet processed)
app.post("/api/v1/my/redemptions/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const redemption = await prisma.redemption.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });
    
    if (!redemption) {
      return res.status(404).json({ error: "Redemption not found" });
    }
    
    if (redemption.status === "completed") {
      return res.status(400).json({ error: "Cannot cancel completed redemption" });
    }
    
    if (redemption.burn_tx_hash) {
      return res.status(400).json({ error: "Cannot cancel - tokens already burned on blockchain" });
    }
    
    const cancelled = await prisma.redemption.update({
      where: { id: req.params.id },
      data: { status: "cancelled", error_message: "Cancelled by user" }
    });
    
    res.json({ success: true, data: cancelled });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// TOKEN TRANSACTIONS
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// FACILITIES
// ═══════════════════════════════════════════════════════════════

app.get('/api/v1/facilities', async (req, res) => {
  try {
    const { country, type } = req.query;
    const where = { isActive: true };
    if (country) where.country = country;
    if (type) where.type = type;
    
    const facilities = await prisma.facility.findMany({ where });
    res.json({ data: facilities, count: facilities.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/facilities/:id', async (req, res) => {
  try {
    const facility = await prisma.facility.findUnique({ where: { id: req.params.id } });
    if (!facility) return res.status(404).json({ error: 'Facility not found' });
    res.json({ data: facility });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// SUPPORT CIRCLES
// ═══════════════════════════════════════════════════════════════

// Get user's support circles
app.get('/api/v1/my/support-circles', authMiddleware, async (req, res) => {
  try {
    const circles = await prisma.supportCircle.findMany({
      where: { userId: req.user.userId },
      include: { circleMembers: true }
    });
    res.json({ data: circles, count: circles.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create support circle
app.post('/api/v1/my/support-circles', authMiddleware, async (req, res) => {
  try {
    const { pregnancyId, name } = req.body;
    
    const circle = await prisma.supportCircle.create({
      data: {
        userId: req.user.userId,
        pregnancyId,
        name: name || 'My Support Circle'
      }
    });
    res.status(201).json({ data: circle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add member to circle
app.post('/api/v1/my/support-circles/:id/members', authMiddleware, async (req, res) => {
  try {
    const { name, phone, role, relationship } = req.body;
    
    // Verify circle belongs to user
    const circle = await prisma.supportCircle.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });
    if (!circle) return res.status(404).json({ error: 'Circle not found' });
    
    const member = await prisma.circleMember.create({
      data: {
        circleId: req.params.id,
        name,
        phone,
        role: role || 'support',
        relationship
      }
    });
    res.status(201).json({ data: member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove member from circle
app.delete('/api/v1/my/support-circles/:circleId/members/:memberId', authMiddleware, async (req, res) => {
  try {
    const circle = await prisma.supportCircle.findFirst({
      where: { id: req.params.circleId, userId: req.user.userId }
    });
    if (!circle) return res.status(404).json({ error: 'Circle not found' });
    
    await prisma.circleMember.delete({ where: { id: req.params.memberId } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// ARTICLES & CONTENT
// ═══════════════════════════════════════════════════════════════

app.get('/api/v1/articles', async (req, res) => {
  try {
    const { category, language } = req.query;
    const where = { isPublished: true };
    if (category) where.category = category;
    if (language) where.language = language;
    
    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: 50
    });
    res.json({ data: articles, count: articles.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/articles/:id', async (req, res) => {
  try {
    const article = await prisma.article.findUnique({ where: { id: req.params.id } });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ data: article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// QUIZZES
// ═══════════════════════════════════════════════════════════════

// List quizzes
app.get('/api/v1/quizzes', async (req, res) => {
  try {
    const { category } = req.query;
    const where = { is_active: true };
    if (category) where.category = category;
    
    const quizzes = await prisma.quiz.findMany({
      where,
      include: { _count: { select: { questions: true } } }
    });
    res.json({ data: quizzes, count: quizzes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get quiz with questions
app.get('/api/v1/quizzes/:id', async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: { orderBy: { orderIndex: 'asc' } } }
    });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ data: quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit quiz attempt
app.post('/api/v1/quizzes/:id/attempt', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, answer }
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: true }
    });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    
    // Calculate score
    let correctCount = 0;
    answers.forEach(a => {
      const question = quiz.questions.find(q => q.id === a.questionId);
      if (question && question.correctAnswer === a.answer) correctCount++;
    });
    
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= (quiz.passingScore || 70);
    
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.userId,
        quizId: req.params.id,
        score,
        passed,
        answers,
        completedAt: new Date()
      }
    });
    
    res.json({ data: attempt, score, passed, correctCount, totalQuestions: quiz.questions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's quiz attempts
app.get('/api/v1/my/quiz-attempts', authMiddleware, async (req, res) => {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: req.user.userId },
      include: { quiz: true },
      orderBy: { completedAt: 'desc' }
    });
    res.json({ data: attempts, count: attempts.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

// Get user notifications
app.get('/api/v1/my/notifications', authMiddleware, async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    const where = { userId: req.user.userId };
    if (unreadOnly === 'true') where.readAt = null;
    
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json({ data: notifications, count: notifications.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
app.put('/api/v1/my/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user.userId },
      data: { readAt: new Date() }
    });
    if (notification.count === 0) return res.status(404).json({ error: 'Notification not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read
app.put('/api/v1/my/notifications/read-all', authMiddleware, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.userId, readAt: null },
      data: { readAt: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// CONSENTS
// ═══════════════════════════════════════════════════════════════

// Get user consents
app.get('/api/v1/my/consents', authMiddleware, async (req, res) => {
  try {
    const consents = await prisma.consent.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: consents, count: consents.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update consent
app.post('/api/v1/my/consents', authMiddleware, async (req, res) => {
  try {
    const { consentType, accepted } = req.body;
    
    const consent = await prisma.consent.upsert({
      where: { 
        userId_consentType: { userId: req.user.userId, consentType }
      },
      update: { accepted, acceptedAt: accepted ? new Date() : null },
      create: {
        userId: req.user.userId,
        consentType,
        accepted,
        acceptedAt: accepted ? new Date() : null,
        ipAddress: req.ip
      }
    });
    res.json({ data: consent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// DIGITAL DOULAS
// ═══════════════════════════════════════════════════════════════

// Get user's digital doula assignment
app.get('/api/v1/my/doula', authMiddleware, async (req, res) => {
  try {
    const doula = await prisma.digitalDoula.findFirst({
      where: { user_id: req.user.userId, is_active: true }
    });
    res.json({ data: doula });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════════════════════════

// List all users (admin)
app.get('/api/v1/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { country, status, role, page = 1, limit = 50 } = req.query;
    const where = {};
    if (country) where.country = country;
    if (status) where.status = status;
    if (role) where.role = role;
    
    const users = await prisma.user.findMany({
      where,
      include: { userProfile: true, _count: { select: { pregnancies: true } } },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });
    
    const total = await prisma.user.count({ where });
    res.json({ data: users, count: users.length, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user details (admin)
app.get('/api/v1/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        userProfile: true,
        pregnancies: true,
        milestones: { include: { milestone_definitions: true } },
        emergencyContacts: true,
        consents: true
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user (admin)
app.put('/api/v1/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status, role }
    });
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard stats (admin)
app.get('/api/v1/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalPregnancies,
      activePregnancies,
      totalMilestones,
      completedMilestones,
      totalPartners,
      totalRedemptions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'active' } }),
      prisma.pregnancy.count(),
      prisma.pregnancy.count({ where: { status: 'active' } }),
      prisma.userMilestone.count(),
      prisma.userMilestone.count({ where: { status: 'completed' } }),
      prisma.partner.count({ where: { isActive: true } }),
      prisma.redemption.count()
    ]);
    
    res.json({
      users: { total: totalUsers, active: activeUsers },
      pregnancies: { total: totalPregnancies, active: activePregnancies },
      milestones: { total: totalMilestones, completed: completedMilestones },
      partners: totalPartners,
      redemptions: totalRedemptions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES (for backwards compatibility)
// ═══════════════════════════════════════════════════════════════

app.get('/api/v1/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, phone: true, country: true, role: true, status: true, createdAt: true }
    });
    res.json({ data: users, count: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/pregnancies', async (req, res) => {
  try {
    const pregnancies = await prisma.pregnancy.findMany({
      include: { user: { select: { id: true, phone: true, country: true } } }
    });
    res.json({ data: pregnancies, count: pregnancies.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log('==================================================');
  console.log('  MAMATOKENS API v2.0');
  console.log('==================================================');
  console.log(`  Server: http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/health`);
  console.log('  Stellar: MAMA token on testnet');
  console.log('==================================================');
});
