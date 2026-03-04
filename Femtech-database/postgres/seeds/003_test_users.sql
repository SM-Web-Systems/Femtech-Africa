-- ============================================
-- FEMTECH AFRICA - TEST USERS SEED DATA
-- ============================================
-- NOTE: These are TEST users for development/staging only
-- Password hashes and encrypted fields are placeholders

-- ============================================
-- SOUTH AFRICA TEST USERS
-- ============================================

-- Test Mother 1 - Active pregnancy, early stage
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000001-0001-4000-8000-000000000001',
  '+27821234001',
  true,
  'thandi.test@femtech.dev',
  false,
  'ZA',
  'en',
  'active',
  'mother',
  'GTEST1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '60 days',
  NOW()
);

INSERT INTO user_profiles (id, user_id, first_name_encrypted, last_name_encrypted, date_of_birth_encrypted, encryption_key_id, created_at, updated_at)
VALUES (
  'up000001-0001-4000-8000-000000000001',
  'u0000001-0001-4000-8000-000000000001',
  E'\\x746573745f656e637279707465645f7468616e6469', -- placeholder encrypted "Thandi"
  E'\\x746573745f656e637279707465645f6e6b6f7369', -- placeholder encrypted "Nkosi"
  E'\\x746573745f656e637279707465645f31393935303631350a', -- placeholder encrypted "1995-06-15"
  'dev-key-001',
  NOW() - INTERVAL '60 days',
  NOW()
);

-- Test Mother 2 - Active pregnancy, third trimester
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000001-0001-4000-8000-000000000002',
  '+27831234002',
  true,
  'nomsa.test@femtech.dev',
  false,
  'ZA',
  'zu',
  'active',
  'mother',
  'GTEST2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2',
  NOW() - INTERVAL '120 days',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '150 days',
  NOW()
);

INSERT INTO user_profiles (id, user_id, first_name_encrypted, last_name_encrypted, date_of_birth_encrypted, encryption_key_id, created_at, updated_at)
VALUES (
  'up000001-0001-4000-8000-000000000002',
  'u0000001-0001-4000-8000-000000000002',
  E'\\x746573745f656e637279707465645f6e6f6d7361',
  E'\\x746573745f656e637279707465645f64756265',
  E'\\x746573745f656e637279707465645f31393932303332300a',
  'dev-key-001',
  NOW() - INTERVAL '150 days',
  NOW()
);

-- Test Mother 3 - High risk pregnancy
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000001-0001-4000-8000-000000000003',
  '+27841234003',
  true,
  'lindiwe.test@femtech.dev',
  false,
  'ZA',
  'xh',
  'active',
  'mother',
  'GTEST3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3',
  NOW() - INTERVAL '90 days',
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '100 days',
  NOW()
);

-- Test Mother 4 - New user, no wallet yet
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000001-0001-4000-8000-000000000004',
  '+27851234004',
  true,
  NULL,
  false,
  'ZA',
  'en',
  'active',
  'mother',
  NULL,
  NULL,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '3 days',
  NOW()
);

-- Test Mother 5 - Pending verification
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000001-0001-4000-8000-000000000005',
  '+27861234005',
  false,
  NULL,
  false,
  'ZA',
  'en',
  'pending_verification',
  'mother',
  NULL,
  NULL,
  NULL,
  NOW() - INTERVAL '1 hour',
  NOW()
);

-- Test Verifier 1 - Healthcare Worker
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000001-0001-4000-8000-000000000010',
  '+27821234010',
  true,
  'dr.mokoena.test@femtech.dev',
  true,
  'ZA',
  'en',
  'active',
  'verifier',
  NULL,
  NULL,
  NOW() - INTERVAL '4 hours',
  NOW() - INTERVAL '180 days',
  NOW()
);

-- Test Verifier 2 - Community Health Worker
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000001-0001-4000-8000-000000000011',
  '+27831234011',
  true,
  'chw.sipho.test@femtech.dev',
  true,
  'ZA',
  'zu',
  'active',
  'verifier',
  NULL,
  NULL,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '200 days',
  NOW()
);

-- Test Admin
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000001-0001-4000-8000-000000000020',
  '+27801234020',
  true,
  'admin.test@femtech.dev',
  true,
  'ZA',
  'en',
  'active',
  'admin',
  NULL,
  NULL,
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '365 days',
  NOW()
);

-- ============================================
-- KENYA TEST USERS
-- ============================================

-- Test Mother - Kenya
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000002-0001-4000-8000-000000000001',
  '+254722123001',
  true,
  'wanjiku.test@femtech.dev',
  false,
  'KE',
  'sw',
  'active',
  'mother',
  'GTESTKE1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1',
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '90 days',
  NOW()
);

INSERT INTO user_profiles (id, user_id, first_name_encrypted, last_name_encrypted, date_of_birth_encrypted, encryption_key_id, created_at, updated_at)
VALUES (
  'up000002-0001-4000-8000-000000000001',
  'u0000002-0001-4000-8000-000000000001',
  E'\\x746573745f656e637279707465645f77616e6a696b75',
  E'\\x746573745f656e637279707465645f6b616d6175',
  E'\\x746573745f656e637279707465645f31393938303431320a',
  'dev-key-001',
  NOW() - INTERVAL '90 days',
  NOW()
);

-- Test Mother 2 - Kenya
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000002-0001-4000-8000-000000000002',
  '+254733123002',
  true,
  'akinyi.test@femtech.dev',
  false,
  'KE',
  'en',
  'active',
  'mother',
  'GTESTKE2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2',
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '120 days',
  NOW()
);

-- Test Verifier - Kenya
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000002-0001-4000-8000-000000000010',
  '+254722123010',
  true,
  'nurse.ochieng.test@femtech.dev',
  true,
  'KE',
  'sw',
  'active',
  'verifier',
  NULL,
  NULL,
  NOW() - INTERVAL '8 hours',
  NOW() - INTERVAL '150 days',
  NOW()
);

-- ============================================
-- NIGERIA TEST USERS
-- ============================================

-- Test Mother - Nigeria
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000003-0001-4000-8000-000000000001',
  '+2348012345001',
  true,
  'adaeze.test@femtech.dev',
  false,
  'NG',
  'en',
  'active',
  'mother',
  'GTESTNG1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '5 hours',
  NOW() - INTERVAL '75 days',
  NOW()
);

INSERT INTO user_profiles (id, user_id, first_name_encrypted, last_name_encrypted, date_of_birth_encrypted, encryption_key_id, created_at, updated_at)
VALUES (
  'up000003-0001-4000-8000-000000000001',
  'u0000003-0001-4000-8000-000000000001',
  E'\\x746573745f656e637279707465645f616461657a65',
  E'\\x746573745f656e637279707465645f6f6b776f',
  E'\\x746573745f656e637279707465645f31393936303930380a',
  'dev-key-001',
  NOW() - INTERVAL '75 days',
  NOW()
);

-- Test Mother 2 - Nigeria (Yoruba)
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000003-0001-4000-8000-000000000002',
  '+2349023456002',
  true,
  'folake.test@femtech.dev',
  false,
  'NG',
  'yo',
  'active',
  'mother',
  'GTESTNG2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2',
  NOW() - INTERVAL '50 days',
  NOW() - INTERVAL '12 hours',
  NOW() - INTERVAL '100 days',
  NOW()
);

-- ============================================
-- GHANA TEST USERS
-- ============================================

-- Test Mother - Ghana
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000004-0001-4000-8000-000000000001',
  '+233244123001',
  true,
  'abena.test@femtech.dev',
  false,
  'GH',
  'en',
  'active',
  'mother',
  'GTESTGH1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1',
  NOW() - INTERVAL '40 days',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '80 days',
  NOW()
);

-- ============================================
-- UGANDA TEST USERS
-- ============================================

-- Test Mother - Uganda
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000005-0001-4000-8000-000000000001',
  '+256770123001',
  true,
  'nakato.test@femtech.dev',
  false,
  'UG',
  'en',
  'active',
  'mother',
  'GTESTUG1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1',
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '4 hours',
  NOW() - INTERVAL '60 days',
  NOW()
);

-- ============================================
-- RWANDA TEST USERS
-- ============================================

-- Test Mother - Rwanda
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000006-0001-4000-8000-000000000001',
  '+250780123001',
  true,
  'uwimana.test@femtech.dev',
  false,
  'RW',
  'en',
  'active',
  'mother',
  'GTESTRW1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1',
  NOW() - INTERVAL '35 days',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '70 days',
  NOW()
);

-- ============================================
-- TANZANIA TEST USERS
-- ============================================

-- Test Mother - Tanzania
INSERT INTO users (id, phone, phone_verified, email, email_verified, country, language, status, role, wallet_address, wallet_created_at, last_login_at, created_at, updated_at)
VALUES (
  'u0000007-0001-4000-8000-000000000001',
  '+255754123001',
  true,
  'rehema.test@femtech.dev',
  false,
  'TZ',
  'sw',
  'active',
  'mother',
  'GTESTTZ1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '55 days',
  NOW()
);
