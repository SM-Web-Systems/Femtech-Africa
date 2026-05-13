const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect();

const TEST_OTP = '123456';
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
    
    await client.query(
      'INSERT INTO "otpCode" (phone, code, "expiresAt", "createdAt") VALUES ($1, $2, $3, $4)',
      [phone, hashOtp(otp), expiresAt, new Date()]
    );

    console.log(`OTP for ${phone}: ${otp}`);
    res.json({ success: true, message: 'OTP sent', otp });
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP
router.post('/otp/verify', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP required' });
    }

    const result = await client.query(
      'SELECT * FROM "otpCode" WHERE phone = $1 AND "expiresAt" > NOW() ORDER BY "createdAt" DESC LIMIT 1',
      [phone]
    );

    if (!result.rows.length) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const stored = result.rows[0];
    if (stored.code !== hashOtp(otp)) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Get or create user
    const userResult = await client.query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );

    let user = userResult.rows[0];
    if (!user) {
      const createResult = await client.query(
        'INSERT INTO users (phone, country, status, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [phone, country || 'ZA', 'active', 'mother']
      );
      user = createResult.rows[0];
    }

    const token = jwt.sign({ userId: user.id, phone }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    res.json({ success: true, token, user });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
