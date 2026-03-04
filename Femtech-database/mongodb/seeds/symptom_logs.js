// ============================================
// FEMTECH AFRICA - MONGODB SYMPTOM LOG SEEDS
// ============================================

// Run with: mongosh femtech_health < symptom_logs.js

db = db.getSiblingDB('femtech_health');

// Clear existing test data
db.symptom_logs.deleteMany({ userId: { $regex: /^u0000/ } });

// ============================================
// THANDI'S SYMPTOM LOGS (12 weeks pregnant)
// ============================================

const thandiUserId = 'u0000001-0001-4000-8000-000000000001';
const thandiPregnancyId = 'preg0001-0001-4000-8000-000000000001';

db.symptom_logs.insertMany([
  // Day 1 - Morning sickness
  {
    userId: thandiUserId,
    pregnancyId: thandiPregnancyId,
    symptoms: [
      { type: 'nausea', severity: 'moderate', duration: '2 hours', notes: 'Felt sick after breakfast' },
      { type: 'fatigue', severity: 'mild', duration: 'all day' }
    ],
    vitals: {
      weight: 62.5
    },
    mood: 'okay',
    gestationalWeek: 10,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Normal first trimester symptoms. Try eating smaller, frequent meals.',
      actions: ['Eat crackers before getting up', 'Stay hydrated', 'Rest when needed']
    },
    country: 'ZA',
    deviceId: 'device-thandi-001',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  // Day 3
  {
    userId: thandiUserId,
    pregnancyId: thandiPregnancyId,
    symptoms: [
      { type: 'nausea', severity: 'mild', duration: '1 hour' },
      { type: 'breast_tenderness', severity: 'mild' }
    ],
    mood: 'good',
    gestationalWeek: 10,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Normal pregnancy symptoms.',
      actions: ['Continue prenatal vitamins', 'Wear supportive bra']
    },
    country: 'ZA',
    deviceId: 'device-thandi-001',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
  },
  // Day 5
  {
    userId: thandiUserId,
    pregnancyId: thandiPregnancyId,
    symptoms: [
      { type: 'fatigue', severity: 'moderate', duration: 'afternoon' }
    ],
    vitals: {
      bloodPressureSystolic: 110,
      bloodPressureDiastolic: 70,
      weight: 62.7
    },
    mood: 'good',
    gestationalWeek: 11,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Blood pressure and weight are normal. Fatigue is common in first trimester.',
      actions: ['Get adequate rest', 'Take short naps if possible']
    },
    country: 'ZA',
    deviceId: 'device-thandi-001',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  // Day 7
  {
    userId: thandiUserId,
    pregnancyId: thandiPregnancyId,
    symptoms: [
      { type: 'headache', severity: 'mild', duration: '2 hours' },
      { type: 'frequent_urination', severity: 'mild' }
    ],
    mood: 'okay',
    gestationalWeek: 11,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Mild headache and frequent urination are normal. Ensure adequate hydration.',
      actions: ['Drink plenty of water', 'Rest in quiet room for headache']
    },
    country: 'ZA',
    deviceId: 'device-thandi-001',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
  },
  // Day 10
  {
    userId: thandiUserId,
    pregnancyId: thandiPregnancyId,
    symptoms: [
      { type: 'nausea', severity: 'mild' }
    ],
    mood: 'great',
    gestationalWeek: 12,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Nausea is improving as you enter second trimester!',
      actions: ['Continue current routine']
    },
    country: 'ZA',
    deviceId: 'device-thandi-001',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  // Yesterday
  {
    userId: thandiUserId,
    pregnancyId: thandiPregnancyId,
    symptoms: [],
    vitals: {
      bloodPressureSystolic: 112,
      bloodPressureDiastolic: 72,
      weight: 63.0
    },
    mood: 'great',
    gestationalWeek: 12,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'No concerning symptoms. Keep up the good work!',
      actions: ['Continue prenatal vitamins', 'Stay active']
    },
    country: 'ZA',
    deviceId: 'device-thandi-001',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]);

// ============================================
// NOMSA'S SYMPTOM LOGS (32 weeks pregnant)
// ============================================

const nomsaUserId = 'u0000001-0001-4000-8000-000000000002';
const nomsaPregnancyId = 'preg0001-0001-4000-8000-000000000002';

db.symptom_logs.insertMany([
  // Recent logs (third trimester symptoms)
  {
    userId: nomsaUserId,
    pregnancyId: nomsaPregnancyId,
    symptoms: [
      { type: 'back_pain', severity: 'moderate', duration: 'evening', notes: 'Lower back pain after work' },
      { type: 'swelling', severity: 'mild', notes: 'Ankles slightly swollen' }
    ],
    vitals: {
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 76,
      weight: 78.5
    },
    mood: 'okay',
    fetalMovement: 'normal',
    gestationalWeek: 31,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Common third trimester symptoms. Monitor swelling.',
      actions: ['Elevate feet when resting', 'Use pregnancy pillow for back support', 'Monitor swelling - contact clinic if it worsens']
    },
    country: 'ZA',
    deviceId: 'device-nomsa-001',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    userId: nomsaUserId,
    pregnancyId: nomsaPregnancyId,
    symptoms: [
      { type: 'braxton_hicks', severity: 'mild', duration: '30 minutes', notes: 'Irregular tightening' },
      { type: 'heartburn', severity: 'moderate' }
    ],
    mood: 'good',
    fetalMovement: 'normal',
    gestationalWeek: 31,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Braxton Hicks contractions are normal practice contractions.',
      actions: ['Rest and drink water during contractions', 'Avoid spicy foods for heartburn', 'Contact clinic if contractions become regular']
    },
    country: 'ZA',
    deviceId: 'device-nomsa-001',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    userId: nomsaUserId,
    pregnancyId: nomsaPregnancyId,
    symptoms: [
      { type: 'shortness_of_breath', severity: 'mild', notes: 'When climbing stairs' },
      { type: 'insomnia', severity: 'moderate', notes: 'Hard to find comfortable position' }
    ],
    vitals: {
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 78,
      weight: 78.8
    },
    mood: 'okay',
    fetalMovement: 'increased',
    gestationalWeek: 32,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Baby is growing and taking up space! These symptoms are normal.',
      actions: ['Take breaks when climbing stairs', 'Try sleeping on left side', 'Use pillows between knees']
    },
    country: 'ZA',
    deviceId: 'device-nomsa-001',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    userId: nomsaUserId,
    pregnancyId: nomsaPregnancyId,
    symptoms: [
      { type: 'pelvic_pressure', severity: 'mild', notes: 'Baby feels low' }
    ],
    mood: 'good',
    fetalMovement: 'normal',
    gestationalWeek: 32,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Baby may be moving into position. Monitor for regular contractions.',
      actions: ['Rest frequently', 'Continue kick counts', 'Contact clinic if pressure becomes painful']
    },
    country: 'ZA',
    deviceId: 'device-nomsa-001',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]);

// ============================================
// LINDIWE'S SYMPTOM LOGS (24 weeks, HIGH RISK)
// ============================================

const lindiweUserId = 'u0000001-0001-4000-8000-000000000003';
const lindiwePregnancyId = 'preg0001-0001-4000-8000-000000000003';

db.symptom_logs.insertMany([
  // Monitoring gestational diabetes
  {
    userId: lindiweUserId,
    pregnancyId: lindiwePregnancyId,
    symptoms: [
      { type: 'increased_thirst', severity: 'mild' },
      { type: 'fatigue', severity: 'moderate' }
    ],
    vitals: {
      bloodPressureSystolic: 125,
      bloodPressureDiastolic: 82,
      weight: 85.2
    },
    mood: 'okay',
    fetalMovement: 'normal',
    gestationalWeek: 23,
    triageResult: {
      urgency: 'routine',
      recommendation: 'Blood pressure slightly elevated. Continue monitoring glucose levels.',
      actions: ['Follow gestational diabetes diet plan', 'Monitor blood glucose as directed', 'Attend scheduled specialist appointment', 'Rest when fatigued']
    },
    country: 'ZA',
    deviceId: 'device-lindiwe-001',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  // Urgent symptom log
  {
    userId: lindiweUserId,
    pregnancyId: lindiwePregnancyId,
    symptoms: [
      { type: 'headache', severity: 'severe', duration: '3 hours', notes: 'Persistent headache, not relieved by rest' },
      { type: 'visual_disturbances', severity: 'moderate', notes: 'Seeing spots' },
      { type: 'swelling', severity: 'moderate', notes: 'Face and hands swollen' }
    ],
    vitals: {
      bloodPressureSystolic: 145,
      bloodPressureDiastolic: 95
    },
    mood: 'low',
    fetalMovement: 'normal',
    gestationalWeek: 24,
    triageResult: {
      urgency: 'urgent',
      recommendation: 'ATTENTION: These symptoms combined with elevated blood pressure require immediate medical evaluation. Possible preeclampsia signs.',
      actions: ['Contact your healthcare provider IMMEDIATELY', 'Do not take any medication without consulting', 'Lie on your left side', 'Have someone ready to take you to hospital']
    },
    country: 'ZA',
    deviceId: 'device-lindiwe-001',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  // Follow-up after clinic visit
  {
    userId: lindiweUserId,
    pregnancyId: lindiwePregnancyId,
    symptoms: [
      { type: 'headache', severity: 'mild', notes: 'Much better after medication' }
    ],
    vitals: {
      bloodPressureSystolic: 128,
      bloodPressureDiastolic: 82,
      weight: 85.5
    },
    mood: 'okay',
    fetalMovement: 'normal',
    gestationalWeek: 24,
    triageResult: {
      urgency: 'routine',
      recommendation: 'Blood pressure improved after treatment. Continue monitoring closely.',
      actions: ['Take prescribed medication as directed', 'Monitor blood pressure twice daily', 'Report any return of severe headache or visual changes', 'Attend follow-up appointment']
    },
    country: 'ZA',
    deviceId: 'device-lindiwe-001',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  // Recent stable log
  {
    userId: lindiweUserId,
    pregnancyId: lindiwePregnancyId,
    symptoms: [],
    vitals: {
      bloodPressureSystolic: 124,
      bloodPressureDiastolic: 80,
      weight: 85.6
    },
    mood: 'good',
    fetalMovement: 'normal',
    gestationalWeek: 24,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Blood pressure stable. No concerning symptoms today.',
      actions: ['Continue current medication', 'Keep next appointment', 'Continue daily monitoring']
    },
    country: 'ZA',
    deviceId: 'device-lindiwe-001',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]);

// ============================================
// WANJIKU'S SYMPTOM LOGS (Kenya, 20 weeks)
// ============================================

const wanjikuUserId = 'u0000002-0001-4000-8000-000000000001';
const wanjikuPregnancyId = 'preg0002-0001-4000-8000-000000000001';

db.symptom_logs.insertMany([
  {
    userId: wanjikuUserId,
    pregnancyId: wanjikuPregnancyId,
    symptoms: [
      { type: 'round_ligament_pain', severity: 'mild', notes: 'Sharp pain when standing quickly' }
    ],
    mood: 'good',
    fetalMovement: 'normal',
    gestationalWeek: 19,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Round ligament pain is normal as your uterus grows.',
      actions: ['Move slowly when changing positions', 'Use a pregnancy support belt if needed']
    },
    country: 'KE',
    deviceId: 'device-wanjiku-001',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    userId: wanjikuUserId,
    pregnancyId: wanjikuPregnancyId,
    symptoms: [
      { type: 'nasal_congestion', severity: 'mild' },
      { type: 'skin_changes', severity: 'mild', notes: 'Darker patches on face' }
    ],
    vitals: {
      weight: 65.2
    },
    mood: 'great',
    fetalMovement: 'normal',
    gestationalWeek: 20,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Pregnancy rhinitis and melasma are common. Both usually resolve after delivery.',
      actions: ['Use saline nasal spray', 'Use sunscreen to prevent further darkening', 'Stay hydrated']
    },
    country: 'KE',
    deviceId: 'device-wanjiku-001',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    userId: wanjikuUserId,
    pregnancyId: wanjikuPregnancyId,
    symptoms: [],
    vitals: {
      bloodPressureSystolic: 108,
      bloodPressureDiastolic: 68,
      weight: 65.4
    },
    mood: 'great',
    fetalMovement: 'increased',
    gestationalWeek: 20,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Excellent! Baby is becoming more active - you might be feeling those first kicks!',
      actions: ['Start paying attention to movement patterns', 'Enjoy this special time!']
    },
    country: 'KE',
    deviceId: 'device-wanjiku-001',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]);

// ============================================
// ADAEZE'S SYMPTOM LOGS (Nigeria, 16 weeks)
// ============================================

const adaezeUserId = 'u0000003-0001-4000-8000-000000000001';
const adaezePregnancyId = 'preg0003-0001-4000-8000-000000000001';

db.symptom_logs.insertMany([
  {
    userId: adaezeUserId,
    pregnancyId: adaezePregnancyId,
    symptoms: [
      { type: 'increased_appetite', severity: 'mild', notes: 'Eating more than usual' },
      { type: 'food_cravings', severity: 'mild', notes: 'Craving fruits' }
    ],
    mood: 'great',
    gestationalWeek: 15,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Second trimester often brings increased appetite and energy!',
      actions: ['Eat nutritious foods', 'Include protein with each meal', 'Enjoy healthy cravings']
    },
    country: 'NG',
    deviceId: 'device-adaeze-001',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    userId: adaezeUserId,
    pregnancyId: adaezePregnancyId,
    symptoms: [
      { type: 'mild_cramping', severity: 'mild', duration: '10 minutes', notes: 'Mild stretching sensation' }
    ],
    vitals: {
      weight: 58.5
    },
    mood: 'good',
    gestationalWeek: 16,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Mild cramping without bleeding is usually normal uterine stretching.',
      actions: ['Rest if cramping occurs', 'Stay hydrated', 'Contact clinic if cramping becomes severe or is accompanied by bleeding']
    },
    country: 'NG',
    deviceId: 'device-adaeze-001',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    userId: adaezeUserId,
    pregnancyId: adaezePregnancyId,
    symptoms: [],
    vitals: {
      bloodPressureSystolic: 110,
      bloodPressureDiastolic: 70,
      weight: 58.7
    },
    mood: 'great',
    gestationalWeek: 16,
    triageResult: {
      urgency: 'self_care',
      recommendation: 'Everything looks great! You\'re in the honeymoon phase of pregnancy.',
      actions: ['Continue prenatal vitamins', 'Stay active', 'Prepare for anatomy scan coming up']
    },
    country: 'NG',
    deviceId: 'device-adaeze-001',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]);

// Create indexes
db.symptom_logs.createIndex({ userId: 1, createdAt: -1 });
db.symptom_logs.createIndex({ pregnancyId: 1, createdAt: -1 });
db.symptom_logs.createIndex({ 'symptoms.type': 1 });
db.symptom_logs.createIndex({ 'triageResult.urgency': 1 });
db.symptom_logs.createIndex({ country: 1, createdAt: -1 });

print('Symptom logs seed data inserted successfully!');
print('Total documents: ' + db.symptom_logs.countDocuments());
