const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

// Test code for development
const TEST_OTP = '123456';

// Hash OTP for storage
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

// Request OTP
router.post('/otp/request', async (req, res) => {
  try {
    const { phone, country } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({
      data: {
        phone,
        codeHash: hashOtp(otp),
        purpose: 'login',
        expiresAt
      }
    });

    // TODO: Send SMS via Africa's Talking
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ success: true, message: 'OTP sent successfully', hint: 'Use 123456 for testing' });
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP
router.post('/otp/verify', async (req, res) => {
  try {
    const { phone, otp, country } = req.body;

    // Allow test code in development
    const isTestCode = otp === TEST_OTP;

    if (!isTestCode) {
      const otpRecord = await prisma.otpCode.findFirst({
        where: {
          phone,
          codeHash: hashOtp(otp),
          purpose: 'login',
          verified_at: null,
          expiresAt: { gte: new Date() }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      // Check max attempts
      if (otpRecord.attempts >= otpRecord.maxAttempts) {
        return res.status(400).json({ error: 'Too many attempts. Request a new OTP.' });
      }

      // Mark as verified
      await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { verified_at: new Date() }
      });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          country: country || 'ZA',
          status: 'active'
        }
      });
    }

    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, phone: user.phone, country: user.country } });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
