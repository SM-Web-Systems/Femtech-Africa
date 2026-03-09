const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get personalized content recommendations
router.get('/content', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user context
    const [pregnancy, completedQuizzes, viewedArticles, riskFactors] = await Promise.all([
      prisma.pregnancy.findFirst({
        where: { userId, status: 'ACTIVE' },
      }),
      prisma.quizAttempt.findMany({
        where: { userId },
        select: { quizId: true },
      }),
      // Assuming we track viewed articles - if not, skip this
      Promise.resolve([]),
      prisma.pregnancy.findFirst({
        where: { userId, status: 'ACTIVE' },
        select: { riskFactors: true, isHighRisk: true },
      }),
    ]);

    // Calculate gestational weeks
    let gestationalWeeks = null;
    let trimester = null;
    if (pregnancy?.last_period_date) {
      gestationalWeeks = Math.floor(
        (Date.now() - new Date(pregnancy.last_period_date).getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
      if (gestationalWeeks <= 12) trimester = 1;
      else if (gestationalWeeks <= 27) trimester = 2;
      else trimester = 3;
    }

    // Get all available articles
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });

    // Get uncompleted quizzes
    const completedQuizIds = completedQuizzes.map(q => q.quizId);
    const quizzes = await prisma.quiz.findMany({
      where: {
        isActive: true,
        id: { notIn: completedQuizIds },
      },
    });

    // Score and rank content
    const scoredArticles = articles.map(article => {
      let score = 0;

      // Gestational age relevance
      if (article.gestationalWeekMin && article.gestationalWeekMax && gestationalWeeks) {
        if (gestationalWeeks >= article.gestationalWeekMin && gestationalWeeks <= article.gestationalWeekMax) {
          score += 30;
        } else if (Math.abs(gestationalWeeks - article.gestationalWeekMin) <= 4) {
          score += 15;
        }
      }

      // Trimester relevance
      if (article.trimester && article.trimester === trimester) {
        score += 20;
      }

      // Risk factor relevance
      if (riskFactors?.isHighRisk && article.category === 'HIGH_RISK') {
        score += 25;
      }

      // Category bonuses
      if (article.category === 'NUTRITION') score += 10;
      if (article.category === 'EXERCISE') score += 8;
      if (article.category === 'MENTAL_HEALTH') score += 8;

      // Recency bonus
      const daysSincePublished = (Date.now() - new Date(article.createdAt).getTime()) / (24 * 60 * 60 * 1000);
      if (daysSincePublished < 7) score += 10;
      else if (daysSincePublished < 30) score += 5;

      return { ...article, relevanceScore: score };
    });

    // Sort by score and take top recommendations
    const recommendedArticles = scoredArticles
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);

    // Score quizzes similarly
    const scoredQuizzes = quizzes.map(quiz => {
      let score = 0;

      if (quiz.gestationalWeekMin && quiz.gestationalWeekMax && gestationalWeeks) {
        if (gestationalWeeks >= quiz.gestationalWeekMin && gestationalWeeks <= quiz.gestationalWeekMax) {
          score += 30;
        }
      }

      // Reward bonus
      if (quiz.rewardAmount) {
        score += quiz.rewardAmount * 2;
      }

      return { ...quiz, relevanceScore: score };
    });

    const recommendedQuizzes = scoredQuizzes
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);

    res.json({
      gestationalWeeks,
      trimester,
      articles: recommendedArticles,
      quizzes: recommendedQuizzes,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Get milestone recommendations
router.get('/milestones', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [pregnancy, userMilestones] = await Promise.all([
      prisma.pregnancy.findFirst({
        where: { userId, status: 'ACTIVE' },
      }),
      prisma.userMilestone.findMany({
        where: { userId },
        include: { milestoneDefinition: true },
      }),
    ]);

    let gestationalWeeks = null;
    if (pregnancy?.last_period_date) {
      gestationalWeeks = Math.floor(
        (Date.now() - new Date(pregnancy.last_period_date).getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
    }

    // Get milestone definitions
    const allMilestones = await prisma.milestoneDefinition.findMany({
      where: { isActive: true },
      orderBy: { weekNumber: 'asc' },
    });

    // Find upcoming milestones
    const completedIds = userMilestones
      .filter(m => m.status === 'COMPLETED')
      .map(m => m.milestone_def_id);

    const upcomingMilestones = allMilestones
      .filter(m => !completedIds.includes(m.id))
      .filter(m => !gestationalWeeks || m.weekNumber >= gestationalWeeks - 1)
      .slice(0, 5);

    // Find overdue milestones
    const overdueMilestones = allMilestones
      .filter(m => !completedIds.includes(m.id))
      .filter(m => gestationalWeeks && m.weekNumber < gestationalWeeks - 1)
      .slice(0, 3);

    res.json({
      gestationalWeeks,
      upcoming: upcomingMilestones,
      overdue: overdueMilestones,
      completed: userMilestones.filter(m => m.status === 'COMPLETED').length,
      total: allMilestones.length,
    });
  } catch (error) {
    console.error('Milestone recommendations error:', error);
    res.status(500).json({ error: 'Failed to get milestone recommendations' });
  }
});

module.exports = router;
