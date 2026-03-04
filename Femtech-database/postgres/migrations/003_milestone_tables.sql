-- momentum-database/postgres/migrations/003_milestone_tables.sql
-- Description: Milestone definitions, progress tracking, and token transactions
-- Sprint: 3-4
-- Author: Database & AI Team

-- ============================================================
-- ENUMS
-- ============================================================

-- Milestone category
CREATE TYPE milestone_category AS ENUM (
    'clinical',     -- ANC visits, lab tests, ultrasounds
    'wellness',     -- Daily check-ins, vitamin tracking
    'education',    -- Quiz completions, article reading
    'community'     -- Peer support, journey sharing
);

-- Milestone status
CREATE TYPE milestone_status AS ENUM (
    'locked',       -- Not yet available
    'available',    -- Can be started
    'in_progress',  -- Started but not complete
    'pending_verification',  -- Awaiting verification
    'completed',    -- Successfully completed
    'expired'       -- Time window passed
);

-- Verification type
CREATE TYPE verification_type AS ENUM (
    'qr_scan',          -- QR code scan at facility
    'provider_signature', -- Healthcare provider signs
    'system_automatic',   -- Automatic (quiz, check-in streak)
    'photo_proof',        -- Photo evidence (deprecated)
    'self_reported'       -- Self-reported (limited rewards)
);

-- Token transaction type
CREATE TYPE token_tx_type AS ENUM (
    'mint_milestone',   -- Minted for milestone completion
    'mint_referral',    -- Minted for referral bonus
    'mint_grant',       -- Minted from NGO grant
    'burn_redemption',  -- Burned for redemption
    'burn_expired',     -- Burned due to expiry (if applicable)
    'transfer_in',      -- Received from another user
    'transfer_out'      -- Sent to another user
);

-- Transaction status
CREATE TYPE token_tx_status AS ENUM (
    'pending',      -- Transaction initiated
    'processing',   -- Being processed on blockchain
    'confirmed',    -- Confirmed on blockchain
    'failed'        -- Transaction failed
);

-- Verifier type
CREATE TYPE verifier_type AS ENUM (
    'clinic',           -- Healthcare facility
    'chw',              -- Community Health Worker
    'digital_doula',    -- Digital Doula
    'system'            -- Automated system
);

-- ============================================================
-- TABLES: MILESTONE DEFINITIONS
-- ============================================================

CREATE TABLE milestone_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identification
    code VARCHAR(50) NOT NULL,  -- e.g., 'ANC_VISIT_1', 'CHECKIN_7DAY'
    
    -- Display
    name VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(50),  -- Icon name/code
    
    -- Classification
    category milestone_category NOT NULL,
    country country_code,  -- NULL = all countries
    
    -- Rewards
    reward_amount INTEGER NOT NULL,  -- Token amount
    
    -- Constraints
    max_claims_per_pregnancy INTEGER NOT NULL DEFAULT 1,
    requires_verification BOOLEAN NOT NULL DEFAULT TRUE,
    verification_types verification_type[] NOT NULL DEFAULT ARRAY['qr_scan']::verification_type[],
    
    -- Timing
    gestational_week_min INTEGER,  -- Earliest week to claim
    gestational_week_max INTEGER,  -- Latest week to claim
    days_to_complete INTEGER,       -- Time limit after starting
    
    -- Dependencies
    prerequisite_milestones UUID[],  -- Must complete these first
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT milestone_definitions_code_country_unique UNIQUE (code, country)
);

-- ============================================================
-- TABLES: USER MILESTONES (Progress)
-- ============================================================

CREATE TABLE user_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- References
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE SET NULL,
    milestone_def_id UUID NOT NULL REFERENCES milestone_definitions(id),
    
    -- Status
    status milestone_status NOT NULL DEFAULT 'available',
    
    -- Progress
    progress INTEGER NOT NULL DEFAULT 0,  -- 0-100
    progress_data JSONB,  -- Category-specific progress data
    
    -- Completion
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    -- Reward
    reward_amount INTEGER,  -- Actual amount rewarded
    reward_minted BOOLEAN NOT NULL DEFAULT FALSE,
    reward_tx_hash VARCHAR(64),  -- Stellar transaction hash
    reward_minted_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT user_milestones_unique UNIQUE (user_id, pregnancy_id, milestone_def_id)
);

-- ============================================================
-- TABLES: VERIFICATIONS
-- ============================================================

CREATE TABLE verifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User link (optional - system verifiers don't have users)
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Facility link
    facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
    
    -- Type
    verifier_type verifier_type NOT NULL,
    
    -- Identification
    verification_code VARCHAR(20) NOT NULL,  -- For QR generation
    name VARCHAR(200) NOT NULL,
    
    -- Credentials
    credential_number VARCHAR(100),  -- Professional license number
    credential_verified BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Stats
    total_verifications INTEGER NOT NULL DEFAULT 0,
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT verifiers_code_unique UNIQUE (verification_code)
);

CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- References
    user_milestone_id UUID NOT NULL REFERENCES user_milestones(id) ON DELETE CASCADE,
    verifier_id UUID REFERENCES verifiers(id) ON DELETE SET NULL,
    
    -- Type
    verification_type verification_type NOT NULL,
    
    -- Proof
    verification_hash VARCHAR(64) NOT NULL,  -- SHA-256 of proof data
    qr_code_data TEXT,  -- Scanned QR data
    signature BYTEA,  -- Digital signature if applicable
    
    -- Metadata
    metadata JSONB,  -- Additional verification data
    
    -- Location (for fraud detection)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Timestamps
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLES: TOKEN TRANSACTIONS
-- ============================================================

CREATE TABLE token_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Type & Status
    type token_tx_type NOT NULL,
    status token_tx_status NOT NULL DEFAULT 'pending',
    
    -- Amount
    amount INTEGER NOT NULL,
    
    -- Blockchain
    tx_hash VARCHAR(64),  -- Stellar transaction hash
    stellar_tx_id VARCHAR(64),  -- Stellar ledger sequence
    
    -- References
    milestone_id UUID REFERENCES user_milestones(id),
    redemption_id UUID,  -- FK added later
    
    -- Error handling
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES: MILESTONES
-- ============================================================

-- Milestone definitions
CREATE INDEX idx_milestone_definitions_category ON milestone_definitions(category);
CREATE INDEX idx_milestone_definitions_country ON milestone_definitions(country);
CREATE INDEX idx_milestone_definitions_active ON milestone_definitions(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_milestone_definitions_code ON milestone_definitions(code);

-- User milestones
CREATE INDEX idx_user_milestones_user_id ON user_milestones(user_id);
CREATE INDEX idx_user_milestones_pregnancy_id ON user_milestones(pregnancy_id);
CREATE INDEX idx_user_milestones_status ON user_milestones(status);
CREATE INDEX idx_user_milestones_def_id ON user_milestones(milestone_def_id);
CREATE INDEX idx_user_milestones_pending ON user_milestones(user_id, status) 
    WHERE status IN ('available', 'in_progress', 'pending_verification');
CREATE INDEX idx_user_milestones_completed ON user_milestones(user_id, completed_at) 
    WHERE status = 'completed';

-- Verifiers
CREATE INDEX idx_verifiers_user_id ON verifiers(user_id);
CREATE INDEX idx_verifiers_facility_id ON verifiers(facility_id);
CREATE INDEX idx_verifiers_type ON verifiers(verifier_type);
CREATE INDEX idx_verifiers_code ON verifiers(verification_code);
CREATE INDEX idx_verifiers_active ON verifiers(is_active) WHERE is_active = TRUE;

-- Verifications
CREATE INDEX idx_verifications_milestone_id ON verifications(user_milestone_id);
CREATE INDEX idx_verifications_verifier_id ON verifications(verifier_id);
CREATE INDEX idx_verifications_hash ON verifications(verification_hash);
CREATE INDEX idx_verifications_verified_at ON verifications(verified_at);

-- Token transactions
CREATE INDEX idx_token_tx_user_id ON token_transactions(user_id);
CREATE INDEX idx_token_tx_type ON token_transactions(type);
CREATE INDEX idx_token_tx_status ON token_transactions(status);
CREATE INDEX idx_token_tx_hash ON token_transactions(tx_hash) WHERE tx_hash IS NOT NULL;
CREATE INDEX idx_token_tx_milestone_id ON token_transactions(milestone_id);
CREATE INDEX idx_token_tx_created_at ON token_transactions(created_at);
CREATE INDEX idx_token_tx_pending ON token_transactions(status, created_at) 
    WHERE status IN ('pending', 'processing');

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_milestone_definitions_updated_at
    BEFORE UPDATE ON milestone_definitions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_milestones_updated_at
    BEFORE UPDATE ON user_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verifiers_updated_at
    BEFORE UPDATE ON verifiers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-increment verifier count
CREATE OR REPLACE FUNCTION increment_verifier_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE verifiers 
    SET total_verifications = total_verifications + 1
    WHERE id = NEW.verifier_id;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_verifier_count_trigger
    AFTER INSERT ON verifications
    FOR EACH ROW
    WHEN (NEW.verifier_id IS NOT NULL)
    EXECUTE FUNCTION increment_verifier_count();

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE user_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE milestone_definitions IS 'Master list of all possible milestones';
COMMENT ON TABLE user_milestones IS 'Individual user progress on milestones';
COMMENT ON TABLE verifiers IS 'Authorized verifiers (clinics, CHWs, Doulas)';
COMMENT ON TABLE verifications IS 'Verification records for milestone completion';
COMMENT ON TABLE token_transactions IS 'All token mint/burn transactions';

COMMENT ON COLUMN milestone_definitions.code IS 'Unique code like ANC_VISIT_1, CHECKIN_7DAY';
COMMENT ON COLUMN milestone_definitions.reward_amount IS 'Number of MTK tokens rewarded';
COMMENT ON COLUMN user_milestones.progress_data IS 'JSON with category-specific progress';
COMMENT ON COLUMN verifications.verification_hash IS 'SHA-256 hash for on-chain proof';
COMMENT ON COLUMN token_transactions.tx_hash IS 'Stellar transaction hash (64 char hex)';