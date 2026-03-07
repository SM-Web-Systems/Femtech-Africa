const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

// Test code for development (remove in production)
const TEST_OTP = '123456';

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
        code: otp,
        expires_at: expiresAt
      }
    });

    // TODO: Send SMS via Africa's Talking
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ success: true, message: 'OTP sent successfully', hint: 'Use 123456 for testing' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP
router.post('/otp/verify', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Allow test code in development
    const isTestCode = otp === TEST_OTP;

    if (!isTestCode) {
      const otpRecord = await prisma.otpCode.findFirst({
        where: {
          phone,
          code: otp,
          used: false,
          expires_at: { gte: new Date() }
        },
        orderBy: { created_at: 'desc' }
      });

      if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { used: true }
      });
    }

    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          country: req.body.country || 'ZA',
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