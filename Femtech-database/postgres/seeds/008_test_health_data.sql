-- ============================================
-- FEMTECH AFRICA - TEST APPOINTMENTS
-- ============================================

-- Thandi's appointments (12 weeks pregnant)
INSERT INTO appointments (id, pregnancy_id, facility_id, type, status, scheduled_date, scheduled_time, actual_date, reminder_sent, verified_by, verification_hash, created_at, updated_at)
VALUES
-- Completed first ANC visit
(
  'apt00001-0001-4000-8000-000000000001',
  'preg0001-0001-4000-8000-000000000001',
  'f0000001-0001-4000-8000-000000000001',
  'anc_visit',
  'completed',
  CURRENT_DATE - INTERVAL '35 days',
  '09:00:00',
  CURRENT_DATE - INTERVAL '35 days',
  true,
  'v0000001-0001-4000-8000-000000000001',
  'hash_apt_thandi_001',
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '35 days'
),
-- Upcoming ultrasound
(
  'apt00001-0001-4000-8000-000000000002',
  'preg0001-0001-4000-8000-000000000001',
  'f0000001-0001-4000-8000-000000000004', -- Netcare private hospital
  'ultrasound',
  'scheduled',
  CURRENT_DATE + INTERVAL '5 days',
  '10:30:00',
  NULL,
  false,
  NULL,
  NULL,
  NOW() - INTERVAL '10 days',
  NOW()
),
-- Upcoming second ANC visit
(
  'apt00001-0001-4000-8000-000000000003',
  'preg0001-0001-4000-8000-000000000001',
  'f0000001-0001-4000-8000-000000000001',
  'anc_visit',
  'scheduled',
  CURRENT_DATE + INTERVAL '14 days',
  '08:30:00',
  NULL,
  false,
  NULL,
  NULL,
  NOW() - INTERVAL '5 days',
  NOW()
);

-- Nomsa's appointments (32 weeks - many completed)
INSERT INTO appointments (id, pregnancy_id, facility_id, type, status, scheduled_date, scheduled_time, actual_date, reminder_sent, verified_by, verification_hash, created_at, updated_at)
VALUES
-- ANC visits (completed)
(
  'apt00002-0001-4000-8000-000000000001',
  'preg0001-0001-4000-8000-000000000002',
  'f0000001-0001-4000-8000-000000000002',
  'anc_visit',
  'completed',
  CURRENT_DATE - INTERVAL '120 days',
  '09:00:00',
  CURRENT_DATE - INTERVAL '120 days',
  true,
  'v0000001-0001-4000-8000-000000000002',
  'hash_apt_nomsa_001',
  NOW() - INTERVAL '130 days',
  NOW() - INTERVAL '120 days'
),
(
  'apt00002-0001-4000-8000-000000000002',
  'preg0001-0001-4000-8000-000000000002',
  'f0000001-0001-4000-8000-000000000002',
  'anc_visit',
  'completed',
  CURRENT_DATE - INTERVAL '90 days',
  '09:30:00',
  CURRENT_DATE - INTERVAL '90 days',
  true,
  'v0000001-0001-4000-8000-000000000002',
  'hash_apt_nomsa_002',
  NOW() - INTERVAL '100 days',
  NOW() - INTERVAL '90 days'
),
(
  'apt00002-0001-4000-8000-000000000003',
  'preg0001-0001-4000-8000-000000000002',
  'f0000001-0001-4000-8000-000000000002',
  'anc_visit',
  'completed',
  CURRENT_DATE - INTERVAL '60 days',
  '10:00:00',
  CURRENT_DATE - INTERVAL '60 days',
  true,
  'v0000001-0001-4000-8000-000000000002',
  'hash_apt_nomsa_003',
  NOW() - INTERVAL '70 days',
  NOW() - INTERVAL '60 days'
),
-- Ultrasounds (completed)
(
  'apt00002-0001-4000-8000-000000000004',
  'preg0001-0001-4000-8000-000000000002',
  'f0000001-0001-4000-8000-000000000002',
  'ultrasound',
  'completed',
  CURRENT_DATE - INTERVAL '110 days',
  '11:00:00',
  CURRENT_DATE - INTERVAL '110 days',
  true,
  'v0000001-0001-4000-8000-000000000002',
  'hash_apt_nomsa_004',
  NOW() - INTERVAL '120 days',
  NOW() - INTERVAL '110 days'
),
(
  'apt00002-0001-4000-8000-000000000005',
  'preg0001-0001-4000-8000-000000000002',
  'f0000001-0001-4000-8000-000000000002',
  'ultrasound',
  'completed',
  CURRENT_DATE - INTERVAL '70 days',
  '14:00:00',
  CURRENT_DATE - INTERVAL '70 days',
  true,
  'v0000001-0001-4000-8000-000000000002',
  'hash_apt_nomsa_005',
  NOW() - INTERVAL '80 days',
  NOW() - INTERVAL '70 days'
),
-- Upcoming fourth ANC
(
  'apt00002-0001-4000-8000-000000000006',
  'preg0001-0001-4000-8000-000000000002',
  'f0000001-0001-4000-8000-000000000002',
  'anc_visit',
  'scheduled',
  CURRENT_DATE + INTERVAL '7 days',
  '09:00:00',
  NULL,
  false,
  NULL,
  NULL,
  NOW() - INTERVAL '3 days',
  NOW()
),
-- Third trimester ultrasound scheduled
(
  'apt00002-0001-4000-8000-000000000007',
  'preg0001-0001-4000-8000-000000000002',
  'f0000001-0001-4000-8000-000000000002',
  'ultrasound',
  'scheduled',
  CURRENT_DATE + INTERVAL '10 days',
  '15:00:00',
  NULL,
  false,
  NULL,
  NULL,
  NOW() - INTERVAL '2 days',
  NOW()
);

-- Lindiwe's appointments (high risk - more frequent)
INSERT INTO appointments (id, pregnancy_id, facility_id, type, status, scheduled_date, scheduled_time, actual_date, reminder_sent, verified_by, verification_hash, created_at, updated_at)
VALUES
(
  'apt00003-0001-4000-8000-000000000001',
  'preg0001-0001-4000-8000-000000000003',
  'f0000001-0001-4000-8000-000000000003', -- Groote Schuur (high risk)
  'anc_visit',
  'completed',
  CURRENT_DATE - INTERVAL '50 days',
  '08:00:00',
  CURRENT_DATE - INTERVAL '50 days',
  true,
  'v0000001-0001-4000-8000-000000000001',
  'hash_apt_lindiwe_001',
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '50 days'
),
(
  'apt00003-0001-4000-8000-000000000002',
  'preg0001-0001-4000-8000-000000000003',
  'f0000001-0001-4000-8000-000000000003',
  'specialist',
  'completed',
  CURRENT_DATE - INTERVAL '40 days',
  '10:00:00',
  CURRENT_DATE - INTERVAL '40 days',
  true,
  'v0000001-0001-4000-8000-000000000001',
  'hash_apt_lindiwe_002',
  NOW() - INTERVAL '50 days',
  NOW() - INTERVAL '40 days'
),
(
  'apt00003-0001-4000-8000-000000000003',
  'preg0001-0001-4000-8000-000000000003',
  'f0000001-0001-4000-8000-000000000003',
  'anc_visit',
  'scheduled',
  CURRENT_DATE + INTERVAL '3 days',
  '08:30:00',
  NULL,
  true, -- Reminder already sent
  NULL,
  NULL,
  NOW() - INTERVAL '7 days',
  NOW()
);

-- Kenya appointments
INSERT INTO appointments (id, pregnancy_id, facility_id, type, status, scheduled_date, scheduled_time, actual_date, reminder_sent, verified_by, verification_hash, created_at, updated_at)
VALUES
(
  'apt00004-0001-4000-8000-000000000001',
  'preg0002-0001-4000-8000-000000000001',
  'f0000002-0001-4000-8000-000000000001',
  'anc_visit',
  'completed',
  CURRENT_DATE - INTERVAL '55 days',
  '09:00:00',
  CURRENT_DATE - INTERVAL '55 days',
  true,
  'v0000002-0001-4000-8000-000000000001',
  'hash_apt_wanjiku_001',
  NOW() - INTERVAL '65 days',
  NOW() - INTERVAL '55 days'
),
(
  'apt00004-0001-4000-8000-000000000002',
  'preg0002-0001-4000-8000-000000000001',
  'f0000002-0001-4000-8000-000000000001',
  'anc_visit',
  'completed',
  CURRENT_DATE - INTERVAL '35 days',
  '10:00:00',
  CURRENT_DATE - INTERVAL '35 days',
  true,
  'v0000002-0001-4000-8000-000000000001',
  'hash_apt_wanjiku_002',
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '35 days'
),
(
  'apt00004-0001-4000-8000-000000000003',
  'preg0002-0001-4000-8000-000000000001',
  'f0000002-0001-4000-8000-000000000003', -- Private hospital for anatomy scan
  'ultrasound',
  'scheduled',
  CURRENT_DATE + INTERVAL '4 days',
  '11:00:00',
  NULL,
  false,
  NULL,
  NULL,
  NOW() - INTERVAL '7 days',
  NOW()
);

-- ============================================
-- FEMTECH AFRICA - TEST KICK SESSIONS
-- ============================================

-- Nomsa's kick sessions (third trimester, many sessions)
INSERT INTO kick_sessions (id, pregnancy_id, started_at, ended_at, kick_count, target_kicks, duration_minutes, reached_target, alert_triggered, notes, created_at)
VALUES
-- Successful sessions
(
  'ks000001-0001-4000-8000-000000000001',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '14 days' - INTERVAL '2 hours',
  NOW() - INTERVAL '14 days' - INTERVAL '1 hour' - INTERVAL '42 minutes',
  10,
  10,
  18,
  true,
  false,
  'Morning kick count - baby very active!',
  NOW() - INTERVAL '14 days'
),
(
  'ks000001-0001-4000-8000-000000000002',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '13 days' - INTERVAL '3 hours',
  NOW() - INTERVAL '13 days' - INTERVAL '2 hours' - INTERVAL '35 minutes',
  10,
  10,
  25,
  true,
  false,
  NULL,
  NOW() - INTERVAL '13 days'
),
(
  'ks000001-0001-4000-8000-000000000003',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '12 days' - INTERVAL '4 hours',
  NOW() - INTERVAL '12 days' - INTERVAL '3 hours' - INTERVAL '48 minutes',
  12,
  10,
  12,
  true,
  false,
  'Very active after lunch',
  NOW() - INTERVAL '12 days'
),
(
  'ks000001-0001-4000-8000-000000000004',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '11 days' - INTERVAL '2 hours',
  NOW() - INTERVAL '11 days' - INTERVAL '1 hour' - INTERVAL '30 minutes',
  10,
  10,
  30,
  true,
  false,
  NULL,
  NOW() - INTERVAL '11 days'
),
(
  'ks000001-0001-4000-8000-000000000005',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '10 days' - INTERVAL '5 hours',
  NOW() - INTERVAL '10 days' - INTERVAL '4 hours' - INTERVAL '20 minutes',
  10,
  10,
  40,
  true,
  false,
  'Took a bit longer today but reached target',
  NOW() - INTERVAL '10 days'
),
(
  'ks000001-0001-4000-8000-000000000006',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '9 days' - INTERVAL '3 hours',
  NOW() - INTERVAL '9 days' - INTERVAL '2 hours' - INTERVAL '45 minutes',
  11,
  10,
  15,
  true,
  false,
  NULL,
  NOW() - INTERVAL '9 days'
),
(
  'ks000001-0001-4000-8000-000000000007',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '8 days' - INTERVAL '2 hours',
  NOW() - INTERVAL '8 days' - INTERVAL '1 hour' - INTERVAL '38 minutes',
  10,
  10,
  22,
  true,
  false,
  NULL,
  NOW() - INTERVAL '8 days'
),
(
  'ks000001-0001-4000-8000-000000000008',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '7 days' - INTERVAL '4 hours',
  NOW() - INTERVAL '7 days' - INTERVAL '3 hours' - INTERVAL '25 minutes',
  10,
  10,
  35,
  true,
  false,
  NULL,
  NOW() - INTERVAL '7 days'
),
(
  'ks000001-0001-4000-8000-000000000009',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '6 days' - INTERVAL '2 hours',
  NOW() - INTERVAL '6 days' - INTERVAL '1 hour' - INTERVAL '50 minutes',
  10,
  10,
  10,
  true,
  false,
  'Super quick today!',
  NOW() - INTERVAL '6 days'
),
(
  'ks000001-0001-4000-8000-000000000010',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '5 days' - INTERVAL '3 hours',
  NOW() - INTERVAL '5 days' - INTERVAL '2 hours' - INTERVAL '40 minutes',
  10,
  10,
  20,
  true,
  false,
  NULL,
  NOW() - INTERVAL '5 days'
),
-- Session with fewer kicks (monitoring)
(
  'ks000001-0001-4000-8000-000000000011',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '4 days' - INTERVAL '2 hours',
  NOW() - INTERVAL '4 days' - INTERVAL '1 hour',
  7,
  10,
  60,
  false,
  false,
  'Only 7 kicks in an hour, will try again later',
  NOW() - INTERVAL '4 days'
),
-- Follow-up session that reached target
(
  'ks000001-0001-4000-8000-000000000012',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '4 days' + INTERVAL '2 hours',
  NOW() - INTERVAL '4 days' + INTERVAL '2 hours' + INTERVAL '25 minutes',
  10,
  10,
  25,
  true,
  false,
  'Second count of the day - all good!',
  NOW() - INTERVAL '4 days'
),
-- Recent sessions
(
  'ks000001-0001-4000-8000-000000000013',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '3 days' - INTERVAL '3 hours',
  NOW() - INTERVAL '3 days' - INTERVAL '2 hours' - INTERVAL '42 minutes',
  10,
  10,
  18,
  true,
  false,
  NULL,
  NOW() - INTERVAL '3 days'
),
(
  'ks000001-0001-4000-8000-000000000014',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '2 days' - INTERVAL '2 hours',
  NOW() - INTERVAL '2 days' - INTERVAL '1 hour' - INTERVAL '35 minutes',
  10,
  10,
  25,
  true,
  false,
  NULL,
  NOW() - INTERVAL '2 days'
),
(
  'ks000001-0001-4000-8000-000000000015',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '1 day' - INTERVAL '4 hours',
  NOW() - INTERVAL '1 day' - INTERVAL '3 hours' - INTERVAL '40 minutes',
  10,
  10,
  20,
  true,
  false,
  NULL,
  NOW() - INTERVAL '1 day'
),
-- Today's active session
(
  'ks000001-0001-4000-8000-000000000016',
  'preg0001-0001-4000-8000-000000000002',
  NOW() - INTERVAL '30 minutes',
  NULL,
  6,
  10,
  NULL,
  false,
  false,
  NULL,
  NOW() - INTERVAL '30 minutes'
);

-- Akinyi's kick sessions (Kenya, 28 weeks)
INSERT INTO kick_sessions (id, pregnancy_id, started_at, ended_at, kick_count, target_kicks, duration_minutes, reached_target, alert_triggered, notes, created_at)
VALUES
(
  'ks000002-0001-4000-8000-000000000001',
  'preg0002-0001-4000-8000-000000000002',
  NOW() - INTERVAL '5 days' - INTERVAL '2 hours',
  NOW() - INTERVAL '5 days' - INTERVAL '1 hour' - INTERVAL '45 minutes',
  10,
  10,
  15,
  true,
  false,
  NULL,
  NOW() - INTERVAL '5 days'
),
(
  'ks000002-0001-4000-8000-000000000002',
  'preg0002-0001-4000-8000-000000000002',
  NOW() - INTERVAL '3 days' - INTERVAL '3 hours',
  NOW() - INTERVAL '3 days' - INTERVAL '2 hours' - INTERVAL '30 minutes',
  10,
  10,
  30,
  true,
  false,
  NULL,
  NOW() - INTERVAL '3 days'
),
(
  'ks000002-0001-4000-8000-000000000003',
  'preg0002-0001-4000-8000-000000000002',
  NOW() - INTERVAL '1 day' - INTERVAL '4 hours',
  NOW() - INTERVAL '1 day' - INTERVAL '3 hours' - INTERVAL '38 minutes',
  10,
  10,
  22,
  true,
  false,
  'Baby loves evening time',
  NOW() - INTERVAL '1 day'
);

-- Lindiwe's kick sessions (high risk - monitored more closely)
INSERT INTO kick_sessions (id, pregnancy_id, started_at, ended_at, kick_count, target_kicks, duration_minutes, reached_target, alert_triggered, notes, created_at)
VALUES
(
  'ks000003-0001-4000-8000-000000000001',
  'preg0001-0001-4000-8000-000000000003',
  NOW() - INTERVAL '3 days' - INTERVAL '2 hours',
  NOW() - INTERVAL '3 days' - INTERVAL '1 hour' - INTERVAL '40 minutes',
  10,
  10,
  20,
  true,
  false,
  NULL,
  NOW() - INTERVAL '3 days'
),
(
  'ks000003-0001-4000-8000-000000000002',
  'preg0001-0001-4000-8000-000000000003',
  NOW() - INTERVAL '2 days' - INTERVAL '3 hours',
  NOW() - INTERVAL '2 days' - INTERVAL '2 hours' - INTERVAL '35 minutes',
  10,
  10,
  25,
  true,
  false,
  NULL,
  NOW() - INTERVAL '2 days'
),
-- Concerning session that triggered alert
(
  'ks000003-0001-4000-8000-000000000003',
  'preg0001-0001-4000-8000-000000000003',
  NOW() - INTERVAL '1 day' - INTERVAL '4 hours',
  NOW() - INTERVAL '1 day' - INTERVAL '3 hours',
  4,
  10,
  60,
  false,
  true, -- Alert triggered due to low count + high risk
  'Only felt 4 kicks in an hour. Called clinic for advice.',
  NOW() - INTERVAL '1 day'
),
-- Follow-up session after rest
(
  'ks000003-0001-4000-8000-000000000004',
  'preg0001-0001-4000-8000-000000000003',
  NOW() - INTERVAL '1 day' - INTERVAL '1 hour',
  NOW() - INTERVAL '1 day' - INTERVAL '30 minutes',
  10,
  10,
  30,
  true,
  false,
  'After lying on left side and drinking cold water - baby active again',
  NOW() - INTERVAL '1 day'
);
