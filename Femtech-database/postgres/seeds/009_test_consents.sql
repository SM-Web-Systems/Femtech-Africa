-- ============================================
-- FEMTECH AFRICA - TEST CONSENTS
-- ============================================

-- Thandi's consents (all granted)
INSERT INTO consents (id, user_id, consent_type, version, granted_at, ip_address, user_agent, created_at)
VALUES
(
  'con00001-0001-4000-8000-000000000001',
  'u0000001-0001-4000-8000-000000000001',
  'terms_of_service',
  '1.0',
  NOW() - INTERVAL '60 days',
  '105.21.45.123',
  'FemtechApp/1.0.0 (Android 12; Samsung Galaxy A52)',
  NOW() - INTERVAL '60 days'
),
(
  'con00001-0001-4000-8000-000000000002',
  'u0000001-0001-4000-8000-000000000001',
  'privacy_policy',
  '1.0',
  NOW() - INTERVAL '60 days',
  '105.21.45.123',
  'FemtechApp/1.0.0 (Android 12; Samsung Galaxy A52)',
  NOW() - INTERVAL '60 days'
),
(
  'con00001-0001-4000-8000-000000000003',
  'u0000001-0001-4000-8000-000000000001',
  'health_data_processing',
  '1.0',
  NOW() - INTERVAL '60 days',
  '105.21.45.123',
  'FemtechApp/1.0.0 (Android 12; Samsung Galaxy A52)',
  NOW() - INTERVAL '60 days'
),
(
  'con00001-0001-4000-8000-000000000004',
  'u0000001-0001-4000-8000-000000000001',
  'marketing_communications',
  '1.0',
  NOW() - INTERVAL '60 days',
  '105.21.45.123',
  'FemtechApp/1.0.0 (Android 12; Samsung Galaxy A52)',
  NOW() - INTERVAL '60 days'
);

-- Nomsa's consents (marketing revoked)
INSERT INTO consents (id, user_id, consent_type, version, granted_at, revoked_at, ip_address, user_agent, created_at)
VALUES
(
  'con00002-0001-4000-8000-000000000001',
  'u0000001-0001-4000-8000-000000000002',
  'terms_of_service',
  '1.0',
  NOW() - INTERVAL '150 days',
  NULL,
  '196.25.78.201',
  'FemtechApp/1.0.0 (iOS 16.5; iPhone 12)',
  NOW() - INTERVAL '150 days'
),
(
  'con00002-0001-4000-8000-000000000002',
  'u0000001-0001-4000-8000-000000000002',
  'privacy_policy',
  '1.0',
  NOW() - INTERVAL '150 days',
  NULL,
  '196.25.78.201',
  'FemtechApp/1.0.0 (iOS 16.5; iPhone 12)',
  NOW() - INTERVAL '150 days'
),
(
  'con00002-0001-4000-8000-000000000003',
  'u0000001-0001-4000-8000-000000000002',
  'health_data_processing',
  '1.0',
  NOW() - INTERVAL '150 days',
  NULL,
  '196.25.78.201',
  'FemtechApp/1.0.0 (iOS 16.5; iPhone 12)',
  NOW() - INTERVAL '150 days'
),
(
  'con00002-0001-4000-8000-000000000004',
  'u0000001-0001-4000-8000-000000000002',
  'marketing_communications',
  '1.0',
  NOW() - INTERVAL '150 days',
  NOW() - INTERVAL '30 days', -- Revoked
  '196.25.78.201',
  'FemtechApp/1.0.0 (iOS 16.5; iPhone 12)',
  NOW() - INTERVAL '150 days'
);

-- Wanjiku's consents (Kenya)
INSERT INTO consents (id, user_id, consent_type, version, granted_at, ip_address, user_agent, created_at)
VALUES
(
  'con00003-0001-4000-8000-000000000001',
  'u0000002-0001-4000-8000-000000000001',
  'terms_of_service',
  '1.0',
  NOW() - INTERVAL '90 days',
  '197.232.15.45',
  'FemtechApp/1.0.0 (Android 11; Tecno Spark 8)',
  NOW() - INTERVAL '90 days'
),
(
  'con00003-0001-4000-8000-000000000002',
  'u0000002-0001-4000-8000-000000000001',
  'privacy_policy',
  '1.0',
  NOW() - INTERVAL '90 days',
  '197.232.15.45',
  'FemtechApp/1.0.0 (Android 11; Tecno Spark 8)',
  NOW() - INTERVAL '90 days'
),
(
  'con00003-0001-4000-8000-000000000003',
  'u0000002-0001-4000-8000-000000000001',
  'health_data_processing',
  '1.0',
  NOW() - INTERVAL '90 days',
  '197.232.15.45',
  'FemtechApp/1.0.0 (Android 11; Tecno Spark 8)',
  NOW() - INTERVAL '90 days'
);

-- Adaeze's consents (Nigeria)
INSERT INTO consents (id, user_id, consent_type, version, granted_at, ip_address, user_agent, created_at)
VALUES
(
  'con00004-0001-4000-8000-000000000001',
  'u0000003-0001-4000-8000-000000000001',
  'terms_of_service',
  '1.0',
  NOW() - INTERVAL '75 days',
  '105.112.45.89',
  'FemtechApp/1.0.0 (Android 13; Samsung Galaxy A34)',
  NOW() - INTERVAL '75 days'
),
(
  'con00004-0001-4000-8000-000000000002',
  'u0000003-0001-4000-8000-000000000001',
  'privacy_policy',
  '1.0',
  NOW() - INTERVAL '75 days',
  '105.112.45.89',
  'FemtechApp/1.0.0 (Android 13; Samsung Galaxy A34)',
  NOW() - INTERVAL '75 days'
),
(
  'con00004-0001-4000-8000-000000000003',
  'u0000003-0001-4000-8000-000000000001',
  'health_data_processing',
  '1.0',
  NOW() - INTERVAL '75 days',
  '105.112.45.89',
  'FemtechApp/1.0.0 (Android 13; Samsung Galaxy A34)',
  NOW() - INTERVAL '75 days'
),
(
  'con00004-0001-4000-8000-000000000004',
  'u0000003-0001-4000-8000-000000000001',
  'marketing_communications',
  '1.0',
  NOW() - INTERVAL '75 days',
  '105.112.45.89',
  'FemtechApp/1.0.0 (Android 13; Samsung Galaxy A34)',
  NOW() - INTERVAL '75 days'
),
(
  'con00004-0001-4000-8000-000000000005',
  'u0000003-0001-4000-8000-000000000001',
  'data_sharing_partners',
  '1.0',
  NOW() - INTERVAL '75 days',
  '105.112.45.89',
  'FemtechApp/1.0.0 (Android 13; Samsung Galaxy A34)',
  NOW() - INTERVAL '75 days'
);
