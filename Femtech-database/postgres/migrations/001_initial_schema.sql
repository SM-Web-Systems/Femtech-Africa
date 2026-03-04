-- momentum-database/postgres/migrations/001_initial_schema.sql
-- Description: Core tables for users, auth, and base infrastructure
-- Sprint: 1
-- Author: Database & AI Team

-- ============================================================
-- EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- ============================================================
-- ENUMS
-- ============================================================

-- User status
CREATE TYPE user_status AS ENUM (
    'pending',          -- Registered but not verified
    'active',           -- Verified and active
    'suspended',        -- Temporarily suspended
    'deactivated'       -- User requested deactivation
);

-- User role
CREATE TYPE user_role AS ENUM (
    'mother',           -- Primary user (pregnant woman)
    'support',          -- Support circle member
    'doula',            -- Digital Doula
    'chw',              -- Community Health Worker
    'clinician',        -- Medical professional
    'admin'             -- Platform administrator
);

-- Country codes
CREATE TYPE country_code AS ENUM (
    'ZA',   -- South Africa
    'UG',   -- Uganda
    'KE'    -- Kenya
);

-- Language codes
CREATE TYPE language_code AS ENUM (
    'en',   -- English
    'zu',   -- Zulu
    'xh',   -- Xhosa
    'st',   -- Sotho
    'tn',   -- Tswana
    'lg',   -- Luganda
    'sw'    -- Swahili
);

-- Consent types
CREATE TYPE consent_type AS ENUM (
    'terms_of_service',
    'privacy_policy',
    'health_data_processing',
    'marketing_communications',
    'data_sharing_research',
    'biometric_data'
);

-- OTP purpose
CREATE TYPE otp_purpose AS ENUM (
    'registration',
    'login',
    'password_reset',
    'phone_change',
    'verification'
);

-- ============================================================
-- TABLES: CORE IDENTITY
-- ============================================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Phone (primary identifier)
    phone VARCHAR(20) NOT NULL,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified_at TIMESTAMPTZ,
    
    -- Location & Language
    country country_code NOT NULL,
    language language_code NOT NULL DEFAULT 'en',
    
    -- Status & Role
    status user_status NOT NULL DEFAULT 'pending',
    role user_role NOT NULL DEFAULT 'mother',
    
    -- Blockchain
    wallet_address VARCHAR(56),  -- Stellar public key (G...)
    wallet_created_at TIMESTAMPTZ,
    
    -- Metadata
    last_login_at TIMESTAMPTZ,
    login_count INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT users_phone_unique UNIQUE (phone),
    CONSTRAINT users_wallet_unique UNIQUE (wallet_address),
    CONSTRAINT users_phone_format CHECK (phone ~ '^\+[1-9]\d{6,14}$')
);

-- User profiles (separate for PII isolation)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Personal info (encrypted at application level)
    first_name_encrypted BYTEA,
    last_name_encrypted BYTEA,
    date_of_birth_encrypted BYTEA,
    
    -- Non-sensitive
    avatar_url VARCHAR(500),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT user_profiles_user_unique UNIQUE (user_id)
);

-- Consents
CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Consent details
    consent_type consent_type NOT NULL,
    version VARCHAR(20) NOT NULL,  -- e.g., "1.0", "2.0"
    granted BOOLEAN NOT NULL,
    
    -- Timestamps
    granted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    
    -- Audit
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT consents_user_type_unique UNIQUE (user_id, consent_type, version)
);

-- Sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Device info
    device_id VARCHAR(100),
    device_info JSONB,
    ip_address INET,
    
    -- Token
    refresh_token_hash VARCHAR(64) NOT NULL,  -- SHA-256 hash
    
    -- Expiry
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Usage tracking
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT sessions_token_unique UNIQUE (refresh_token_hash)
);

-- OTP codes
CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Target
    phone VARCHAR(20) NOT NULL,
    
    -- Code (hashed)
    code_hash VARCHAR(64) NOT NULL,  -- SHA-256 hash
    
    -- Purpose
    purpose otp_purpose NOT NULL,
    
    -- Security
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    
    -- Expiry
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Verification
    verified_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES: CORE IDENTITY
-- ============================================================

-- Users
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_country ON users(country);
CREATE INDEX idx_users_wallet ON users(wallet_address) WHERE wallet_address IS NOT NULL;
CREATE INDEX idx_users_created_at ON users(created_at);

-- User profiles
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Consents
CREATE INDEX idx_consents_user_id ON consents(user_id);
CREATE INDEX idx_consents_type ON consents(consent_type);

-- Sessions
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_token_hash ON sessions(refresh_token_hash);

-- OTP codes
CREATE INDEX idx_otp_codes_phone ON otp_codes(phone);
CREATE INDEX idx_otp_codes_expires_at ON otp_codes(expires_at);
CREATE INDEX idx_otp_codes_phone_purpose ON otp_codes(phone, purpose);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;

$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AUDIT LOG TABLE
-- ============================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Actor
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Action
    action VARCHAR(50) NOT NULL,  -- CREATE, UPDATE, DELETE, LOGIN, etc.
    
    -- Entity
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Policies will be added by application roles

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE users IS 'Core user accounts for all user types';
COMMENT ON TABLE user_profiles IS 'User profile data, separated for PII isolation';
COMMENT ON TABLE consents IS 'User consent records for GDPR/POPIA compliance';
COMMENT ON TABLE sessions IS 'Active user sessions with refresh tokens';
COMMENT ON TABLE otp_codes IS 'One-time passwords for authentication';
COMMENT ON TABLE audit_logs IS 'Audit trail for all data changes';

COMMENT ON COLUMN users.phone IS 'E.164 format phone number';
COMMENT ON COLUMN users.wallet_address IS 'Stellar public key (G...)';
COMMENT ON COLUMN user_profiles.first_name_encrypted IS 'AES-256-GCM encrypted first name';
COMMENT ON COLUMN sessions.refresh_token_hash IS 'SHA-256 hash of refresh token';