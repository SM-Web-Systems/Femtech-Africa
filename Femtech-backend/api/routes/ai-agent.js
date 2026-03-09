const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for the AI agent
const getSystemPrompt = (userContext) => `You are MamaAI, a caring and knowledgeable maternal health assistant for the MamaToken app. You support pregnant women in South Africa and East Africa.

## Your Personality
- Warm, empathetic, and encouraging
- Clear and simple language (many users have limited health literacy)
- Culturally sensitive to African contexts
- Never judgmental, always supportive
- Proactive about safety - always recommend professional care for concerning symptoms

## User Context
${userContext}

## Your Capabilities
1. **Pregnancy Guidance**: Answer questions about pregnancy stages, symptoms, nutrition, exercise, and fetal development
2. **App Navigation**: Help users use MamaToken features (wallet, quizzes, vouchers, milestones, appointments)
3. **Health Information**: Provide evidence-based maternal health information
4. **Milestone Tracking**: Remind about and explain pregnancy milestones
5. **Token Economy**: Explain how to earn and redeem MAMA tokens
6. **Emergency Guidance**: Recognize danger signs and advise immediate medical attention

## Important Guidelines
- For ANY of these symptoms, immediately advise seeking emergency care:
  * Severe headache with vision changes
  * Heavy vaginal bleeding
  * Severe abdominal pain
  * Reduced or no fetal movement (after 28 weeks)
  * High fever
  * Seizures or convulsions
  * Difficulty breathing
  * Severe swelling of face/hands
  
- Always recommend regular antenatal care visits
- Never diagnose conditions - suggest consulting healthcare providers
- Be encouraging about healthy behaviors
- Celebrate achievements and milestones
- If unsure, say so and recommend professional consultation

## Response Format
- Keep responses concise (2-3 paragraphs max unless detailed explanation needed)
- Use simple, clear language
- Include relevant emojis sparingly to be friendly 🤰💜
- When suggesting app features, be specific about where to find them
- For health topics, cite that information is general guidance

## Languages
Respond in the same language the user writes in. You support:
- English
- Zulu
- Xhosa
- Sotho
- Swahili

If the user writes in a local language, respond in that language.`;

// Build user context from database
const buildUserContext = async (userId) => {
  try {
    const [user, profile, pregnancy, milestones, quizAttempts, wallet, appointments] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.userProfile.findUnique({ where: { userId: userId } }),
      prisma.pregnancy.findFirst({ 
        where: { userId: userId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.userMilestone.findMany({ 
        where: { userId: userId },
        include: { milestoneDefinition: true },
        orderBy: { completedAt: 'desc' },
        take: 10
      }),
      prisma.quizAttempt.findMany({
        where: { userId: userId },
        include: { quiz: true },
        orderBy: { completedAt: 'desc' },
        take: 5
      }),
      prisma.tokenTransaction.aggregate({
        where: { userId: userId },
        _sum: { amount: true }
      }),
      prisma.appointment.findMany({
        where: { user_id: userId },
        orderBy: { scheduled_at: 'desc' },
        take: 5
      })
    ]);

    // Calculate gestational age if pregnancy exists
    let gestationalWeeks = null;
    let trimester = null;
    let dueDate = null;
    
    if (pregnancy) {
      const today = new Date();
      const lmp = pregnancy.last_period_date || pregnancy.conceptionDate;
      if (lmp) {
        const diffTime = Math.abs(today - new Date(lmp));
        gestationalWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
        
        if (gestationalWeeks <= 12) trimester = 'First';
        else if (gestationalWeeks <= 27) trimester = 'Second';
        else trimester = 'Third';
      }
      dueDate = pregnancy.estimated_due_date;
    }

    // Build context string
    let context = `## Current User Information\n`;
    
    if (profile) {
      context += `- Name: ${profile.firstNameEncrypted ? 'Available' : 'Not set'}\n`;
    }
    
    if (pregnancy) {
      context += `\n## Pregnancy Status\n`;
      context += `- Status: Active pregnancy\n`;
      if (gestationalWeeks) context += `- Gestational Age: ${gestationalWeeks} weeks\n`;
      if (trimester) context += `- Trimester: ${trimester}\n`;
      if (dueDate) context += `- Due Date: ${new Date(dueDate).toLocaleDateString()}\n`;
      if (pregnancy.isHighRisk) context += `- Risk Level: High risk pregnancy\n`;
      if (pregnancy.riskFactors) context += `- Risk Factors: ${JSON.stringify(pregnancy.riskFactors)}\n`;
    } else {
      context += `\n## Pregnancy Status\n- No active pregnancy recorded\n`;
    }
    
    context += `\n## Token Balance\n`;
    context += `- MAMA Tokens: ${wallet._sum.amount || 0}\n`;
    
    if (milestones.length > 0) {
      context += `\n## Recent Milestones\n`;
      milestones.slice(0, 5).forEach(m => {
        context += `- ${m.milestoneDefinition?.name || 'Milestone'}: ${m.status}\n`;
      });
    }
    
    if (quizAttempts.length > 0) {
      context += `\n## Recent Quiz Activity\n`;
      quizAttempts.forEach(q => {
        context += `- ${q.quiz?.title || 'Quiz'}: Score ${q.score}%\n`;
      });
    }
    
    if (appointments.length > 0) {
      context += `\n## Upcoming/Recent Appointments\n`;
      appointments.forEach(a => {
        context += `- ${a.appointment_type}: ${new Date(a.scheduled_at).toLocaleDateString()} (${a.status})\n`;
      });
    }

    return context;
  } catch (error) {
    console.error('Error building user context:', error);
    return '## User Context\nUnable to load user context. Provide general guidance.';
  }
};

// Store conversation history
const conversationCache = new Map();
const MAX_HISTORY = 20;

// Chat endpoint
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user.userId;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create conversation history
    const cacheKey = `${userId}:${conversationId || 'default'}`;
    let history = conversationCache.get(cacheKey) || [];

    // Build user context
    const userContext = await buildUserContext(userId);
    const systemPrompt = getSystemPrompt(userContext);

    // Add user message to history
    history.push({ role: 'user', content: message });

    // Keep only last N messages
    if (history.length > MAX_HISTORY) {
      history = history.slice(-MAX_HISTORY);
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: history,
    });

    const assistantMessage = response.content[0].text;

    // Add assistant response to history
    history.push({ role: 'assistant', content: assistantMessage });
    conversationCache.set(cacheKey, history);

    // Log conversation for analytics (optional)
    try {
      await prisma.aiConversation.create({
        data: {
          userId: userId,
          conversationId: conversationId || cacheKey,
          userMessage: message,
          assistantMessage: assistantMessage,
          tokensUsed: response.usage?.output_tokens || 0,
        }
      });
    } catch (logError) {
      // Don't fail if logging fails
      console.log('Failed to log conversation:', logError.message);
    }

    res.json({
      message: assistantMessage,
      conversationId: conversationId || cacheKey,
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Fallback response for common queries
    const fallbackResponse = getFallbackResponse(req.body.message);
    if (fallbackResponse) {
      return res.json({
        message: fallbackResponse,
        conversationId: req.body.conversationId,
        offline: true
      });
    }
    
    res.status(500).json({ error: 'Failed to process message. Please try again.' });
  }
});

// Clear conversation history
router.delete('/chat/:conversationId', authenticateToken, (req, res) => {
  const cacheKey = `${req.user.userId}:${req.params.conversationId}`;
  conversationCache.delete(cacheKey);
  res.json({ success: true });
});

// Get suggested prompts based on user context
router.get('/suggestions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const [pregnancy, milestones, quizAttempts] = await Promise.all([
      prisma.pregnancy.findFirst({ 
        where: { userId: userId, status: 'ACTIVE' }
      }),
      prisma.userMilestone.findMany({
        where: { userId: userId, status: 'PENDING' },
        include: { milestoneDefinition: true },
        take: 3
      }),
      prisma.quizAttempt.count({ where: { userId: userId } })
    ]);

    const suggestions = [];

    // Pregnancy-specific suggestions
    if (pregnancy) {
      const today = new Date();
      const lmp = pregnancy.last_period_date;
      if (lmp) {
        const weeks = Math.floor((today - new Date(lmp)) / (1000 * 60 * 60 * 24 * 7));
        suggestions.push(`What should I expect at ${weeks} weeks pregnant?`);
        
        if (weeks >= 28) {
          suggestions.push('How do I count my baby\'s kicks?');
        }
        if (weeks >= 36) {
          suggestions.push('What are the signs of labor?');
        }
      }
      
      if (pregnancy.isHighRisk) {
        suggestions.push('What extra precautions should I take for a high-risk pregnancy?');
      }
    } else {
      suggestions.push('How do I track my pregnancy in this app?');
    }

    // App-related suggestions
    if (quizAttempts === 0) {
      suggestions.push('How do I earn MAMA tokens?');
    }
    
    suggestions.push('What vouchers can I redeem with my tokens?');
    
    if (milestones.length > 0) {
      suggestions.push(`Tell me about the "${milestones[0].milestoneDefinition?.name}" milestone`);
    }

    // General health suggestions
    suggestions.push('What foods should I eat during pregnancy?');
    suggestions.push('What are pregnancy warning signs I should watch for?');

    res.json({ suggestions: suggestions.slice(0, 6) });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.json({
      suggestions: [
        'How do I earn MAMA tokens?',
        'What are pregnancy warning signs?',
        'How do I redeem my vouchers?',
        'What should I eat during pregnancy?',
      ]
    });
  }
});

// Fallback responses for offline/error situations
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Emergency keywords
  if (lowerMessage.includes('bleeding') || lowerMessage.includes('blood')) {
    return '⚠️ If you are experiencing vaginal bleeding during pregnancy, please seek medical attention immediately. Contact your healthcare provider or go to the nearest hospital. This could be serious and needs professional evaluation right away.';
  }
  
  if (lowerMessage.includes('pain') && (lowerMessage.includes('severe') || lowerMessage.includes('bad'))) {
    return '⚠️ Severe pain during pregnancy should be evaluated by a healthcare provider. Please contact your doctor or go to the nearest clinic/hospital as soon as possible.';
  }
  
  if (lowerMessage.includes('not moving') || lowerMessage.includes('no movement') || lowerMessage.includes('baby stopped')) {
    return '⚠️ If you notice reduced fetal movement, please contact your healthcare provider immediately or go to the hospital. Try lying on your left side and counting movements. If you count fewer than 10 movements in 2 hours after 28 weeks, seek medical attention.';
  }
  
  // Token questions
  if (lowerMessage.includes('token') || lowerMessage.includes('earn') || lowerMessage.includes('mama')) {
    return 'You can earn MAMA tokens by:\n\n1. 📚 Completing educational quizzes\n2. ✅ Achieving pregnancy milestones\n3. 📅 Attending antenatal appointments\n4. 💪 Logging healthy activities\n\nGo to the Quiz section to start earning tokens!';
  }
  
  // Voucher questions
  if (lowerMessage.includes('voucher') || lowerMessage.includes('redeem')) {
    return 'To redeem vouchers:\n\n1. Go to the Wallet tab\n2. Tap "Redeem" to see available vouchers\n3. Choose a voucher from our partner stores\n4. Use your MAMA tokens to claim it\n\nVouchers can be used for baby supplies, healthcare products, and more!';
  }
  
  return null;
};

module.exports = router;
