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

// DELETE profile - permanently delete user and all associated data
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Deleting profile for user:', userId);

    // Models with userId field (mapped via @map to user_id in DB)
    await prisma.voucher.deleteMany({ where: { userId: userId } });
    await prisma.tokenTransaction.deleteMany({ where: { userId: userId } });
    await prisma.quizAttempt.deleteMany({ where: { userId: userId } });
    await prisma.notification.deleteMany({ where: { userId: userId } });
    await prisma.userMilestone.deleteMany({ where: { userId: userId } });
    await prisma.redemptionItem.deleteMany({ where: { redemption: { userId: userId } } });
    await prisma.redemption.deleteMany({ where: { userId: userId } });
    await prisma.circleMember.deleteMany({ where: { userId: userId } });
    await prisma.pregnancy.deleteMany({ where: { userId: userId } });
    await prisma.consent.deleteMany({ where: { userId: userId } });
    await prisma.session.deleteMany({ where: { userId: userId } });
    await prisma.userProfile.deleteMany({ where: { userId: userId } });

    // Models with user_id field (no @map, field name = column name)
    await prisma.supportCircle.deleteMany({ where: { owner_id: userId } });
    await prisma.appointment.deleteMany({ where: { user_id: userId } });
    await prisma.kickSession.deleteMany({ where: { user_id: userId } });
    await prisma.medicalHistory.deleteMany({ where: { user_id: userId } });
    await prisma.emergencyContact.deleteMany({ where: { user_id: userId } });
    await prisma.digitalDoula.deleteMany({ where: { user_id: userId } });
    await prisma.smsMessage.deleteMany({ where: { user_id: userId } });

    // Finally delete user
    await prisma.user.delete({ where: { id: userId } });

    console.log('Profile deleted successfully for user:', userId);
    res.json({ success: true, message: 'Profile and all data permanently deleted' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;