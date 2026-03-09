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
      where: { userId: req.user.userId }
    });

    if (!profile) {
      return res.json({ exists: false });
    }

    // Safely decrypt fields (handle null values)
    const decryptField = (encryptedValue) => {
      if (!encryptedValue) return null;
      try {
        return decrypt(encryptedValue);
      } catch (e) {
        return null;
      }
    };

    res.json({
      exists: true,
      firstName: decryptField(profile.firstNameEncrypted),
      lastName: decryptField(profile.lastNameEncrypted),
      dateOfBirth: decryptField(profile.dateOfBirthEncrypted),
      avatarUrl: profile.avatarUrl,
      updatedAt: profile.updatedAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, avatarUrl } = req.body;

    // Safely encrypt fields (handle null/empty values)
    const encryptField = (value) => {
      if (!value || value.trim() === '') return null;
      return encrypt(value);
    };

    const profile = await prisma.userProfile.upsert({
      where: { userId: req.user.userId },
      update: {
        firstNameEncrypted: encryptField(firstName),
        lastNameEncrypted: encryptField(lastName),
        dateOfBirthEncrypted: encryptField(dateOfBirth),
        avatarUrl: avatarUrl || null,
        updatedAt: new Date()
      },
      create: {
        userId: req.user.userId,
        firstNameEncrypted: encryptField(firstName),
        lastNameEncrypted: encryptField(lastName),
        dateOfBirthEncrypted: encryptField(dateOfBirth),
        avatarUrl: avatarUrl || null
      }
    });

    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
