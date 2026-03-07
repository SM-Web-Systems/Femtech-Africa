const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get facilities
router.get('/facilities', async (req, res) => {
  try {
    const facilities = await prisma.facility.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    });
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get articles
router.get('/articles', async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: { is_published: true },
      orderBy: { published_at: 'desc' }
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { is_active: true },
      include: { _count: { select: { quiz_questions: true } } }
    });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
