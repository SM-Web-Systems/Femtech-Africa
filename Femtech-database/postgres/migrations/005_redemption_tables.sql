-- momentum-database/postgres/migrations/005_redemption_tables.sql
-- Description: Token redemption and partner integration tables
-- Sprint: 7
-- Author: Database & AI Team

-- ============================================================
-- ENUMS
-- ============================================================

-- Partner type
CREATE TYPE partner_type AS ENUM (
    'mobile_money',     -- MTN MoMo, Airtel Money
    'transport',        -- Uber, Bolt, SafeBoda
    'retail',           -- Dischem, Checkers
    'healthcare',       -- Clinics, pharmacies
    'nutrition'         -- Food/nutrition partners
);

-- Redemption status
CREATE TYPE redemption_status AS ENUM (
    'pending',          -- User initiated
    'processing',       -- Being processed
    'awaiting_burn',    -- Token burn pending
    'completed',        -- Successfully completed
    'failed',           -- Failed (tokens refunded)
    'cancelled',        -- User cancelled
    'expired'           -- Expired (not claimed)
);

-- Product category
CREATE TYPE product_category AS ENUM (
    'transport_voucher',
    'mobile_money',
    'data_bundle',
    'nutrition_pack',
    'pharmacy_voucher',
    'clinic_credit',
    'baby_supplies'
);

-- ============================================================
-- TABLES: PARTNERS
-- ============================================================

CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic info
    name VARCHAR(200) NOT NULL,
    type partner_type NOT NULL,
    
    -- Location
    country country_code NOT NULL,
    
    -- Branding
    logo_url VARCHAR(500),
    description TEXT,
    
    -- Integration
    api_endpoint VARCHAR(500),
    api_key_encrypted BYTEA,  -- AES-256 encrypted
    webhook_url VARCHAR(500),
    
    -- Configuration
    config JSONB,  -- Partner-specific config
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE partner_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Partner
    partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    
    -- Product info
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category product_category NOT NULL,
    
    -- Pricing
    token_cost INTEGER NOT NULL,  -- Cost in MTK tokens
    
    -- External
    external_product_id VARCHAR(100),  -- Partner's product ID
    
    -- Media
    image_url VARCHAR(500),
    
    -- Availability
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    stock_quantity INTEGER,  -- NULL = unlimited
    
    -- Limits
    max_per_user_daily INTEGER,
    max_per_user_monthly INTEGER,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLES: REDEMPTIONS
-- ============================================================

CREATE TABLE redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Partner & Product
    partner_id UUID NOT NULL REFERENCES partners(id),
    
    -- Type
    type partner_type NOT NULL,
    
    -- Amount
    total_tokens INTEGER NOT NULL,
    
    -- Status
    status redemption_status NOT NULL DEFAULT 'pending',
    
    -- External references
    external_ref VARCHAR(100),  -- Partner's reference
    disbursement_ref VARCHAR(100),  -- For mobile money
    
    -- Recipient (for mobile money/vouchers)
    recipient_phone VARCHAR(20),
    recipient_name VARCHAR(100),
    
    -- Token burn
    burn_tx_hash VARCHAR(64),
    burn_confirmed_at TIMESTAMPTZ,
    
    -- Completion
    completed_at TIMESTAMPTZ,
    
    -- Error handling
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    
    -- Expiry
    expires_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE redemption_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- References
    redemption_id UUID NOT NULL REFERENCES redemptions(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES partner_products(id),
    
    -- Quantity & Cost
    quantity INTEGER NOT NULL DEFAULT 1,
    token_cost INTEGER NOT NULL,  -- Total cost for this line
    
    -- Voucher code (if applicable)
    voucher_code VARCHAR(100),
    voucher_expires_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLES: NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Type
    type VARCHAR(50) NOT NULL,  -- milestone_completed, appointment_reminder, etc.
    
    -- Content
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    
    -- Data payload
    data JSONB,
    
    -- Channel
    channel VARCHAR(20) NOT NULL,  -- push, sms, email
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, sent, delivered, failed
    
    -- Timestamps
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sms_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Recipient
    phone VARCHAR(20) NOT NULL,
    
    -- Content
    message TEXT NOT NULL,
    template VARCHAR(50),  -- Template name if used
    
    -- Provider
    provider VARCHAR(50) NOT NULL,  -- africas_talking, twilio
    provider_message_id VARCHAR(100),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    
    -- Cost tracking
    cost DECIMAL(10, 4),
    currency VARCHAR(3),
    
    -- Timestamps
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Partners
CREATE INDEX idx_partners_type ON partners(type);
CREATE INDEX idx_partners_country ON partners(country);
CREATE INDEX idx_partners_active ON partners(is_active) WHERE is_active = TRUE;

-- Partner products
CREATE INDEX idx_partner_products_partner_id ON partner_products(partner_id);
CREATE INDEX idx_partner_products_category ON partner_products(category);
CREATE INDEX idx_partner_products_available ON partner_products(is_available) WHERE is_available = TRUE;

-- Redemptions
CREATE INDEX idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX idx_redemptions_partner_id ON redemptions(partner_id);
CREATE INDEX idx_redemptions_status ON redemptions(status);
CREATE INDEX idx_redemptions_created_at ON redemptions(created_at);
CREATE INDEX idx_redemptions_pending ON redemptions(status, created_at) 
    WHERE status IN ('pending', 'processing', 'awaiting_burn');

-- Redemption items
CREATE INDEX idx_redemption_items_redemption_id ON redemption_items(redemption_id);
CREATE INDEX idx_redemption_items_product_id ON redemption_items(product_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;

-- SMS messages
CREATE INDEX idx_sms_messages_user_id ON sms_messages(user_id);
CREATE INDEX idx_sms_messages_phone ON sms_messages(phone);
CREATE INDEX idx_sms_messages_status ON sms_messages(status);
CREATE INDEX idx_sms_messages_provider_id ON sms_messages(provider_message_id);

-- ============================================================
-- ADD FK TO TOKEN_TRANSACTIONS
-- ============================================================

ALTER TABLE token_transactions 
ADD CONSTRAINT token_transactions_redemption_fk 
FOREIGN KEY (redemption_id) REFERENCES redemptions(id);

CREATE INDEX idx_token_tx_redemption_id ON token_transactions(redemption_id) 
    WHERE redemption_id IS NOT NULL;

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_products_updated_at
    BEFORE UPDATE ON partner_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_redemptions_updated_at
    BEFORE UPDATE ON redemptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemption_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE partners IS 'Partner organizations for token redemption';
COMMENT ON TABLE partner_products IS 'Products/services available for redemption';
COMMENT ON TABLE redemptions IS 'Token redemption transactions';
COMMENT ON TABLE redemption_items IS 'Individual items in a redemption';
COMMENT ON TABLE notifications IS 'User notifications (push, in-app)';
COMMENT ON TABLE sms_messages IS 'SMS message logs for auditing';