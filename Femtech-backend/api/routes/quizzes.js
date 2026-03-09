const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');
const { mintTokens } = require('../utils/stellar');

const prisma = new PrismaClient();

// Get all active quizzes (public)
router.get('/', async (req, res) => {
  try {
    const { category, country, language } = req.query;
    
    const where = { is_active: true };
    if (category) where.category = category;
    if (country) where.country = country;
    if (language) where.language = language;

    const quizzes = await prisma.quiz.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        difficulty: true,
        time_limit_mins: true,
        pass_threshold: true,
        reward_amount: true,
        _count: { select: { questions: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(quizzes.map(q => ({
      ...q,
      questionCount: q._count.questions
    })));
  } catch (error) {
    console.error('Quiz list error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get quiz details with questions (protected)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            questionText: true,
            questionType: true,
            options: true,
            // Don't send correct_answer to client!
            sortOrder: true
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check if user already passed this quiz
    const existingPass = await prisma.quizAttempt.findFirst({
      where: {
        userId: req.user.userId,
        quizId: quiz.id,
        passed: true
      }
    });

    res.json({
      ...quiz,
      alreadyPassed: !!existingPass,
      questionCount: quiz.questions.length
    });
  } catch (error) {
    console.error('Quiz detail error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start a quiz attempt
router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: { orderBy: { sortOrder: 'asc' } } }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Return quiz with questions (no answers)
    res.json({
      quizId: quiz.id,
      title: quiz.title,
      timeLimit: quiz.time_limit_mins,
      passThreshold: quiz.pass_threshold,
      rewardAmount: quiz.reward_amount,
      startedAt: new Date().toISOString(),
      questions: quiz.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options
      }))
    });
  } catch (error) {
    console.error('Quiz start error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit quiz answers
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { answers, startedAt } = req.body;
    const quizId = req.params.id;
    const userId = req.user.userId;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array required' });
    }

    // Get quiz with correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let correctCount = 0;
    const results = [];

    for (const question of quiz.questions) {
      const userAnswer = answers.find(a => a.questionId === question.id);
      const isCorrect = userAnswer && 
        JSON.stringify(userAnswer.answer) === JSON.stringify(question.correct_answer);
      
      if (isCorrect) correctCount++;
      
      results.push({
        questionId: question.id,
        questionText: question.questionText,
        userAnswer: userAnswer?.answer,
        correctAnswer: question.correct_answer,
        isCorrect,
        explanation: question.explanation
      });
    }

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.pass_threshold;

    // Calculate duration
    const started = new Date(startedAt);
    const completed = new Date();
    const durationSeconds = Math.round((completed - started) / 1000);

    // Check if user already passed and got reward
    const existingPass = await prisma.quizAttempt.findFirst({
      where: { userId, quizId, passed: true, rewardGranted: true }
    });

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        passed,
        answers,
        started_at: started,
        completedAt: completed,
        duration_seconds: durationSeconds,
        rewardGranted: false
      }
    });

    // Grant reward if passed and not already rewarded
    let reward = null;
    if (passed && quiz.reward_amount > 0 && !existingPass) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      
      if (user?.walletAddress) {
        try {
          const txResult = await mintTokens(user.walletAddress, quiz.reward_amount);
          
          // Update attempt as rewarded
          await prisma.quizAttempt.update({
            where: { id: attempt.id },
            data: { rewardGranted: true }
          });

          // Record transaction
          await prisma.tokenTransaction.create({
            data: {
              userId,
              type: 'mint_milestone',
              amount: quiz.reward_amount,
              status: 'confirmed',
              tx_hash: txResult.hash
            }
          });

          reward = {
            amount: quiz.reward_amount,
            tx_hash: txResult.hash
          };
        } catch (mintError) {
          console.error('Mint error:', mintError);
          // Quiz passed but mint failed - can retry later
        }
      }
    }

    res.json({
      attemptId: attempt.id,
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      passThreshold: quiz.pass_threshold,
      durationSeconds,
      reward,
      alreadyRewarded: !!existingPass,
      results
    });
  } catch (error) {
    console.error('Quiz submit error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's quiz attempts
router.get('/my/attempts', authenticateToken, async (req, res) => {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: req.user.userId },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            category: true,
            reward_amount: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(attempts);
  } catch (error) {
    console.error('Quiz attempts error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;