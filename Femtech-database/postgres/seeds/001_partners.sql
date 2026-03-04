-- ============================================
-- FEMTECH AFRICA - PARTNER SEED DATA
-- ============================================

-- ============================================
-- SOUTH AFRICA PARTNERS
-- ============================================

-- MTN Mobile Money (MoMo)
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'a1b2c3d4-1111-4000-8000-000000000001',
  'MTN MoMo',
  'mobile_money',
  'ZA',
  'https://cdn.femtech.africa/partners/mtn-momo.png',
  'MTN Mobile Money - Send money directly to your MTN MoMo wallet. Instant transfers available 24/7.',
  'https://api.mtn.com/v1/disbursements',
  'partner-support@mtn.co.za',
  '+27800123456',
  2.50,
  true,
  NOW(),
  NOW()
);

-- Vodacom (Vodapay)
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'a1b2c3d4-1111-4000-8000-000000000002',
  'Vodapay',
  'mobile_money',
  'ZA',
  'https://cdn.femtech.africa/partners/vodapay.png',
  'Vodapay wallet top-up. Use your tokens to add airtime or data to your Vodacom account.',
  'https://api.vodapay.co.za/v1',
  'merchants@vodacom.co.za',
  '+27821234567',
  2.00,
  true,
  NOW(),
  NOW()
);

-- Clicks Pharmacy
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'a1b2c3d4-1111-4000-8000-000000000003',
  'Clicks',
  'pharmacy',
  'ZA',
  'https://cdn.femtech.africa/partners/clicks.png',
  'Clicks pharmacy vouchers for prenatal vitamins, baby products, and healthcare essentials.',
  'https://api.clicks.co.za/vouchers/v1',
  'corporate@clicks.co.za',
  '+27860254257',
  3.00,
  true,
  NOW(),
  NOW()
);

-- Dis-Chem Pharmacy
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'a1b2c3d4-1111-4000-8000-000000000004',
  'Dis-Chem',
  'pharmacy',
  'ZA',
  'https://cdn.femtech.africa/partners/dischem.png',
  'Dis-Chem vouchers for mother and baby products, vitamins, and clinic services.',
  'https://api.dischem.co.za/partners/v1',
  'partners@dischem.co.za',
  '+27860347243',
  3.00,
  true,
  NOW(),
  NOW()
);

-- Uber (Transport)
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'a1b2c3d4-1111-4000-8000-000000000005',
  'Uber',
  'transport',
  'ZA',
  'https://cdn.femtech.africa/partners/uber.png',
  'Uber ride vouchers for safe transport to clinic appointments and healthcare facilities.',
  'https://api.uber.com/v1.2/vouchers',
  'za-business@uber.com',
  '+27100011234',
  5.00,
  true,
  NOW(),
  NOW()
);

-- Bolt (Transport)
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'a1b2c3d4-1111-4000-8000-000000000006',
  'Bolt',
  'transport',
  'ZA',
  'https://cdn.femtech.africa/partners/bolt.png',
  'Bolt ride credits for affordable transport to medical appointments.',
  'https://partners.bolt.eu/api/v1',
  'za-partners@bolt.eu',
  '+27875501234',
  4.50,
  true,
  NOW(),
  NOW()
);

-- Pick n Pay (Grocery)
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'a1b2c3d4-1111-4000-8000-000000000007',
  'Pick n Pay',
  'grocery',
  'ZA',
  'https://cdn.femtech.africa/partners/pnp.png',
  'Pick n Pay vouchers for groceries, baby food, and household essentials.',
  'https://api.pnp.co.za/vouchers/v2',
  'smartshopper@pnp.co.za',
  '+27800112233',
  2.00,
  true,
  NOW(),
  NOW()
);

-- Shoprite/Checkers (Grocery)
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'a1b2c3d4-1111-4000-8000-000000000008',
  'Shoprite',
  'grocery',
  'ZA',
  'https://cdn.femtech.africa/partners/shoprite.png',
  'Shoprite and Checkers vouchers for affordable groceries and baby products.',
  'https://api.shoprite.co.za/xtra/vouchers',
  'xtra@shoprite.co.za',
  '+27800011222',
  1.50,
  true,
  NOW(),
  NOW()
);

-- Netcare (Healthcare)
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'a1b2c3d4-1111-4000-8000-000000000009',
  'Netcare',
  'healthcare',
  'ZA',
  'https://cdn.femtech.africa/partners/netcare.png',
  'Netcare clinic vouchers for consultations, ultrasounds, and lab tests.',
  'https://api.netcare.co.za/partners/v1',
  'corporatewellness@netcare.co.za',
  '+27860123456',
  0.00,
  true,
  NOW(),
  NOW()
);

-- ============================================
-- KENYA PARTNERS
-- ============================================

-- M-Pesa (Safaricom)
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'b2c3d4e5-2222-4000-8000-000000000001',
  'M-Pesa',
  'mobile_money',
  'KE',
  'https://cdn.femtech.africa/partners/mpesa.png',
  'M-Pesa mobile money. Receive tokens directly to your M-Pesa account.',
  'https://sandbox.safaricom.co.ke/mpesa',
  'mpesa-partners@safaricom.co.ke',
  '+254722000000',
  1.50,
  true,
  NOW(),
  NOW()
);

-- Airtel Money Kenya
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'b2c3d4e5-2222-4000-8000-000000000002',
  'Airtel Money',
  'mobile_money',
  'KE',
  'https://cdn.femtech.africa/partners/airtel-money.png',
  'Airtel Money wallet top-up for payments and transfers.',
  'https://openapiuat.airtel.africa/merchant/v1',
  'ke-partners@airtel.com',
  '+254733100100',
  2.00,
  true,
  NOW(),
  NOW()
);

-- Goodlife Pharmacy Kenya
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'b2c3d4e5-2222-4000-8000-000000000003',
  'Goodlife Pharmacy',
  'pharmacy',
  'KE',
  'https://cdn.femtech.africa/partners/goodlife.png',
  'Goodlife Pharmacy vouchers for prenatal care, vitamins, and baby products.',
  'https://api.goodlife.co.ke/vouchers',
  'corporate@goodlife.co.ke',
  '+254709876000',
  3.50,
  true,
  NOW(),
  NOW()
);

-- Little Cab (Transport)
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'b2c3d4e5-2222-4000-8000-000000000004',
  'Little Cab',
  'transport',
  'KE',
  'https://cdn.femtech.africa/partners/littlecab.png',
  'Little Cab ride vouchers for transport to healthcare appointments.',
  'https://api.littlecab.co.ke/v1',
  'partners@littlecab.co.ke',
  '+254700123456',
  4.00,
  true,
  NOW(),
  NOW()
);

-- Naivas Supermarket
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'b2c3d4e5-2222-4000-8000-000000000005',
  'Naivas',
  'grocery',
  'KE',
  'https://cdn.femtech.africa/partners/naivas.png',
  'Naivas supermarket vouchers for groceries and household essentials.',
  'https://api.naivas.co.ke/loyalty/vouchers',
  'loyalty@naivas.co.ke',
  '+254709789000',
  2.00,
  true,
  NOW(),
  NOW()
);

-- ============================================
-- NIGERIA PARTNERS
-- ============================================

-- OPay
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'c3d4e5f6-3333-4000-8000-000000000001',
  'OPay',
  'mobile_money',
  'NG',
  'https://cdn.femtech.africa/partners/opay.png',
  'OPay wallet. Instant transfers to your OPay account.',
  'https://api.opayweb.com/v1',
  'merchants@opay.ng',
  '+2349012345678',
  2.00,
  true,
  NOW(),
  NOW()
);

-- Paga
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'c3d4e5f6-3333-4000-8000-000000000002',
  'Paga',
  'mobile_money',
  'NG',
  'https://cdn.femtech.africa/partners/paga.png',
  'Paga mobile wallet for easy payments and transfers.',
  'https://api.paga.com/v2',
  'business@paga.com',
  '+2348012345678',
  2.50,
  true,
  NOW(),
  NOW()
);

-- HealthPlus Pharmacy
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'c3d4e5f6-3333-4000-8000-000000000003',
  'HealthPlus',
  'pharmacy',
  'NG',
  'https://cdn.femtech.africa/partners/healthplus.png',
  'HealthPlus pharmacy vouchers for medications and baby care products.',
  'https://api.healthplus.com.ng/vouchers',
  'corporate@healthplus.com.ng',
  '+2347012345678',
  3.00,
  true,
  NOW(),
  NOW()
);

-- Bolt Nigeria
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'c3d4e5f6-3333-4000-8000-000000000004',
  'Bolt',
  'transport',
  'NG',
  'https://cdn.femtech.africa/partners/bolt.png',
  'Bolt ride credits for safe transport in Nigeria.',
  'https://partners.bolt.eu/api/v1',
  'ng-partners@bolt.eu',
  '+2349087654321',
  4.50,
  true,
  NOW(),
  NOW()
);

-- Shoprite Nigeria
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'c3d4e5f6-3333-4000-8000-000000000005',
  'Shoprite',
  'grocery',
  'NG',
  'https://cdn.femtech.africa/partners/shoprite.png',
  'Shoprite vouchers for groceries and household items.',
  'https://api.shoprite.com.ng/vouchers',
  'ng-partners@shoprite.co.za',
  '+2348098765432',
  2.00,
  true,
  NOW(),
  NOW()
);

-- ============================================
-- GHANA PARTNERS
-- ============================================

-- MTN MoMo Ghana
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'd4e5f6g7-4444-4000-8000-000000000001',
  'MTN MoMo',
  'mobile_money',
  'GH',
  'https://cdn.femtech.africa/partners/mtn-momo-gh.png',
  'MTN Mobile Money Ghana. Send rewards directly to your MoMo wallet.',
  'https://proxy.momoapi.mtn.com/collection',
  'momo-partners@mtn.com.gh',
  '+233244000000',
  2.00,
  true,
  NOW(),
  NOW()
);

-- Vodafone Cash Ghana
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'd4e5f6g7-4444-4000-8000-000000000002',
  'Vodafone Cash',
  'mobile_money',
  'GH',
  'https://cdn.femtech.africa/partners/vodafone-cash.png',
  'Vodafone Cash wallet top-up.',
  'https://api.vodafone.com.gh/cash/v1',
  'vcash-partners@vodafone.com.gh',
  '+233202000000',
  2.00,
  true,
  NOW(),
  NOW()
);

-- Ernest Chemists
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'd4e5f6g7-4444-4000-8000-000000000003',
  'Ernest Chemists',
  'pharmacy',
  'GH',
  'https://cdn.femtech.africa/partners/ernest.png',
  'Ernest Chemists vouchers for mother and baby healthcare products.',
  'https://api.ernestchemist.com/vouchers',
  'corporate@ernestchemist.com',
  '+233302123456',
  3.00,
  true,
  NOW(),
  NOW()
);

-- ============================================
-- TANZANIA PARTNERS
-- ============================================

-- M-Pesa Tanzania (Vodacom)
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'e5f6g7h8-5555-4000-8000-000000000001',
  'M-Pesa',
  'mobile_money',
  'TZ',
  'https://cdn.femtech.africa/partners/mpesa-tz.png',
  'Vodacom M-Pesa Tanzania. Instant mobile money transfers.',
  'https://openapi.m-pesa.com/sandbox',
  'mpesa-tz@vodacom.co.tz',
  '+255754000000',
  2.00,
  true,
  NOW(),
  NOW()
);

-- Tigo Pesa
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'e5f6g7h8-5555-4000-8000-000000000002',
  'Tigo Pesa',
  'mobile_money',
  'TZ',
  'https://cdn.femtech.africa/partners/tigopesa.png',
  'Tigo Pesa mobile wallet transfers.',
  'https://api.tigo.co.tz/pesa/v1',
  'partners@tigo.co.tz',
  '+255713000000',
  2.00,
  true,
  NOW(),
  NOW()
);

-- ============================================
-- UGANDA PARTNERS
-- ============================================

-- MTN MoMo Uganda
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'f6g7h8i9-6666-4000-8000-000000000001',
  'MTN MoMo',
  'mobile_money',
  'UG',
  'https://cdn.femtech.africa/partners/mtn-momo-ug.png',
  'MTN Mobile Money Uganda.',
  'https://proxy.momoapi.mtn.com/collection',
  'momo-ug@mtn.co.ug',
  '+256770000000',
  2.00,
  true,
  NOW(),
  NOW()
);

-- Airtel Money Uganda
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'f6g7h8i9-6666-4000-8000-000000000002',
  'Airtel Money',
  'mobile_money',
  'UG',
  'https://cdn.femtech.africa/partners/airtel-money-ug.png',
  'Airtel Money Uganda wallet.',
  'https://openapiuat.airtel.africa/merchant/v1',
  'ug-partners@airtel.com',
  '+256750000000',
  2.00,
  true,
  NOW(),
  NOW()
);

-- SafeBoda
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'f6g7h8i9-6666-4000-8000-000000000003',
  'SafeBoda',
  'transport',
  'UG',
  'https://cdn.femtech.africa/partners/safeboda.png',
  'SafeBoda ride credits for affordable boda-boda transport.',
  'https://api.safeboda.com/v1',
  'partners@safeboda.com',
  '+256780123456',
  3.00,
  true,
  NOW(),
  NOW()
);

-- ============================================
-- RWANDA PARTNERS
-- ============================================

-- MTN MoMo Rwanda
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'g7h8i9j0-7777-4000-8000-000000000001',
  'MTN MoMo',
  'mobile_money',
  'RW',
  'https://cdn.femtech.africa/partners/mtn-momo-rw.png',
  'MTN Mobile Money Rwanda.',
  'https://proxy.momoapi.mtn.com/collection',
  'momo-rw@mtn.co.rw',
  '+250780000000',
  1.50,
  true,
  NOW(),
  NOW()
);

-- Airtel Money Rwanda
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'g7h8i9j0-7777-4000-8000-000000000002',
  'Airtel Money',
  'mobile_money',
  'RW',
  'https://cdn.femtech.africa/partners/airtel-money-rw.png',
  'Airtel Money Rwanda.',
  'https://openapiuat.airtel.africa/merchant/v1',
  'rw-partners@airtel.com',
  '+250730000000',
  1.50,
  true,
  NOW(),
  NOW()
);

-- Move (Rwanda Transport)
INSERT INTO partners (id, name, type, country, logo_url, description, api_base_url, contact_email, contact_phone, commission_percent, is_active, created_at, updated_at)
VALUES (
  'g7h8i9j0-7777-4000-8000-000000000003',
  'Move',
  'transport',
  'RW',
  'https://cdn.femtech.africa/partners/move-rw.png',
  'Move ride credits for transport in Kigali.',
  'https://api.move.rw/v1',
  'partners@move.rw',
  '+250788123456',
  3.50,
  true,
  NOW(),
  NOW()
);
