-- momentum-database/postgres/migrations/002_health_tables.sql
-- Description: Health, pregnancy, and clinical data tables
-- Sprint: 2-3
-- Author: Database & AI Team

-- ============================================================
-- ENUMS
-- ============================================================

-- Pregnancy status
CREATE TYPE pregnancy_status AS ENUM (
    'active',           -- Currently pregnant
    'delivered',        -- Successfully delivered
    'loss',             -- Pregnancy loss
    'terminated'        -- Medical termination
);

-- Blood type
CREATE TYPE blood_type AS ENUM (
    'A+', 'A-',
    'B+', 'B-',
    'AB+', 'AB-',
    'O+', 'O-',
    'unknown'
);

-- Medical condition type
CREATE TYPE condition_type AS ENUM (
    'chronic',          -- Ongoing condition (diabetes, hypertension)
    'pregnancy',        -- Pregnancy-specific (gestational diabetes)
    'allergy',          -- Allergies
    'medication',       -- Current medications
    'surgical',         -- Previous surgeries
    'family_history'    -- Family medical history
);

-- Condition status
CREATE TYPE condition_status AS ENUM (
    'active',
    'resolved',
    'managed'
);

-- Appointment type
CREATE TYPE appointment_type AS ENUM (
    'anc_visit',        -- Antenatal care visit
    'ultrasound',       -- Ultrasound scan
    'lab_test',         -- Laboratory tests
    'specialist',       -- Specialist consultation
    'delivery',         -- Delivery appointment
    'postnatal',        -- Postnatal visit
    'emergency'         -- Emergency visit
);

-- Appointment status
CREATE TYPE appointment_status AS ENUM (
    'scheduled',
    'confirmed',
    'completed',
    'cancelled',
    'no_show',
    'rescheduled'
);

-- Facility type
CREATE TYPE facility_type AS ENUM (
    'hospital',
    'clinic',
    'health_center',
    'pharmacy',
    'laboratory',
    'private_practice'
);

-- Triage level (SATS-based)
CREATE TYPE triage_level AS ENUM (
    'red',      -- Emergency
    'orange',   -- Very urgent
    'yellow',   -- Urgent
    'green',    -- Standard
    'blue'      -- Dead on arrival (not used in our context)
);

-- ============================================================
-- TABLES: FACILITIES
-- ============================================================

CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic info
    name VARCHAR(200) NOT NULL,
    type facility_type NOT NULL,
    
    -- Location
    address TEXT,
    city VARCHAR(100),
    country country_code NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Contact
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    
    -- Operating hours (JSON for flexibility)
    operating_hours JSONB,
    
    -- Partnership
    is_partner BOOLEAN NOT NULL DEFAULT FALSE,
    partner_since DATE,
    accepts_tokens BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Verification
    verification_code VARCHAR(20),  -- For QR code generation
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLES: PREGNANCY
-- ============================================================

CREATE TABLE pregnancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Status
    status pregnancy_status NOT NULL DEFAULT 'active',
    
    -- Dates
    last_period_date DATE,
    estimated_due_date DATE NOT NULL,
    conception_date DATE,
    actual_delivery_date DATE,
    
    -- Obstetric history
    gravida INTEGER NOT NULL DEFAULT 1,  -- Total pregnancies
    parity INTEGER NOT NULL DEFAULT 0,    -- Previous deliveries
    
    -- Risk assessment
    is_high_risk BOOLEAN NOT NULL DEFAULT FALSE,
    risk_factors JSONB,  -- Array of risk factor codes
    risk_score INTEGER,  -- Calculated risk score (0-100)
    
    -- Medical info
    blood_type blood_type DEFAULT 'unknown',
    
    -- Preferred facility
    primary_facility_id UUID REFERENCES facilities(id),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Medical history
CREATE TABLE medical_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE SET NULL,
    
    -- Condition
    condition_type condition_type NOT NULL,
    condition_code VARCHAR(20),  -- ICD-10 code if applicable
    condition_name VARCHAR(200) NOT NULL,
    
    -- Status
    status condition_status NOT NULL DEFAULT 'active',
    
    -- Details
    diagnosed_date DATE,
    resolved_date DATE,
    notes_encrypted BYTEA,  -- Encrypted clinical notes
    
    -- Verification
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE SET NULL,
    facility_id UUID REFERENCES facilities(id),
    
    -- Type & Status
    appointment_type appointment_type NOT NULL,
    status appointment_status NOT NULL DEFAULT 'scheduled',
    
    -- Scheduling
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    
    -- Reminders
    reminder_sent_at TIMESTAMPTZ,
    
    -- Completion
    completed_at TIMESTAMPTZ,
    
    -- Verification (for milestone rewards)
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    verification_code VARCHAR(20),
    
    -- Notes
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Kick counter sessions
CREATE TABLE kick_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pregnancy_id UUID NOT NULL REFERENCES pregnancies(id) ON DELETE CASCADE,
    
    -- Session data
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    
    -- Counts
    kick_count INTEGER NOT NULL DEFAULT 0,
    target_count INTEGER NOT NULL DEFAULT 10,
    
    -- Duration
    duration_minutes INTEGER,  -- Calculated on completion
    
    -- Notes
    notes TEXT,
    
    -- Alert
    alert_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    alert_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Emergency contacts
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Contact info
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Priority (1 = primary)
    priority INTEGER NOT NULL DEFAULT 1,
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES: HEALTH
-- ============================================================

-- Facilities
CREATE INDEX idx_facilities_country ON facilities(country);
CREATE INDEX idx_facilities_type ON facilities(type);
CREATE INDEX idx_facilities_partner ON facilities(is_partner) WHERE is_partner = TRUE;
CREATE INDEX idx_facilities_location ON facilities(latitude, longitude) WHERE latitude IS NOT NULL;
CREATE INDEX idx_facilities_verification_code ON facilities(verification_code) WHERE verification_code IS NOT NULL;

-- Pregnancies
CREATE INDEX idx_pregnancies_user_id ON pregnancies(user_id);
CREATE INDEX idx_pregnancies_status ON pregnancies(status);
CREATE INDEX idx_pregnancies_due_date ON pregnancies(estimated_due_date);
CREATE INDEX idx_pregnancies_active ON pregnancies(user_id, status) WHERE status = 'active';

-- Medical history
CREATE INDEX idx_medical_history_user_id ON medical_history(user_id);
CREATE INDEX idx_medical_history_pregnancy_id ON medical_history(pregnancy_id);
CREATE INDEX idx_medical_history_type ON medical_history(condition_type);

-- Appointments
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_pregnancy_id ON appointments(pregnancy_id);
CREATE INDEX idx_appointments_facility_id ON appointments(facility_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_upcoming ON appointments(user_id, scheduled_at, status) 
    WHERE status IN ('scheduled', 'confirmed');

-- Kick sessions
CREATE INDEX idx_kick_sessions_user_id ON kick_sessions(user_id);
CREATE INDEX idx_kick_sessions_pregnancy_id ON kick_sessions(pregnancy_id);
CREATE INDEX idx_kick_sessions_start_time ON kick_sessions(start_time);

-- Emergency contacts
CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_pregnancies_updated_at
    BEFORE UPDATE ON pregnancies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_history_updated_at
    BEFORE UPDATE ON medical_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at
    BEFORE UPDATE ON facilities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Calculate gestational week from due date
CREATE OR REPLACE FUNCTION calculate_gestational_week(due_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN 40 - CEIL((due_date - CURRENT_DATE)::DECIMAL / 7);
END;

$$ LANGUAGE plpgsql IMMUTABLE;

-- Check if pregnancy is high risk
CREATE OR REPLACE FUNCTION is_pregnancy_high_risk(pregnancy_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    risk_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO risk_count
    FROM medical_history mh
    WHERE mh.pregnancy_id = is_pregnancy_high_risk.pregnancy_id
    AND mh.status = 'active'
    AND mh.condition_type IN ('chronic', 'pregnancy');
    
    RETURN risk_count > 0;
END;

$$ LANGUAGE plpgsql;

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE pregnancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE kick_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE facilities IS 'Healthcare facilities (hospitals, clinics, etc.)';
COMMENT ON TABLE pregnancies IS 'Pregnancy records for mothers';
COMMENT ON TABLE medical_history IS 'Medical history and conditions';
COMMENT ON TABLE appointments IS 'Scheduled and completed appointments';
COMMENT ON TABLE kick_sessions IS 'Fetal kick counting sessions';
COMMENT ON TABLE emergency_contacts IS 'Emergency contacts for each user';

COMMENT ON COLUMN pregnancies.gravida IS 'Total number of pregnancies including current';
COMMENT ON COLUMN pregnancies.parity IS 'Number of previous deliveries >= 20 weeks';
COMMENT ON COLUMN pregnancies.risk_factors IS 'JSON array of risk factor codes';