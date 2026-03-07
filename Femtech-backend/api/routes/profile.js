const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');
const { encrypt, decrypt } = require('../utils/encryption');

const prisma = new PrismaClient();

// Get profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { user_id: req.user.userId }
    });

    if (!profile) {
      return res.json({ exists: false });
    }

    res.json({
      firstName: decrypt(profile.first_name),
      lastName: decrypt(profile.last_name),
      dateOfBirth: decrypt(profile.date_of_birth),
      updatedAt: profile.updated_at
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth } = req.body;

    const profile = await prisma.userProfile.upsert({
      where: { user_id: req.user.userId },
      update: {
        first_name: encrypt(firstName),
        last_name: encrypt(lastName),
        date_of_birth: encrypt(dateOfBirth),
        updated_at: new Date()
      },
      create: {
        user_id: req.user.userId,
        first_name: encrypt(firstName),
        last_name: encrypt(lastName),
        date_of_birth: encrypt(dateOfBirth)
      }
    });

    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
