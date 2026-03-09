const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk').default;
const { PrismaClient, pregnancy_status } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const getSystemPrompt = (userContext) => `You are MamaAI, a caring maternal health assistant for the MamaToken app supporting pregnant women in South Africa and East Africa.

## Personality
- Warm, empathetic, encouraging
- Simple language (many users have limited health literacy)
- Culturally sensitive to African contexts
- Never judgmental
- Proactive about safety

## User Context
${userContext}

## Capabilities
1. Pregnancy guidance (symptoms, nutrition, fetal development)
2. App navigation (wallet, quizzes, vouchers, milestones)
3. Evidence-based maternal health information
4. Milestone tracking and reminders
5. Token economy explanation
6. Emergency guidance

## Emergency Signs - ALWAYS advise immediate medical care:
- Severe headache with vision changes
- Heavy vaginal bleeding
- Severe abdominal pain
- Reduced/no fetal movement (after 28 weeks)
- High fever, seizures, difficulty breathing
- Severe swelling of face/hands

## Guidelines
- Never diagnose - recommend healthcare providers
- Keep responses concise (2-3 paragraphs max)
- Use simple language with sparse emojis 🤰💜
- Respond in the user's language (English, Zulu, Xhosa, Sotho, Swahili)`;

const buildUserContext = async (userId) => {
  try {
    const [profile, pregnancy, milestones, wallet] = await Promise.all([
      prisma.userProfile.findUnique({ where: { userId } }),
      prisma.pregnancy.findFirst({ where: { user_id: userId, status: pregnancy_status.active }, orderBy: { createdAt: 'desc' } }),
      prisma.userMilestone.findMany({ where: { userId }, include: { milestoneDefinition: true }, take: 5 }),
      prisma.tokenTransaction.aggregate({ where: { userId }, _sum: { amount: true } })
    ]);

    let context = '## User Information\n';
    
    if (pregnancy) {
      const weeks = pregnancy.last_period_date 
        ? Math.floor((Date.now() - new Date(pregnancy.last_period_date).getTime()) / (7 * 24 * 60 * 60 * 1000))
        : null;
      context += `- Active pregnancy${weeks ? `: ${weeks} weeks` : ''}\n`;
      if (pregnancy.isHighRisk) context += `- High risk pregnancy\n`;
      if (pregnancy.estimated_due_date) context += `- Due: ${new Date(pregnancy.estimated_due_date).toLocaleDateString()}\n`;
    } else {
      context += '- No active pregnancy recorded\n';
    }
    
    context += `- MAMA Token Balance: ${wallet._sum.amount || 0}\n`;
    context += `- Milestones completed: ${milestones.filter(m => m.status === 'COMPLETED').length}\n`;
    
    return context;
  } catch (error) {
    console.error('Context error:', error);
    return '## User Context\nUnable to load context.';
  }
};

const conversationCache = new Map();

router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user.userId;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message required' });
    }

    const cacheKey = `${userId}:${conversationId || 'default'}`;
    let history = conversationCache.get(cacheKey) || [];
    
    const userContext = await buildUserContext(userId);
    history.push({ role: 'user', content: message });
    
    if (history.length > 20) history = history.slice(-20);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: getSystemPrompt(userContext),
      messages: history,
    });

    const assistantMessage = response.content[0].text;
    history.push({ role: 'assistant', content: assistantMessage });
    conversationCache.set(cacheKey, history);

    res.json({ message: assistantMessage, conversationId: cacheKey });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

router.get('/suggestions', authenticateToken, async (req, res) => {
  try {
    const pregnancy = await prisma.pregnancy.findFirst({
      where: { user_id: req.user.userId, status: pregnancy_status.active }
    });

    const suggestions = [
      'How do I earn MAMA tokens?',
      'What are pregnancy warning signs?',
      'How do I redeem my vouchers?',
      'What should I eat during pregnancy?',
    ];

    if (pregnancy) {
      const weeks = pregnancy.last_period_date
        ? Math.floor((Date.now() - new Date(pregnancy.last_period_date).getTime()) / (7 * 24 * 60 * 60 * 1000))
        : null;
      if (weeks) suggestions.unshift(`What should I expect at ${weeks} weeks?`);
    }

    res.json({ suggestions: suggestions.slice(0, 6) });
  } catch (error) {
    res.json({ suggestions: ['How do I earn MAMA tokens?', 'What are pregnancy warning signs?'] });
  }
});

router.delete('/chat/:conversationId', authenticateToken, (req, res) => {
  conversationCache.delete(`${req.user.userId}:${req.params.conversationId}`);
  res.json({ success: true });
});

module.exports = router;
