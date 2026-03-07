const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get user's pregnancies
router.get('/pregnancies', authenticateToken, async (req, res) => {
  try {
    const pregnancies = await prisma.pregnancy.findMany({
      where: { user_id: req.user.userId },
      orderBy: { created_at: 'desc' }
    });
    res.json(pregnancies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create pregnancy
router.post('/pregnancies', authenticateToken, async (req, res) => {
  try {
    const { dueDate, lastPeriodDate } = req.body;

    const pregnancy = await prisma.pregnancy.create({
      data: {
        user_id: req.user.userId,
        due_date: new Date(dueDate),
        last_period_date: lastPeriodDate ? new Date(lastPeriodDate) : null,
        status: 'active'
      }
    });

    res.json(pregnancy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get appointments
router.get('/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { user_id: req.user.userId },
      orderBy: { appointment_date: 'desc' }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create appointment
router.post('/appointments', authenticateToken, async (req, res) => {
  try {
    const { facilityId, appointmentDate, type, notes } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        user_id: req.user.userId,
        facility_id: facilityId,
        appointment_date: new Date(appointmentDate),
        type,
        notes,
        status: 'scheduled'
      }
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get emergency contacts
router.get('/emergency-contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await prisma.emergencyContact.findMany({
      where: { user_id: req.user.userId }
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: req.user.userId },
      orderBy: { created_at: 'desc' },
      take: 50
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transactions
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.tokenTransaction.findMany({
      where: { user_id: req.user.userId },
      orderBy: { created_at: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
