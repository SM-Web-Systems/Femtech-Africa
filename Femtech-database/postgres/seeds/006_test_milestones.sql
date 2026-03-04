-- ============================================
-- FEMTECH AFRICA - TEST USER MILESTONES
-- ============================================

-- Helper: Get milestone definition IDs (assumes 001_milestone_definitions.sql has been run)
-- We'll use direct references to milestone codes

-- ============================================
-- THANDI'S MILESTONES (12 weeks, first pregnancy)
-- ============================================

-- Completed milestones
INSERT INTO user_milestones (id, user_id, pregnancy_id, milestone_definition_id, status, progress_percent, progress_data, unlocked_at, started_at, completed_at, verified_at, verified_by, reward_amount, claim_number, created_at, updated_at)
SELECT
  'um000001-0001-' || LPAD(ROW_NUMBER() OVER ()::text, 4, '0') || '-8000-000000000001',
  'u0000001-0001-4000-8000-000000000001',
  'preg0001-0001-4000-8000-000000000001',
  md.id,
  'completed',
  100,
  '{"verified": true}'::jsonb,
  NOW() - INTERVAL '50 days',
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '40 days',
  NOW() - INTERVAL '40 days',
  'v0000001-0001-4000-8000-000000000001',
  md.reward_amount,
  1,
  NOW() - INTERVAL '50 days',
  NOW()
FROM milestone_definitions md
WHERE md.code IN ('REGISTRATION', 'FIRST_CHECKIN', 'ANC_VISIT_1')
AND md.is_active = true;

-- In-progress milestones
INSERT INTO user_milestones (id, user_id, pregnancy_id, milestone_definition_id, status, progress_percent, progress_data, unlocked_at, started_at, reward_amount, claim_number, created_at, updated_at)
SELECT
  'um000001-0001-' || LPAD((3 + ROW_NUMBER() OVER ())::text, 4, '0') || '-8000-000000000001',
  'u0000001-0001-4000-8000-000000000001',
  'preg0001-0001-4000-8000-000000000001',
  md.id,
  'in_progress',
  CASE md.code
    WHEN 'CHECKIN_7DAY' THEN 71  -- 5 of 7 days
    WHEN 'EDUCATION_QUIZ_1' THEN 50
    ELSE 30
  END,
  CASE md.code
    WHEN 'CHECKIN_7DAY' THEN '{"days_completed": 5, "current_streak": 5}'::jsonb
    WHEN 'EDUCATION_QUIZ_1' THEN '{"quizzes_started": 1, "quizzes_completed": 0}'::jsonb
    ELSE '{}'::jsonb
  END,
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '25 days',
  md.reward_amount,
  1,
  NOW() - INTERVAL '30 days',
  NOW()
FROM milestone_definitions md
WHERE md.code IN ('CHECKIN_7DAY', 'EDUCATION_QUIZ_1')
AND md.is_active = true;

-- Available milestones (unlocked but not started)
INSERT INTO user_milestones (id, user_id, pregnancy_id, milestone_definition_id, status, progress_percent, unlocked_at, reward_amount, claim_number, created_at, updated_at)
SELECT
  'um000001-0001-' || LPAD((5 + ROW_NUMBER() OVER ())::text, 4, '0') || '-8000-000000000001',
  'u0000001-0001-4000-8000-000000000001',
  'preg0001-0001-4000-8000-000000000001',
  md.id,
  'available',
  0,
  NOW() - INTERVAL '10 days',
  md.reward_amount,
  1,
  NOW() - INTERVAL '10 days',
  NOW()
FROM milestone_definitions md
WHERE md.code IN ('ULTRASOUND_1', 'LAB_BLOOD_TYPE', 'SUPPORT_CIRCLE_1')
AND md.is_active = true;

-- Locked milestones (future gestational weeks)
INSERT INTO user_milestones (id, user_id, pregnancy_id, milestone_definition_id, status, progress_percent, reward_amount, claim_number, created_at, updated_at)
SELECT
  'um000001-0001-' || LPAD((8 + ROW_NUMBER() OVER ())::text, 4, '0') || '-8000-000000000001',
  'u0000001-0001-4000-8000-000000000001',
  'preg0001-0001-4000-8000-000000000001',
  md.id,
  'locked',
  0,
  md.reward_amount,
  1,
  NOW() - INTERVAL '50 days',
  NOW()
FROM milestone_definitions md
WHERE md.code IN ('ANATOMY_SCAN', 'ANC_VISIT_3', 'ANC_VISIT_4', 'KICK_COUNTER_5')
AND md.is_active = true;

-- ============================================
-- NOMSA'S MILESTONES (32 weeks, second pregnancy)
-- ============================================

-- Many completed milestones (advanced pregnancy)
INSERT INTO user_milestones (id, user_id, pregnancy_id, milestone_definition_id, status, progress_percent, progress_data, unlocked_at, started_at, completed_at, verified_at, verified_by, reward_amount, claim_number, created_at, updated_at)
SELECT
  'um000002-0001-' || LPAD(ROW_NUMBER() OVER ()::text, 4, '0') || '-8000-000000000001',
  'u0000001-0001-4000-8000-000000000002',
  'preg0001-0001-4000-8000-000000000002',
  md.id,
  'completed',
  100,
  '{"verified": true}'::jsonb,
  NOW() - INTERVAL '140 days',
  NOW() - INTERVAL '135 days',
  NOW() - INTERVAL '130 days' + (ROW_NUMBER() OVER () * INTERVAL '10 days'),
  NOW() - INTERVAL '130 days' + (ROW_NUMBER() OVER () * INTERVAL '10 days'),
  'v0000001-0001-4000-8000-000000000002',
  md.reward_amount,
  1,
  NOW() - INTERVAL '140 days',
  NOW()
FROM milestone_definitions md
WHERE md.code IN (
  'REGISTRATION', 'FIRST_CHECKIN', 'CHECKIN_7DAY', 'CHECKIN_30DAY',
  'ANC_VISIT_1', 'ANC_VISIT_2', 'ANC_VISIT_3',
  'ULTRASOUND_1', 'ANATOMY_SCAN',
  'LAB_BLOOD_TYPE', 'LAB_HIV',
  'EDUCATION_QUIZ_1', 'EDUCATION_QUIZ_2',
  'KICK_COUNTER_5', 'KICK_COUNTER_10',
  'SUPPORT_CIRCLE_1'
)
AND md.is_active = true;

-- Available milestones for third trimester
INSERT INTO user_milestones (id, user_id, pregnancy_id, milestone_definition_id, status, progress_percent, unlocked_at, reward_amount, claim_number, created_at, updated_at)
SELECT
  'um000002-0001-' || LPAD((16 + ROW_NUMBER() OVER ())::text, 4, '0') || '-8000-000000000001',
  'u0000001-0001-4000-8000-000000000002',
  'preg0001-0001-4000-8000-000000000002',
  md.id,
  'available',
  0,
  NOW() - INTERVAL '5 days',
  md.reward_amount,
  1,
  NOW() - INTERVAL '5 days',
  NOW()
FROM milestone_definitions md
WHERE md.code IN ('ANC_VISIT_4', 'ULTRASOUND_3', 'BIRTH_PLAN', 'HOSPITAL_BAG')
AND md.is_active = true;

-- ============================================
-- WANJIKU'S MILESTONES (Kenya, 20 weeks)
-- ============================================

INSERT INTO user_milestones (id, user_id, pregnancy_id, milestone_definition_id, status, progress_percent, progress_data, unlocked_at, started_at, completed_at, verified_at, verified_by, reward_amount, claim_number, created_at, updated_at)
SELECT
  'um000003-0001-' || LPAD(ROW_NUMBER() OVER ()::text, 4, '0') || '-8000-000000000001',
  'u0000002-0001-4000-8000-000000000001',
  'preg0002-0001-4000-8000-000000000001',
  md.id,
  'completed',
  100,
  '{"verified": true}'::jsonb,
  NOW() - INTERVAL '80 days',
  NOW() - INTERVAL '75 days',
  NOW() - INTERVAL '70 days' + (ROW_NUMBER() OVER () * INTERVAL '7 days'),
  NOW() - INTERVAL '70 days' + (ROW_NUMBER() OVER () * INTERVAL '7 days'),
  'v0000002-0001-4000-8000-000000000001',
  md.reward_amount,
  1,
  NOW() - INTERVAL '80 days',
  NOW()
FROM milestone_definitions md
WHERE md.code IN ('REGISTRATION', 'FIRST_CHECKIN', 'CHECKIN_7DAY', 'ANC_VISIT_1', 'ANC_VISIT_2', 'ULTRASOUND_1', 'LAB_BLOOD_TYPE')
AND md.is_active = true;

-- ============================================
-- TOKEN TRANSACTIONS FOR TEST USERS
-- ============================================

-- Thandi's token transactions (milestone rewards)
INSERT INTO token_transactions (id, user_id, type, status, amount, balance_before, balance_after, stellar_tx_hash, stellar_ledger, milestone_id, fee_paid, fee_sponsored, created_at, confirmed_at)
VALUES
-- Registration reward
(
  'tx000001-0001-4000-8000-000000000001',
  'u0000001-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  500000000, -- 50 tokens (7 decimals)
  0,
  500000000,
  'test_stellar_hash_thandi_001',
  12345001,
  'um000001-0001-0001-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '40 days',
  NOW() - INTERVAL '40 days'
),
-- First check-in reward
(
  'tx000001-0001-4000-8000-000000000002',
  'u0000001-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  200000000, -- 20 tokens
  500000000,
  700000000,
  'test_stellar_hash_thandi_002',
  12345002,
  'um000001-0001-0002-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '38 days',
  NOW() - INTERVAL '38 days'
),
-- ANC Visit 1 reward
(
  'tx000001-0001-4000-8000-000000000003',
  'u0000001-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  1000000000, -- 100 tokens
  700000000,
  1700000000,
  'test_stellar_hash_thandi_003',
  12345003,
  'um000001-0001-0003-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '35 days',
  NOW() - INTERVAL '35 days'
);

-- Nomsa's token transactions (many milestones completed)
INSERT INTO token_transactions (id, user_id, type, status, amount, balance_before, balance_after, stellar_tx_hash, stellar_ledger, milestone_id, fee_paid, fee_sponsored, created_at, confirmed_at)
VALUES
-- Registration
(
  'tx000002-0001-4000-8000-000000000001',
  'u0000001-0001-4000-8000-000000000002',
  'mint_milestone',
  'confirmed',
  500000000,
  0,
  500000000,
  'test_stellar_hash_nomsa_001',
  12340001,
  'um000002-0001-0001-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '130 days',
  NOW() - INTERVAL '130 days'
),
-- First check-in
(
  'tx000002-0001-4000-8000-000000000002',
  'u0000001-0001-4000-8000-000000000002',
  'mint_milestone',
  'confirmed',
  200000000,
  500000000,
  700000000,
  'test_stellar_hash_nomsa_002',
  12340002,
  'um000002-0001-0002-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '128 days',
  NOW() - INTERVAL '128 days'
),
-- 7-day streak
(
  'tx000002-0001-4000-8000-000000000003',
  'u0000001-0001-4000-8000-000000000002',
  'mint_milestone',
  'confirmed',
  300000000,
  700000000,
  1000000000,
  'test_stellar_hash_nomsa_003',
  12340003,
  'um000002-0001-0003-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '121 days',
  NOW() - INTERVAL '121 days'
),
-- 30-day streak
(
  'tx000002-0001-4000-8000-000000000004',
  'u0000001-0001-4000-8000-000000000002',
  'mint_milestone',
  'confirmed',
  500000000,
  1000000000,
  1500000000,
  'test_stellar_hash_nomsa_004',
  12340004,
  'um000002-0001-0004-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '98 days',
  NOW() - INTERVAL '98 days'
),
-- ANC Visit 1
(
  'tx000002-0001-4000-8000-000000000005',
  'u0000001-0001-4000-8000-000000000002',
  'mint_milestone',
  'confirmed',
  1000000000,
  1500000000,
  2500000000,
  'test_stellar_hash_nomsa_005',
  12340005,
  'um000002-0001-0005-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '115 days',
  NOW() - INTERVAL '115 days'
),
-- ANC Visit 2
(
  'tx000002-0001-4000-8000-000000000006',
  'u0000001-0001-4000-8000-000000000002',
  'mint_milestone',
  'confirmed',
  1000000000,
  2500000000,
  3500000000,
  'test_stellar_hash_nomsa_006',
  12340006,
  'um000002-0001-0006-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '85 days',
  NOW() - INTERVAL '85 days'
),
-- ANC Visit 3
(
  'tx000002-0001-4000-8000-000000000007',
  'u0000001-0001-4000-8000-000000000002',
  'mint_milestone',
  'confirmed',
  1000000000,
  3500000000,
  4500000000,
  'test_stellar_hash_nomsa_007',
  12340007,
  'um000002-0001-0007-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '55 days',
  NOW() - INTERVAL '55 days'
),
-- Ultrasound 1
(
  'tx000002-0001-4000-8000-000000000008',
  'u0000001-0001-4000-8000-000000000002',
  'mint_milestone',
  'confirmed',
  750000000,
  4500000000,
  5250000000,
  'test_stellar_hash_nomsa_008',
  12340008,
  'um000002-0001-0008-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '110 days',
  NOW() - INTERVAL '110 days'
),
-- Anatomy Scan
(
  'tx000002-0001-4000-8000-000000000009',
  'u0000001-0001-4000-8000-000000000002',
  'mint_milestone',
  'confirmed',
  1000000000,
  5250000000,
  6250000000,
  'test_stellar_hash_nomsa_009',
  12340009,
  'um000002-0001-0009-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '70 days',
  NOW() - INTERVAL '70 days'
),
-- Lab tests
(
  'tx000002-0001-4000-8000-000000000010',
  'u0000001-0001-4000-8000-000000000002',
  'mint_milestone',
  'confirmed',
  500000000,
  6250000000,
  6750000000,
  'test_stellar_hash_nomsa_010',
  12340010,
  'um000002-0001-0010-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '100 days',
  NOW() - INTERVAL '100 days'
),
-- Education quizzes
(
  'tx000002-0001-4000-8000-000000000011',
  'u0000001-0001-4000-8000-000000000002',
  'mint_milestone',
  'confirmed',
  200000000,
  6750000000,
  6950000000,
  'test_stellar_hash_nomsa_011',
  12340011,
  'um000002-0001-0012-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '90 days',
  NOW() - INTERVAL '90 days'
),
-- Kick counter milestones
(
  'tx000002-0001-4000-8000-000000000012',
  'u0000001-0001-4000-8000-000000000002',
  'mint_milestone',
  'confirmed',
  250000000,
  6950000000,
  7200000000,
  'test_stellar_hash_nomsa_012',
  12340012,
  'um000002-0001-0014-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '45 days'
);

-- Nomsa's redemption (used some tokens)
INSERT INTO token_transactions (id, user_id, type, status, amount, balance_before, balance_after, stellar_tx_hash, stellar_ledger, redemption_id, fee_paid, fee_sponsored, created_at, confirmed_at)
VALUES
(
  'tx000002-0001-4000-8000-000000000020',
  'u0000001-0001-4000-8000-000000000002',
  'burn_redemption',
  'confirmed',
  2500000000, -- 250 tokens for grocery voucher
  7200000000,
  4700000000,
  'test_stellar_hash_nomsa_burn_001',
  12350001,
  'red00001-0001-4000-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '20 days'
);

-- Wanjiku's token transactions (Kenya)
INSERT INTO token_transactions (id, user_id, type, status, amount, balance_before, balance_after, stellar_tx_hash, stellar_ledger, milestone_id, fee_paid, fee_sponsored, created_at, confirmed_at)
VALUES
(
  'tx000003-0001-4000-8000-000000000001',
  'u0000002-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  500000000,
  0,
  500000000,
  'test_stellar_hash_wanjiku_001',
  12360001,
  'um000003-0001-0001-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '70 days',
  NOW() - INTERVAL '70 days'
),
(
  'tx000003-0001-4000-8000-000000000002',
  'u0000002-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  200000000,
  500000000,
  700000000,
  'test_stellar_hash_wanjiku_002',
  12360002,
  'um000003-0001-0002-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '68 days',
  NOW() - INTERVAL '68 days'
),
(
  'tx000003-0001-4000-8000-000000000003',
  'u0000002-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  300000000,
  700000000,
  1000000000,
  'test_stellar_hash_wanjiku_003',
  12360003,
  'um000003-0001-0003-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '61 days',
  NOW() - INTERVAL '61 days'
),
(
  'tx000003-0001-4000-8000-000000000004',
  'u0000002-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  1000000000,
  1000000000,
  2000000000,
  'test_stellar_hash_wanjiku_004',
  12360004,
  'um000003-0001-0004-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '55 days',
  NOW() - INTERVAL '55 days'
),
(
  'tx000003-0001-4000-8000-000000000005',
  'u0000002-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  1000000000,
  2000000000,
  3000000000,
  'test_stellar_hash_wanjiku_005',
  12360005,
  'um000003-0001-0005-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '40 days',
  NOW() - INTERVAL '40 days'
),
(
  'tx000003-0001-4000-8000-000000000006',
  'u0000002-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  750000000,
  3000000000,
  3750000000,
  'test_stellar_hash_wanjiku_006',
  12360006,
  'um000003-0001-0006-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '35 days',
  NOW() - INTERVAL '35 days'
),
(
  'tx000003-0001-4000-8000-000000000007',
  'u0000002-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  500000000,
  3750000000,
  4250000000,
  'test_stellar_hash_wanjiku_007',
  12360007,
  'um000003-0001-0007-8000-000000000001',
  1000,
  true,
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '30 days'
);

-- Adaeze's token transactions (Nigeria)
INSERT INTO token_transactions (id, user_id, type, status, amount, balance_before, balance_after, stellar_tx_hash, stellar_ledger, milestone_id, fee_paid, fee_sponsored, created_at, confirmed_at)
VALUES
(
  'tx000004-0001-4000-8000-000000000001',
  'u0000003-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  500000000,
  0,
  500000000,
  'test_stellar_hash_adaeze_001',
  12370001,
  NULL,
  1000,
  true,
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '60 days'
),
(
  'tx000004-0001-4000-8000-000000000002',
  'u0000003-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  200000000,
  500000000,
  700000000,
  'test_stellar_hash_adaeze_002',
  12370002,
  NULL,
  1000,
  true,
  NOW() - INTERVAL '58 days',
  NOW() - INTERVAL '58 days'
),
(
  'tx000004-0001-4000-8000-000000000003',
  'u0000003-0001-4000-8000-000000000001',
  'mint_milestone',
  'confirmed',
  1000000000,
  700000000,
  1700000000,
  'test_stellar_hash_adaeze_003',
  12370003,
  NULL,
  1000,
  true,
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '45 days'
);