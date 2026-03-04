-- ============================================
-- FEMTECH AFRICA - TEST VERIFIERS
-- ============================================

-- South Africa Verifiers
INSERT INTO verifiers (id, user_id, type, facility_id, verification_code, credentials_hash, specializations, verification_count, is_active, approved_at, approved_by, created_at, updated_at)
VALUES
-- Dr. Mokoena - Healthcare Worker at Joburg General
(
  'v0000001-0001-4000-8000-000000000001',
  'u0000001-0001-4000-8000-000000000010',
  'healthcare_worker',
  'f0000001-0001-4000-8000-000000000001',
  'VER-ZA-HCW-001',
  'hash_placeholder_dr_mokoena',
  ARRAY['obstetrics', 'prenatal_care', 'high_risk_pregnancy'],
  156,
  true,
  NOW() - INTERVAL '180 days',
  'u0000001-0001-4000-8000-000000000020',
  NOW() - INTERVAL '180 days',
  NOW()
),
-- Sipho - Community Health Worker in Alexandra
(
  'v0000001-0001-4000-8000-000000000002',
  'u0000001-0001-4000-8000-000000000011',
  'community_health_worker',
  'f0000001-0001-4000-8000-000000000005',
  'VER-ZA-CHW-001',
  'hash_placeholder_sipho_chw',
  ARRAY['home_visits', 'postnatal_care', 'breastfeeding_support'],
  89,
  true,
  NOW() - INTERVAL '200 days',
  'u0000001-0001-4000-8000-000000000020',
  NOW() - INTERVAL '200 days',
  NOW()
);

-- Kenya Verifiers
INSERT INTO verifiers (id, user_id, type, facility_id, verification_code, credentials_hash, specializations, verification_count, is_active, approved_at, approved_by, created_at, updated_at)
VALUES
(
  'v0000002-0001-4000-8000-000000000001',
  'u0000002-0001-4000-8000-000000000010',
  'healthcare_worker',
  'f0000002-0001-4000-8000-000000000001',
  'VER-KE-HCW-001',
  'hash_placeholder_nurse_ochieng',
  ARRAY['midwifery', 'prenatal_care', 'neonatal_care'],
  234,
  true,
  NOW() - INTERVAL '150 days',
  'u0000001-0001-4000-8000-000000000020',
  NOW() - INTERVAL '150 days',
  NOW()
);

-- ============================================
-- FEMTECH AFRICA - DIGITAL DOULAS
-- ============================================

INSERT INTO digital_doulas (id, name, bio, avatar_url, country, languages, specializations, is_available, response_time_minutes, total_chats, avg_rating, created_at, updated_at)
VALUES
-- South Africa Doulas
(
  'dd000001-0001-4000-8000-000000000001',
  'Sister Thembi',
  'Experienced midwife with 15 years of maternal care experience. I''m here to support you through your pregnancy journey with compassion and expertise.',
  'https://cdn.femtech.africa/doulas/thembi.png',
  'ZA',
  ARRAY['en', 'zu', 'xh']::language_code[],
  ARRAY['first_time_mothers', 'natural_birth', 'breastfeeding', 'emotional_support'],
  true,
  30,
  1250,
  4.85,
  NOW() - INTERVAL '300 days',
  NOW()
),
(
  'dd000001-0001-4000-8000-000000000002',
  'Mama Lerato',
  'Traditional birth attendant and certified doula. I combine traditional wisdom with modern practices to help mothers feel confident and prepared.',
  'https://cdn.femtech.africa/doulas/lerato.png',
  'ZA',
  ARRAY['en', 'zu', 'st']::language_code[],
  ARRAY['traditional_practices', 'postnatal_care', 'baby_care', 'nutrition'],
  true,
  45,
  890,
  4.92,
  NOW() - INTERVAL '250 days',
  NOW()
),
(
  'dd000001-0001-4000-8000-000000000003',
  'Dr. Amahle',
  'Registered nurse and certified lactation consultant. Specializing in high-risk pregnancy support and premature baby care.',
  'https://cdn.femtech.africa/doulas/amahle.png',
  'ZA',
  ARRAY['en', 'af']::language_code[],
  ARRAY['high_risk_pregnancy', 'premature_babies', 'lactation', 'medical_guidance'],
  true,
  20,
  567,
  4.78,
  NOW() - INTERVAL '180 days',
  NOW()
),

-- Kenya Doulas
(
  'dd000002-0001-4000-8000-000000000001',
  'Mama Wanjiru',
  'Community midwife serving mothers in Nairobi for over 20 years. I''m passionate about helping every mother have a safe and positive birth experience.',
  'https://cdn.femtech.africa/doulas/wanjiru.png',
  'KE',
  ARRAY['en', 'sw']::language_code[],
  ARRAY['community_support', 'natural_birth', 'postnatal_care', 'traditional_practices'],
  true,
  40,
  1100,
  4.88,
  NOW() - INTERVAL '280 days',
  NOW()
),
(
  'dd000002-0001-4000-8000-000000000002',
  'Nurse Akinyi',
  'Registered nurse-midwife with expertise in adolescent maternal health. Here to provide judgment-free support to all mothers.',
  'https://cdn.femtech.africa/doulas/akinyi.png',
  'KE',
  ARRAY['en', 'sw']::language_code[],
  ARRAY['adolescent_mothers', 'first_time_mothers', 'mental_health', 'family_planning'],
  true,
  25,
  780,
  4.91,
  NOW() - INTERVAL '200 days',
  NOW()
),

-- Nigeria Doulas
(
  'dd000003-0001-4000-8000-000000000001',
  'Mama Ngozi',
  'Certified doula and childbirth educator. I believe every woman deserves support and empowerment during pregnancy and birth.',
  'https://cdn.femtech.africa/doulas/ngozi.png',
  'NG',
  ARRAY['en', 'ig']::language_code[],
  ARRAY['childbirth_education', 'natural_birth', 'emotional_support', 'advocacy'],
  true,
  35,
  950,
  4.82,
  NOW() - INTERVAL '260 days',
  NOW()
),
(
  'dd000003-0001-4000-8000-000000000002',
  'Sister Folashade',
  'Experienced midwife specializing in traditional Yoruba birth practices integrated with modern healthcare.',
  'https://cdn.femtech.africa/doulas/folashade.png',
  'NG',
  ARRAY['en', 'yo']::language_code[],
  ARRAY['traditional_practices', 'postnatal_rituals', 'nutrition', 'herbal_remedies'],
  true,
  50,
  620,
  4.75,
  NOW() - INTERVAL '220 days',
  NOW()
),

-- Ghana Doula
(
  'dd000004-0001-4000-8000-000000000001',
  'Auntie Ama',
  'Community health advocate and trained birth companion. Supporting mothers in Accra with love and practical guidance.',
  'https://cdn.femtech.africa/doulas/ama.png',
  'GH',
  ARRAY['en']::language_code[],
  ARRAY['community_support', 'nutrition', 'breastfeeding', 'newborn_care'],
  true,
  45,
  430,
  4.80,
  NOW() - INTERVAL '180 days',
  NOW()
),

-- Uganda Doula
(
  'dd000005-0001-4000-8000-000000000001',
  'Sister Grace',
  'Registered midwife and maternal health educator. Committed to reducing maternal mortality through education and support.',
  'https://cdn.femtech.africa/doulas/grace.png',
  'UG',
  ARRAY['en', 'sw']::language_code[],
  ARRAY['danger_signs', 'facility_delivery', 'postnatal_care', 'family_planning'],
  true,
  30,
  380,
  4.87,
  NOW() - INTERVAL '150 days',
  NOW()
),

-- Rwanda Doula
(
  'dd000006-0001-4000-8000-000000000001',
  'Mama Claudine',
  'Trained birth companion and community health worker. Here to walk with you through your pregnancy journey.',
  'https://cdn.femtech.africa/doulas/claudine.png',
  'RW',
  ARRAY['en', 'fr']::language_code[],
  ARRAY['community_support', 'mental_health', 'first_time_mothers', 'breastfeeding'],
  true,
  40,
  290,
  4.90,
  NOW() - INTERVAL '140 days',
  NOW()
),

-- Tanzania Doula
(
  'dd000007-0001-4000-8000-000000000001',
  'Mama Rehema',
  'Experienced traditional birth attendant and modern doula. Bridging traditional wisdom with safe practices.',
  'https://cdn.femtech.africa/doulas/rehema.png',
  'TZ',
  ARRAY['sw', 'en']::language_code[],
  ARRAY['traditional_practices', 'natural_birth', 'nutrition', 'postnatal_care'],
  true,
  35,
  410,
  4.83,
  NOW() - INTERVAL '160 days',
  NOW()
);
