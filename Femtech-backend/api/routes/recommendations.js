const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

router.get('/content', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const pregnancy = await prisma.pregnancy.findFirst({ where: { userId, status: 'ACTIVE' } });
    let gestationalWeeks = null;
    if (pregnancy && pregnancy.last_period_date) {
      gestationalWeeks = Math.floor((Date.now() - new Date(pregnancy.last_period_date).getTime()) / (7 * 24 * 60 * 60 * 1000));
    }
    const quizzes = await prisma.quiz.findMany({ where: { isActive: true }, take: 5 });
    res.json({ gestationalWeeks, quizzes, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

module.exports = router;
