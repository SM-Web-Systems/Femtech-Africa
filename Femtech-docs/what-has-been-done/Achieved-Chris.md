Femtech Africa - Project Summary
Executive Overview
Femtech Africa is a comprehensive maternal health platform designed to improve pregnancy outcomes across Africa through blockchain-based incentives. This document summarizes all technical work completed to date.

1. Project Architecture
1.1 High-Level System Design
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├──────────────────┬──────────────────┬──────────────────┬────────────────────┤
│   Mobile App     │    Web PWA       │  Admin Dashboard │   USSD Gateway     │
│ (React Native)   │   (Next.js)      │    (Next.js)     │  (Feature Phones)  │
└────────┬─────────┴────────┬─────────┴────────┬─────────┴──────────┬─────────┘
         │                  │                  │                    │
         └──────────────────┴────────┬─────────┴────────────────────┘
                                     │
                           ┌─────────▼─────────┐
                           │    API Gateway    │
                           │      (Kong)       │
                           └─────────┬─────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                            SERVICE LAYER                                     │
├─────────┬─────────┬─────────┬──────┴──┬─────────┬─────────┬─────────────────┤
│  Auth   │ Health  │Milestone│  Token  │Redemp-  │Community│  Notification   │
│ Service │ Service │ Service │ Service │  tion   │ Service │    Service      │
└────┬────┴────┬────┴────┬────┴────┬────┴────┬────┴────┬────┴───────┬─────────┘
     │         │         │         │         │         │            │
     └─────────┴─────────┴────┬────┴─────────┴─────────┴────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    Event Bus      │
                    │   (RabbitMQ)      │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────┼─────────────────────────────────────────────┐
│                          DATA LAYER                                        │
├───────────┬───────────┬─────┴─────┬───────────┬────────────────────────────┤
│PostgreSQL │  MongoDB  │   Redis   │TimescaleDB│      Stellar Network       │
│ (Primary) │(Documents)│  (Cache)  │(Analytics)│      (Blockchain)          │
└───────────┴───────────┴───────────┴───────────┴────────────────────────────┘
1.2 Technology Stack
Layer	Technology	Purpose
Mobile	React Native + WatermelonDB	Cross-platform app with offline-first
Web PWA	Next.js 14 + IndexedDB	Progressive web app for browsers
Admin	Next.js 14 + shadcn/ui	Administrative dashboard
Backend	Node.js/Express + TypeScript	Microservices API
ML Services	Python FastAPI + XGBoost	Risk prediction, symptom parsing
Primary DB	PostgreSQL 15	Transactional data
Document DB	MongoDB 7	Symptom logs, analytics events
Cache	Redis 7	Session management, caching
Time-Series	TimescaleDB	Metrics and analytics
Blockchain	Stellar (Soroban)	Token minting, burning, transfers
Message Queue	RabbitMQ	Event-driven communication
Infrastructure	AWS EKS + Terraform	Cloud deployment
1.3 Target Markets
Country	Code	Currency	Primary Mobile Money	Phase
South Africa	ZA	ZAR	MTN MoMo, Vodapay	1
Kenya	KE	KES	M-Pesa, Airtel Money	1
Nigeria	NG	NGN	OPay, Paga	2
Ghana	GH	GHS	MTN MoMo, Vodafone Cash	2
Tanzania	TZ	TZS	M-Pesa, Tigo Pesa	3
Uganda	UG	UGX	MTN MoMo, Airtel Money	3
Rwanda	RW	RWF	MTN MoMo, Airtel Money	3
2. Repository Structure
2.1 Folder Organization (15 Repositories)
femtech-africa/
├── femtech-backend/           # Backend microservices monorepo
├── femtech-mobile/            # React Native mobile application
├── femtech-web/               # Next.js Progressive Web App
├── femtech-admin/             # Admin dashboard (Next.js)
├── femtech-contracts/         # Stellar/Soroban smart contracts
├── femtech-infrastructure/    # Terraform & Kubernetes configs
├── femtech-database/          # Database schemas & migrations
├── femtech-ml/                # Machine learning models
├── femtech-docs/              # Documentation
├── femtech-shared-types/      # Shared TypeScript definitions
├── femtech-e2e-tests/         # End-to-end tests
├── femtech-security/          # Security policies & audits
├── femtech-localizations/     # i18n translation files
├── femtech-monitoring/        # Observability configurations
└── femtech-scripts/           # Automation scripts
2.2 Team Ownership
Team	Repositories Owned
Backend	femtech-backend, femtech-shared-types
Frontend	femtech-mobile, femtech-web
Blockchain	femtech-contracts, femtech-backend/packages/token-service
Admin & Analytics	femtech-admin, femtech-backend/packages/admin-service, femtech-backend/packages/analytics-service
Database & AI	femtech-infrastructure, femtech-database, femtech-ml
Link All & Access	femtech-e2e-tests, femtech-security, femtech-localizations, femtech-monitoring, femtech-scripts, femtech-docs
2.3 Backend Monorepo Services
femtech-backend/packages/
├── api-gateway/           # Kong configuration
├── auth-service/          # Authentication & authorization
├── health-service/        # Pregnancy & symptom tracking
├── milestone-service/     # Milestone definitions & progress
├── token-service/         # Blockchain token operations
├── redemption-service/    # Partner redemptions
├── community-service/     # Support circles & doulas
├── notification-service/  # Push, SMS, email
├── content-service/       # Articles, quizzes
├── sync-service/          # Offline synchronization
├── ussd-gateway/          # Feature phone support
├── integration-service/   # External integrations
├── analytics-service/     # Reporting & metrics
├── admin-service/         # Admin operations
├── risk-engine/           # Python ML service
└── shared/                # Shared utilities
3. Database Design
3.1 Database Strategy (Polyglot Persistence)
Database	Purpose	Data Stored
PostgreSQL	Primary transactional	Users, pregnancies, milestones, redemptions, partners
MongoDB	Flexible documents	Symptom logs, community posts, analytics events
Redis	Caching & sessions	Session tokens, rate limits, cached queries
TimescaleDB	Time-series analytics	Token metrics, health trends
3.2 Core PostgreSQL Tables
Users & Identity:

users - Core user accounts with phone, country, wallet address
user_profiles - Encrypted PII (names, DOB)
consents - GDPR/POPIA consent tracking
sessions - Device sessions with refresh tokens
otp_codes - One-time passwords for verification
Health & Pregnancy:

pregnancies - Pregnancy records with LMP, EDD, risk factors
facilities - Healthcare facilities (hospitals, clinics, pharmacies)
medical_history - Encrypted medical conditions
appointments - Scheduled and completed visits
kick_sessions - Fetal movement tracking
emergency_contacts - Emergency contact information
Milestones & Rewards:

milestone_definitions - Configurable milestone templates
user_milestones - User progress on milestones
verifiers - Healthcare worker verification accounts
verifications - Verification records with geo/QR data
token_transactions - All token mints, burns, transfers
Partners & Redemptions:

partners - Partner organizations (MTN, Clicks, Uber, etc.)
partner_products - Redeemable products catalog
redemptions - Redemption orders
redemption_items - Individual items in redemptions
Community & Content:

support_circles - Peer support groups
circle_members - Group membership
digital_doulas - AI-assisted doula profiles
articles - Educational content
quizzes / quiz_questions / quiz_attempts - Learning assessments
notifications / sms_messages - Communication logs
3.3 Key Enums
Copy-- User management
user_status: pending_verification, active, suspended, deactivated
user_role: mother, support_member, verifier, partner, admin, super_admin
country_code: ZA, KE, NG, GH, TZ, UG, RW
language_code: en, zu, xh, af, sw, yo, ha, ig, am, fr, pt

-- Health tracking
pregnancy_status: active, delivered, miscarriage, stillbirth, terminated
blood_type: A_positive, A_negative, B_positive, B_negative, AB_positive, AB_negative, O_positive, O_negative, unknown
appointment_type: anc_visit, ultrasound, lab_test, vaccination, postnatal, specialist, emergency

-- Milestones
milestone_category: clinical, wellness, education, community, nutrition, mental_health
milestone_status: locked, available, in_progress, pending_verification, completed, expired, skipped

-- Tokens & Redemptions
token_tx_type: mint_milestone, mint_referral, mint_bonus, mint_airdrop, burn_redemption, burn_penalty, transfer_in, transfer_out, clawback
token_tx_status: pending, submitted, confirmed, failed, reversed
redemption_status: initiated, pending_burn, burn_confirmed, processing, completed, failed, refunded, expired
partner_type: mobile_money, transport, pharmacy, grocery, healthcare, education, utility
3.4 MongoDB Collections
symptom_logs:

User symptom check-ins with vitals, mood, fetal movement
Triage results (urgency, recommendations, actions)
TTL: 2 years
community_posts:

Community feed posts with media and engagement
Moderation tracking
analytics_events:

Application usage events
Device and location context
4. Data Access Layer
4.1 Repository Pattern
All database access follows the Repository Pattern with:

Base Repository - Common CRUD operations, caching, event publishing
Domain Repositories - Entity-specific queries and business logic
Transaction Support - Cross-table atomic operations
Cache Integration - Automatic cache invalidation
4.2 Implemented Repositories
Repository	Key Methods
UserRepository	findByPhone(), createWithProfile(), updateWallet(), getStatsByCountry()
PregnancyRepository	findActiveByUser(), createPregnancy(), updateRiskStatus(), getGestationalWeek()
MilestoneRepository	findDefinitions(), initializeMilestones(), getProgress(), completeMilestone(), unlockEligibleMilestones()
TokenRepository	getBalance(), createMintTransaction(), createBurnTransaction(), confirmTransaction(), getGlobalStats()
RedemptionRepository	findPartners(), findProducts(), createRedemption(), updateStatus(), cancelExpired()
4.3 Caching Strategy
# Session & Auth
session:{sessionId}                    → User session data (TTL: 7 days)
user:{userId}                          → User profile (TTL: 5 min)
user:phone:{phone}                     → User by phone lookup (TTL: 5 min)

# Token Balances
token:balance:{userId}                 → Balance calculation (TTL: 30 sec)

# Pregnancy & Milestones
pregnancy:active:{userId}              → Active pregnancy (TTL: 60 sec)
milestones:{pregnancyId}:list          → Milestone list (TTL: 2 min)
milestones:{pregnancyId}:progress      → Progress summary (TTL: 60 sec)

# Catalog
catalog:{country}                      → Product catalog (TTL: 5 min)

# Rate Limiting
ratelimit:login:{phone}                → Login attempts (TTL: 15 min)
ratelimit:otp:{phone}                  → OTP requests (TTL: 15 min)
5. Service Layer
5.1 Service Architecture
All services extend BaseService providing:

Prisma database access
Redis cache integration
RabbitMQ event publishing
Structured logging
Transaction management
5.2 Implemented Services
AuthService:

initiateRegistration() - Send OTP, cache registration intent
completeRegistration() - Verify OTP, create user, record consents, issue tokens
requestLoginOtp() / verifyLogin() - Login flow
refreshTokens() - JWT refresh with rotation
logout() / logoutAllDevices() - Session invalidation
getConsents() / updateConsent() - Consent management
HealthService:

registerPregnancy() - Create pregnancy with medical history and contacts
getActivePregnancy() - Fetch pregnancy with gestational calculations
logSymptoms() - Store in MongoDB, run triage engine
startKickSession() / recordKick() / endKickSession() - Kick counting
scheduleAppointment() / verifyAppointment() - Appointment management
MilestoneService:

initializeMilestones() - Create user milestones from definitions
getMilestones() - List with progress summary
startMilestone() / updateProgress() - Progress tracking
submitForVerification() / verifyMilestone() - Verification flow
Event-driven auto-completion for streaks, kick counts, appointments
TokenService:

getOrCreateWallet() - Stellar wallet provisioning
mintForMilestone() / mintForReferral() - Token minting
processBurn() - Token burning for redemptions
getBalance() / getTransactionHistory() - Balance queries
retryFailedTransactions() - Scheduled retry mechanism
RedemptionService:

getCatalog() - Country-specific product catalog
validateCart() - Pre-redemption validation
createRedemption() - Initiate redemption flow
processFulfillment() - Partner API integration
cancelExpiredRedemptions() - Scheduled cleanup
5.3 Event-Driven Flows
health.pregnancy.registered    → MilestoneService.initializeMilestones()
health.symptoms.logged         → MilestoneService.checkSymptomStreak()
health.kick_session.completed  → MilestoneService.checkKickMilestones()
health.appointment.verified    → MilestoneService.checkAppointmentMilestones()
milestone.completed            → TokenService.mintForMilestone()
redemption.burn_requested      → TokenService.processBurn()
token.burned                   → RedemptionService.processFulfillment()
6. Blockchain Integration
6.1 Why Stellar?
Ultra-low fees: ~$0.000001 per transaction
Fast finality: 3-5 second confirmation
Built-in compliance: SEP-10/12/24/31 standards
Native multi-signature: Account-level security
Fee sponsorship: Protocol-level sponsored accounts
African partnerships: Mobile money integrations
6.2 Smart Contracts (Soroban)
MomToken (SEP-41 compliant):

initialize() - Set admin, mint cap, token metadata
mint() - Authorized minters only, daily limits
burn() - User-initiated token destruction
balance() - Query token balance
pause() / set_paused() - Emergency pause
add_minter() - Authorize new minters
Clawback support for compliance
FeeSponsor:

initialize() - Set daily/lifetime limits
can_sponsor() - Check sponsorship availability
record_sponsorship() - Track usage
get_remaining() - Query remaining sponsorship
Whitelist of allowed operations
MilestoneRegistry:

On-chain milestone completion records
Verification hash storage
MultiSigWallet:

Configurable threshold signatures
Social recovery support
Daily spending limits
CredentialNFT:

Soulbound achievement tokens
Non-transferable by design
6.3 Stellar Classic Operations
AccountFactory:

createSponsoredAccount() - Create user wallet with sponsored reserves
setupTrustline() - Establish MTK trustline
MintOperations:

mintTokens() - Payment from issuer to user
batchMint() - Multiple mints in one transaction
BurnOperations:

burnTokens() - Payment from user back to issuer
Sponsor-paid transaction fees
6.4 Token Economics
Token Symbol: MTK (MomToken)
Decimals: 7 (Stellar standard)
Mint Cap: 100 billion tokens
Daily Mint Limit: 1 million tokens
Sponsorship: 10 daily operations, 1000 lifetime per user
7. Partner & Redemption System
7.1 Partner Coverage
Country	Mobile Money	Pharmacy	Transport	Grocery	Healthcare
ZA	MTN MoMo, Vodapay	Clicks, Dis-Chem	Uber, Bolt	Pick n Pay, Shoprite	Netcare
KE	M-Pesa, Airtel	Goodlife	Little Cab	Naivas	-
NG	OPay, Paga	HealthPlus	Bolt	Shoprite	-
GH	MTN MoMo, Vodafone Cash	Ernest Chemists	-	-	-
TZ	M-Pesa, Tigo Pesa	-	-	-	-
UG	MTN MoMo, Airtel	-	SafeBoda	-	-
RW	MTN MoMo, Airtel	-	Move	-	-
7.2 Product Categories
Category	Examples	Token Range	Fulfillment
mobile_money	Wallet top-ups	50-500	Direct API transfer
airtime	Phone airtime	50-250	Voucher code
data	Data bundles	145-245	Voucher code
prenatal_vitamins	Pregnacare, Elevit	300-450	Store pickup
baby_care	Diapers, lotion	100-350	Store pickup
transport	Ride credits	110-550	Voucher code
grocery	Store vouchers	250-1000	Store voucher
healthcare	Ultrasounds, labs	500-1200	Appointment booking
7.3 Redemption Flow
initiated → pending_burn → burn_confirmed → processing → completed
                                                      ↘ failed → refunded
8. Milestone System
8.1 Milestone Categories
Category	Description	Reward Range
clinical	ANC visits, ultrasounds, lab tests	50-150 tokens
wellness	Check-in streaks, kick counting	20-50 tokens
education	Quiz completion, article reading	10-30 tokens
community	Support circles, doula chat	15-50 tokens
nutrition	Meal logging, vitamin tracking	10-20 tokens
mental_health	Mood tracking, meditation	10-20 tokens
8.2 Milestone Examples
Clinical (Requires Verification):

Registration: 50 tokens
ANC Visit 1-4: 100 tokens each
Dating Ultrasound: 75 tokens
Anatomy Scan: 100 tokens
Blood Type Test: 50 tokens
HIV Test: 50 tokens
Glucose Screening: 50 tokens
Wellness (Auto-Complete):

First Check-in: 20 tokens
7-Day Streak: 30 tokens
30-Day Streak: 50 tokens
5 Kick Sessions: 25 tokens
10 Kick Sessions: 40 tokens
Education (Auto-Complete):

First Quiz: 20 tokens
5 Quizzes: 40 tokens
10 Articles Read: 30 tokens
8.3 Verification Methods
QR Scan: Verifier scans user's milestone QR code
Manual: Healthcare worker enters verification code
Auto-Complete: System detects completion via events
Geo-verification: Location confirmation at facility
9. Seed Data
9.1 Test Data Summary
Data Type	Records	Countries
Partners	25	7
Partner Products	60+	7
Test Users	15	7
Facilities	12	7
Pregnancies	10	7
Digital Doulas	12	7
Verifiers	3	2
Token Transactions	25+	3
Redemptions	8	3
Appointments	20	3
Kick Sessions	20	2
Symptom Logs (MongoDB)	25+	5
9.2 Test Users by Country
South Africa (ZA):

Thandi: 12 weeks pregnant, early stage, 170 tokens
Nomsa: 32 weeks pregnant, advanced, 470 tokens
Lindiwe: 24 weeks, HIGH RISK (gestational diabetes)
Dr. Mokoena: Healthcare worker verifier
Sipho: Community health worker verifier
Admin: System administrator
Kenya (KE):

Wanjiku: 20 weeks pregnant, 425 tokens
Akinyi: 28 weeks pregnant
Nurse Ochieng: Healthcare worker verifier
Nigeria (NG):

Adaeze: 16 weeks pregnant, 170 tokens
Folake: 22 weeks, HIGH RISK (twins)
Other Countries:

Ghana: Abena (18 weeks)
Uganda: Nakato (14 weeks)
Rwanda: Uwimana (15 weeks)
Tanzania: Rehema (10 weeks)
9.3 Seed Files
femtech-database/
├── postgres/seeds/
│   ├── 001_partners.sql           # Partner organizations
│   ├── 002_partner_products.sql   # Redeemable products
│   ├── 003_test_users.sql         # User accounts
│   ├── 004_test_pregnancies.sql   # Facilities & pregnancies
│   ├── 005_test_verifiers.sql     # Verifiers & doulas
│   ├── 006_test_milestones.sql    # Milestones & transactions
│   ├── 007_test_redemptions.sql   # Redemption history
│   ├── 008_test_health_data.sql   # Appointments & kick sessions
│   └── 009_test_consents.sql      # User consents
├── mongodb/seeds/
│   └── symptom_logs.js            # Symptom check-in history
└── scripts/
    └── seed.sh                    # Seed runner script
10. Development Workflow
10.1 Sprint Structure (8 Sprints)
Sprint	Theme	Key Deliverables
1	Foundation	Repo setup, CI/CD, Docker, shared types
2	Auth & Wallet	Registration, OTP, JWT, Stellar wallets
3	Health	Pregnancy registration, symptom tracking, triage
4	Milestones	Catalog, progress, verification, token minting
5	Community	Feed, chat, doulas, content CMS
6	Offline & Notifications	Push/SMS, sync service, USSD
7	Redemptions	Token burn, partner integrations, vouchers
8	Launch Prep	Analytics, security, performance, monitoring
10.2 CI/CD Pipeline
Change Detection: Only build affected packages
Parallel Jobs: Backend, mobile, web, contracts, admin
Quality Gates: Lint, test, build, security scan
Deployment: Staging auto-deploy, production manual approval
10.3 GitHub Configuration
Branch Protection: main (2 approvals), develop (1 approval)
CODEOWNERS: Team-based ownership
Required Checks: All CI jobs must pass
Auto-merge: Enabled for approved PRs
11. Files Delivered
11.1 Part 1: TypeScript Models & Repositories
femtech-database/prisma/schema.prisma - Complete Prisma schema with 30+ models
femtech-backend/packages/shared/src/database/base.repository.ts - Base repository pattern
femtech-backend/packages/auth-service/src/repositories/user.repository.ts - User repository
femtech-backend/packages/health-service/src/repositories/pregnancy.repository.ts - Pregnancy repository
femtech-backend/packages/milestone-service/src/repositories/milestone.repository.ts - Milestone repository
femtech-backend/packages/token-service/src/repositories/token.repository.ts - Token repository
femtech-backend/packages/redemption-service/src/repositories/redemption.repository.ts - Redemption repository
11.2 Part 2: Data Access Patterns
femtech-backend/packages/shared/src/services/base.service.ts - Base service pattern
femtech-backend/packages/auth-service/src/services/auth.service.ts - Auth service
femtech-backend/packages/health-service/src/services/health.service.ts - Health service
femtech-backend/packages/milestone-service/src/services/milestone.service.ts - Milestone service
femtech-backend/packages/token-service/src/services/token.service.ts - Token service
femtech-backend/packages/redemption-service/src/services/redemption.service.ts - Redemption service
femtech-backend/packages/health-service/src/services/symptom-log.service.ts - MongoDB symptom service
femtech-backend/packages/shared/src/cache/cache.service.ts - Redis cache service
11.3 Part 3: Seed Data
femtech-database/postgres/seeds/001_partners.sql - 25 partners across 7 countries
femtech-database/postgres/seeds/002_partner_products.sql - 60+ products
femtech-database/postgres/seeds/003_test_users.sql - 15 test users
femtech-database/postgres/seeds/004_test_pregnancies.sql - Facilities & pregnancies
femtech-database/postgres/seeds/005_test_verifiers.sql - Verifiers & doulas
femtech-database/postgres/seeds/006_test_milestones.sql - Milestones & transactions
femtech-database/postgres/seeds/007_test_redemptions.sql - Redemption history
femtech-database/postgres/seeds/008_test_health_data.sql - Appointments & kick sessions
femtech-database/postgres/seeds/009_test_consents.sql - User consents
femtech-database/mongodb/seeds/symptom_logs.js - MongoDB symptom logs
femtech-database/scripts/seed.sh - Seed runner script
12. Next Steps
Potential areas for continued development:

API Endpoints - REST/GraphQL endpoint implementations
Frontend Components - React Native and Next.js UI components
Integration Tests - E2E test suites for all flows
Partner Adapters - M-Pesa, MTN MoMo, OPay integrations
ML Models - Risk prediction, symptom NLP, content recommendation
Deployment Scripts - Terraform modules, Kubernetes manifests
Monitoring Setup - Prometheus, Grafana, alerting rules
Document generated: March 2026 Version: 1.0 Status: Development Phase

# March 5, 2026

PostgreSQL Database Deployed on Linux Server • Installed PostgreSQL on remote server (68.183.44.159) • Created femtech database user and granted permissions • Enabled required extensions: uuid-ossp, pgcrypto

Database Migrations Successfully Executed • Ran five migration files (001_initial_schema.sql through 005_redemption_tables.sql) • Created all core tables: users, pregnancies, milestones, partners, products, redemptions • Set up indexes, triggers, foreign keys, and enum types

Database Seeded with Test Data • 16 users across ZA, KE, UG (mothers, clinicians, CHWs, doulas, admin) • 16 partners (mobile money, healthcare, retail, transport) • 18 partner products (airtime, vouchers, data bundles) • 22 milestone definitions (clinical, wellness, education, community) • 8 pregnancies with various risk profiles • 15 user milestones in different states

Prisma Client Generated • Used Prisma 5.10.0 for stability (avoiding v7 breaking changes) • Pulled schema from live database • Fixed enum mapping issues (blood_type, partner_type, country_code)

API Server Built and Deployed • Express.js API with full CRUD endpoints • JWT authentication with OTP verification flow • Public endpoints: /health, /users, /partners, /products, /milestones, /pregnancies • Protected endpoints: /my/milestones, /my/pregnancies, /my/transactions, /my/redemptions • Deployed to Linux server using PM2 for process management

Live API Accessible • URL: https://api.mamatokens.com:3000 • Health check confirmed: database connected, 16 users active • Authentication tested successfully with JWT token generation

Environment Configuration Centralized • Single .env file at FEMTECH-AFRICA root • All services reference this central configuration • 42 environment variables loaded

Row Level Security Configured • RLS disabled on users, pregnancies, user_milestones tables for development • Full DML permissions granted to femtech user

Endpoint	URL
Health	https://api.mamatokens.com:3000/health
Users	https://api.mamatokens.com:3000/api/v1/users
Partners	https://api.mamatokens.com:3000/api/v1/partners
Products	https://api.mamatokens.com:3000/api/v1/products
Milestones	https://api.mamatokens.com:3000/api/v1/milestones
Request OTP	POST https://api.mamatokens.com:3000/api/v1/auth/request-otp
Verify OTP	POST https://api.mamatokens.com:3000/api/v1/auth/verify-otp
Mint Tokens (MAMA) POST https://api.mamatokens.com/api/v1/mint (protected)

Server Status: All Systems Operational

Service	Status	Port
PostgreSQL	✓ Active	5432
Redis	✓ Active	6379
MongoDB	✓ Active	27017
RabbitMQ	✓ Active	5672, 15672
Nginx	✓ Active	80
Femtech API	✓ Online	3000
Access URLs:

API: https://api.mamatokens.com/health
RabbitMQ Management: https://api.mamatokens.com:15672 (user: femtech / pass: femtech2026)
Configured:

Nginx reverse proxy (port 80 → 3000)
UFW firewall (ports 22, 80, 443, 5432, 15672)
PM2 process manager with auto-restart
Daily database backups at 2 AM (7-day retention)
Central .env configuration

Stellar Testnet MAMA token
Stellar MAMA Token - Created on testnet with 10M tokens
Mint API Endpoint - POST /api/v1/mint for milestone rewards

Stellar Token: View: https://stellar.expert/explorer/testnet/asset/MAMA-GA5CGTJ6X4HZVQB6PEZNFRVU2V3KRLXVALV7QGXYT6XAIUNGNSM6FZ6V

# MAMA Token Minting Flow
# Prerequisites
- User must be authenticated (JWT token)
- User must have a Stellar wallet address linked to their account
- Milestone must be status: "completed" and reward_minted: false

# Step 1: User Wallet Setup (First time only)
If user has no wallet, frontend should:

POST /api/v1/wallet/create
Or manually:

- Generate Stellar keypair client-side
- Fund via Friendbot (testnet): https://friendbot.stellar.org?addr={PUBLIC_KEY}
- Create trustline for MAMA token
- Save public key to user profile

# Step 2: Check Available Milestones
GET /api/v1/my/milestones
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "data": [
    {
      "id": "f1000000-0000-4000-8000-000000000001",
      "status": "completed",
      "reward_minted": false,
      "rewardAmount": 20,
      "milestone_definitions": {
        "code": "PROFILE_COMPLETE",
        "name": "Complete Profile",
        "rewardAmount": 20
      }
    }
  ]
}
Mintable milestones: Filter where status === "completed" AND reward_minted === false

# Step 3: Mint Tokens
POST /api/v1/mint
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "milestoneId": "f1000000-0000-4000-8000-000000000001"
}
Success Response (200):

{
  "success": true,
  "amount": 20,
  "txHash": "feaace09b5f6a1867ec6804f49d58db35e7fc633604995fd5cc8275b091ec122",
  "stellarExpert": "https://stellar.expert/explorer/testnet/tx/feaace09..."
}
Error Responses:

# Status	Error	Cause
- 400	User has no wallet address	User needs wallet setup
- 400	Reward already minted	Milestone already claimed
- 404	Milestone not found	Invalid milestone ID or not owned by user
- 401	No token provided	Missing JWT
- 401	Invalid token	Expired or invalid JWT

# Step 4: Verify Transaction (Optional)
User can view transaction on Stellar Explorer:

https://stellar.expert/explorer/testnet/tx/{txHash}
Or check wallet balance:

https://stellar.expert/explorer/testnet/account/{USER_WALLET_ADDRESS}
Frontend UI Flow
┌─────────────────────────────────────────────────────────┐
│                    MILESTONES SCREEN                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ✅ Complete Profile           20 MAMA           │   │
│  │    Status: Completed                            │   │
│  │    [CLAIM REWARD]  ← Button enabled             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ✅ First ANC Visit           100 MAMA           │   │
│  │    Status: Completed                            │   │
│  │    [CLAIMED ✓]  ← Already minted                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔄 Nutrition Quiz             25 MAMA           │   │
│  │    Status: In Progress (60%)                    │   │
│  │    [CONTINUE]  ← Can't claim yet                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘

         ↓ User taps "CLAIM REWARD" ↓

┌─────────────────────────────────────────────────────────┐
│                   CLAIMING REWARD...                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                      🔄 Loading                         │
│                                                         │
│              Minting 20 MAMA tokens...                  │
│                                                         │
└─────────────────────────────────────────────────────────┘

         ↓ Success ↓

┌─────────────────────────────────────────────────────────┐
│                   REWARD CLAIMED! 🎉                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                       +20 MAMA                          │
│                                                         │
│              Complete Profile Milestone                 │
│                                                         │
│         [VIEW TRANSACTION]  [DONE]                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
Token Details
Property	Value
Asset Code	MAMA
Network	Stellar Testnet
Issuer	GA5CGTJ6X4HZVQB6PEZNFRVU2V3KRLXVALV7QGXYT6XAIUNGNSM6FZ6V
Explorer	https://stellar.expert/explorer/testnet/asset/MAMA-GA5CGTJ6X4HZVQB6PEZNFRVU2V3KRLXVALV7QGXYT6XAIUNGNSM6FZ6V

6/3/2026

Enhanced API finished and tested
Data encryption in the DB (name birthdate....)

=== TOKEN REDEMPTION FLOW COMPLETED ===

Flow:
1. User selects products to redeem
2. API validates user's secret key matches wallet
3. API checks MAMA token balance on Stellar
4. API burns tokens (sends to distributor)
5. Creates redemption record with burn tx hash
6. Generates voucher codes for products
7. Returns completed redemption with Stellar Explorer link

Endpoints:
- GET  /api/v1/my/redemptions      - List user's redemptions
- GET  /api/v1/my/redemptions/:id  - Get single redemption
- POST /api/v1/my/redemptions      - Create redemption (with burn)
- POST /api/v1/my/redemptions/:id/cancel - Cancel pending redemption

Test Results:
- Balance before: 120 MAMA
- Redeemed: R10 Airtime (50 tokens)
- Balance after: 70 MAMA (burned 50)
- Voucher: VOUCHER-OMH6E28L
- Stellar TX: https://stellar.expert/explorer/testnet/tx/2a1642f2ee75f70a5bc5bb07f7fea1a37226388909f3fbed398a013dd2d81003
"
07/03/2026

HTTPS on all the website
Mobile App done
