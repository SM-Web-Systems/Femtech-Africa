-- ============================================
-- FEMTECH AFRICA - TEST FACILITIES
-- ============================================

-- South Africa Facilities
INSERT INTO facilities (id, name, type, country, province, district, address, latitude, longitude, phone, email, is_partner, verification_code, operating_hours, services, is_active, created_at, updated_at)
VALUES
('f0000001-0001-4000-8000-000000000001', 'Johannesburg General Hospital', 'public_hospital', 'ZA', 'Gauteng', 'Johannesburg', '1 Jubilee Rd, Parktown, Johannesburg', -26.1751, 28.0444, '+27113100000', 'info@joburghosp.gov.za', true, 'JHB-GEN-001', '{"mon-fri": "08:00-17:00", "sat": "08:00-13:00"}', ARRAY['anc', 'delivery', 'postnatal', 'ultrasound', 'lab'], true, NOW(), NOW()),
('f0000001-0001-4000-8000-000000000002', 'Chris Hani Baragwanath Hospital', 'public_hospital', 'ZA', 'Gauteng', 'Soweto', 'Chris Hani Rd, Diepkloof, Soweto', -26.2612, 27.9444, '+27119330000', 'info@chrishanibara.gov.za', true, 'CHB-SOW-001', '{"mon-sun": "24h"}', ARRAY['anc', 'delivery', 'postnatal', 'nicu', 'ultrasound', 'lab'], true, NOW(), NOW()),
('f0000001-0001-4000-8000-000000000003', 'Groote Schuur Hospital', 'public_hospital', 'ZA', 'Western Cape', 'Cape Town', 'Main Rd, Observatory, Cape Town', -33.9422, 18.4675, '+27214044111', 'info@gsh.gov.za', true, 'GSH-CPT-001', '{"mon-sun": "24h"}', ARRAY['anc', 'delivery', 'postnatal', 'nicu', 'high_risk', 'ultrasound', 'lab'], true, NOW(), NOW()),
('f0000001-0001-4000-8000-000000000004', 'Netcare Milpark Hospital', 'private_hospital', 'ZA', 'Gauteng', 'Johannesburg', '9 Guild Rd, Milpark, Johannesburg', -26.1828, 28.0163, '+27114801600', 'milpark@netcare.co.za', true, 'NET-MIL-001', '{"mon-sun": "24h"}', ARRAY['anc', 'delivery', 'postnatal', 'nicu', 'ultrasound_3d', 'lab'], true, NOW(), NOW()),
('f0000001-0001-4000-8000-000000000005', 'Alexandra Community Health Centre', 'clinic', 'ZA', 'Gauteng', 'Alexandra', '45 First Ave, Alexandra, Johannesburg', -26.1069, 28.0961, '+27113200500', 'alex.chc@gauteng.gov.za', true, 'ALE-CHC-001', '{"mon-fri": "07:00-16:00"}', ARRAY['anc', 'postnatal', 'immunization'], true, NOW(), NOW()),
('f0000001-0001-4000-8000-000000000006', 'Clicks Rosebank', 'pharmacy', 'ZA', 'Gauteng', 'Johannesburg', 'The Zone, Rosebank', -26.1472, 28.0444, '+27113003000', 'rosebank@clicks.co.za', true, 'CLI-ROS-001', '{"mon-sat": "08:00-21:00", "sun": "09:00-18:00"}', ARRAY['prenatal_vitamins', 'baby_products'], true, NOW(), NOW()),

-- Kenya Facilities
('f0000002-0001-4000-8000-000000000001', 'Kenyatta National Hospital', 'public_hospital', 'KE', 'Nairobi', 'Nairobi', 'Hospital Rd, Upper Hill, Nairobi', -1.3019, 36.8066, '+254202726300', 'info@knh.or.ke', true, 'KNH-NRB-001', '{"mon-sun": "24h"}', ARRAY['anc', 'delivery', 'postnatal', 'nicu', 'high_risk', 'ultrasound', 'lab'], true, NOW(), NOW()),
('f0000002-0001-4000-8000-000000000002', 'Pumwani Maternity Hospital', 'public_hospital', 'KE', 'Nairobi', 'Nairobi', 'Pumwani Rd, Eastleigh, Nairobi', -1.2753, 36.8536, '+254202650966', 'info@pumwani.go.ke', true, 'PUM-NRB-001', '{"mon-sun": "24h"}', ARRAY['anc', 'delivery', 'postnatal'], true, NOW(), NOW()),
('f0000002-0001-4000-8000-000000000003', 'Nairobi Women''s Hospital', 'private_hospital', 'KE', 'Nairobi', 'Nairobi', 'Argwings Kodhek Rd, Hurlingham, Nairobi', -1.2986, 36.7901, '+254207202360', 'info@nwh.co.ke', true, 'NWH-NRB-001', '{"mon-sun": "24h"}', ARRAY['anc', 'delivery', 'postnatal', 'nicu', 'ultrasound_4d', 'lab'], true, NOW(), NOW()),
('f0000002-0001-4000-8000-000000000004', 'Kibera Health Centre', 'clinic', 'KE', 'Nairobi', 'Kibera', 'Olympic Estate, Kibera', -1.3136, 36.7817, '+254202022222', 'kibera.hc@health.go.ke', true, 'KIB-HC-001', '{"mon-fri": "07:30-17:00"}', ARRAY['anc', 'postnatal', 'immunization'], true, NOW(), NOW()),

-- Nigeria Facilities
('f0000003-0001-4000-8000-000000000001', 'Lagos University Teaching Hospital', 'public_hospital', 'NG', 'Lagos', 'Idi-Araba', 'Ishaga Rd, Idi-Araba, Lagos', 6.5158, 3.3547, '+2347028225555', 'info@luth.gov.ng', true, 'LUTH-LAG-001', '{"mon-sun": "24h"}', ARRAY['anc', 'delivery', 'postnatal', 'nicu', 'high_risk', 'ultrasound', 'lab'], true, NOW(), NOW()),
('f0000003-0001-4000-8000-000000000002', 'Reddington Hospital', 'private_hospital', 'NG', 'Lagos', 'Victoria Island', '12 Idowu Martins St, Victoria Island, Lagos', 6.4310, 3.4218, '+2348140000001', 'info@reddingtonhospital.com', true, 'RED-VI-001', '{"mon-sun": "24h"}', ARRAY['anc', 'delivery', 'postnatal', 'nicu', 'ultrasound_4d', 'lab'], true, NOW(), NOW()),

-- Ghana Facilities
('f0000004-0001-4000-8000-000000000001', 'Korle Bu Teaching Hospital', 'public_hospital', 'GH', 'Greater Accra', 'Accra', 'Guggisberg Ave, Korle Bu, Accra', 5.5364, -0.2286, '+233302665401', 'info@kbth.gov.gh', true, 'KBTH-ACC-001', '{"mon-sun": "24h"}', ARRAY['anc', 'delivery', 'postnatal', 'nicu', 'high_risk', 'ultrasound', 'lab'], true, NOW(), NOW()),

-- Uganda Facilities
('f0000005-0001-4000-8000-000000000001', 'Mulago National Referral Hospital', 'public_hospital', 'UG', 'Central', 'Kampala', 'Upper Mulago Hill Rd, Kampala', 0.3444, 32.5758, '+256414541188', 'info@mulago.or.ug', true, 'MUL-KLA-001', '{"mon-sun": "24h"}', ARRAY['anc', 'delivery', 'postnatal', 'nicu', 'high_risk', 'ultrasound', 'lab'], true, NOW(), NOW()),

-- Rwanda Facilities
('f0000006-0001-4000-8000-000000000001', 'King Faisal Hospital', 'private_hospital', 'RW', 'Kigali', 'Kigali', 'KG 544 St, Kigali', -1.9544, 30.0936, '+250788888888', 'info@kfh.rw', true, 'KFH-KGL-001', '{"mon-sun": "24h"}', ARRAY['anc', 'delivery', 'postnatal', 'nicu', 'ultrasound_4d', 'lab'], true, NOW(), NOW()),

-- Tanzania Facilities
('f0000007-0001-4000-8000-000000000001', 'Muhimbili National Hospital', 'public_hospital', 'TZ', 'Dar es Salaam', 'Ilala', 'United Nations Rd, Upanga, Dar es Salaam', -6.8027, 39.2829, '+255222150596', 'info@mnh.or.tz', true, 'MNH-DSM-001', '{"mon-sun": "24h"}', ARRAY['anc', 'delivery', 'postnatal', 'nicu', 'high_risk', 'ultrasound', 'lab'], true, NOW(), NOW());

-- ============================================
-- FEMTECH AFRICA - TEST PREGNANCIES
-- ============================================

-- South Africa - Thandi (Early pregnancy, ~12 weeks)
INSERT INTO pregnancies (id, user_id, status, lmp_date, edd_date, gravida, parity, is_high_risk, risk_factors, blood_type, primary_facility_id, momconnect_registered, momconnect_id, created_at, updated_at)
VALUES (
  'preg0001-0001-4000-8000-000000000001',
  'u0000001-0001-4000-8000-000000000001',
  'active',
  CURRENT_DATE - INTERVAL '84 days', -- ~12 weeks
  CURRENT_DATE + INTERVAL '196 days',
  1,
  0,
  false,
  ARRAY[]::varchar[],
  'O_positive',
  'f0000001-0001-4000-8000-000000000001',
  true,
  'MC-ZA-00001',
  NOW() - INTERVAL '60 days',
  NOW()
);

-- South Africa - Nomsa (Third trimester, ~32 weeks)
INSERT INTO pregnancies (id, user_id, status, lmp_date, edd_date, gravida, parity, is_high_risk, risk_factors, blood_type, primary_facility_id, momconnect_registered, momconnect_id, created_at, updated_at)
VALUES (
  'preg0001-0001-4000-8000-000000000002',
  'u0000001-0001-4000-8000-000000000002',
  'active',
  CURRENT_DATE - INTERVAL '224 days', -- ~32 weeks
  CURRENT_DATE + INTERVAL '56 days',
  2,
  1,
  false,
  ARRAY[]::varchar[],
  'A_positive',
  'f0000001-0001-4000-8000-000000000002',
  true,
  'MC-ZA-00002',
  NOW() - INTERVAL '150 days',
  NOW()
);

-- South Africa - Lindiwe (High risk, ~24 weeks)
INSERT INTO pregnancies (id, user_id, status, lmp_date, edd_date, gravida, parity, is_high_risk, risk_factors, blood_type, primary_facility_id, momconnect_registered, momconnect_id, created_at, updated_at)
VALUES (
  'preg0001-0001-4000-8000-000000000003',
  'u0000001-0001-4000-8000-000000000003',
  'active',
  CURRENT_DATE - INTERVAL '168 days', -- ~24 weeks
  CURRENT_DATE + INTERVAL '112 days',
  3,
  1,
  true,
  ARRAY['gestational_diabetes', 'previous_preterm', 'advanced_maternal_age'],
  'B_negative',
  'f0000001-0001-4000-8000-000000000003',
  true,
  'MC-ZA-00003',
  NOW() - INTERVAL '100 days',
  NOW()
);

-- Kenya - Wanjiku (~20 weeks)
INSERT INTO pregnancies (id, user_id, status, lmp_date, edd_date, gravida, parity, is_high_risk, risk_factors, blood_type, primary_facility_id, momconnect_registered, created_at, updated_at)
VALUES (
  'preg0002-0001-4000-8000-000000000001',
  'u0000002-0001-4000-8000-000000000001',
  'active',
  CURRENT_DATE - INTERVAL '140 days', -- ~20 weeks
  CURRENT_DATE + INTERVAL '140 days',
  1,
  0,
  false,
  ARRAY[]::varchar[],
  'O_positive',
  'f0000002-0001-4000-8000-000000000001',
  false,
  NOW() - INTERVAL '90 days',
  NOW()
);

-- Kenya - Akinyi (~28 weeks)
INSERT INTO pregnancies (id, user_id, status, lmp_date, edd_date, gravida, parity, is_high_risk, risk_factors, blood_type, primary_facility_id, momconnect_registered, created_at, updated_at)
VALUES (
  'preg0002-0001-4000-8000-000000000002',
  'u0000002-0001-4000-8000-000000000002',
  'active',
  CURRENT_DATE - INTERVAL '196 days', -- ~28 weeks
  CURRENT_DATE + INTERVAL '84 days',
  2,
  1,
  false,
  ARRAY[]::varchar[],
  'A_positive',
  'f0000002-0001-4000-8000-000000000003',
  false,
  NOW() - INTERVAL '120 days',
  NOW()
);

-- Nigeria - Adaeze (~16 weeks)
INSERT INTO pregnancies (id, user_id, status, lmp_date, edd_date, gravida, parity, is_high_risk, risk_factors, blood_type, primary_facility_id, momconnect_registered, created_at, updated_at)
VALUES (
  'preg0003-0001-4000-8000-000000000001',
  'u0000003-0001-4000-8000-000000000001',
  'active',
  CURRENT_DATE - INTERVAL '112 days', -- ~16 weeks
  CURRENT_DATE + INTERVAL '168 days',
  1,
  0,
  false,
  ARRAY[]::varchar[],
  'O_positive',
  'f0000003-0001-4000-8000-000000000001',
  false,
  NOW() - INTERVAL '75 days',
  NOW()
);

-- Nigeria - Folake (~22 weeks, high risk)
INSERT INTO pregnancies (id, user_id, status, lmp_date, edd_date, gravida, parity, is_high_risk, risk_factors, blood_type, primary_facility_id, momconnect_registered, created_at, updated_at)
VALUES (
  'preg0003-0001-4000-8000-000000000002',
  'u0000003-0001-4000-8000-000000000002',
  'active',
  CURRENT_DATE - INTERVAL '154 days', -- ~22 weeks
  CURRENT_DATE + INTERVAL '126 days',
  4,
  2,
  true,
  ARRAY['hypertension', 'multiple_pregnancy'],
  'AB_positive',
  'f0000003-0001-4000-8000-000000000002',
  false,
  NOW() - INTERVAL '100 days',
  NOW()
);

-- Ghana - Abena (~18 weeks)
INSERT INTO pregnancies (id, user_id, status, lmp_date, edd_date, gravida, parity, is_high_risk, risk_factors, blood_type, primary_facility_id, momconnect_registered, created_at, updated_at)
VALUES (
  'preg0004-0001-4000-8000-000000000001',
  'u0000004-0001-4000-8000-000000000001',
  'active',
  CURRENT_DATE - INTERVAL '126 days', -- ~18 weeks
  CURRENT_DATE + INTERVAL '154 days',
  1,
  0,
  false,
  ARRAY[]::varchar[],
  'O_positive',
  'f0000004-0001-4000-8000-000000000001',
  false,
  NOW() - INTERVAL '80 days',
  NOW()
);

-- Uganda - Nakato (~14 weeks)
INSERT INTO pregnancies (id, user_id, status, lmp_date, edd_date, gravida, parity, is_high_risk, risk_factors, blood_type, primary_facility_id, momconnect_registered, created_at, updated_at)
VALUES (
  'preg0005-0001-4000-8000-000000000001',
  'u0000005-0001-4000-8000-000000000001',
  'active',
  CURRENT_DATE - INTERVAL '98 days', -- ~14 weeks
  CURRENT_DATE + INTERVAL '182 days',
  2,
  1,
  false,
  ARRAY[]::varchar[],
  'B_positive',
  'f0000005-0001-4000-8000-000000000001',
  false,
  NOW() - INTERVAL '60 days',
  NOW()
);

-- Rwanda - Uwimana (~15 weeks)
INSERT INTO pregnancies (id, user_id, status, lmp_date, edd_date, gravida, parity, is_high_risk, risk_factors, blood_type, primary_facility_id, momconnect_registered, created_at, updated_at)
VALUES (
  'preg0006-0001-4000-8000-000000000001',
  'u0000006-0001-4000-8000-000000000001',
  'active',
  CURRENT_DATE - INTERVAL '105 days', -- ~15 weeks
  CURRENT_DATE + INTERVAL '175 days',
  1,
  0,
  false,
  ARRAY[]::varchar[],
  'O_negative',
  'f0000006-0001-4000-8000-000000000001',
  false,
  NOW() - INTERVAL '70 days',
  NOW()
);

-- Tanzania - Rehema (~10 weeks)
INSERT INTO pregnancies (id, user_id, status, lmp_date, edd_date, gravida, parity, is_high_risk, risk_factors, blood_type, primary_facility_id, momconnect_registered, created_at, updated_at)
VALUES (
  'preg0007-0001-4000-8000-000000000001',
  'u0000007-0001-4000-8000-000000000001',
  'active',
  CURRENT_DATE - INTERVAL '70 days', -- ~10 weeks
  CURRENT_DATE + INTERVAL '210 days',
  1,
  0,
  false,
  ARRAY[]::varchar[],
  'A_positive',
  'f0000007-0001-4000-8000-000000000001',
  false,
  NOW() - INTERVAL '55 days',
  NOW()
);

-- ============================================
-- EMERGENCY CONTACTS
-- ============================================

INSERT INTO emergency_contacts (id, pregnancy_id, name, relationship, phone, is_primary, can_access_health, created_at, updated_at)
VALUES
-- Thandi's contacts
('ec000001-0001-4000-8000-000000000001', 'preg0001-0001-4000-8000-000000000001', 'Sipho Nkosi', 'partner', '+27821234501', true, true, NOW(), NOW()),
('ec000001-0001-4000-8000-000000000002', 'preg0001-0001-4000-8000-000000000001', 'Grace Nkosi', 'mother', '+27821234502', false, true, NOW(), NOW()),

-- Nomsa's contacts
('ec000001-0001-4000-8000-000000000003', 'preg0001-0001-4000-8000-000000000002', 'Themba Dube', 'partner', '+27831234503', true, true, NOW(), NOW()),

-- Lindiwe's contacts (high risk - more contacts)
('ec000001-0001-4000-8000-000000000004', 'preg0001-0001-4000-8000-000000000003', 'Mandla Zulu', 'partner', '+27841234504', true, true, NOW(), NOW()),
('ec000001-0001-4000-8000-000000000005', 'preg0001-0001-4000-8000-000000000003', 'Dr. Mokoena', 'healthcare_provider', '+27821234010', false, true, NOW(), NOW()),
('ec000001-0001-4000-8000-000000000006', 'preg0001-0001-4000-8000-000000000003', 'Nosipho Zulu', 'sister', '+27841234505', false, false, NOW(), NOW()),

-- Kenya contacts
('ec000002-0001-4000-8000-000000000001', 'preg0002-0001-4000-8000-000000000001', 'John Kamau', 'partner', '+254722123501', true, true, NOW(), NOW()),
('ec000002-0001-4000-8000-000000000002', 'preg0002-0001-4000-8000-000000000002', 'Peter Odhiambo', 'partner', '+254733123502', true, true, NOW(), NOW()),

-- Nigeria contacts
('ec000003-0001-4000-8000-000000000001', 'preg0003-0001-4000-8000-000000000001', 'Chidi Okwo', 'partner', '+2348012345501', true, true, NOW(), NOW()),
('ec000003-0001-4000-8000-000000000002', 'preg0003-0001-4000-8000-000000000002', 'Oluwaseun Adeyemi', 'partner', '+2349023456502', true, true, NOW(), NOW());
