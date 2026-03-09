const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk').default;
const { PrismaClient } = require('../generated/prisma-client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Risk factors and their weights
const RISK_FACTORS = {
  age_under_18: { weight: 2, label: 'Age under 18' },
  age_over_35: { weight: 1.5, label: 'Age over 35' },
  first_pregnancy: { weight: 0.5, label: 'First pregnancy' },
  multiple_pregnancy: { weight: 2.5, label: 'Multiple pregnancy (twins/triplets)' },
  previous_preeclampsia: { weight: 3, label: 'Previous preeclampsia' },
  previous_cesarean: { weight: 1.5, label: 'Previous cesarean section' },
  previous_stillbirth: { weight: 3, label: 'Previous stillbirth' },
  previous_preterm: { weight: 2, label: 'Previous preterm birth' },
  chronic_hypertension: { weight: 2.5, label: 'Chronic hypertension' },
  diabetes: { weight: 2, label: 'Diabetes' },
  gestational_diabetes: { weight: 1.5, label: 'Gestational diabetes' },
  hiv_positive: { weight: 2, label: 'HIV positive' },
  anemia: { weight: 1.5, label: 'Anemia' },
  obesity: { weight: 1.5, label: 'Obesity (BMI > 30)' },
  underweight: { weight: 1, label: 'Underweight (BMI < 18.5)' },
  smoking: { weight: 2, label: 'Smoking' },
  alcohol: { weight: 2, label: 'Alcohol use' },
  late_anc_start: { weight: 1.5, label: 'Late start of antenatal care' },
  missed_appointments: { weight: 1, label: 'Missed antenatal appointments' },
  high_bp_reading: { weight: 2.5, label: 'High blood pressure reading' },
  protein_in_urine: { weight: 2, label: 'Protein in urine' },
  reduced_fetal_movement: { weight: 3, label: 'Reduced fetal movement' },
  vaginal_bleeding: { weight: 3, label: 'Vaginal bleeding' },
};

// Calculate risk score based on factors
function calculateRiskScore(factors) {
  let totalWeight = 0;
  const identifiedFactors = [];

  for (const [key, present] of Object.entries(factors)) {
    if (present && RISK_FACTORS[key]) {
      totalWeight += RISK_FACTORS[key].weight;
      identifiedFactors.push(RISK_FACTORS[key].label);
    }
  }

  // Normalize to 0-1 scale (max possible ~35)
  const normalizedScore = Math.min(totalWeight / 15, 1);

  let riskLevel;
  if (normalizedScore < 0.3) {
    riskLevel = 'LOW';
  } else if (normalizedScore < 0.6) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'HIGH';
  }

  return {
    score: normalizedScore,
    level: riskLevel,
    factors: identifiedFactors,
    confidence: 0.85,
  };
}

// Get user's risk factors from database
async function getUserRiskFactors(userId) {
  const [pregnancy, medicalHistory, appointments, profile] = await Promise.all([
    prisma.pregnancy.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.medicalHistory.findMany({
      where: { user_id: userId },
    }),
    prisma.appointment.findMany({
      where: { user_id: userId },
      orderBy: { scheduled_at: 'desc' },
    }),
    prisma.userProfile.findUnique({
      where: { userId },
    }),
  ]);

  const factors = {};

  // Age-based risks (would need DOB from profile)
  if (profile?.dateOfBirthEncrypted) {
    // Would need to decrypt and calculate age
    // For now, skip or use pregnancy data
  }

  if (pregnancy) {
    factors.first_pregnancy = pregnancy.gravida === 1;
    factors.multiple_pregnancy = pregnancy.isMultiple || false;
    factors.high_bp_reading = pregnancy.isHighRisk || false;

    // Check risk factors stored in pregnancy
    if (pregnancy.riskFactors) {
      const rf = typeof pregnancy.riskFactors === 'string' 
        ? JSON.parse(pregnancy.riskFactors) 
        : pregnancy.riskFactors;
      
      factors.previous_preeclampsia = rf.previousPreeclampsia || false;
      factors.previous_cesarean = rf.previousCesarean || false;
      factors.previous_stillbirth = rf.previousStillbirth || false;
      factors.chronic_hypertension = rf.chronicHypertension || false;
      factors.diabetes = rf.diabetes || false;
      factors.hiv_positive = rf.hivPositive || false;
    }
  }

  // Check medical history
  for (const history of medicalHistory) {
    if (history.condition_type === 'ANEMIA') factors.anemia = true;
    if (history.condition_type === 'DIABETES') factors.diabetes = true;
    if (history.condition_type === 'HYPERTENSION') factors.chronic_hypertension = true;
  }

  // Check appointment attendance
  const missedCount = appointments.filter(a => a.status === 'MISSED').length;
  factors.missed_appointments = missedCount >= 2;

  // Check if ANC started late (after 12 weeks)
  if (pregnancy && appointments.length > 0) {
    const firstAppointment = appointments[appointments.length - 1];
    const pregnancyStart = pregnancy.last_period_date || pregnancy.createdAt;
    const weeksAtFirstVisit = Math.floor(
      (new Date(firstAppointment.scheduled_at) - new Date(pregnancyStart)) / (7 * 24 * 60 * 60 * 1000)
    );
    factors.late_anc_start = weeksAtFirstVisit > 12;
  }

  return factors;
}

// Get risk assessment
router.get('/assessment', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const factors = await getUserRiskFactors(userId);
    const assessment = calculateRiskScore(factors);

    res.json({
      ...assessment,
      assessedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Risk assessment error:', error);
    res.status(500).json({ error: 'Failed to calculate risk assessment' });
  }
});

// Get AI-powered risk analysis with recommendations
router.get('/analysis', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const factors = await getUserRiskFactors(userId);
    const assessment = calculateRiskScore(factors);

    // Get pregnancy details for context
    const pregnancy = await prisma.pregnancy.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    let gestationalWeeks = null;
    if (pregnancy?.last_period_date) {
      gestationalWeeks = Math.floor(
        (Date.now() - new Date(pregnancy.last_period_date).getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
    }

    // Use Claude for personalized recommendations
    const prompt = `Based on this pregnancy risk assessment, provide personalized recommendations:

Risk Level: ${assessment.level}
Risk Score: ${(assessment.score * 100).toFixed(0)}%
Gestational Age: ${gestationalWeeks ? gestationalWeeks + ' weeks' : 'Unknown'}
Identified Risk Factors:
${assessment.factors.length > 0 ? assessment.factors.map(f => '- ' + f).join('\n') : '- No significant risk factors identified'}

Provide a JSON response with:
1. "summary": A brief, reassuring summary of the risk level (2-3 sentences)
2. "recommendations": Array of 3-5 specific, actionable recommendations
3. "warningSignsToWatch": Array of 3-5 warning signs specific to their risk factors
4. "nextSteps": Array of 2-3 immediate next steps

Keep language simple and culturally appropriate for South African/East African users. Be encouraging while emphasizing the importance of regular antenatal care.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    let analysis;
    try {
      // Extract JSON from response
      const text = response.content[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      analysis = null;
    }

    // Fallback if AI parsing fails
    if (!analysis) {
      analysis = {
        summary: assessment.level === 'LOW'
          ? 'Your pregnancy is progressing well with no major concerns identified. Continue your regular antenatal visits and healthy habits.'
          : assessment.level === 'MEDIUM'
          ? 'Some factors need monitoring during your pregnancy. Your healthcare team will work with you to ensure the best outcomes.'
          : 'Your pregnancy requires closer monitoring. Please attend all appointments and contact your healthcare provider if you notice any warning signs.',
        recommendations: [
          'Attend all scheduled antenatal appointments',
          'Take your prenatal vitamins daily',
          'Stay hydrated and eat nutritious foods',
          'Get adequate rest and manage stress',
          'Report any unusual symptoms immediately',
        ],
        warningSignsToWatch: [
          'Severe headache or vision changes',
          'Heavy vaginal bleeding',
          'Severe abdominal pain',
          'Reduced baby movement',
          'High fever',
        ],
        nextSteps: [
          'Schedule your next antenatal visit',
          'Review your birth plan with your healthcare provider',
        ],
      };
    }

    res.json({
      riskLevel: assessment.level,
      riskScore: assessment.score,
      riskFactors: assessment.factors,
      gestationalWeeks,
      ...analysis,
      assessedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Risk analysis error:', error);
    res.status(500).json({ error: 'Failed to generate risk analysis' });
  }
});

// Submit symptom for triage
router.post('/symptom-check', authenticateToken, async (req, res) => {
  try {
    const { symptoms, description } = req.body;
    const userId = req.user.userId;

    // Get pregnancy context
    const pregnancy = await prisma.pregnancy.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    let gestationalWeeks = null;
    if (pregnancy?.last_period_date) {
      gestationalWeeks = Math.floor(
        (Date.now() - new Date(pregnancy.last_period_date).getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
    }

    const prompt = `You are a maternal health triage assistant. Analyze these pregnancy symptoms and provide guidance.

Gestational Age: ${gestationalWeeks ? gestationalWeeks + ' weeks' : 'Unknown'}
Symptoms reported: ${symptoms ? symptoms.join(', ') : 'None specified'}
Description: ${description || 'No additional description'}

Provide a JSON response with:
1. "urgency": One of "EMERGENCY", "URGENT", "ROUTINE", "SELF_CARE"
2. "assessment": Brief assessment of the symptoms (2-3 sentences)
3. "action": What the user should do immediately
4. "possibleCauses": Array of 2-3 possible causes (non-alarming where appropriate)
5. "selfCareAdvice": Array of 2-3 self-care tips (only if urgency is ROUTINE or SELF_CARE)

IMPORTANT: 
- If ANY red flag symptoms (heavy bleeding, severe pain, no fetal movement, seizures, severe headache with vision changes), urgency MUST be "EMERGENCY"
- Always err on the side of caution
- Never diagnose, only triage`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    let triage;
    try {
      const text = response.content[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      triage = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (parseError) {
      console.error('Failed to parse triage response:', parseError);
      // Default to cautious response
      triage = {
        urgency: 'URGENT',
        assessment: 'We could not fully assess your symptoms. Please contact your healthcare provider for proper evaluation.',
        action: 'Contact your healthcare provider or visit your nearest clinic today.',
        possibleCauses: [],
        selfCareAdvice: [],
      };
    }

    res.json({
      ...triage,
      disclaimer: 'This is not a medical diagnosis. Always consult a healthcare professional for proper medical advice.',
    });
  } catch (error) {
    console.error('Symptom check error:', error);
    res.status(500).json({ error: 'Failed to process symptom check' });
  }
});

module.exports = router;
