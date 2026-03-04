-- ============================================
-- FEMTECH AFRICA - TEST REDEMPTIONS
-- ============================================

-- Nomsa's completed redemption (Pick n Pay voucher)
INSERT INTO redemptions (id, user_id, status, total_tokens, burn_tx_id, external_reference, completed_at, created_at, updated_at)
VALUES (
  'red00001-0001-4000-8000-000000000001',
  'u0000001-0001-4000-8000-000000000002',
  'completed',
  250,
  'tx000002-0001-4000-8000-000000000020',
  'PNP-VOUCH-2024-001234',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '20 days'
);

INSERT INTO redemption_items (id, redemption_id, product_id, quantity, token_cost, voucher_code, delivery_data, created_at)
VALUES (
  'ri000001-0001-4000-8000-000000000001',
  'red00001-0001-4000-8000-000000000001',
  'p007-0001-0001-0001-000000000001', -- R50 Pick n Pay Voucher
  1,
  250,
  'PNP-V50-ABC123XYZ',
  '{"sms_sent": true, "sms_timestamp": "2024-01-15T10:30:00Z"}'::jsonb,
  NOW() - INTERVAL '20 days'
);

-- Nomsa's second completed redemption (Clicks prenatal vitamins)
INSERT INTO redemptions (id, user_id, status, total_tokens, burn_tx_id, external_reference, completed_at, created_at, updated_at)
VALUES (
  'red00001-0001-4000-8000-000000000002',
  'u0000001-0001-4000-8000-000000000002',
  'completed',
  350,
  NULL, -- Assume separate burn tx
  'CLICKS-ORD-2024-005678',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days'
);

INSERT INTO redemption_items (id, redemption_id, product_id, quantity, token_cost, voucher_code, delivery_data, created_at)
VALUES (
  'ri000001-0001-4000-8000-000000000002',
  'red00001-0001-4000-8000-000000000002',
  'p003-0001-0001-0001-000000000001', -- Pregnacare Original
  1,
  350,
  'CLICKS-PREG-DEF456GHI',
  '{"pickup_location": "Clicks Rosebank", "pickup_code": "7890"}'::jsonb,
  NOW() - INTERVAL '10 days'
);

-- Wanjiku's completed redemption (M-Pesa Kenya)
INSERT INTO redemptions (id, user_id, status, total_tokens, burn_tx_id, external_reference, completed_at, created_at, updated_at)
VALUES (
  'red00002-0001-4000-8000-000000000001',
  'u0000002-0001-4000-8000-000000000001',
  'completed',
  250,
  NULL,
  'MPESA-TXN-KE-2024-001',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days'
);

INSERT INTO redemption_items (id, redemption_id, product_id, quantity, token_cost, voucher_code, delivery_data, created_at)
VALUES (
  'ri000002-0001-4000-8000-000000000001',
  'red00002-0001-4000-8000-000000000001',
  'p010-0001-0001-0001-000000000003', -- KES 500 M-Pesa
  1,
  250,
  NULL, -- Direct transfer, no voucher code
  '{"mpesa_receipt": "QJK7Y8Z9AB", "phone": "+254722123001", "amount_kes": 500}'::jsonb,
  NOW() - INTERVAL '15 days'
);

-- Wanjiku's pending redemption (transport voucher)
INSERT INTO redemptions (id, user_id, status, total_tokens, external_reference, expires_at, created_at, updated_at)
VALUES (
  'red00002-0001-4000-8000-000000000002',
  'u0000002-0001-4000-8000-000000000001',
  'pending_burn',
  110,
  NULL,
  NOW() + INTERVAL '25 minutes',
  NOW() - INTERVAL '5 minutes',
  NOW() - INTERVAL '5 minutes'
);

INSERT INTO redemption_items (id, redemption_id, product_id, quantity, token_cost, created_at)
VALUES (
  'ri000002-0001-4000-8000-000000000002',
  'red00002-0001-4000-8000-000000000002',
  'p012-0001-0001-0001-000000000001', -- KES 200 Little Cab Credit
  1,
  110,
  NOW() - INTERVAL '5 minutes'
);

-- Adaeze's completed redemption (OPay Nigeria)
INSERT INTO redemptions (id, user_id, status, total_tokens, burn_tx_id, external_reference, completed_at, created_at, updated_at)
VALUES (
  'red00003-0001-4000-8000-000000000001',
  'u0000003-0001-4000-8000-000000000001',
  'completed',
  100,
  NULL,
  'OPAY-TXN-NG-2024-001',
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '8 days'
);

INSERT INTO redemption_items (id, redemption_id, product_id, quantity, token_cost, voucher_code, delivery_data, created_at)
VALUES (
  'ri000003-0001-4000-8000-000000000001',
  'red00003-0001-4000-8000-000000000001',
  'p014-0001-0001-0001-000000000002', -- NGN 1000 OPay
  1,
  100,
  NULL,
  '{"opay_reference": "OP1234567890", "phone": "+2348012345001", "amount_ngn": 1000}'::jsonb,
  NOW() - INTERVAL '8 days'
);

-- Thandi's initiated but not yet burned redemption
INSERT INTO redemptions (id, user_id, status, total_tokens, external_reference, expires_at, created_at, updated_at)
VALUES (
  'red00001-0001-4000-8000-000000000003',
  'u0000001-0001-4000-8000-000000000001',
  'initiated',
  165,
  NULL,
  NOW() + INTERVAL '28 minutes',
  NOW() - INTERVAL '2 minutes',
  NOW() - INTERVAL '2 minutes'
);

INSERT INTO redemption_items (id, redemption_id, product_id, quantity, token_cost, created_at)
VALUES (
  'ri000001-0001-4000-8000-000000000003',
  'red00001-0001-4000-8000-000000000003',
  'p005-0001-0001-0001-000000000001', -- R30 Uber Ride Credit
  1,
  165,
  NOW() - INTERVAL '2 minutes'
);

-- Failed redemption example (expired)
INSERT INTO redemptions (id, user_id, status, total_tokens, failure_reason, expires_at, created_at, updated_at)
VALUES (
  'red00001-0001-4000-8000-000000000004',
  'u0000001-0001-4000-8000-000000000002',
  'expired',
  500,
  'Redemption expired before burn confirmation',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days' - INTERVAL '35 minutes',
  NOW() - INTERVAL '2 days'
);

INSERT INTO redemption_items (id, redemption_id, product_id, quantity, token_cost, created_at)
VALUES (
  'ri000001-0001-4000-8000-000000000004',
  'red00001-0001-4000-8000-000000000004',
  'p007-0001-0001-0001-000000000002', -- R100 Pick n Pay Voucher
  1,
  500,
  NOW() - INTERVAL '2 days' - INTERVAL '35 minutes'
);
