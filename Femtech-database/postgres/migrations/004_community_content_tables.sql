-- momentum-database/postgres/migrations/004_community_content_tables.sql
-- Description: Community features and educational content
-- Sprint: 5
-- Author: Database & AI Team

-- ============================================================
-- ENUMS
-- ============================================================

-- Circle member role
CREATE TYPE circle_role AS ENUM (
    'owner',        -- Pregnant mother (creator)
    'partner',      -- Partner/spouse
    'family',       -- Family member
    'friend',       -- Friend
    'doula'         -- Assigned Digital Doula
);

-- Circle permissions
CREATE TYPE circle_permission AS ENUM (
    'view_health',      -- Can view health data
    'view_location',    -- Can view location
    'receive_alerts',   -- Receives emergency alerts
    'contribute_tokens' -- Can contribute to savings pool
);

-- Content category
CREATE TYPE content_category AS ENUM (
    'pregnancy_basics',
    'nutrition',
    'exercise',
    'mental_health',
    'labor_delivery',
    'breastfeeding',
    'newborn_care',
    'postpartum',
    'danger_signs',
    'family_planning'
);

-- Quiz difficulty
CREATE TYPE quiz_difficulty AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);

-- Question type
CREATE TYPE question_type AS ENUM (
    'multiple_choice',
    'true_false',
    'multi_select'
);

-- ============================================================
-- TABLES: SUPPORT CIRCLES
-- ============================================================

CREATE TABLE support_circles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Owner
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pregnancy_id UUID REFERENCES pregnancies(id) ON DELETE SET NULL,
    
    -- Info
    name VARCHAR(100) NOT NULL DEFAULT 'My Support Circle',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE circle_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- References
    circle_id UUID NOT NULL REFERENCES support_circles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- For non-registered members
    phone VARCHAR(20),
    name VARCHAR(100),
    
    -- Role & Permissions
    role circle_role NOT NULL,
    permissions circle_permission[] NOT NULL DEFAULT ARRAY['view_health', 'receive_alerts']::circle_permission[],
    
    -- Invitation
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT circle_members_unique UNIQUE (circle_id, user_id),
    CONSTRAINT circle_members_phone_unique UNIQUE (circle_id, phone)
);

-- ============================================================
-- TABLES: DIGITAL DOULAS
-- ============================================================

CREATE TABLE digital_doulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User link
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Profile
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    
    -- Qualifications
    specializations VARCHAR(100)[],
    languages language_code[] NOT NULL DEFAULT ARRAY['en']::language_code[],
    years_experience INTEGER,
    certifications JSONB,
    
    -- Stats
    rating DECIMAL(3, 2),  -- 0.00 to 5.00
    total_ratings INTEGER NOT NULL DEFAULT 0,
    total_supports INTEGER NOT NULL DEFAULT 0,
    total_tokens_earned INTEGER NOT NULL DEFAULT 0,
    
    -- Availability
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    max_active_mothers INTEGER NOT NULL DEFAULT 10,
    current_active_mothers INTEGER NOT NULL DEFAULT 0,
    
    -- Verification
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT digital_doulas_user_unique UNIQUE (user_id)
);

-- ============================================================
-- TABLES: CONTENT
-- ============================================================

CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    
    -- Classification
    category content_category NOT NULL,
    tags VARCHAR(50)[],
    
    -- Targeting
    country country_code,  -- NULL = all countries
    language language_code NOT NULL DEFAULT 'en',
    gestational_week_min INTEGER,
    gestational_week_max INTEGER,
    
    -- Media
    thumbnail_url VARCHAR(500),
    audio_url VARCHAR(500),  -- Audio version
    
    -- Metadata
    read_time_mins INTEGER,
    author VARCHAR(100),
    source VARCHAR(200),
    source_url VARCHAR(500),
    
    -- Status
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT articles_slug_lang_unique UNIQUE (slug, language)
);

CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Classification
    category content_category NOT NULL,
    difficulty quiz_difficulty NOT NULL DEFAULT 'beginner',
    
    -- Targeting
    country country_code,
    language language_code NOT NULL DEFAULT 'en',
    
    -- Rules
    time_limit_mins INTEGER,
    pass_threshold INTEGER NOT NULL DEFAULT 70,  -- Percentage
    
    -- Rewards
    reward_amount INTEGER NOT NULL DEFAULT 0,
    milestone_def_id UUID REFERENCES milestone_definitions(id),
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    
    -- Question
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL,
    
    -- Options (JSON array)
    options JSONB NOT NULL,  -- [{id: 'a', text: '...'}]
    
    -- Answer
    correct_answer JSONB NOT NULL,  -- 'a' or ['a', 'c'] for multi-select
    explanation TEXT,
    
    -- Ordering
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- References
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    
    -- Results
    score INTEGER NOT NULL,  -- Percentage
    passed BOOLEAN NOT NULL,
    
    -- Answers
    answers JSONB NOT NULL,  -- {question_id: answer}
    
    -- Timing
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL,
    duration_seconds INTEGER,
    
    -- Reward
    reward_granted BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Support circles
CREATE INDEX idx_support_circles_owner_id ON support_circles(owner_id);
CREATE INDEX idx_support_circles_pregnancy_id ON support_circles(pregnancy_id);

-- Circle members
CREATE INDEX idx_circle_members_circle_id ON circle_members(circle_id);
CREATE INDEX idx_circle_members_user_id ON circle_members(user_id);

-- Digital doulas
CREATE INDEX idx_digital_doulas_user_id ON digital_doulas(user_id);
CREATE INDEX idx_digital_doulas_available ON digital_doulas(is_available, is_active) 
    WHERE is_available = TRUE AND is_active = TRUE;
CREATE INDEX idx_digital_doulas_rating ON digital_doulas(rating DESC);
CREATE INDEX idx_digital_doulas_languages ON digital_doulas USING GIN(languages);

-- Articles
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_country ON articles(country);
CREATE INDEX idx_articles_language ON articles(language);
CREATE INDEX idx_articles_published ON articles(is_published, published_at) 
    WHERE is_published = TRUE;
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_gestational ON articles(gestational_week_min, gestational_week_max);
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);

-- Quizzes
CREATE INDEX idx_quizzes_category ON quizzes(category);
CREATE INDEX idx_quizzes_country ON quizzes(country);
CREATE INDEX idx_quizzes_active ON quizzes(is_active) WHERE is_active = TRUE;

-- Quiz questions
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_quiz_questions_order ON quiz_questions(quiz_id, sort_order);

-- Quiz attempts
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_passed ON quiz_attempts(user_id, quiz_id, passed) WHERE passed = TRUE;

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_support_circles_updated_at
    BEFORE UPDATE ON support_circles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_digital_doulas_updated_at
    BEFORE UPDATE ON digital_doulas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
    BEFORE UPDATE ON quizzes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE support_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE support_circles IS 'Support circles for each mother';
COMMENT ON TABLE circle_members IS 'Members of support circles';
COMMENT ON TABLE digital_doulas IS 'Digital Doula profiles';
COMMENT ON TABLE articles IS 'Educational articles and content';
COMMENT ON TABLE quizzes IS 'Educational quizzes';
COMMENT ON TABLE quiz_questions IS 'Questions for each quiz';
COMMENT ON TABLE quiz_attempts IS 'User quiz attempt records';