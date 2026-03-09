const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk').default;
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RISK_FACTORS = {
  age_under_18: { weight: 2, label: 'Age under 18' },
  age_over_35: { weight: 1.5, label: 'Age over 35' },
  first_pregnancy: { weight: 0.5, label: 'First pregnancy' },
  multiple_pregnancy: { weight: 2.5, label: 'Multiple pregnancy' },
  previous_preeclampsia: { weight: 3, label: 'Previous preeclampsia' },
  previous_cesarean: { weight: 1.5, label: 'Previous cesarean' },
  previous_stillbirth: { weight: 3, label: 'Previous stillbirth' },
  chronic_hypertension: { weight: 2.5, label: 'Chronic hypertension' },
  diabetes: { weight: 2, label: 'Diabetes' },
  hiv_positive: { weight: 2, label: 'HIV positive' },
  anemia: { weight: 1.5, label: 'Anemia' },
  missed_appointments: { weight: 1, label: 'Missed appointments' },
};

function calculateRiskScore(factors) {
  let totalWeight = 0;
  const identifiedFactors = [];
  for (const key in factors) {
    if (factors[key] && RISK_FACTORS[key]) {
      totalWeight += RISK_FACTORS[key].weight;
      identifiedFactors.push(RISK_FACTORS[key].label);
    }
  }
  const normalizedScore = Math.min(totalWeight / 15, 1);
  const riskLevel = normalizedScore < 0.3 ? 'LOW' : normalizedScore < 0.6 ? 'MEDIUM' : 'HIGH';
  return { score: normalizedScore, level: riskLevel, factors: identifiedFactors };
}

async function getUserRiskFactors(userId) {
  const pregnancy = await prisma.pregnancy.findFirst({ where: { userId: userId, status: 'active' } });
  const appointments = await prisma.appointment.findMany({ where: { user_id: userId } });
  const factors = {};
  if (pregnancy) {
    factors.first_pregnancy = pregnancy.gravida === 1;
    factors.multiple_pregnancy = pregnancy.isMultiple || false;
    if (pregnancy.riskFactors) {
      try {
        const rf = typeof pregnancy.riskFactors === 'string' ? JSON.parse(pregnancy.riskFactors) : pregnancy.riskFactors;
        factors.previous_preeclampsia = rf.previousPreeclampsia || false;
        factors.previous_cesarean = rf.previousCesarean || false;
        factors.chronic_hypertension = rf.chronicHypertension || false;
        factors.diabetes = rf.diabetes || false;
        factors.hiv_positive = rf.hivPositive || false;
      } catch (e) {}
    }
  }
  const missedCount = appointments.filter(function(a) { return a.status === 'MISSED'; }).length;
  factors.missed_appointments = missedCount >= 2;
  return factors;
}

router.get('/assessment', authenticateToken, async (req, res) => {
  try {
    const factors = await getUserRiskFactors(req.user.userId);
    const assessment = calculateRiskScore(factors);
    res.json({ score: assessment.score, level: assessment.level, factors: assessment.factors, assessedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Risk assessment error:', error);
    res.status(500).json({ error: 'Failed to calculate risk' });
  }
});

router.get('/analysis', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const factors = await getUserRiskFactors(userId);
    const assessment = calculateRiskScore(factors);
    const pregnancy = await prisma.pregnancy.findFirst({ where: { userId: userId, status: 'active' } });
    var gestationalWeeks = null;
    if (pregnancy && pregnancy.last_period_date) {
      gestationalWeeks = Math.floor((Date.now() - new Date(pregnancy.last_period_date).getTime()) / (7 * 24 * 60 * 60 * 1000));
    }
    var prompt = 'Pregnancy risk assessment - Level: ' + assessment.level + ', Score: ' + Math.round(assessment.score * 100) + '%, Week: ' + (gestationalWeeks || 'Unknown') + ', Factors: ' + (assessment.factors.join(', ') || 'None') + '. Return JSON only with: summary (string), recommendations (array of 3-5 strings), warningSignsToWatch (array of 3-5 strings), nextSteps (array of 2-3 strings). Simple language.';
    var response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });
    var analysis = null;
    try {
      var text = response.content[0].text;
      var jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) analysis = JSON.parse(jsonMatch[0]);
    } catch (e) {}
    if (!analysis) {
      analysis = {
        summary: assessment.level === 'LOW' ? 'Your pregnancy is progressing well.' : 'Some factors need monitoring.',
        recommendations: ['Attend all antenatal appointments', 'Take prenatal vitamins daily', 'Stay hydrated and eat well'],
        warningSignsToWatch: ['Severe headache or vision changes', 'Heavy vaginal bleeding', 'Reduced baby movement'],
        nextSteps: ['Schedule your next antenatal visit'],
      };
    }
    res.json({
      riskLevel: assessment.level,
      riskScore: assessment.score,
      riskFactors: assessment.factors,
      gestationalWeeks: gestationalWeeks,
      summary: analysis.summary,
      recommendations: analysis.recommendations,
      warningSignsToWatch: analysis.warningSignsToWatch,
      nextSteps: analysis.nextSteps,
      assessedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Risk analysis error:', error);
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
});

module.exports = router;
