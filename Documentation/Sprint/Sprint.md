project_name: "Momentum Africa Development"

views:
  1_backlog:
    type: "Table"
    name: "📋 Backlog"
    group_by: "Epic"
    sort_by: "Priority"
    columns: [Title, Epic, Team, Priority, Complexity, Sprint, Status]
    
  2_sprint_board:
    type: "Board"
    name: "🏃 Current Sprint"
    columns: [Backlog, Ready, In Progress, In Review, Done]
    filter: "sprint:@current"
    
  3_by_team:
    type: "Board"
    name: "👥 By Team"
    group_by: "Team"
    columns: [To Do, In Progress, Done]
    
  4_roadmap:
    type: "Roadmap"
    name: "🗺️ Roadmap"
    date_field: "Target Date"
    group_by: "Epic"
    
  5_dependencies:
    type: "Table"
    name: "🔗 Dependencies"
    columns: [Title, Blocked By, Blocks, Team, Status]
    filter: "has:blocked-by OR has:blocks"
    
  6_api_contracts:
    type: "Table"
    name: "📄 API Contracts"
    filter: "label:api-contract"
    columns: [Title, Status, Backend, Frontend, Approved]

custom_fields:
  - name: "Team"
    type: "Single select"
    options:
      - Backend
      - Frontend
      - Blockchain
      - Admin & Analytics
      - Database & AI
      - Link All & Access
      
  - name: "Epic"
    type: "Single select"
    options:
      - AUTH
      - HEALTH
      - MILESTONE
      - TOKEN
      - COMMUNITY
      - CONTENT
      - NOTIFICATION
      - CONNECTIVITY
      - INTEGRATION
      - ANALYTICS
      - ADMIN
      - MOBILE
      - WEB
      - ML
      - INFRASTRUCTURE
      - CONTRACTS
      - DEVOPS
      - SECURITY
      - DOCS
      
  - name: "Priority"
    type: "Single select"
    options:
      - "P0 - Critical"
      - "P1 - High"
      - "P2 - Medium"
      - "P3 - Low"
      
  - name: "Complexity"
    type: "Single select"
    options:
      - "XS (< 2h)"
      - "S (2-4h)"
      - "M (1-2d)"
      - "L (3-5d)"
      - "XL (> 1w)"
      
  - name: "Sprint"
    type: "Iteration"
    duration: "2 weeks"
    
  - name: "Blocked By"
    type: "Text"
    
  - name: "API Contract Status"
    type: "Single select"
    options:
      - Draft
      - In Review
      - Approved
      - Implemented

Sprint	Theme	        Backend	  Frontend	Blockchain	Admin	 DB & AI	Link All
1	    Foundation	    3 tasks	   4 tasks	3 tasks	    1 task	 3 tasks	7 tasks
2	    Auth & Wallet	7 tasks	   10 tasks	4 tasks	    1 task	 2 tasks	2 tasks
3	    Health	        5 tasks	   6 tasks	1 task	    1 task	 3 tasks	2 tasks
4	    Milestones	    5 tasks	   6 tasks	4 tasks	    1 task	 1 task	    3 tasks
5	    Community	    5 tasks	   6 tasks	0 tasks	    2 tasks	 0 tasks	0 tasks
6	    Offline	        4 tasks	   4 tasks	0 tasks	    0 tasks	 0 tasks	0 tasks
7	    Integrations	5 tasks	   3 tasks	1 task	    0 tasks	 0 tasks	0 tasks
8	    Launch	        0 tasks	   0 tasks	0 tasks	    4 tasks	 4 tasks	6 tasks


sprint_1:
  goals:
    - Repository structure established
    - CI/CD pipelines working
    - Development environments ready
    - API contracts process defined
    - Stellar testnet configured
    - Database schemas designed

  # ═══════════════════════════════════════════════════════════════
  # TEAM: LINK ALL & ACCESS (Sprint Lead for Setup)
  # ═══════════════════════════════════════════════════════════════
  link_all_tasks:
    - id: "DEVOPS-001"
      title: "Initialize monorepo with Turborepo + PNPM workspaces"
      epic: DEVOPS
      priority: P0
      complexity: M
      assignee: "@devops-lead"
      description: |
        Set up the root monorepo structure with:
        - turbo.json configuration
        - pnpm-workspace.yaml
        - Root package.json with scripts
        - .gitignore, .editorconfig, .prettierrc
      acceptance_criteria:
        - [ ] `pnpm install` works from root
        - [ ] `pnpm build` builds all packages
        - [ ] Turborepo caching works
      # outputs:
        - /package.json
        - /turbo.json
        - /pnpm-workspace.yaml
        
    - id: "DEVOPS-002"
      title: "Set up GitHub Actions CI pipeline"
      epic: DEVOPS
      priority: P0
      complexity: M
      assignee: "@devops-dev1"
      blocked_by: "DEVOPS-001"
      description: |
        Create CI workflow with:
        - Lint, test, build jobs
        - Path-based filtering (only run affected)
        - Caching for node_modules, turbo
      acceptance_criteria:
        - [ ] CI runs on PR to develop/main
        - [ ] Jobs run in parallel where possible
        - [ ] Build artifacts cached
      # outputs:
        - /.github/workflows/ci.yml
        - /.github/workflows/labeler.yml
        
    - id: "DEVOPS-003"
      title: "Create Docker Compose for local development"
      epic: DEVOPS
      priority: P0
      complexity: S
      assignee: "@devops-dev1"
      blocked_by: "DEVOPS-001"
      description: |
        Local dev environment with:
        - PostgreSQL 16
        - MongoDB 7
        - Redis 7
        - RabbitMQ 3.12
      acceptance_criteria:
        - [ ] `docker-compose up` starts all services
        - [ ] Health checks pass
        - [ ] Data persists in volumes
      # outputs:
        - /docker-compose.yml
        - /docker-compose.override.yml
        
    - id: "DEVOPS-004"
      title: "Set up GitHub issue templates and PR template"
      epic: DEVOPS
      priority: P1
      complexity: S
      assignee: "@qa-dev1"
      description: |
        Create templates:
        - Epic template
        - Feature template
        - Bug template
        - API Contract template
        - PR template
      acceptance_criteria:
        - [ ] Templates appear in GitHub UI
        - [ ] Required fields enforced
      # outputs:
        - /.github/ISSUE_TEMPLATE/
        - /.github/PULL_REQUEST_TEMPLATE.md
        
    - id: "DEVOPS-005"
      title: "Create CODEOWNERS and branch protection rules"
      epic: DEVOPS
      priority: P1
      complexity: S
      assignee: "@devops-lead"
      blocked_by: "DEVOPS-001"
      description: |
        Configure:
        - CODEOWNERS per team
        - Branch protection for main, develop
        - Required reviewers
      acceptance_criteria:
        - [ ] PRs require correct team review
        - [ ] Cannot push directly to protected branches
      # outputs:
        - /.github/CODEOWNERS
        
    - id: "DOCS-001"
      title: "Write development setup guide"
      epic: DOCS
      priority: P1
      complexity: S
      assignee: "@devops-lead"
      blocked_by: "DEVOPS-003"
      description: |
        README with:
        - Prerequisites
        - Installation steps
        - Running locally
        - Running tests
      acceptance_criteria:
        - [ ] New developer can set up in < 30 min
      # outputs:
        - /README.md
        - /momentum-docs/guides/development-setup.md
        
    - id: "DOCS-002"
      title: "Document API contract workflow"
      epic: DOCS
      priority: P1
      complexity: S
      assignee: "@qa-dev1"
      description: |
        Document the process:
        - How to create API contract issue
        - Review process
        - Approval criteria
      # outputs:
        - /momentum-docs/guides/api-contract-workflow.md

  # ═══════════════════════════════════════════════════════════════
  # TEAM: BACKEND
  # ═══════════════════════════════════════════════════════════════
  backend_tasks:
    - id: "BACKEND-001"
      title: "Initialize backend monorepo structure"
      epic: DEVOPS
      priority: P0
      complexity: M
      assignee: "@backend-lead"
      blocked_by: "DEVOPS-001"
      description: |
        Create folder structure:
        - packages/ with all service folders
        - Shared package with common code
        - TypeScript configuration
      acceptance_criteria:
        - [ ] All 15 service folders created
        - [ ] Shared package importable
        - [ ] TypeScript compiles
      # outputs:
        - /momentum-backend/packages/*/package.json
        - /momentum-backend/tsconfig.json
        
    - id: "BACKEND-002"
      title: "Create shared utilities package"
      epic: DEVOPS
      priority: P0
      complexity: M
      assignee: "@backend-dev1"
      blocked_by: "BACKEND-001"
      description: |
        Shared package with:
        - Logger (pino)
        - Error classes
        - Validation helpers
        - Date utilities
        - Constants
      acceptance_criteria:
        - [ ] Can import from @momentum/shared
        - [ ] Logger outputs JSON in prod
      # outputs:
        - /momentum-backend/packages/shared/
        
    - id: "BACKEND-003"
      title: "Set up API Gateway scaffold (Kong config)"
      epic: DEVOPS
      priority: P1
      complexity: M
      assignee: "@backend-dev2"
      blocked_by: "BACKEND-001"
      description: |
        Kong declarative config:
        - Route definitions
        - JWT plugin
        - Rate limiting plugin
        - CORS configuration
      acceptance_criteria:
        - [ ] Kong starts with config
        - [ ] Routes defined for all services
      # outputs:
        - /momentum-backend/packages/api-gateway/
        
    - id: "SHARED-001"
      title: "Initialize shared-types package"
      epic: DEVOPS
      priority: P0
      complexity: S
      assignee: "@backend-dev1"
      blocked_by: "DEVOPS-001"
      description: |
        TypeScript types package:
        - Common types (User, Response, Error)
        - Event schemas
        - API request/response types
      acceptance_criteria:
        - [ ] Can import from @momentum/shared-types
        - [ ] Types used by backend and frontend
      # outputs:
        - /momentum-shared-types/
        
    - id: "SHARED-002"
      title: "Define common error codes and response types"
      epic: DEVOPS
      priority: P1
      complexity: S
      assignee: "@backend-dev1"
      blocked_by: "SHARED-001"
      description: |
        Standard types:
        - ApiResponse<T>
        - ApiError
        - ErrorCode enum
        - PaginatedResponse<T>
      # outputs:
        - /momentum-shared-types/src/common/

  # ═══════════════════════════════════════════════════════════════
  # TEAM: FRONTEND
  # ═══════════════════════════════════════════════════════════════
  frontend_tasks:
    - id: "MOBILE-SETUP-001"
      title: "Initialize React Native project"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@frontend-lead"
      blocked_by: "DEVOPS-001"
      description: |
        React Native 0.73+ project:
        - TypeScript configuration
        - ESLint + Prettier
        - Basic folder structure
        - Navigation setup (React Navigation)
      acceptance_criteria:
        - [ ] App runs on iOS simulator
        - [ ] App runs on Android emulator
        - [ ] Hot reload works
      # outputs:
        - /momentum-mobile/
        
    - id: "MOBILE-SETUP-002"
      title: "Configure WatermelonDB for offline storage"
      epic: MOBILE
      priority: P1
      complexity: M
      assignee: "@mobile-dev1"
      blocked_by: "MOBILE-SETUP-001"
      description: |
        Offline database:
        - WatermelonDB setup
        - Initial schema
        - Migration system
      acceptance_criteria:
        - [ ] Can create/read/update records offline
        - [ ] Schema migrations work
      # outputs:
        - /momentum-mobile/src/database/
        
    - id: "WEB-SETUP-001"
      title: "Initialize Next.js 14 web project"
      epic: WEB
      priority: P0
      complexity: M
      assignee: "@web-dev1"
      blocked_by: "DEVOPS-001"
      description: |
        Next.js 14 project:
        - App Router
        - TypeScript
        - Tailwind CSS
        - shadcn/ui components
      acceptance_criteria:
        - [ ] `pnpm dev` starts dev server
        - [ ] App router pages work
        - [ ] Tailwind styles apply
      # outputs:
        - /momentum-web/
        
    - id: "WEB-SETUP-002"
      title: "Configure PWA (next-pwa)"
      epic: WEB
      priority: P1
      complexity: M
      assignee: "@web-dev1"
      blocked_by: "WEB-SETUP-001"
      description: |
        PWA setup:
        - Service worker
        - Manifest.json
        - Offline page
        - Install prompt
      acceptance_criteria:
        - [ ] Lighthouse PWA score > 90
        - [ ] Can install as app
        - [ ] Works offline (basic)
      # outputs:
        - /momentum-web/public/manifest.json
        - /momentum-web/public/sw.js

  # ═══════════════════════════════════════════════════════════════
  # TEAM: BLOCKCHAIN
  # ═══════════════════════════════════════════════════════════════
  blockchain_tasks:
    - id: "STELLAR-SETUP-001"
      title: "Set up Stellar testnet accounts"
      epic: CONTRACTS
      priority: P0
      complexity: S
      assignee: "@blockchain-lead"
      description: |
        Create accounts:
        - Issuer account
        - Fee sponsor account
        - Test user accounts
        - Fund with friendbot
      acceptance_criteria:
        - [ ] Accounts created on testnet
        - [ ] Keys securely stored
        - [ ] Accounts funded
      # outputs:
        - /momentum-contracts/deployments/testnet/
        
    - id: "STELLAR-SETUP-002"
      title: "Initialize Soroban development environment"
      epic: CONTRACTS
      priority: P0
      complexity: M
      assignee: "@stellar-dev1"
      blocked_by: "STELLAR-SETUP-001"
      description: |
        Soroban setup:
        - Rust toolchain
        - Soroban CLI
        - Project structure
        - Test framework
      acceptance_criteria:
        - [ ] `cargo build` compiles
        - [ ] `soroban contract deploy` works
      # outputs:
        - /momentum-contracts/soroban/
        
    - id: "TOKEN-SERVICE-001"
      title: "Initialize token-service scaffold"
      epic: TOKEN
      priority: P1
      complexity: M
      assignee: "@stellar-dev2"
      blocked_by: "BACKEND-001"
      description: |
        Token service setup:
        - Express app scaffold
        - Stellar SDK integration
        - Basic routes structure
      acceptance_criteria:
        - [ ] Service starts
        - [ ] Can connect to Stellar testnet
      # outputs:
        - /momentum-backend/packages/token-service/

  # ═══════════════════════════════════════════════════════════════
  # TEAM: DATABASE & AI
  # ═══════════════════════════════════════════════════════════════
  database_ai_tasks:
    - id: "DB-001"
      title: "Design initial PostgreSQL schema"
      epic: INFRASTRUCTURE
      priority: P0
      complexity: L
      assignee: "@data-lead"
      description: |
        Core tables:
        - users, sessions, consents
        - pregnancies, medical_history
        - milestones, verifications
        - Basic indexes
      acceptance_criteria:
        - [ ] ERD diagram created
        - [ ] Schema reviewed by Backend team
        - [ ] Migration files created
      # outputs:
        - /momentum-database/postgres/migrations/001_initial_schema.sql
        - /momentum-docs/architecture/data-model.md
        
    - id: "DB-002"
      title: "Design MongoDB schemas"
      epic: INFRASTRUCTURE
      priority: P1
      complexity: M
      assignee: "@dba1"
      blocked_by: "DB-001"
      description: |
        Document collections:
        - symptom_logs
        - community_posts
        - chat_messages
        - analytics_events
      acceptance_criteria:
        - [ ] Schemas defined with validation
        - [ ] Indexes planned
      # outputs:
        - /momentum-database/mongodb/schemas/
        
    - id: "INFRA-001"
      title: "Set up Terraform project structure"
      epic: INFRASTRUCTURE
      priority: P1
      complexity: M
      assignee: "@infra-dev1"
      description: |
        Terraform setup:
        - AWS provider config
        - Environment folders (dev, staging, prod)
        - Module structure
      acceptance_criteria:
        - [ ] `terraform init` works
        - [ ] State backend configured
      # outputs:
        - /momentum-infrastructure/terraform/

  # ═══════════════════════════════════════════════════════════════
  # TEAM: ADMIN & ANALYTICS
  # ═══════════════════════════════════════════════════════════════
  admin_analytics_tasks:
    - id: "ADMIN-SETUP-001"
      title: "Initialize Next.js admin dashboard"
      epic: ADMIN
      priority: P1
      complexity: M
      assignee: "@admin-lead"
      blocked_by: "DEVOPS-001"
      description: |
        Admin dashboard:
        - Next.js 14 with App Router
        - Tailwind + shadcn/ui
        - Auth layout
        - Sidebar navigation
      acceptance_criteria:
        - [ ] Dashboard shell renders
        - [ ] Navigation works
        - [ ] Auth pages exist
      # outputs:
        - /momentum-admin/


sprint_2:
  goals:
    - User registration working (backend + mobile + web)
    - OTP verification working
    - JWT authentication working
    - Basic Stellar wallet creation
    - Auth middleware for all services

  # ═══════════════════════════════════════════════════════════════
  # API CONTRACTS (Must be approved before implementation)
  # ═══════════════════════════════════════════════════════════════
  api_contracts:
    - id: "API-AUTH-001"
      title: "API Contract: User Registration"
      teams: [Backend, Frontend]
      priority: P0
      assignee: "@backend-lead"
      reviewers: ["@frontend-lead", "@backend-lead"]
      endpoint: "POST /api/v1/auth/register"
      status: "Draft"
      
    - id: "API-AUTH-002"
      title: "API Contract: OTP Verification"
      teams: [Backend, Frontend]
      priority: P0
      assignee: "@backend-lead"
      endpoint: "POST /api/v1/auth/verify-otp"
      
    - id: "API-AUTH-003"
      title: "API Contract: Token Refresh"
      teams: [Backend, Frontend]
      priority: P0
      assignee: "@backend-lead"
      endpoint: "POST /api/v1/auth/refresh"
      
    - id: "API-AUTH-004"
      title: "API Contract: Get Profile"
      teams: [Backend, Frontend]
      priority: P1
      assignee: "@backend-lead"
      endpoint: "GET /api/v1/auth/profile"
      
    - id: "API-TOKEN-001"
      title: "API Contract: Get Token Balance"
      teams: [Blockchain, Frontend]
      priority: P1
      assignee: "@blockchain-lead"
      endpoint: "GET /api/v1/tokens/balance"

  # ═══════════════════════════════════════════════════════════════
  # TEAM: BACKEND
  # ═══════════════════════════════════════════════════════════════
  backend_tasks:
    - id: "AUTH-001"
      title: "Implement user registration endpoint"
      epic: AUTH
      priority: P0
      complexity: M
      assignee: "@backend-dev1"
      blocked_by: ["API-AUTH-001", "SHARED-002", "DB-001"]
      description: |
        POST /api/v1/auth/register
        - Validate phone number (E.164)
        - Check for existing user
        - Create user record
        - Trigger OTP send
        - Return session info
      acceptance_criteria:
        - [ ] Phone validation works (SA, UG, KE formats)
        - [ ] Duplicate phone returns 409
        - [ ] User created in database
        - [ ] OTP event published
      tests:
        - Unit tests for validation
        - Integration test with DB
      # outputs:
        - /momentum-backend/packages/auth-service/src/controllers/registrationController.ts
        - /momentum-backend/packages/auth-service/src/services/registrationService.ts
        
    - id: "AUTH-002"
      title: "Implement OTP service (Africa's Talking)"
      epic: AUTH
      priority: P0
      complexity: M
      assignee: "@backend-dev2"
      blocked_by: "AUTH-001"
      description: |
        OTP service:
        - Generate 6-digit OTP
        - Store with expiry (5 min)
        - Send via Africa's Talking SMS
        - Rate limiting (3/hour per phone)
      acceptance_criteria:
        - [ ] OTP generated and stored
        - [ ] SMS sent (or mocked in dev)
        - [ ] Rate limiting works
        - [ ] Expiry enforced
      # outputs:
        - /momentum-backend/packages/auth-service/src/services/otpService.ts
        - /momentum-backend/packages/notification-service/src/providers/africasTalking/
        
    - id: "AUTH-003"
      title: "Implement JWT token service"
      epic: AUTH
      priority: P0
      complexity: M
      assignee: "@backend-dev1"
      blocked_by: "AUTH-001"
      description: |
        JWT service:
        - Generate access token (15 min)
        - Generate refresh token (7 days)
        - Token validation
        - Blacklist for logout
      acceptance_criteria:
        - [ ] Tokens generated correctly
        - [ ] Tokens validate correctly
        - [ ] Blacklist works
      # outputs:
        - /momentum-backend/packages/auth-service/src/services/jwtService.ts
        
    - id: "AUTH-004"
      title: "Implement OTP verification endpoint"
      epic: AUTH
      priority: P0
      complexity: S
      assignee: "@backend-dev2"
      blocked_by: ["AUTH-002", "AUTH-003", "API-AUTH-002"]
      description: |
        POST /api/v1/auth/verify-otp
        - Validate OTP
        - Mark user as verified
        - Generate JWT tokens
        - Trigger wallet creation event
      acceptance_criteria:
        - [ ] Valid OTP returns tokens
        - [ ] Invalid OTP returns 401
        - [ ] Expired OTP returns 401
        - [ ] Wallet creation event published
      # outputs:
        - /momentum-backend/packages/auth-service/src/controllers/otpController.ts
        
    - id: "AUTH-005"
      title: "Implement token refresh endpoint"
      epic: AUTH
      priority: P0
      complexity: S
      assignee: "@backend-dev1"
      blocked_by: ["AUTH-003", "API-AUTH-003"]
      description: |
        POST /api/v1/auth/refresh
        - Validate refresh token
        - Generate new access token
        - Optionally rotate refresh token
      # outputs:
        - /momentum-backend/packages/auth-service/src/controllers/tokenController.ts
        
    - id: "AUTH-006"
      title: "Create auth middleware for all services"
      epic: AUTH
      priority: P0
      complexity: M
      assignee: "@backend-dev3"
      blocked_by: "AUTH-003"
      description: |
        Middleware:
        - JWT validation
        - User extraction
        - Role checking
        - Rate limiting per user
      acceptance_criteria:
        - [ ] Middleware reusable across services
        - [ ] Invalid token returns 401
        - [ ] Expired token returns 401
        - [ ] User attached to request
      # outputs:
        - /momentum-backend/packages/shared/src/middleware/authMiddleware.ts
        
    - id: "AUTH-007"
      title: "Implement get profile endpoint"
      epic: AUTH
      priority: P1
      complexity: S
      assignee: "@backend-dev3"
      blocked_by: ["AUTH-006", "API-AUTH-004"]
      description: |
        GET /api/v1/auth/profile
        - Return user profile
        - Include wallet address
        - Include pregnancy status
      # outputs:
        - /momentum-backend/packages/auth-service/src/controllers/profileController.ts

  # ═══════════════════════════════════════════════════════════════
  # TEAM: BLOCKCHAIN
  # ═══════════════════════════════════════════════════════════════
  blockchain_tasks:
    - id: "TOKEN-001"
      title: "Deploy MomToken Soroban contract (testnet)"
      epic: TOKEN
      priority: P0
      complexity: L
      assignee: "@stellar-dev1"
      blocked_by: "STELLAR-SETUP-002"
      description: |
        Deploy MomToken contract:
        - SEP-41 compliant
        - Mint/burn functions
        - Admin controls
        - Pausable
      acceptance_criteria:
        - [ ] Contract deployed to testnet
        - [ ] Can mint tokens
        - [ ] Can burn tokens
        - [ ] Admin functions work
      # outputs:
        - /momentum-contracts/soroban/contracts/mom_token/
        - /momentum-contracts/deployments/testnet/contract_ids.json
        
    - id: "TOKEN-002"
      title: "Implement wallet creation service"
      epic: TOKEN
      priority: P0
      complexity: M
      assignee: "@stellar-dev2"
      blocked_by: "STELLAR-SETUP-001"
      description: |
        Wallet service:
        - Create Stellar account
        - Sponsor reserves
        - Create MTK trustline
        - Store public key
      acceptance_criteria:
        - [ ] Wallet created on testnet
        - [ ] Reserves sponsored
        - [ ] Trustline established
        - [ ] Public key returned
      # outputs:
        - /momentum-backend/packages/token-service/src/services/walletCreationService.ts
        
    - id: "TOKEN-003"
      title: "Implement balance query endpoint"
      epic: TOKEN
      priority: P1
      complexity: S
      assignee: "@stellar-dev2"
      blocked_by: ["TOKEN-001", "TOKEN-002", "API-TOKEN-001"]
      description: |
        GET /api/v1/tokens/balance
        - Query Stellar for balance
        - Cache in Redis (30s TTL)
        - Return formatted balance
      acceptance_criteria:
        - [ ] Balance returned correctly
        - [ ] Caching works
        - [ ] Handles missing account
      # outputs:
        - /momentum-backend/packages/token-service/src/controllers/balanceController.ts
        
    - id: "TOKEN-004"
      title: "Integrate wallet creation with auth flow"
      epic: TOKEN
      priority: P0
      complexity: M
      assignee: "@stellar-dev2"
      blocked_by: ["AUTH-004", "TOKEN-002"]
      description: |
        Event handler:
        - Listen for user.verified event
        - Create wallet
        - Store wallet address
        - Emit wallet.created event
      acceptance_criteria:
        - [ ] Wallet created on OTP verification
        - [ ] Wallet address stored on user
        - [ ] Event emitted
      # outputs:
        - /momentum-backend/packages/token-service/src/events/handlers/userVerifiedHandler.ts

  # ═══════════════════════════════════════════════════════════════
  # TEAM: FRONTEND
  # ═══════════════════════════════════════════════════════════════
  frontend_tasks:
    # MOBILE
    - id: "MOBILE-001"
      title: "Build Welcome/Onboarding screens"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev1"
      blocked_by: "MOBILE-SETUP-001"
      description: |
        Screens:
        - Welcome screen with branding
        - Feature highlights carousel
        - Get started button
      acceptance_criteria:
        - [ ] Screens match design
        - [ ] Navigation works
        - [ ] Animations smooth
      # outputs:
        - /momentum-mobile/src/screens/auth/WelcomeScreen.tsx
        - /momentum-mobile/src/screens/auth/OnboardingScreen.tsx
        
    - id: "MOBILE-002"
      title: "Build Phone Entry screen"
      epic: MOBILE
      priority: P0
      complexity: S
      assignee: "@mobile-dev1"
      blocked_by: "MOBILE-001"
      description: |
        Phone entry:
        - Country selector
        - Phone input with formatting
        - Validation
        - Submit button
      # outputs:
        - /momentum-mobile/src/screens/auth/PhoneEntryScreen.tsx
        - /momentum-mobile/src/components/auth/PhoneInput.tsx
        
    - id: "MOBILE-003"
      title: "Build OTP Verification screen"
      epic: MOBILE
      priority: P0
      complexity: S
      assignee: "@mobile-dev2"
      blocked_by: "MOBILE-002"
      description: |
        OTP screen:
        - 6-digit input
        - Auto-advance
        - Resend timer
        - Paste from SMS
      # outputs:
        - /momentum-mobile/src/screens/auth/OTPVerificationScreen.tsx
        - /momentum-mobile/src/components/auth/OTPInput.tsx
        
    - id: "MOBILE-004"
      title: "Implement auth API client"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev2"
      blocked_by: "API-AUTH-001"
      description: |
        API client:
        - Axios instance with interceptors
        - Auth endpoints (register, verify, refresh)
        - Error handling
        - Token storage
      acceptance_criteria:
        - [ ] Can call all auth endpoints
        - [ ] Tokens stored securely
        - [ ] Auto-refresh works
      # outputs:
        - /momentum-mobile/src/services/api/client.ts
        - /momentum-mobile/src/services/api/authApi.ts
        
    - id: "MOBILE-005"
      title: "Implement secure token storage"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev2"
      blocked_by: "MOBILE-004"
      description: |
        Secure storage:
        - Use Keychain (iOS) / Keystore (Android)
        - Store access + refresh tokens
        - Clear on logout
      # outputs:
        - /momentum-mobile/src/services/storage/secureStorage.ts
        
    - id: "MOBILE-006"
      title: "Wire up complete auth flow"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@frontend-lead"
      blocked_by: ["MOBILE-003", "MOBILE-004", "MOBILE-005", "AUTH-004"]
      description: |
        Integration:
        - Connect screens to API
        - Handle success/error states
        - Navigate to home on success
        - Store tokens
      acceptance_criteria:
        - [ ] Can register new user
        - [ ] Can verify OTP
        - [ ] Redirects to home
        - [ ] Tokens persisted
      # outputs:
        - /momentum-mobile/src/store/authStore.ts
        
    # WEB
    - id: "WEB-001"
      title: "Build Login/Register page"
      epic: WEB
      priority: P0
      complexity: M
      assignee: "@web-dev1"
      blocked_by: "WEB-SETUP-001"
      description: |
        Auth pages:
        - Phone entry form
        - Country selector
        - Validation
        - Loading states
      # outputs:
        - /momentum-web/src/app/(auth)/login/page.tsx
        - /momentum-web/src/app/(auth)/register/page.tsx
        
    - id: "WEB-002"
      title: "Build OTP Verification page"
      epic: WEB
      priority: P0
      complexity: S
      assignee: "@web-dev1"
      blocked_by: "WEB-001"
      description: |
        OTP page:
        - 6-digit input
        - Resend button
        - Error handling
      # outputs:
        - /momentum-web/src/app/(auth)/verify-otp/page.tsx
        
    - id: "WEB-003"
      title: "Implement auth API client (web)"
      epic: WEB
      priority: P0
      complexity: M
      assignee: "@web-dev2"
      blocked_by: "API-AUTH-001"
      description: |
        API client for web:
        - Fetch/axios client
        - Auth endpoints
        - Cookie/localStorage tokens
      # outputs:
        - /momentum-web/src/services/api/client.ts
        - /momentum-web/src/services/api/authApi.ts
        
    - id: "WEB-004"
      title: "Wire up complete auth flow (web)"
      epic: WEB
      priority: P0
      complexity: M
      assignee: "@web-dev1"
      blocked_by: ["WEB-002", "WEB-003", "AUTH-004"]
      description: |
        Integration:
        - Connect pages to API
        - Handle states
        - Redirect to dashboard
      # outputs:
        - /momentum-web/src/store/authStore.ts

  # ═══════════════════════════════════════════════════════════════
  # TEAM: DATABASE & AI
  # ═══════════════════════════════════════════════════════════════
  database_ai_tasks:
    - id: "DB-003"
      title: "Create auth-related database migrations"
      epic: INFRASTRUCTURE
      priority: P0
      complexity: M
      assignee: "@dba1"
      blocked_by: "DB-001"
      description: |
        Migrations for:
        - users table
        - sessions table
        - otp_codes table
        - consents table
      # outputs:
        - /momentum-database/postgres/migrations/002_auth_tables.sql
        
    - id: "DB-004"
      title: "Set up Redis for session/OTP storage"
      epic: INFRASTRUCTURE
      priority: P1
      complexity: S
      assignee: "@infra-dev1"
      blocked_by: "DEVOPS-003"
      description: |
        Redis configuration:
        - Session storage schema
        - OTP storage with TTL
        - Rate limit counters
      # outputs:
        - /momentum-database/redis/schemas/

  # ═══════════════════════════════════════════════════════════════
  # TEAM: ADMIN & ANALYTICS
  # ═══════════════════════════════════════════════════════════════
  admin_analytics_tasks:
    - id: "ADMIN-001"
      title: "Build admin login page"
      epic: ADMIN
      priority: P1
      complexity: S
      assignee: "@admin-lead"
      blocked_by: "ADMIN-SETUP-001"
      description: |
        Admin auth:
        - Email/password login
        - MFA setup
        - Session management
      # outputs:
        - /momentum-admin/src/app/(auth)/login/page.tsx

  # ═══════════════════════════════════════════════════════════════
  # TEAM: LINK ALL & ACCESS
  # ═══════════════════════════════════════════════════════════════
  link_all_tasks:
    - id: "TEST-001"
      title: "Write E2E tests for auth flow"
      epic: SECURITY
      priority: P1
      complexity: M
      assignee: "@qa-dev1"
      blocked_by: ["AUTH-004", "MOBILE-006"]
      description: |
        E2E tests:
        - Registration flow
        - OTP verification
        - Token refresh
        - Logout
      # outputs:
        - /momentum-e2e-tests/tests/api/auth.spec.ts
        
    - id: "SECURITY-001"
      title: "Security review of auth implementation"
      epic: SECURITY
      priority: P1
      complexity: M
      assignee: "@security-dev1"
      blocked_by: "AUTH-006"
      description: |
        Review:
        - JWT implementation
        - OTP security
        - Rate limiting
        - Input validation
      # outputs:
        - /momentum-security/audits/auth-review.md


sprint_3:
  goals:
    - Pregnancy registration working
    - Daily symptom check-in working
    - Risk engine basic triage
    - Mobile health screens complete
    - Web health screens complete

  api_contracts:
    - id: "API-HEALTH-001"
      title: "API Contract: Register Pregnancy"
      endpoint: "POST /api/v1/health/pregnancies"
      
    - id: "API-HEALTH-002"
      title: "API Contract: Daily Check-in"
      endpoint: "POST /api/v1/health/check-ins"
      
    - id: "API-HEALTH-003"
      title: "API Contract: Get Triage Result"
      endpoint: "GET /api/v1/health/check-ins/:id/triage"
      
    - id: "API-HEALTH-004"
      title: "API Contract: Kick Counter"
      endpoint: "POST /api/v1/health/kick-sessions"

  backend_tasks:
    - id: "HEALTH-001"
      title: "Implement pregnancy registration"
      epic: HEALTH
      priority: P0
      complexity: M
      assignee: "@backend-dev1"
      blocked_by: ["API-HEALTH-001", "AUTH-006"]
      
    - id: "HEALTH-002"
      title: "Implement symptom check-in endpoint"
      epic: HEALTH
      priority: P0
      complexity: L
      assignee: "@backend-dev2"
      blocked_by: ["HEALTH-001", "API-HEALTH-002"]
      
    - id: "HEALTH-003"
      title: "Implement kick counter endpoint"
      epic: HEALTH
      priority: P1
      complexity: S
      assignee: "@backend-dev3"
      blocked_by: ["HEALTH-001", "API-HEALTH-004"]
      
    - id: "HEALTH-004"
      title: "Implement medical history CRUD"
      epic: HEALTH
      priority: P1
      complexity: M
      assignee: "@backend-dev1"
      blocked_by: "HEALTH-001"
      
    - id: "HEALTH-005"
      title: "Integrate with risk engine"
      epic: HEALTH
      priority: P0
      complexity: M
      assignee: "@backend-dev2"
      blocked_by: ["HEALTH-002", "ML-001"]

  blockchain_tasks:
    - id: "TOKEN-005"
      title: "Deploy FeeSponsor contract"
      epic: TOKEN
      priority: P1
      complexity: L
      assignee: "@stellar-dev1"
      blocked_by: "TOKEN-001"

  frontend_tasks:
    # MOBILE
    - id: "MOBILE-HEALTH-001"
      title: "Build Pregnancy Setup screen"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev1"
      blocked_by: "MOBILE-006"
      
    - id: "MOBILE-HEALTH-002"
      title: "Build Daily Check-in screen"
      epic: MOBILE
      priority: P0
      complexity: L
      assignee: "@mobile-dev2"
      blocked_by: "MOBILE-HEALTH-001"
      
    - id: "MOBILE-HEALTH-003"
      title: "Build Triage Result screen"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev2"
      blocked_by: "MOBILE-HEALTH-002"
      
    - id: "MOBILE-HEALTH-004"
      title: "Build Kick Counter screen"
      epic: MOBILE
      priority: P1
      complexity: M
      assignee: "@mobile-dev1"
      blocked_by: "MOBILE-HEALTH-001"
      
    # WEB
    - id: "WEB-HEALTH-001"
      title: "Build Dashboard home page"
      epic: WEB
      priority: P0
      complexity: M
      assignee: "@web-dev1"
      blocked_by: "WEB-004"
      
    - id: "WEB-HEALTH-002"
      title: "Build Daily Check-in page"
      epic: WEB
      priority: P0
      complexity: L
      assignee: "@web-dev2"
      blocked_by: "WEB-HEALTH-001"

  database_ai_tasks:
    - id: "ML-001"
      title: "Implement rule-based triage engine"
      epic: ML
      priority: P0
      complexity: L
      assignee: "@ml-dev1"
      description: |
        FastAPI triage service:
        - Symptom input processing
        - Rule-based risk scoring
        - SATS protocol (SA)
        - Uganda MOH protocol
      # outputs:
        - /momentum-backend/packages/risk-engine/
        - /momentum-ml/src/models/risk_predictor/
        
    - id: "ML-002"
      title: "Load SATS and Uganda protocols"
      epic: ML
      priority: P0
      complexity: M
      assignee: "@ml-dev1"
      blocked_by: "ML-001"
      # outputs:
        - /momentum-backend/packages/risk-engine/src/protocols/
        
    - id: "DB-005"
      title: "Create health-related database migrations"
      epic: INFRASTRUCTURE
      priority: P0
      complexity: M
      assignee: "@dba1"
      # outputs:
        - /momentum-database/postgres/migrations/003_health_tables.sql

  admin_analytics_tasks:
    - id: "ADMIN-002"
      title: "Build user management page (view only)"
      epic: ADMIN
      priority: P2
      complexity: M
      assignee: "@fullstack-dev1"

  link_all_tasks:
    - id: "TEST-002"
      title: "Write E2E tests for health flow"
      epic: SECURITY
      priority: P1
      complexity: M
      assignee: "@qa-dev1"
      blocked_by: ["HEALTH-002", "MOBILE-HEALTH-002"]
      
    - id: "I18N-001"
      title: "Add health-related translations"
      epic: DOCS
      priority: P1
      complexity: S
      assignee: "@qa-dev1"
      # outputs:
        - /momentum-localizations/mobile/*/health.json
        - /momentum-localizations/web/*/health.json


sprint_4:
  goals:
    - Milestone definitions seeded
    - Milestone completion flow working
    - Token minting on milestone completion
    - Rewards wallet visible in mobile/web
    - QR verification working

  api_contracts:
    - id: "API-MILE-001"
      title: "API Contract: Get Milestone Catalog"
      endpoint: "GET /api/v1/milestones"
      
    - id: "API-MILE-002"
      title: "API Contract: Get User Progress"
      endpoint: "GET /api/v1/milestones/progress"
      
    - id: "API-MILE-003"
      title: "API Contract: Verify Milestone (QR)"
      endpoint: "POST /api/v1/milestones/verify"
      
    - id: "API-TOKEN-002"
      title: "API Contract: Get Transaction History"
      endpoint: "GET /api/v1/tokens/transactions"

  backend_tasks:
    - id: "MILE-001"
      title: "Implement milestone catalog service"
      epic: MILESTONE
      priority: P0
      complexity: M
      assignee: "@backend-dev1"
      blocked_by: "API-MILE-001"
      
    - id: "MILE-002"
      title: "Implement milestone progress tracking"
      epic: MILESTONE
      priority: P0
      complexity: L
      assignee: "@backend-dev2"
      blocked_by: ["MILE-001", "API-MILE-002"]
      
    - id: "MILE-003"
      title: "Implement QR verification endpoint"
      epic: MILESTONE
      priority: P0
      complexity: M
      assignee: "@backend-dev3"
      blocked_by: ["MILE-002", "API-MILE-003"]
      
    - id: "MILE-004"
      title: "Seed milestone definitions"
      epic: MILESTONE
      priority: P0
      complexity: S
      assignee: "@backend-dev1"
      blocked_by: "MILE-001"
      description: |
        Seed data:
        - Clinical milestones (ANC visits, labs)
        - Wellness milestones (check-in streaks)
        - Education milestones (quiz completions)
      # outputs:
        - /momentum-database/postgres/seeds/milestones.sql
        
    - id: "MILE-005"
      title: "Auto-complete wellness milestones"
      epic: MILESTONE
      priority: P1
      complexity: M
      assignee: "@backend-dev2"
      blocked_by: ["MILE-002", "HEALTH-002"]
      description: |
        Event handlers:
        - 7-day check-in streak → milestone
        - 30-day check-in streak → milestone

  blockchain_tasks:
    - id: "TOKEN-006"
      title: "Deploy MilestoneRegistry contract"
      epic: TOKEN
      priority: P0
      complexity: L
      assignee: "@stellar-dev1"
      blocked_by: "TOKEN-001"
      
    - id: "TOKEN-007"
      title: "Implement mint-for-milestone flow"
      epic: TOKEN
      priority: P0
      complexity: L
      assignee: "@stellar-dev2"
      blocked_by: ["TOKEN-001", "TOKEN-006"]
      
    - id: "TOKEN-008"
      title: "Integrate milestone service with token minting"
      epic: TOKEN
      priority: P0
      complexity: M
      assignee: "@blockchain-lead"
      blocked_by: ["MILE-002", "TOKEN-007"]
      
    - id: "TOKEN-009"
      title: "Implement transaction history endpoint"
      epic: TOKEN
      priority: P1
      complexity: M
      assignee: "@stellar-dev2"
      blocked_by: ["TOKEN-001", "API-TOKEN-002"]

  frontend_tasks:
    # MOBILE
    - id: "MOBILE-REWARD-001"
      title: "Build Wallet/Balance screen"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev1"
      blocked_by: "TOKEN-003"
      
    - id: "MOBILE-REWARD-002"
      title: "Build Milestone List screen"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev2"
      blocked_by: "API-MILE-001"
      
    - id: "MOBILE-REWARD-003"
      title: "Build QR Scanner screen"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev1"
      blocked_by: "MILE-003"
      
    - id: "MOBILE-REWARD-004"
      title: "Build reward celebration animation"
      epic: MOBILE
      priority: P1
      complexity: S
      assignee: "@mobile-dev2"
      
    # WEB
    - id: "WEB-REWARD-001"
      title: "Build Wallet page"
      epic: WEB
      priority: P0
      complexity: M
      assignee: "@web-dev1"
      blocked_by: "TOKEN-003"
      
    - id: "WEB-REWARD-002"
      title: "Build Milestones page"
      epic: WEB
      priority: P0
      complexity: M
      assignee: "@web-dev2"
      blocked_by: "API-MILE-001"

  database_ai_tasks:
    - id: "DB-006"
      title: "Create milestone-related database migrations"
      epic: INFRASTRUCTURE
      priority: P0
      complexity: M
      assignee: "@dba1"
      # outputs:
        - /momentum-database/postgres/migrations/004_milestone_tables.sql

  admin_analytics_tasks:
    - id: "ADMIN-003"
      title: "Build milestone management page"
      epic: ADMIN
      priority: P2
      complexity: M
      assignee: "@fullstack-dev1"

  link_all_tasks:
    - id: "NOTIF-001"
      title: "Implement push notification service"
      epic: NOTIFICATION
      priority: P1
      complexity: M
      assignee: "@backend-dev3"  # Shared with Backend
      
    - id: "NOTIF-002"
      title: "Send notification on milestone completion"
      epic: NOTIFICATION
      priority: P1
      complexity: S
      assignee: "@backend-dev3"
      blocked_by: ["NOTIF-001", "TOKEN-008"]
      
    - id: "TEST-003"
      title: "Write E2E tests for milestone flow"
      epic: SECURITY
      priority: P1
      complexity: M
      assignee: "@qa-dev1"


sprint_5:
  goals:
    - Community feed working
    - Peer chat working
    - Education hub with articles
    - Quiz system working
    - Digital Doula basic profile

  backend_tasks:
    - id: "COMM-001"
      title: "Implement community feed service"
      epic: COMMUNITY
      priority: P0
      complexity: L
      assignee: "@backend-dev1"
      
    - id: "COMM-002"
      title: "Implement peer chat service"
      epic: COMMUNITY
      priority: P1
      complexity: L
      assignee: "@backend-dev2"
      
    - id: "COMM-003"
      title: "Implement Digital Doula profiles"
      epic: COMMUNITY
      priority: P1
      complexity: M
      assignee: "@backend-dev3"
      
    - id: "CONTENT-001"
      title: "Implement content service (articles)"
      epic: CONTENT
      priority: P0
      complexity: M
      assignee: "@backend-dev1"
      
    - id: "CONTENT-002"
      title: "Implement quiz service"
      epic: CONTENT
      priority: P0
      complexity: M
      assignee: "@backend-dev2"

  frontend_tasks:
    - id: "MOBILE-COMM-001"
      title: "Build Community Feed screen"
      epic: MOBILE
      priority: P0
      complexity: L
      assignee: "@mobile-dev1"
      
    - id: "MOBILE-COMM-002"
      title: "Build Chat screens"
      epic: MOBILE
      priority: P1
      complexity: L
      assignee: "@mobile-dev2"
      
    - id: "MOBILE-EDU-001"
      title: "Build Education Hub screen"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev1"
      
    - id: "MOBILE-EDU-002"
      title: "Build Quiz screen"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev2"
      
    - id: "WEB-COMM-001"
      title: "Build Community page"
      epic: WEB
      priority: P0
      complexity: L
      assignee: "@web-dev1"
      
    - id: "WEB-EDU-001"
      title: "Build Education Hub page"
      epic: WEB
      priority: P0
      complexity: M
      assignee: "@web-dev2"

  admin_analytics_tasks:
    - id: "ADMIN-CMS-001"
      title: "Build Content CMS"
      epic: ADMIN
      priority: P0
      complexity: L
      assignee: "@admin-lead"
      
    - id: "ADMIN-CMS-002"
      title: "Build Quiz Builder"
      epic: ADMIN
      priority: P0
      complexity: M
      assignee: "@fullstack-dev1"


sprint_6:
  goals:
    - Push notifications working (mobile + web)
    - SMS notifications working
    - Offline sync working (mobile)
    - PWA offline working (web)
    - USSD basic menu working

  backend_tasks:
    - id: "NOTIF-003"
      title: "Implement SMS notification service"
      epic: NOTIFICATION
      priority: P0
      complexity: M
      assignee: "@backend-dev1"
      
    - id: "NOTIF-004"
      title: "Implement scheduled notifications"
      epic: NOTIFICATION
      priority: P1
      complexity: M
      assignee: "@backend-dev2"
      
    - id: "SYNC-001"
      title: "Implement sync service"
      epic: CONNECTIVITY
      priority: P0
      complexity: L
      assignee: "@backend-dev3"
      
    - id: "USSD-001"
      title: "Implement USSD gateway"
      epic: CONNECTIVITY
      priority: P1
      complexity: L
      assignee: "@backend-dev1"

  frontend_tasks:
    - id: "MOBILE-SYNC-001"
      title: "Implement offline sync manager"
      epic: MOBILE
      priority: P0
      complexity: L
      assignee: "@mobile-dev1"
      
    - id: "MOBILE-PUSH-001"
      title: "Implement push notification handling"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev2"
      
    - id: "WEB-OFFLINE-001"
      title: "Implement IndexedDB storage"
      epic: WEB
      priority: P0
      complexity: M
      assignee: "@web-dev1"
      
    - id: "WEB-PUSH-001"
      title: "Implement web push notifications"
      epic: WEB
      priority: P0
      complexity: M
      assignee: "@web-dev2"


sprint_7:
  goals:
    - Token redemption working
    - Mobile money integration (MTN MoMo)
    - Transport vouchers (Uber/Bolt)
    - MomConnect integration (SA)
    - FamilyConnect integration (UG)

  backend_tasks:
    - id: "REDEEM-001"
      title: "Implement redemption service"
      epic: INTEGRATION
      priority: P0
      complexity: L
      assignee: "@backend-dev1"
      
    - id: "REDEEM-002"
      title: "Integrate MTN MoMo"
      epic: INTEGRATION
      priority: P0
      complexity: L
      assignee: "@backend-dev2"
      
    - id: "REDEEM-003"
      title: "Integrate transport vouchers"
      epic: INTEGRATION
      priority: P1
      complexity: M
      assignee: "@backend-dev3"
      
    - id: "INTEG-001"
      title: "Integrate MomConnect (SA)"
      epic: INTEGRATION
      priority: P1
      complexity: L
      assignee: "@backend-dev1"
      
    - id: "INTEG-002"
      title: "Integrate FamilyConnect (UG)"
      epic: INTEGRATION
      priority: P1
      complexity: L
      assignee: "@backend-dev2"

  blockchain_tasks:
    - id: "TOKEN-010"
      title: "Implement burn-for-redemption flow"
      epic: TOKEN
      priority: P0
      complexity: M
      assignee: "@stellar-dev1"

  frontend_tasks:
    - id: "MOBILE-REDEEM-001"
      title: "Build Redemption Catalog screen"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev1"
      
    - id: "MOBILE-REDEEM-002"
      title: "Build Redemption Flow screens"
      epic: MOBILE
      priority: P0
      complexity: M
      assignee: "@mobile-dev2"
      
    - id: "WEB-REDEEM-001"
      title: "Build Redemption pages"
      epic: WEB
      priority: P0
      complexity: M
      assignee: "@web-dev1"


sprint_8:
  goals:
    - Analytics dashboard working
    - Admin fully functional
    - Verifier management working
    - Performance optimization
    - Security hardening
    - Documentation complete

  admin_analytics_tasks:
    - id: "ANALYTICS-001"
      title: "Implement event ingestion pipeline"
      epic: ANALYTICS
      priority: P0
      complexity: L
      assignee: "@data-dev1"
      
    - id: "ANALYTICS-002"
      title: "Build KPI dashboard"
      epic: ANALYTICS
      priority: P0
      complexity: L
      assignee: "@admin-lead"
      
    - id: "ADMIN-004"
      title: "Build verifier management"
      epic: ADMIN
      priority: P0
      complexity: M
      assignee: "@fullstack-dev1"
      
    - id: "ADMIN-005"
      title: "Build platform configuration"
      epic: ADMIN
      priority: P1
      complexity: M
      assignee: "@fullstack-dev1"

  database_ai_tasks:
    - id: "ML-003"
      title: "Train XGBoost risk model"
      epic: ML
      priority: P1
      complexity: L
      assignee: "@ml-dev1"
      
    - id: "INFRA-002"
      title: "Set up production Kubernetes"
      epic: INFRASTRUCTURE
      priority: P0
      complexity: XL
      assignee: "@infra-dev1"
      
    - id: "INFRA-003"
      title: "Configure production databases"
      epic: INFRASTRUCTURE
      priority: P0
      complexity: L
      assignee: "@dba1"

  link_all_tasks:
    - id: "SECURITY-002"
      title: "Conduct security audit"
      epic: SECURITY
      priority: P0
      complexity: L
      assignee: "@security-dev1"
      
    - id: "SECURITY-003"
      title: "Smart contract audit coordination"
      epic: SECURITY
      priority: P0
      complexity: M
      assignee: "@security-dev1"
      
    - id: "TEST-004"
      title: "Full E2E regression suite"
      epic: SECURITY
      priority: P0
      complexity: L
      assignee: "@qa-dev1"
      
    - id: "MONITOR-001"
      title: "Set up Prometheus/Grafana"
      epic: DEVOPS
      priority: P0
      complexity: M
      assignee: "@devops-dev1"
      
    - id: "MONITOR-002"
      title: "Set up alerting"
      epic: DEVOPS
      priority: P0
      complexity: M
      assignee: "@devops-dev1"
      
    - id: "DOCS-003"
      title: "Complete API documentation"
      epic: DOCS
      priority: P0
      complexity: M
      assignee: "@qa-dev1"
      
    - id: "DOCS-004"
      title: "Write runbooks"
      epic: DOCS
      priority: P0
      complexity: M
      assignee: "@devops-lead"
