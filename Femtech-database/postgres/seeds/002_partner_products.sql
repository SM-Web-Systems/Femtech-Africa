-- ============================================
-- FEMTECH AFRICA - PARTNER PRODUCTS SEED DATA
-- ============================================

-- ============================================
-- MTN MOMO SOUTH AFRICA PRODUCTS
-- ============================================

INSERT INTO partner_products (id, partner_id, name, description, category, token_cost, fiat_value, currency, image_url, stock_quantity, max_per_user, max_per_month, requires_kyc, external_sku, sort_order, is_active, created_at, updated_at)
VALUES
-- Mobile Money Top-ups
('p001-0001-0001-0001-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001', 'R10 MoMo Top-up', 'Add R10 to your MTN MoMo wallet instantly.', 'mobile_money', 50, 10.00, 'ZAR', 'https://cdn.femtech.africa/products/momo-10.png', NULL, NULL, 10, false, 'MOMO-ZA-10', 1, true, NOW(), NOW()),
('p001-0001-0001-0001-000000000002', 'a1b2c3d4-1111-4000-8000-000000000001', 'R20 MoMo Top-up', 'Add R20 to your MTN MoMo wallet instantly.', 'mobile_money', 100, 20.00, 'ZAR', 'https://cdn.femtech.africa/products/momo-20.png', NULL, NULL, 10, false, 'MOMO-ZA-20', 2, true, NOW(), NOW()),
('p001-0001-0001-0001-000000000003', 'a1b2c3d4-1111-4000-8000-000000000001', 'R50 MoMo Top-up', 'Add R50 to your MTN MoMo wallet instantly.', 'mobile_money', 250, 50.00, 'ZAR', 'https://cdn.femtech.africa/products/momo-50.png', NULL, NULL, 5, false, 'MOMO-ZA-50', 3, true, NOW(), NOW()),
('p001-0001-0001-0001-000000000004', 'a1b2c3d4-1111-4000-8000-000000000001', 'R100 MoMo Top-up', 'Add R100 to your MTN MoMo wallet.', 'mobile_money', 500, 100.00, 'ZAR', 'https://cdn.femtech.africa/products/momo-100.png', NULL, NULL, 3, true, 'MOMO-ZA-100', 4, true, NOW(), NOW()),

-- ============================================
-- VODAPAY SOUTH AFRICA PRODUCTS
-- ============================================

-- Airtime & Data
('p002-0001-0001-0001-000000000001', 'a1b2c3d4-1111-4000-8000-000000000002', 'R10 Airtime', 'Vodacom airtime voucher.', 'airtime', 50, 10.00, 'ZAR', 'https://cdn.femtech.africa/products/voda-airtime-10.png', NULL, NULL, 10, false, 'VODA-AIR-10', 1, true, NOW(), NOW()),
('p002-0001-0001-0001-000000000002', 'a1b2c3d4-1111-4000-8000-000000000002', 'R29 Data Bundle (500MB)', 'Vodacom 500MB data bundle, valid 30 days.', 'data', 145, 29.00, 'ZAR', 'https://cdn.femtech.africa/products/voda-data-500mb.png', NULL, NULL, 5, false, 'VODA-DATA-500', 2, true, NOW(), NOW()),
('p002-0001-0001-0001-000000000003', 'a1b2c3d4-1111-4000-8000-000000000002', 'R49 Data Bundle (1GB)', 'Vodacom 1GB data bundle, valid 30 days.', 'data', 245, 49.00, 'ZAR', 'https://cdn.femtech.africa/products/voda-data-1gb.png', NULL, NULL, 3, false, 'VODA-DATA-1GB', 3, true, NOW(), NOW()),

-- ============================================
-- CLICKS PHARMACY PRODUCTS
-- ============================================

-- Prenatal Vitamins
('p003-0001-0001-0001-000000000001', 'a1b2c3d4-1111-4000-8000-000000000003', 'Pregnacare Original (30 tablets)', 'Complete prenatal vitamin supplement with folic acid, iron, and vitamin D.', 'prenatal_vitamins', 350, 189.99, 'ZAR', 'https://cdn.femtech.africa/products/pregnacare-30.png', 500, 2, 2, false, 'CLICKS-PREG-30', 1, true, NOW(), NOW()),
('p003-0001-0001-0001-000000000002', 'a1b2c3d4-1111-4000-8000-000000000003', 'Solal Prenatal (60 capsules)', 'Advanced prenatal formula with omega-3.', 'prenatal_vitamins', 450, 249.99, 'ZAR', 'https://cdn.femtech.africa/products/solal-prenatal.png', 300, 2, 2, false, 'CLICKS-SOLAL-60', 2, true, NOW(), NOW()),

-- Baby Products
('p003-0001-0001-0001-000000000003', 'a1b2c3d4-1111-4000-8000-000000000003', 'Pampers Newborn (50 pack)', 'Pampers Premium Care newborn diapers.', 'baby_care', 300, 169.99, 'ZAR', 'https://cdn.femtech.africa/products/pampers-nb-50.png', 1000, 3, 6, false, 'CLICKS-PAMP-NB50', 10, true, NOW(), NOW()),
('p003-0001-0001-0001-000000000004', 'a1b2c3d4-1111-4000-8000-000000000003', 'Johnson''s Baby Lotion (500ml)', 'Gentle baby lotion for daily moisturizing.', 'baby_care', 100, 54.99, 'ZAR', 'https://cdn.femtech.africa/products/johnsons-lotion.png', 800, 5, 10, false, 'CLICKS-JB-LOT500', 11, true, NOW(), NOW()),

-- Healthcare Essentials
('p003-0001-0001-0001-000000000005', 'a1b2c3d4-1111-4000-8000-000000000003', 'Digital Thermometer', 'Clicks digital thermometer for baby.', 'healthcare', 150, 79.99, 'ZAR', 'https://cdn.femtech.africa/products/thermometer.png', 200, 1, 1, false, 'CLICKS-THERM-DIG', 20, true, NOW(), NOW()),
('p003-0001-0001-0001-000000000006', 'a1b2c3d4-1111-4000-8000-000000000003', 'Breast Pump Manual', 'Clicks manual breast pump for expressing milk.', 'breastfeeding', 400, 219.99, 'ZAR', 'https://cdn.femtech.africa/products/breast-pump-manual.png', 100, 1, 1, false, 'CLICKS-BP-MAN', 21, true, NOW(), NOW()),

-- R50/R100 Vouchers
('p003-0001-0001-0001-000000000007', 'a1b2c3d4-1111-4000-8000-000000000003', 'R50 Clicks Voucher', 'R50 voucher for any Clicks store purchase.', 'voucher', 250, 50.00, 'ZAR', 'https://cdn.femtech.africa/products/clicks-voucher-50.png', NULL, 5, 10, false, 'CLICKS-VOUCH-50', 30, true, NOW(), NOW()),
('p003-0001-0001-0001-000000000008', 'a1b2c3d4-1111-4000-8000-000000000003', 'R100 Clicks Voucher', 'R100 voucher for any Clicks store purchase.', 'voucher', 500, 100.00, 'ZAR', 'https://cdn.femtech.africa/products/clicks-voucher-100.png', NULL, 3, 6, false, 'CLICKS-VOUCH-100', 31, true, NOW(), NOW()),

-- ============================================
-- DIS-CHEM PHARMACY PRODUCTS
-- ============================================

('p004-0001-0001-0001-000000000001', 'a1b2c3d4-1111-4000-8000-000000000004', 'Elevit Pronatal (30 tablets)', 'Premium prenatal multivitamin.', 'prenatal_vitamins', 400, 219.99, 'ZAR', 'https://cdn.femtech.africa/products/elevit-30.png', 400, 2, 2, false, 'DISCHEM-ELEV-30', 1, true, NOW(), NOW()),
('p004-0001-0001-0001-000000000002', 'a1b2c3d4-1111-4000-8000-000000000004', 'Huggies Newborn (64 pack)', 'Huggies Gold newborn diapers.', 'baby_care', 350, 189.99, 'ZAR', 'https://cdn.femtech.africa/products/huggies-nb-64.png', 800, 3, 6, false, 'DISCHEM-HUG-NB64', 10, true, NOW(), NOW()),
('p004-0001-0001-0001-000000000003', 'a1b2c3d4-1111-4000-8000-000000000004', 'Dis-Chem Clinic Visit', 'Voucher for one clinic consultation at Dis-Chem.', 'clinic', 200, 120.00, 'ZAR', 'https://cdn.femtech.africa/products/dischem-clinic.png', NULL, 2, 4, true, 'DISCHEM-CLINIC-1', 40, true, NOW(), NOW()),

-- ============================================
-- UBER SOUTH AFRICA PRODUCTS
-- ============================================

('p005-0001-0001-0001-000000000001', 'a1b2c3d4-1111-4000-8000-000000000005', 'R30 Uber Ride Credit', 'Uber ride credit for clinic visits.', 'transport', 165, 30.00, 'ZAR', 'https://cdn.femtech.africa/products/uber-30.png', NULL, 10, 20, false, 'UBER-ZA-30', 1, true, NOW(), NOW()),
('p005-0001-0001-0001-000000000002', 'a1b2c3d4-1111-4000-8000-000000000005', 'R50 Uber Ride Credit', 'Uber ride credit for clinic visits.', 'transport', 275, 50.00, 'ZAR', 'https://cdn.femtech.africa/products/uber-50.png', NULL, 6, 12, false, 'UBER-ZA-50', 2, true, NOW(), NOW()),
('p005-0001-0001-0001-000000000003', 'a1b2c3d4-1111-4000-8000-000000000005', 'R100 Uber Ride Credit', 'Uber ride credit for clinic visits.', 'transport', 550, 100.00, 'ZAR', 'https://cdn.femtech.africa/products/uber-100.png', NULL, 3, 6, true, 'UBER-ZA-100', 3, true, NOW(), NOW()),

-- ============================================
-- BOLT SOUTH AFRICA PRODUCTS
-- ============================================

('p006-0001-0001-0001-000000000001', 'a1b2c3d4-1111-4000-8000-000000000006', 'R25 Bolt Credit', 'Bolt ride credit.', 'transport', 135, 25.00, 'ZAR', 'https://cdn.femtech.africa/products/bolt-25.png', NULL, 12, 24, false, 'BOLT-ZA-25', 1, true, NOW(), NOW()),
('p006-0001-0001-0001-000000000002', 'a1b2c3d4-1111-4000-8000-000000000006', 'R50 Bolt Credit', 'Bolt ride credit.', 'transport', 270, 50.00, 'ZAR', 'https://cdn.femtech.africa/products/bolt-50.png', NULL, 6, 12, false, 'BOLT-ZA-50', 2, true, NOW(), NOW()),

-- ============================================
-- PICK N PAY PRODUCTS
-- ============================================

('p007-0001-0001-0001-000000000001', 'a1b2c3d4-1111-4000-8000-000000000007', 'R50 Pick n Pay Voucher', 'Grocery voucher for Pick n Pay stores.', 'grocery', 250, 50.00, 'ZAR', 'https://cdn.femtech.africa/products/pnp-50.png', NULL, 5, 10, false, 'PNP-VOUCH-50', 1, true, NOW(), NOW()),
('p007-0001-0001-0001-000000000002', 'a1b2c3d4-1111-4000-8000-000000000007', 'R100 Pick n Pay Voucher', 'Grocery voucher for Pick n Pay stores.', 'grocery', 500, 100.00, 'ZAR', 'https://cdn.femtech.africa/products/pnp-100.png', NULL, 3, 6, false, 'PNP-VOUCH-100', 2, true, NOW(), NOW()),
('p007-0001-0001-0001-000000000003', 'a1b2c3d4-1111-4000-8000-000000000007', 'R200 Pick n Pay Voucher', 'Grocery voucher for Pick n Pay stores.', 'grocery', 1000, 200.00, 'ZAR', 'https://cdn.femtech.africa/products/pnp-200.png', NULL, 2, 4, true, 'PNP-VOUCH-200', 3, true, NOW(), NOW()),

-- ============================================
-- SHOPRITE PRODUCTS
-- ============================================

('p008-0001-0001-0001-000000000001', 'a1b2c3d4-1111-4000-8000-000000000008', 'R50 Shoprite Voucher', 'Shoprite/Checkers grocery voucher.', 'grocery', 250, 50.00, 'ZAR', 'https://cdn.femtech.africa/products/shoprite-50.png', NULL, 5, 10, false, 'SHOP-VOUCH-50', 1, true, NOW(), NOW()),
('p008-0001-0001-0001-000000000002', 'a1b2c3d4-1111-4000-8000-000000000008', 'R100 Shoprite Voucher', 'Shoprite/Checkers grocery voucher.', 'grocery', 500, 100.00, 'ZAR', 'https://cdn.femtech.africa/products/shoprite-100.png', NULL, 3, 6, false, 'SHOP-VOUCH-100', 2, true, NOW(), NOW()),

-- ============================================
-- NETCARE HEALTHCARE PRODUCTS
-- ============================================

('p009-0001-0001-0001-000000000001', 'a1b2c3d4-1111-4000-8000-000000000009', 'Basic Pregnancy Ultrasound', 'Voucher for a basic pregnancy ultrasound at Netcare.', 'ultrasound', 800, 650.00, 'ZAR', 'https://cdn.femtech.africa/products/netcare-ultra-basic.png', NULL, 2, 4, true, 'NETCARE-ULTRA-B', 1, true, NOW(), NOW()),
('p009-0001-0001-0001-000000000002', 'a1b2c3d4-1111-4000-8000-000000000009', 'Detailed Anatomy Scan', 'Voucher for detailed anatomy scan (20 weeks).', 'ultrasound', 1200, 950.00, 'ZAR', 'https://cdn.femtech.africa/products/netcare-ultra-detail.png', NULL, 1, 2, true, 'NETCARE-ULTRA-D', 2, true, NOW(), NOW()),
('p009-0001-0001-0001-000000000003', 'a1b2c3d4-1111-4000-8000-000000000009', 'Blood Test Panel', 'Comprehensive pregnancy blood panel.', 'lab_test', 500, 400.00, 'ZAR', 'https://cdn.femtech.africa/products/netcare-blood.png', NULL, 2, 4, true, 'NETCARE-BLOOD-1', 10, true, NOW(), NOW()),

-- ============================================
-- M-PESA KENYA PRODUCTS
-- ============================================

('p010-0001-0001-0001-000000000001', 'b2c3d4e5-2222-4000-8000-000000000001', 'KES 100 M-Pesa', 'Receive KES 100 to your M-Pesa.', 'mobile_money', 50, 100.00, 'KES', 'https://cdn.femtech.africa/products/mpesa-100.png', NULL, NULL, 20, false, 'MPESA-KE-100', 1, true, NOW(), NOW()),
('p010-0001-0001-0001-000000000002', 'b2c3d4e5-2222-4000-8000-000000000001', 'KES 200 M-Pesa', 'Receive KES 200 to your M-Pesa.', 'mobile_money', 100, 200.00, 'KES', 'https://cdn.femtech.africa/products/mpesa-200.png', NULL, NULL, 15, false, 'MPESA-KE-200', 2, true, NOW(), NOW()),
('p010-0001-0001-0001-000000000003', 'b2c3d4e5-2222-4000-8000-000000000001', 'KES 500 M-Pesa', 'Receive KES 500 to your M-Pesa.', 'mobile_money', 250, 500.00, 'KES', 'https://cdn.femtech.africa/products/mpesa-500.png', NULL, NULL, 10, false, 'MPESA-KE-500', 3, true, NOW(), NOW()),
('p010-0001-0001-0001-000000000004', 'b2c3d4e5-2222-4000-8000-000000000001', 'KES 1000 M-Pesa', 'Receive KES 1000 to your M-Pesa.', 'mobile_money', 500, 1000.00, 'KES', 'https://cdn.femtech.africa/products/mpesa-1000.png', NULL, NULL, 5, true, 'MPESA-KE-1000', 4, true, NOW(), NOW()),

-- ============================================
-- GOODLIFE PHARMACY KENYA PRODUCTS
-- ============================================

('p011-0001-0001-0001-000000000001', 'b2c3d4e5-2222-4000-8000-000000000003', 'Pregnacare (30 tablets)', 'Prenatal vitamins.', 'prenatal_vitamins', 300, 2500.00, 'KES', 'https://cdn.femtech.africa/products/goodlife-pregnacare.png', 300, 2, 2, false, 'GOODLIFE-PREG-30', 1, true, NOW(), NOW()),
('p011-0001-0001-0001-000000000002', 'b2c3d4e5-2222-4000-8000-000000000003', 'Pampers Newborn (44 pack)', 'Pampers newborn diapers.', 'baby_care', 280, 2200.00, 'KES', 'https://cdn.femtech.africa/products/goodlife-pampers.png', 500, 3, 6, false, 'GOODLIFE-PAMP-44', 10, true, NOW(), NOW()),
('p011-0001-0001-0001-000000000003', 'b2c3d4e5-2222-4000-8000-000000000003', 'KES 500 Goodlife Voucher', 'Voucher for any Goodlife Pharmacy.', 'voucher', 250, 500.00, 'KES', 'https://cdn.femtech.africa/products/goodlife-500.png', NULL, 5, 10, false, 'GOODLIFE-VOUCH-500', 30, true, NOW(), NOW()),

-- ============================================
-- LITTLE CAB KENYA PRODUCTS
-- ============================================

('p012-0001-0001-0001-000000000001', 'b2c3d4e5-2222-4000-8000-000000000004', 'KES 200 Little Cab Credit', 'Ride credit for clinic visits.', 'transport', 110, 200.00, 'KES', 'https://cdn.femtech.africa/products/littlecab-200.png', NULL, 10, 20, false, 'LITTLE-KE-200', 1, true, NOW(), NOW()),
('p012-0001-0001-0001-000000000002', 'b2c3d4e5-2222-4000-8000-000000000004', 'KES 500 Little Cab Credit', 'Ride credit for clinic visits.', 'transport', 275, 500.00, 'KES', 'https://cdn.femtech.africa/products/littlecab-500.png', NULL, 6, 12, false, 'LITTLE-KE-500', 2, true, NOW(), NOW()),

-- ============================================
-- NAIVAS KENYA PRODUCTS
-- ============================================

('p013-0001-0001-0001-000000000001', 'b2c3d4e5-2222-4000-8000-000000000005', 'KES 500 Naivas Voucher', 'Grocery voucher for Naivas supermarkets.', 'grocery', 250, 500.00, 'KES', 'https://cdn.femtech.africa/products/naivas-500.png', NULL, 5, 10, false, 'NAIVAS-VOUCH-500', 1, true, NOW(), NOW()),
('p013-0001-0001-0001-000000000002', 'b2c3d4e5-2222-4000-8000-000000000005', 'KES 1000 Naivas Voucher', 'Grocery voucher for Naivas supermarkets.', 'grocery', 500, 1000.00, 'KES', 'https://cdn.femtech.africa/products/naivas-1000.png', NULL, 3, 6, false, 'NAIVAS-VOUCH-1000', 2, true, NOW(), NOW()),

-- ============================================
-- OPAY NIGERIA PRODUCTS
-- ============================================

('p014-0001-0001-0001-000000000001', 'c3d4e5f6-3333-4000-8000-000000000001', 'NGN 500 OPay', 'Receive NGN 500 to your OPay wallet.', 'mobile_money', 50, 500.00, 'NGN', 'https://cdn.femtech.africa/products/opay-500.png', NULL, NULL, 20, false, 'OPAY-NG-500', 1, true, NOW(), NOW()),
('p014-0001-0001-0001-000000000002', 'c3d4e5f6-3333-4000-8000-000000000001', 'NGN 1000 OPay', 'Receive NGN 1000 to your OPay wallet.', 'mobile_money', 100, 1000.00, 'NGN', 'https://cdn.femtech.africa/products/opay-1000.png', NULL, NULL, 15, false, 'OPAY-NG-1000', 2, true, NOW(), NOW()),
('p014-0001-0001-0001-000000000003', 'c3d4e5f6-3333-4000-8000-000000000001', 'NGN 2000 OPay', 'Receive NGN 2000 to your OPay wallet.', 'mobile_money', 200, 2000.00, 'NGN', 'https://cdn.femtech.africa/products/opay-2000.png', NULL, NULL, 10, false, 'OPAY-NG-2000', 3, true, NOW(), NOW()),
('p014-0001-0001-0001-000000000004', 'c3d4e5f6-3333-4000-8000-000000000001', 'NGN 5000 OPay', 'Receive NGN 5000 to your OPay wallet.', 'mobile_money', 500, 5000.00, 'NGN', 'https://cdn.femtech.africa/products/opay-5000.png', NULL, NULL, 5, true, 'OPAY-NG-5000', 4, true, NOW(), NOW()),

-- ============================================
-- HEALTHPLUS NIGERIA PRODUCTS
-- ============================================

('p015-0001-0001-0001-000000000001', 'c3d4e5f6-3333-4000-8000-000000000003', 'Pregnacare Plus (30 tablets)', 'Prenatal vitamins with omega-3.', 'prenatal_vitamins', 400, 12000.00, 'NGN', 'https://cdn.femtech.africa/products/healthplus-pregnacare.png', 200, 2, 2, false, 'HPLUS-PREG-30', 1, true, NOW(), NOW()),
('p015-0001-0001-0001-000000000002', 'c3d4e5f6-3333-4000-8000-000000000003', 'Pampers Newborn (40 pack)', 'Pampers newborn diapers.', 'baby_care', 350, 9500.00, 'NGN', 'https://cdn.femtech.africa/products/healthplus-pampers.png', 400, 3, 6, false, 'HPLUS-PAMP-40', 10, true, NOW(), NOW()),
('p015-0001-0001-0001-000000000003', 'c3d4e5f6-3333-4000-8000-000000000003', 'NGN 2000 HealthPlus Voucher', 'Voucher for HealthPlus pharmacies.', 'voucher', 200, 2000.00, 'NGN', 'https://cdn.femtech.africa/products/healthplus-2000.png', NULL, 5, 10, false, 'HPLUS-VOUCH-2000', 30, true, NOW(), NOW()),

-- ============================================
-- MTN MOMO GHANA PRODUCTS
-- ============================================

('p016-0001-0001-0001-000000000001', 'd4e5f6g7-4444-4000-8000-000000000001', 'GHS 5 MoMo', 'Receive GHS 5 to your MTN MoMo.', 'mobile_money', 50, 5.00, 'GHS', 'https://cdn.femtech.africa/products/momo-gh-5.png', NULL, NULL, 20, false, 'MOMO-GH-5', 1, true, NOW(), NOW()),
('p016-0001-0001-0001-000000000002', 'd4e5f6g7-4444-4000-8000-000000000001', 'GHS 10 MoMo', 'Receive GHS 10 to your MTN MoMo.', 'mobile_money', 100, 10.00, 'GHS', 'https://cdn.femtech.africa/products/momo-gh-10.png', NULL, NULL, 15, false, 'MOMO-GH-10', 2, true, NOW(), NOW()),
('p016-0001-0001-0001-000000000003', 'd4e5f6g7-4444-4000-8000-000000000001', 'GHS 20 MoMo', 'Receive GHS 20 to your MTN MoMo.', 'mobile_money', 200, 20.00, 'GHS', 'https://cdn.femtech.africa/products/momo-gh-20.png', NULL, NULL, 10, false, 'MOMO-GH-20', 3, true, NOW(), NOW()),
('p016-0001-0001-0001-000000000004', 'd4e5f6g7-4444-4000-8000-000000000001', 'GHS 50 MoMo', 'Receive GHS 50 to your MTN MoMo.', 'mobile_money', 500, 50.00, 'GHS', 'https://cdn.femtech.africa/products/momo-gh-50.png', NULL, NULL, 5, true, 'MOMO-GH-50', 4, true, NOW(), NOW()),

-- ============================================
-- MTN MOMO UGANDA PRODUCTS
-- ============================================

('p017-0001-0001-0001-000000000001', 'f6g7h8i9-6666-4000-8000-000000000001', 'UGX 5000 MoMo', 'Receive UGX 5000 to your MTN MoMo.', 'mobile_money', 50, 5000.00, 'UGX', 'https://cdn.femtech.africa/products/momo-ug-5000.png', NULL, NULL, 20, false, 'MOMO-UG-5000', 1, true, NOW(), NOW()),
('p017-0001-0001-0001-000000000002', 'f6g7h8i9-6666-4000-8000-000000000001', 'UGX 10000 MoMo', 'Receive UGX 10000 to your MTN MoMo.', 'mobile_money', 100, 10000.00, 'UGX', 'https://cdn.femtech.africa/products/momo-ug-10000.png', NULL, NULL, 15, false, 'MOMO-UG-10000', 2, true, NOW(), NOW()),
('p017-0001-0001-0001-000000000003', 'f6g7h8i9-6666-4000-8000-000000000001', 'UGX 20000 MoMo', 'Receive UGX 20000 to your MTN MoMo.', 'mobile_money', 200, 20000.00, 'UGX', 'https://cdn.femtech.africa/products/momo-ug-20000.png', NULL, NULL, 10, false, 'MOMO-UG-20000', 3, true, NOW(), NOW()),

-- ============================================
-- SAFEBODA UGANDA PRODUCTS
-- ============================================

('p018-0001-0001-0001-000000000001', 'f6g7h8i9-6666-4000-8000-000000000003', 'UGX 5000 SafeBoda Credit', 'Boda-boda ride credit.', 'transport', 60, 5000.00, 'UGX', 'https://cdn.femtech.africa/products/safeboda-5000.png', NULL, 15, 30, false, 'SAFEBODA-5000', 1, true, NOW(), NOW()),
('p018-0001-0001-0001-000000000002', 'f6g7h8i9-6666-4000-8000-000000000003', 'UGX 10000 SafeBoda Credit', 'Boda-boda ride credit.', 'transport', 120, 10000.00, 'UGX', 'https://cdn.femtech.africa/products/safeboda-10000.png', NULL, 10, 20, false, 'SAFEBODA-10000', 2, true, NOW(), NOW()),

-- ============================================
-- MTN MOMO RWANDA PRODUCTS
-- ============================================

('p019-0001-0001-0001-000000000001', 'g7h8i9j0-7777-4000-8000-000000000001', 'RWF 500 MoMo', 'Receive RWF 500 to your MTN MoMo.', 'mobile_money', 50, 500.00, 'RWF', 'https://cdn.femtech.africa/products/momo-rw-500.png', NULL, NULL, 20, false, 'MOMO-RW-500', 1, true, NOW(), NOW()),
('p019-0001-0001-0001-000000000002', 'g7h8i9j0-7777-4000-8000-000000000001', 'RWF 1000 MoMo', 'Receive RWF 1000 to your MTN MoMo.', 'mobile_money', 100, 1000.00, 'RWF', 'https://cdn.femtech.africa/products/momo-rw-1000.png', NULL, NULL, 15, false, 'MOMO-RW-1000', 2, true, NOW(), NOW()),
('p019-0001-0001-0001-000000000003', 'g7h8i9j0-7777-4000-8000-000000000001', 'RWF 2000 MoMo', 'Receive RWF 2000 to your MTN MoMo.', 'mobile_money', 200, 2000.00, 'RWF', 'https://cdn.femtech.africa/products/momo-rw-2000.png', NULL, NULL, 10, false, 'MOMO-RW-2000', 3, true, NOW(), NOW()),

-- ============================================
-- M-PESA TANZANIA PRODUCTS
-- ============================================

('p020-0001-0001-0001-000000000001', 'e5f6g7h8-5555-4000-8000-000000000001', 'TZS 1000 M-Pesa', 'Receive TZS 1000 to your M-Pesa.', 'mobile_money', 50, 1000.00, 'TZS', 'https://cdn.femtech.africa/products/mpesa-tz-1000.png', NULL, NULL, 20, false, 'MPESA-TZ-1000', 1, true, NOW(), NOW()),
('p020-0001-0001-0001-000000000002', 'e5f6g7h8-5555-4000-8000-000000000001', 'TZS 2000 M-Pesa', 'Receive TZS 2000 to your M-Pesa.', 'mobile_money', 100, 2000.00, 'TZS', 'https://cdn.femtech.africa/products/mpesa-tz-2000.png', NULL, NULL, 15, false, 'MPESA-TZ-2000', 2, true, NOW(), NOW()),
('p020-0001-0001-0001-000000000003', 'e5f6g7h8-5555-4000-8000-000000000001', 'TZS 5000 M-Pesa', 'Receive TZS 5000 to your M-Pesa.', 'mobile_money', 250, 5000.00, 'TZS', 'https://cdn.femtech.africa/products/mpesa-tz-5000.png', NULL, NULL, 10, false, 'MPESA-TZ-5000', 3, true, NOW(), NOW());
