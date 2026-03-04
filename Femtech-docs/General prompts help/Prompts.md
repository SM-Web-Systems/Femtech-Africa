# Software Block Definitions with inputs, Outputs, and Implementation Prompts

# Table of Contents
- Authentication & Identity Services
- Health & Clinical Services
- Milestone & Rewards Services
- Blockchain & Token Services
- Community & Social Services
- Content & Education Services
- Notification & Communication Services
- Connectivity & Fallback Services
- Integration Services
- Analytics & Reporting Services
- Administration Services
- Mobile Application Modules
- AI/ML Pipeline Modules
- Smart Contract Modules
# ---------------------------------------------------------------------------------------------------------------------------------
# 1. Authentication & Identity Services
# ---------------------------------------------------------------------------------------------------------------------------------
# 1.1 User Registration
Attribute	Description
Block ID	AUTH-001
Name	User Registration Service
Aim	Register new mothers on the platform with phone-based authentication, create invisible blockchain wallet, and establish consent records for POPIA/DPPA compliance
Priority	P0 (Critical)
# inputs:
{
  phoneNumber: string;          // E.164 format: +27XXXXXXXXX or +256XXXXXXXXX
  countryCode: string;          // +27 (SA), +256 (UG)
  firstName: string;            // User's first name
  lastName: string;             // User's last name
  language: string;             // Preferred language: en, zu, xh, st, lg, sw
  consentDataProcessing: boolean;    // Required: true
  consentHealthDataSharing: boolean; // Optional
  consentMarketing: boolean;         // Optional
  referralCode?: string;        // Optional: Digital Doula or partner referral
}

# outputs:
{
  success: boolean;
  userId: string;               // UUID
  walletAddress: string;        // Ethereum address (0x...)
  accessToken: string;          // JWT (15min expiry)
  refreshToken: string;         // JWT (7 day expiry)
  profile: {
    id: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    language: string;
    country: string;            // Derived from countryCode
    createdAt: timestamp;
  };
  consentRecordId: string;      // For audit trail
}

# Implementation Prompt:
Build a user registration service that:
1. VALIDATES phone number format based on country code (+27 for SA, +256 for UG)
2. CHECKS if phone number already exists in database
3. GENERATES 6-digit OTP and sends via Africa's Talking SMS API
4. VERIFIES OTP within 5-minute window (stored in Redis)
5. CREATES user record in PostgreSQL with encrypted PII
6. CREATES invisible blockchain wallet using Web3Auth MPC SDK:
   - No seed phrase shown to user
   - Wallet tied to phone number identity
   - Recovery via trusted contacts + biometrics
7. RECORDS consent with timestamp, IP, and user agent for compliance
8. GENERATES JWT access token (15min) and refresh token (7 days)
9. ASSIGNS user to country-specific data partition (SA or UG)
10. PUBLISHES user.created event to message queue for downstream services
11. IF referral code provided, LINKS to referring Digital Doula for rewards tracking

Error Handling:
- Phone already registered → Return specific error with login suggestion
- OTP expired → Allow resend with rate limiting (max 3 per 10 min)
- Wallet creation failed → Retry 3x, then queue for manual resolution
- Consent not given → Reject registration with clear message

Security Requirements:
- Rate limit: 5 registration attempts per phone per hour
- Log all registration attempts for fraud detection
- Encrypt phone number at rest using AES-256
# ---------------------------------------------------------------------------------------------------------------------------------
# 1.2 User Authentication (Login)
Attribute	Description
Block ID	AUTH-002
Name	User Login Service
Aim	Authenticate existing users via OTP, manage sessions, and provide secure token refresh
Priority	P0 (Critical)

# inputs:
// Step 1: Request OTP
{
  phoneNumber: string;
  countryCode: string;
}

// Step 2: Verify OTP
{
  phoneNumber: string;
  countryCode: string;
  otp: string;                  // 6-digit code
  deviceId?: string;            // For device tracking
  deviceInfo?: {
    platform: string;           // android, ios
    version: string;
    model: string;
  };
}

# outputs:
{
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    language: string;
    country: string;
    walletAddress: string;
    role: string;               // MOTHER, CHW, VERIFIER, ADMIN
    tokenBalance: number;       // Current MTK balance
    activePregnancy?: {
      id: string;
      gestationalAge: number;
      eddDate: string;
      riskLevel: string;
    };
  };
  isNewDevice: boolean;         // Flag if logging in from new device
}

# Implementation Prompt:
Build a user login service that:
1. ACCEPTS phone number and validates format
2. CHECKS if user exists in database
3. GENERATES and sends OTP via SMS
4. VERIFIES OTP with timing attack protection (constant-time comparison)
5. CREATES session record with device fingerprint
6. GENERATES JWT tokens with appropriate claims:
   - userId, role, country in access token
   - Session ID in refresh token
7. STORES refresh token hash in Redis with user association
8. FETCHES current token balance from cache (or blockchain if cache miss)
9. FETCHES active pregnancy data if exists
10. UPDATES last_login timestamp
11. PUBLISHES user.login event for analytics
12. IF new device detected, SENDS notification to user about new login

Session Management:
- Support multiple active sessions (max 5 devices)
- Allow user to view and revoke sessions
- Auto-expire inactive sessions after 30 days

Security:
- Lock account after 5 failed OTP attempts (30 min lockout)
- Implement exponential backoff on failures
- Log all authentication attempts with IP and device
# ---------------------------------------------------------------------------------------------------------------------------------
# 1.3 Token Refresh
Attribute	Description
Block ID	AUTH-003
Name	Token Refresh Service
Aim	Provide seamless session extension without requiring re-authentication
Priority	P0 (Critical)

# inputs:
{
  refreshToken: string;
}

# outputs:
{
  success: boolean;
  accessToken: string;          // New 15-minute token
  refreshToken?: string;        // New refresh token (if rotation enabled)
}

# Implementation Prompt:
Build a token refresh service that:
1. VALIDATES refresh token signature and expiry
2. CHECKS refresh token against stored hash in Redis
3. VERIFIES token not in blacklist (logged out tokens)
4. EXTRACTS session ID and validates session is still active
5. GENERATES new access token with same claims
6. OPTIONALLY rotates refresh token (configurable)
7. UPDATES session last_activity timestamp
8. RETURNS new tokens

Security:
- Refresh tokens are one-time use if rotation enabled
- Detect and alert on refresh token reuse (potential theft)
- Implement refresh token family tracking for theft detection
# ---------------------------------------------------------------------------------------------------------------------------------
# 1.4 Logout
Attribute	Description
Block ID	AUTH-004
Name	Logout Service
Aim	Securely terminate user sessions and invalidate tokens
Priority	P1 (High)

# inputs:
{
  accessToken: string;          // From Authorization header
  logoutAll?: boolean;          // Logout from all devices
}
# outputs:

{
  success: boolean;
  sessionsTerminated: number;
}
# Implementation Prompt:

Build a logout service that:

1. EXTRACTS user ID and session ID from access token
2. ADDS access token to blacklist in Redis (TTL = token remaining lifetime)
3. IF logoutAll = true:
   - DELETES all refresh tokens for user
   - TERMINATES all active sessions
   - SENDS notification about security action
4. ELSE:
   - DELETES only current session's refresh token
5. PUBLISHES user.logout event
6. RETURNS count of terminated sessions
# ---------------------------------------------------------------------------------------------------------------------------------
# 1.5 Wallet Management
Attribute	Description
Block ID	AUTH-005
Name	Wallet Management Service
Aim	Manage invisible blockchain wallets including recovery and key operations
Priority	P1 (High)
# inputs:

// Get wallet info
{
  userId: string;
}

// Setup recovery
{
  userId: string;
  recoveryMethod: 'TRUSTED_CONTACTS' | 'BIOMETRIC' | 'BACKUP_CODE';
  trustedContacts?: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
}

// Initiate recovery
{
  phoneNumber: string;
  recoveryMethod: string;
  recoveryProof: string;        // Varies by method
}
# outputs:

// Wallet info
{
  walletAddress: string;
  createdAt: timestamp;
  recoveryConfigured: boolean;
  recoveryMethods: string[];
}

// Recovery setup
{
  success: boolean;
  recoveryId: string;
  backupCodes?: string[];       // If backup code method
}

// Recovery result
{
  success: boolean;
  newWalletAddress?: string;    // Same address, new access
  accessToken: string;
  refreshToken: string;
}
# Implementation Prompt:

Build a wallet management service using Web3Auth that:

1. WALLET INFO:
   - Returns wallet address (public)
   - Never exposes private key to any service
   - Shows recovery status

2. RECOVERY SETUP:
   - TRUSTED_CONTACTS: Requires 2-of-3 contacts to recover
     - Sends SMS to each contact with recovery shard
     - Stores encrypted shards
   - BIOMETRIC: Links device biometric to key recovery
     - Uses device secure enclave
   - BACKUP_CODE: Generates 12 backup codes
     - Each code usable once
     - Stored as hashes only

3. RECOVERY EXECUTION:
   - Validates recovery proof based on method
   - Reconstructs wallet access via MPC
   - Creates new session
   - Notifies user of recovery event
   - Invalidates old sessions

Security:
- Recovery requires additional verification (SMS + method)
- Rate limit recovery attempts: 3 per day
- Log all recovery attempts for fraud detection
- Notify all trusted contacts on recovery initiation
# ---------------------------------------------------------------------------------------------------------------------------------
# 1.6 Profile Management
Attribute	Description
Block ID	AUTH-006
Name	Profile Management Service
Aim	Allow users to view and update their profile information, language preferences, and privacy settings
Priority	P1 (High)
# inputs:

// Get profile
{
  userId: string;
}

// Update profile
{
  userId: string;
  updates: {
    firstName?: string;
    lastName?: string;
    language?: string;
    dateOfBirth?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
}

// Update privacy settings
{
  userId: string;
  settings: {
    shareHealthWithPartner?: boolean;
    shareLocationOnEmergency?: boolean;
    allowAnonymousDataForResearch?: boolean;
    showProfileInCommunity?: boolean;
  };
}

# outputs:

{
  success: boolean;
  profile: {
    id: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    language: string;
    country: string;
    dateOfBirth?: string;
    emergencyContact?: object;
    privacySettings: object;
    createdAt: timestamp;
    updatedAt: timestamp;
  };
}
# Implementation Prompt:

Build a profile management service that:

1. GET PROFILE:
   - Returns user's profile data
   - Includes privacy settings
   - Includes linked support circle summary

2. UPDATE PROFILE:
   - Validates all input fields
   - Updates PostgreSQL user record
   - Records change in audit log with before/after
   - Publishes user.updated event

3. UPDATE PRIVACY SETTINGS:
   - Validates settings
   - Updates consent records if data sharing changed
   - Propagates changes to relevant services:
     - Partner access revoked → Remove from support circle view
     - Research consent changed → Update anonymization pipeline

4. DELETE ACCOUNT (GDPR/POPIA right to erasure):
   - Requires re-authentication
   - Exports user data (downloadable)
   - Anonymizes health data (retains for research if consented)
   - Deletes PII completely
   - Burns any remaining tokens
   - Sends confirmation
# ---------------------------------------------------------------------------------------------------------------------------------
# 2. Health & Clinical Services
# ---------------------------------------------------------------------------------------------------------------------------------
# 2.1 Pregnancy Registration
Attribute	Description
Block ID	HEALTH-001
Name	Pregnancy Registration Service
Aim	Register a new pregnancy with clinical details, calculate gestational age and EDD, and initialize milestone tracking
Priority	P0 (Critical)
# inputs:

{
  userId: string;
  lastMenstrualPeriod: string;  // YYYY-MM-DD format
  isLMPEstimate: boolean;       // True if unsure of exact date
  ultrasoundDate?: string;      // If dating scan performed
  ultrasoundGestationalAge?: number; // Weeks from scan
  gravida: number;              // Total pregnancies including current
  parity: number;               // Previous births
  previousComplications?: string[]; // PREECLAMPSIA, PPH, CESAREAN, etc.
  chronicConditions?: string[]; // HYPERTENSION, DIABETES, HIV, etc.
  currentMedications?: string[];
  bloodType?: string;
  facilityId?: string;          // Registered clinic
}
# outputs:

{
  success: boolean;
  pregnancy: {
    id: string;
    userId: string;
    lastMenstrualPeriod: string;
    estimatedDueDate: string;
    gestationalAgeWeeks: number;
    gestationalAgeDays: number;
    trimester: 1 | 2 | 3;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    riskFactors: string[];
    status: 'ACTIVE';
    createdAt: timestamp;
  };
  initialMilestones: Array<{
    id: string;
    type: string;
    title: string;
    dueDate: string;
    tokenReward: number;
  }>;
  recommendedActions: string[];
}
# Implementation Prompt:

Build a pregnancy registration service that:

1. VALIDATES input data:
   - LMP cannot be > 42 weeks ago or in future
   - Gravida must be >= 1
   - Parity must be < Gravida

2. CALCULATES dates:
   - EDD = LMP + 280 days (Naegele's rule)
   - If ultrasound provided and differs > 7 days, use ultrasound dating
   - Gestational age = (today - LMP) in weeks+days

3. ASSESSES initial risk level:
   - HIGH if: previous preeclampsia, multiple pregnancy, chronic hypertension, 
     diabetes, HIV positive, age < 18 or > 35, previous stillbirth
   - MEDIUM if: previous cesarean, anemia, obesity
   - LOW if: none of above

4. CREATES pregnancy record:
   - Links to user
   - Stores medical history (encrypted for HIV status)
   - Sets initial risk level

5. INITIALIZES milestone tracking:
   - Creates ANC visit milestones based on gestational age
   - First ANC (if not done), 20-week scan, glucose test, etc.
   - Adjusts for current gestational age (skip past milestones)

6. SYNCS with government system:
   - SA: Register with MomConnect via OpenHIM API
   - UG: Register with FamilyConnect via DHIS2 API

7. PUBLISHES pregnancy.created event

8. RETURNS pregnancy details and recommended immediate actions:
   - Book first ANC if not done
   - Start folic acid if < 12 weeks
   - HIV test if unknown status
# ---------------------------------------------------------------------------------------------------------------------------------
# 2.2 Daily Symptom Check-In
Attribute	Description
Block ID	HEALTH-002
Name	Daily Symptom Check-In Service
Aim	Capture daily health status from mothers, process through triage engine, and return appropriate guidance with emergency escalation when needed
Priority	P0 (Critical)
# inputs:

{
  userId: string;
  pregnancyId: string;
  timestamp: string;            // ISO 8601
  source: 'APP' | 'USSD' | 'SMS';
  
  symptoms: Array<{
    code: string;               // Standardized symptom code
    severity: 'MILD' | 'MODERATE' | 'SEVERE';
    description?: string;       // Free text (for NLP processing)
    duration?: string;          // "2 hours", "since yesterday"
    firstOccurrence: boolean;
  }>;
  
  fetalMovement?: {
    kickCount: number;
    durationMinutes: number;
    timeOfCounting: string;
    pattern: 'NORMAL' | 'INCREASED' | 'DECREASED' | 'NONE';
  };
  
  mood?: {
    score: number;              // 1-10 scale
    feelings: string[];         // HAPPY, ANXIOUS, SAD, TIRED, HOPELESS
    sleepQuality: 'GOOD' | 'FAIR' | 'POOR';
    notes?: string;
  };
  
  vitalSigns?: {
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    temperature?: number;       // Celsius
    weight?: number;            // kg
  };
  
  medications?: {
    folicAcidTaken: boolean;
    ironTaken: boolean;
    otherMedications?: string[];
    missedDoses?: string[];
  };
  
  nutrition?: {
    mealsEaten: number;
    waterGlasses: number;
    fruitsVegetables: boolean;
  };
}

# outputs:

{
  success: boolean;
  logId: string;
  
  triage: {
    level: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
    action: string;             // Human-readable action
    urgency: string;            // Urgency description
    recommendations: string[];  // List of recommendations
    confidence: number;         // 0-1 confidence score
  };
  
  alerts?: {
    triggered: boolean;
    recipients: string[];       // Who was notified
    alertId: string;
  };
  
  streakInfo: {
    currentStreak: number;      // Consecutive days
    longestStreak: number;
    nextMilestone: number;      // Days until next reward
  };
  
  tokensEarned?: {
    amount: number;
    reason: string;
    newBalance: number;
  };
  
  educationalContent?: {
    id: string;
    title: string;
    relevance: string;          // Why this content is shown
  };
}

# Implementation Prompt:

Build a daily symptom check-in service that:

1. VALIDATES input:
   - User has active pregnancy
   - Timestamp is reasonable (not future, not > 24h past)
   - At least one data point provided (symptoms, mood, or vitals)

2. ENRICHES data:
   - Fetches current gestational age
   - Fetches medical history for context
   - Fetches recent symptom history (last 7 days)

3. CALLS Risk Engine API with:
   - Current symptoms
   - Vital signs
   - Fetal movement (if 3rd trimester)
   - Medical history
   - Country (for protocol selection: SATS vs Uganda MOH)

4. PROCESSES triage result:
   - RED: Immediately trigger emergency protocol
     - Send push notification with emergency UI
     - SMS to emergency contact
     - SMS to support circle
     - Log emergency event
   - ORANGE: Trigger urgent notification
     - Push notification with clinic contact
     - SMS reminder if not acknowledged in 1 hour
     - Alert CHW/Digital Doula
   - YELLOW: Flag for next visit
     - Store flag on pregnancy record
     - Include in next visit preparation
   - GREEN: Reassurance
     - Return educational content relevant to gestational age

5. STORES symptom log:
   - Full log to PostgreSQL
   - Triage result included
   - Synced flag = false (for offline submissions)

6. UPDATES streak tracking:
   - Increment consecutive days counter
   - Check for milestone completion (7-day, 14-day streak)

7. TRIGGERS milestone check:
   - If streak milestone reached, initiate reward
   - Publish milestone.completed event

8. SELECTS relevant educational content:
   - Based on symptoms logged
   - Based on gestational age
   - In user's preferred language

9. PUBLISHES events:
   - symptom.logged (for analytics)
   - alert.triggered (if applicable)
   - streak.updated

Error Handling:
- Risk Engine unavailable: Use fallback rule-based triage
- Database write fails: Queue in Redis for retry
- SMS fails: Queue for retry, log failure
# ---------------------------------------------------------------------------------------------------------------------------------
# 2.3 Kick Counter
Attribute	Description
Block ID	HEALTH-003
Name	Fetal Movement (Kick Counter) Service
Aim	Track fetal movements in third trimester, detect reduced movement patterns, and alert on concerning changes
Priority	P1 (High)
# inputs:

// Start counting session
{
  userId: string;
  pregnancyId: string;
  startTime: string;
}

// Record kick
{
  sessionId: string;
  kickTime: string;
  intensity?: 'LIGHT' | 'NORMAL' | 'STRONG';
}

// End session
{
  sessionId: string;
  endTime: string;
  totalKicks: number;
  notes?: string;
}
# outputs:

// Session started
{
  sessionId: string;
  targetKicks: number;          // Usually 10
  maxDuration: number;          // Minutes (120)
  gestationalAge: number;
}

// Kick recorded
{
  kickNumber: number;
  targetReached: boolean;
  elapsedMinutes: number;
}

// Session ended
{
  success: boolean;
  sessionId: string;
  totalKicks: number;
  duration: number;
  assessment: {
    status: 'NORMAL' | 'CONCERNING' | 'SEEK_CARE';
    message: string;
    recommendation: string;
  };
  historicalComparison: {
    averageKicks: number;
    averageDuration: number;
    trend: 'STABLE' | 'INCREASING' | 'DECREASING';
  };
  tokensEarned?: number;
}

# Implementation Prompt:

Build a kick counter service that:

1. START SESSION:
   - Validates pregnancy is >= 28 weeks
   - Creates session record with start time
   - Returns target (10 kicks) and max duration (2 hours)
   - Sends reminder notification if session not completed

2. RECORD KICK:
   - Validates session is active
   - Records kick timestamp
   - Checks if target reached
   - If target reached in < 2 hours: Automatically end session as normal

3. END SESSION:
   - Calculates total duration and kicks
   - Compares to historical data (last 7 days)
   - ASSESSES:
     - NORMAL: >= 10 kicks in <= 2 hours
     - CONCERNING: < 10 kicks in 2 hours, but > historical average - 2 SD
     - SEEK_CARE: < 10 kicks in 2 hours AND below historical trend
   
4. ALERT LOGIC:
   - CONCERNING: 
     - Return gentle reminder to try again after rest/cold drink
     - Schedule follow-up check-in notification for 2 hours later
   - SEEK_CARE:
     - Trigger ORANGE triage alert
     - Notify support circle
     - Recommend immediate clinic visit

5. TRACK PATTERNS:
   - Store all sessions
   - Calculate moving averages
   - Detect trend changes (alert if consistent decrease over 3 days)

6. AWARD TOKENS:
   - 10 MTK for completing daily kick count
   - Part of wellness milestone tracking
# ---------------------------------------------------------------------------------------------------------------------------------
# 2.4 Medical History Management
Attribute	Description
Block ID	HEALTH-004
Name	Medical History Service
Aim	Securely store and manage sensitive medical history including HIV status, with appropriate encryption and access controls
Priority	P0 (Critical)
# inputs:

// Create/Update medical history
{
  userId: string;
  pregnancyId: string;
  
  obstetricHistory: {
    gravida: number;
    parity: number;
    abortions: number;
    ectopicPregnancies: number;
    stillbirths: number;
    neonatalDeaths: number;
    previousDeliveries: Array<{
      year: number;
      outcome: string;
      birthWeight?: number;
      complications?: string[];
      deliveryMethod: string;
    }>;
  };
  
  medicalConditions: {
    chronicConditions: string[];
    previousSurgeries: string[];
    allergies: string[];
    currentMedications: Array<{
      name: string;
      dosage: string;
      frequency: string;
    }>;
  };
  
  sensitiveData: {  // Requires additional encryption
    hivStatus?: 'POSITIVE' | 'NEGATIVE' | 'UNKNOWN';
    hivTestDate?: string;
    onART?: boolean;
    artRegimen?: string;
    viralLoad?: string;
    cd4Count?: number;
    tbStatus?: string;
  };
  
  bloodType?: string;
  rhFactor?: string;
}

# outputs:

{
  success: boolean;
  historyId: string;
  riskAssessment: {
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    factors: string[];
    recommendations: string[];
  };
  requiredTests: Array<{
    testName: string;
    reason: string;
    urgency: string;
  }>;
}
# Implementation Prompt:

Build a medical history service that:

1. DATA ENCRYPTION:
   - All PII encrypted at rest using AES-256-GCM
   - HIV status and related fields use ADDITIONAL field-level encryption
   - Encryption keys managed via AWS KMS
   - IV stored separately from ciphertext

2. ACCESS CONTROL:
   - Only user and explicitly authorized providers can access
   - HIV status requires additional confirmation to view
   - All access logged for audit trail
   - Support circle NEVER sees medical history

3. CREATE/UPDATE:
   - Validates all inputs
   - Encrypts sensitive fields before storage
   - Creates audit log entry
   - Recalculates risk level based on new information
   - Triggers appropriate milestone tracking (e.g., HIV test completion)

4. RISK ASSESSMENT:
   - Evaluates all factors for pregnancy risk
   - Returns specific recommendations based on conditions
   - Lists required tests that haven't been completed

5. DATA PORTABILITY:
   - User can export their complete medical history
   - Encrypted export format for sharing with other providers
   - Supports FHIR format for interoperability

6. SYNC WITH GOVERNMENT SYSTEMS:
   - SA: Update MomConnect with relevant clinical data
   - UG: Update DHIS2 tracker
   - Only syncs non-sensitive standardized fields
   - HIV status NEVER synced without explicit consent
# ---------------------------------------------------------------------------------------------------------------------------------
# 2.5 Appointment Management
Attribute	Description
Block ID	HEALTH-005
Name	Appointment Management Service
Aim	Track ANC and other medical appointments, send reminders, and verify attendance for milestone rewards
Priority	P1 (High)
# inputs:

// Create appointment
{
  userId: string;
  pregnancyId: string;
  appointmentType: 'ANC' | 'ULTRASOUND' | 'LAB_TEST' | 'SPECIALIST' | 'POSTNATAL';
  scheduledDate: string;
  scheduledTime?: string;
  facilityId: string;
  notes?: string;
}

// Verify attendance (by clinic)
{
  appointmentId: string;
  verifierId: string;
  verificationCode: string;     // QR code scanned at clinic
  actualDate: string;
  clinicalNotes?: string;
}

// User self-report (if verification unavailable)
{
  appointmentId: string;
  attended: boolean;
  actualDate: string;
  reason?: string;              // If not attended
}
# outputs:

// Appointment created
{
  success: boolean;
  appointmentId: string;
  qrCode: string;               // For clinic verification
  reminderScheduled: {
    date: string;
    method: string[];           // SMS, PUSH
  };
  milestoneLinked: string;      // Associated milestone ID
}

// Verification result
{
  success: boolean;
  verified: boolean;
  milestoneCompleted: boolean;
  tokensAwarded?: number;
  nextAppointment?: {
    type: string;
    recommendedDate: string;
  };
}
# Implementation Prompt:

Build an appointment management service that:

1. CREATE APPOINTMENT:
   - Validates facility exists and is active
   - Creates appointment record
   - Generates unique QR code for verification
   - Schedules reminders:
     - 7 days before: SMS + Push
     - 1 day before: SMS + Push
     - Morning of: Push only
   - Links to appropriate ANC milestone

2. REMINDER SYSTEM:
   - Uses job scheduler (Bull/Redis)
   - Retries SMS if initial send fails
   - Tracks reminder delivery status

3. CLINIC VERIFICATION:
   - Clinic staff scans user's QR code
   - Validates verifier has appropriate role
   - Marks appointment as COMPLETED
   - Triggers milestone completion
   - Awards tokens
   - Syncs with MomConnect/FamilyConnect

4. SELF-REPORTING (fallback):
   - Allows user to mark as attended
   - Requires photo proof (optional)
   - Marked as UNVERIFIED
   - Reduced token reward (50%)
   - Flagged for CHW follow-up

5. MISSED APPOINTMENT HANDLING:
   - If not marked attended within 48 hours:
     - Send follow-up SMS asking about visit
     - Alert CHW/Digital Doula
     - Update risk assessment (missed appointments = risk factor)

6. APPOINTMENT RECOMMENDATIONS:
   - Based on gestational age and history
   - Suggests next appointment type and timing
   - Follows BANC Plus (SA) or 8-ANC (UG) protocol
# ---------------------------------------------------------------------------------------------------------------------------------
# 2.6 Emergency Response
Attribute	Description
Block ID	HEALTH-006
Name	Emergency Response Service
Aim	Provide immediate emergency assistance including ambulance dispatch, location sharing, and family notification
Priority	P0 (Critical)
# inputs:

// Trigger emergency
{
  userId: string;
  triggerSource: 'SOS_BUTTON' | 'RED_TRIAGE' | 'USSD';
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
  };
  emergencyType?: 'OBSTETRIC' | 'ACCIDENT' | 'OTHER';
  additionalInfo?: string;
}

// Update emergency status
{
  emergencyId: string;
  status: 'ACKNOWLEDGED' | 'HELP_DISPATCHED' | 'RESOLVED' | 'FALSE_ALARM';
  notes?: string;
}
# outputs:

{
  emergencyId: string;
  status: string;
  actionsTriggered: Array<{
    action: string;
    target: string;
    status: string;
    timestamp: string;
  }>;
  emergencyNumbers: {
    ambulance: string;
    clinic: string;
  };
  nearestFacility: {
    name: string;
    address: string;
    distance: number;
    phone: string;
  };
  eta?: string;                 // If ambulance dispatched
}
# Implementation Prompt:

Build an emergency response service that:

1. TRIGGER EMERGENCY:
   - Creates emergency record immediately
   - Initiates parallel actions:

   a) LOCATION HANDLING:
      - If location provided: Use it
      - If not: Request from mobile app
      - Fallback: Use last known location
      - If USSD: Ask for landmark description

   b) FAMILY NOTIFICATION (parallel):
      - SMS to all emergency contacts
      - Include: "[Name] has triggered emergency. Location: [link]. Call: [number]"
      - Push notification to support circle app users

   c) AMBULANCE COORDINATION:
      - SA: Provide 10177 number and nearest facility
      - UG: Provide 112 number and nearest facility
      - If integrated with dispatch: Trigger automated request

   d) CLINICAL ALERT:
      - If facility linked: Alert facility dashboard
      - Send patient summary: gestational age, risk factors, current symptoms

2. EMERGENCY DASHBOARD (for clinics):
   - Real-time view of incoming emergencies
   - Patient pre-arrival information
   - One-click acknowledgment

3. RESOLUTION TRACKING:
   - Track status updates
   - Record outcomes
   - Generate report for quality improvement

4. FALSE ALARM HANDLING:
   - Allow user to cancel with confirmation
   - Still notify contacts of cancellation
   - Log for pattern detection (frequent false alarms may indicate other issues)

5. POST-EMERGENCY:
   - Schedule follow-up check-in
   - Send resources about the emergency type
   - Update risk assessment if applicable
# ---------------------------------------------------------------------------------------------------------------------------------
# 3. Milestone & Rewards Services
# ---------------------------------------------------------------------------------------------------------------------------------
# 3.1 Milestone Definition Management
Attribute	Description
Block ID	MILE-001
Name	Milestone Definition Service
Aim	Manage the catalog of achievable milestones, their rewards, and activation criteria
Priority	P1 (High)
# inputs:

// Create milestone definition (admin)
{
  milestoneCode: string;        // Unique code: ANC_VISIT_1, STREAK_7_DAY
  milestoneType: 'CLINICAL' | 'WELLNESS' | 'EDUCATION' | 'COMMUNITY';
  title: string;
  description: string;
  tokenReward: number;
  country?: string;             // null = global, 'ZA' or 'UG' = country-specific
  gestationalWeekStart?: number;
  gestationalWeekEnd?: number;
  requiresVerification: boolean;
  verifierTypes?: string[];     // CLINIC, CHW, DIGITAL_DOULA
  repeatability: 'ONCE' | 'PER_PREGNANCY' | 'DAILY' | 'WEEKLY';
  expiryDays?: number;
  prerequisites?: string[];     // Other milestone codes required first
  isActive: boolean;
}

// Get applicable milestones for user
{
  userId: string;
  pregnancyId: string;
}
# outputs:

// Milestone definition created
{
  success: boolean;
  milestoneDefinitionId: string;
}

// Applicable milestones
{
  milestones: Array<{
    id: string;
    code: string;
    type: string;
    title: string;
    description: string;
    tokenReward: number;
    status: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED' | 'LOCKED';
    progress?: {
      current: number;
      target: number;
      percentage: number;
    };
    expiresAt?: string;
    completedAt?: string;
    prerequisitesMet: boolean;
    missingPrerequisites?: string[];
  }>;
  summary: {
    totalAvailable: number;
    totalCompleted: number;
    totalTokensEarned: number;
    totalTokensAvailable: number;
  };
}

# Implementation Prompt:

Build a milestone definition service that:

1. MILESTONE CATALOG:
   Store and manage all milestone types:

   CLINICAL:
   - ANC_VISIT_1 through ANC_VISIT_8 (30-50 MTK each)
   - ULTRASOUND_DATING, ULTRASOUND_ANOMALY (50 MTK)
   - HIV_TEST, GLUCOSE_TEST, BLOOD_TYPE (40 MTK)
   - FACILITY_DELIVERY (100 MTK)
   - POSTNATAL_VISIT (50 MTK)

   WELLNESS:
   - SYMPTOM_STREAK_7 (20 MTK)
   - SYMPTOM_STREAK_14 (50 MTK)
   - SYMPTOM_STREAK_30 (100 MTK)
   - KICK_COUNT_DAILY (10 MTK, repeatable)
   - MEDICATION_STREAK_7 (15 MTK)

   EDUCATION:
   - DANGER_SIGNS_QUIZ (25 MTK)
   - NUTRITION_MODULE (20 MTK)
   - BREASTFEEDING_MODULE (20 MTK)
   - NEWBORN_CARE_MODULE (20 MTK)

   COMMUNITY:
   - FIRST_POST (15 MTK)
   - SUPPORTIVE_ANSWER_10 (50 MTK)
   - DIGITAL_DOULA_MENTOR (100+ MTK based on outcomes)

2. GET APPLICABLE MILESTONES:
   - Filter by user's country
   - Filter by current gestational age
   - Check prerequisites
   - Calculate progress for in-progress milestones
   - Return sorted by relevance/urgency

3. MILESTONE LIFECYCLE:
   - AVAILABLE: User can start working on it
   - IN_PROGRESS: User has started, tracking progress
   - COMPLETED: Finished, tokens awarded
   - EXPIRED: Time window passed
   - LOCKED: Prerequisites not met

4. COUNTRY-SPECIFIC VARIATIONS:
   - SA: Aligned with BANC Plus protocol
   - UG: Aligned with 8-ANC protocol
   - Different reward amounts based on local economics
# ---------------------------------------------------------------------------------------------------------------------------------
# 3.2 Milestone Progress Tracking
Attribute	Description
Block ID	MILE-002
Name	Milestone Progress Service
Aim	Track user progress toward milestones, update on relevant events, and trigger completion when criteria met
Priority	P0 (Critical)
# inputs:

// Progress update event (internal)
{
  userId: string;
  pregnancyId: string;
  eventType: string;            // SYMPTOM_LOGGED, ANC_ATTENDED, QUIZ_PASSED
  eventData: object;
  timestamp: string;
}

// Manual progress check
{
  userId: string;
  milestoneId: string;
}
# outputs:

{
  milestoneId: string;
  status: string;
  progress: {
    current: number;
    target: number;
    percentage: number;
  };
  isComplete: boolean;
  tokensAwarded?: number;
  newMilestonesUnlocked?: string[];
  nextMilestone?: {
    id: string;
    title: string;
    progress: number;
  };
}
# Implementation Prompt:

Build a milestone progress tracking service that:

1. EVENT PROCESSING:
   Listen to events and update relevant milestones:

   SYMPTOM_LOGGED event:
   - Update SYMPTOM_STREAK milestones
   - Check if consecutive days increased
   - If target reached, mark complete

   ANC_VERIFIED event:
   - Mark corresponding ANC_VISIT milestone complete
   - Trigger token minting

   QUIZ_COMPLETED event:
   - If passed (>= 80%), mark EDUCATION milestone complete
   - If failed, allow retry

   KICK_COUNT_COMPLETED event:
   - Award daily kick count milestone
   - Update streak tracking

   POST_CREATED event:
   - If first post, complete FIRST_POST milestone
   - Increment community engagement counter

2. STREAK CALCULATION:
   - Query symptom logs for consecutive days
   - Handle timezone correctly
   - Reset streak at midnight user's local time
   - Grace period: Allow 1 missed day if resumed within 48h (configurable)

3. COMPLETION TRIGGER:
   When milestone completed:
   - Update milestone status to COMPLETED
   - Record completion timestamp
   - Call Token Service to mint tokens
   - Record blockchain transaction hash
   - Send congratulations notification
   - Check if new milestones unlocked
   - Publish milestone.completed event

4. EXPIRY HANDLING:
   - Background job checks for expired milestones daily
   - Marks as EXPIRED if deadline passed
   - Notifies user of expired milestones

5. PROGRESS PERSISTENCE:
   - Store progress in PostgreSQL
   - Cache current progress in Redis for fast reads
   - Invalidate cache on updates
# ---------------------------------------------------------------------------------------------------------------------------------
# 3.3 Milestone Verification
Attribute	Description
Block ID	MILE-003
Name	Milestone Verification Service
Aim	Handle verification of clinical milestones by authorized verifiers (clinics, CHWs)
Priority	P0 (Critical)
# inputs:

// Verify milestone (by verifier)
{
  verifierId: string;
  verificationCode: string;     // Scanned from user's app
  milestoneType: string;
  additionalData?: {
    visitDate?: string;
    clinicalNotes?: string;
    weight?: number;
    bloodPressure?: string;
    fetalHeartRate?: number;
  };
  signature: string;            // Cryptographic signature
}

// Generate verification QR (by user)
{
  userId: string;
  milestoneId: string;
}
# outputs:

// QR Generated
{
  qrCodeData: string;           // Encoded data for QR
  qrCodeImage: string;          // Base64 image
  expiresAt: string;            // QR valid for 15 minutes
  milestoneDetails: {
    type: string;
    title: string;
    tokenReward: number;
  };
}

// Verification result
{
  success: boolean;
  verificationId: string;
  milestoneCompleted: boolean;
  tokensAwarded: number;
  blockchainTxHash: string;
  motherNotified: boolean;
  message: string;
}
# Implementation Prompt:

Build a milestone verification service that:

1. QR CODE GENERATION:
   - Encode: userId, milestoneId, timestamp, nonce
   - Sign with user's wallet (or server key)
   - Generate QR code image
   - QR expires in 15 minutes
   - One-time use only

2. VERIFICATION PROCESS:
   a) Decode QR code data
   b) Validate QR not expired
   c) Validate QR not already used
   d) Validate verifier is authorized:
      - Has VERIFIER role
      - Is active
      - Is in correct country
   e) Validate verifier signature
   f) Validate milestone is verifiable and not already complete

3. ON SUCCESSFUL VERIFICATION:
   - Mark milestone as COMPLETED
   - Record verification details:
     - Verifier ID
     - Timestamp
     - Location (if available)
     - Clinical data provided
     - Signature
   - Call Token Service to mint tokens
   - Record blockchain transaction
   - Notify user via push notification
   - Sync with MomConnect/FamilyConnect

4. VERIFICATION LOGGING:
   - All verification attempts logged
   - Failed attempts flagged for review
   - Detect and alert on suspicious patterns:
     - Same verifier, many users in short time
     - User attempting multiple verifications

5. OFFLINE VERIFICATION (future):
   - Generate verification proof offline
   - Store locally
   - Sync when online
   - Verifier receives delayed confirmation
# ---------------------------------------------------------------------------------------------------------------------------------
# 3.4 Rewards Redemption
Attribute	Description
Block ID	MILE-004
Name	Rewards Redemption Service
Aim	Enable mothers to redeem earned tokens for transport vouchers, data bundles, or retail products
Priority	P0 (Critical)
# inputs:

// Get redemption options
{
  userId: string;
  country: string;
}

// Initiate redemption
{
  userId: string;
  redemptionType: 'TRANSPORT' | 'DATA_BUNDLE' | 'RETAIL' | 'MOBILE_MONEY';
  partnerId: string;
  tokenAmount: number;
  details: {
    // For transport
    voucherType?: string;       // UBER, BOLT, SAFEBODA
    
    // For data bundle
    phoneNumber?: string;       // Can be different from registered
    bundleSize?: string;        // 500MB, 1GB, etc.
    
    // For retail
    productCategory?: string;
    
    // For mobile money (UG)
    mobileMoneyNumber?: string;
    mobileMoneyProvider?: string; // MTN, AIRTEL
  };
}

// Confirm redemption
{
  redemptionId: string;
  confirmationCode?: string;    // If 2-step process
}

# outputs:

// Redemption options
{
  tokenBalance: number;
  options: Array<{
    partnerId: string;
    partnerName: string;
    partnerLogo: string;
    redemptionType: string;
    minTokens: number;
    maxTokens: number;
    conversionRate: string;     // "100 MTK = R10 voucher"
    available: boolean;
    description: string;
  }>;
}

// Redemption initiated
{
  redemptionId: string;
  status: 'PENDING_CONFIRMATION' | 'PROCESSING';
  tokenAmount: number;
  estimatedValue: string;
  expiresAt?: string;
  confirmationRequired: boolean;
}

// Redemption result
{
  success: boolean;
  redemptionId: string;
  status: 'COMPLETED' | 'FAILED';
  deliverable: {
    type: string;
    // For voucher
    voucherCode?: string;
    voucherPin?: string;
    validUntil?: string;
    instructions?: string;
    
    // For mobile money
    transactionId?: string;
    amount?: string;
    
    // For data
    dataAdded?: string;
  };
  newTokenBalance: number;
  blockchainTxHash: string;
}

# Implementation Prompt:

Build a rewards redemption service that:

1. GET REDEMPTION OPTIONS:
   - Query active partners for user's country
   - Calculate available options based on token balance
   - Return partner details, conversion rates, availability

   SA Partners:
   - Uber (transport vouchers)
   - Bolt (transport vouchers)
   - Dischem (retail - prenatal vitamins)
   - Checkers (retail - groceries)
   - MTN/Vodacom (data bundles)

   UG Partners:
   - SafeBoda (transport)
   - MTN MoMo (mobile money)
   - Airtel Money (mobile money)
   - Data bundles

2. INITIATE REDEMPTION:
   - Validate user has sufficient balance
   - Validate partner is active
   - Validate redemption amount within limits
   - Create pending redemption record
   - Lock tokens (prevent double-spend)
   - If high value (> 500 MTK), require confirmation

3. PROCESS REDEMPTION:
   
   TRANSPORT VOUCHER:
   - Call partner API to generate voucher
   - Store voucher code securely
   - Set expiry date

   DATA BUNDLE:
   - Call mobile network API
   - Confirm data added to phone

   MOBILE MONEY (UG):
   - Call MTN MoMo / Airtel Money API
   - Initiate disbursement
   - Wait for confirmation

   RETAIL:
   - Generate store credit code
   - Or add to loyalty card

4. ON SUCCESS:
   - Call Token Service to burn tokens
   - Record blockchain transaction
   - Update redemption status
   - Send SMS with voucher/confirmation
   - Send push notification

5. ON FAILURE:
   - Unlock tokens
   - Update redemption status
   - Notify user of failure
   - Log for investigation
   - Retry if transient error

6. FRAUD PREVENTION:
   - Daily redemption limits
   - Velocity checks (many redemptions in short time)
   - Phone number validation for data/money
   - Manual review for high-value redemptions
# ---------------------------------------------------------------------------------------------------------------------------------
# 4. Blockchain & Token Services
# ---------------------------------------------------------------------------------------------------------------------------------
# 4.1 Token Balance Service
Attribute	Description
Block ID	TOKEN-001
Name	Token Balance Service
Aim	Provide real-time token balance information with caching and blockchain verification
Priority	P0 (Critical)
# inputs:

// Get balance
{
  userId: string;
  includeHistory?: boolean;
  historyLimit?: number;
}

// Get transaction history
{
  userId: string;
  transactionType?: 'MINT' | 'BURN' | 'ALL';
  startDate?: string;
  endDate?: string;
  limit: number;
  offset: number;
}
# outputs:

// Balance response
{
  balance: {
    amount: number;
    displayAmount: string;      // Formatted with decimals
    localCurrencyEquivalent: string; // "~R150" or "~UGX 30,000"
    lastUpdated: string;
  };
  lifetimeStats: {
    totalEarned: number;
    totalRedeemed: number;
    milestonesCompleted: number;
  };
  recentTransactions?: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    timestamp: string;
    status: string;
  }>;
}

// Transaction history
{
  transactions: Array<{
    id: string;
    type: 'MINT' | 'BURN';
    amount: number;
    balanceAfter: number;
    description: string;
    milestone?: string;
    redemption?: string;
    blockchainTxHash: string;
    blockNumber: number;
    timestamp: string;
    status: 'CONFIRMED' | 'PENDING';
  }>;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

# Implementation Prompt:

Build a token balance service that:

1. GET BALANCE:
   a) Check Redis cache first
   b) If cache miss or stale (> 5 min):
      - Query blockchain for on-chain balance
      - Query local DB for pending transactions
      - Calculate effective balance
      - Update cache
   c) Calculate local currency equivalent
   d) Return formatted response

2. CACHING STRATEGY:
   - Cache balance in Redis with 5-minute TTL
   - Invalidate on mint/burn events
   - Use pub/sub to propagate invalidations

3. TRANSACTION HISTORY:
   - Query local database (faster than blockchain)
   - Include both confirmed and pending
   - Support filtering and pagination
   - Include human-readable descriptions

4. BLOCKCHAIN VERIFICATION:
   - Periodically reconcile DB with blockchain
   - Alert on discrepancies
   - Self-healing: Update DB if blockchain differs

5. DISPLAY FORMATTING:
   - Handle 18 decimal places
   - Show user-friendly amounts (whole numbers)
   - Include local currency equivalent based on country:
     - SA: ZAR
     - UG: UGX
# ---------------------------------------------------------------------------------------------------------------------------------
# 4.2 Token Minting Service
Attribute	Description
Block ID	TOKEN-002
Name	Token Minting Service
Aim	Mint new tokens to user wallets upon verified milestone completion
Priority	P0 (Critical)
# inputs:

// Mint request (internal only)
{
  userId: string;
  walletAddress: string;
  amount: number;
  milestoneType: string;
  milestoneId: string;
  verificationProof: {
    verifierId?: string;
    verifierSignature?: string;
    timestamp: string;
    eventHash: string;
  };
  country: string;
}
# outputs:

{
  success: boolean;
  transactionId: string;        // Internal ID
  blockchainTxHash: string;     // On-chain transaction
  milestoneHash: string;        // Recorded on MilestoneRegistry
  amount: number;
  newBalance: number;
  gasUsed: number;
  gasCost: string;              // Paid by Paymaster
  confirmations: number;
}
# Implementation Prompt:

Build a token minting service that:

1. VALIDATION:
   - Verify milestone not already rewarded
   - Verify wallet address matches user
   - Verify amount matches milestone definition
   - Verify verifier signature if required

2. PREPARE TRANSACTION:
   - Generate milestone hash:
     hash = keccak256(userId + milestoneId + timestamp + verifierSig)
   - Prepare mint transaction data
   - Estimate gas

3. EXECUTE ON BLOCKCHAIN:
   a) Call MomToken.mintForMilestone():
      - to: user's wallet address
      - amount: token amount (with 18 decimals)
      - milestoneType: string
      - milestoneHash: bytes32

   b) Call MilestoneRegistry.recordMilestone():
      - user: wallet address
      - milestoneHash: bytes32
      - milestoneType: string
      - country: string

4. GAS HANDLING:
   - Use ERC-4337 Paymaster
   - Platform pays all gas fees
   - Track gas costs for analytics

5. CONFIRMATION:
   - Wait for transaction confirmation (1 block minimum)
   - Update local database
   - Invalidate balance cache
   - Return results

6. ERROR HANDLING:
   - Transaction failed: Log, alert, retry with higher gas
   - Network issues: Queue for retry
   - Double-mint attempt: Reject with existing transaction

7. AUDIT:
   - Log all mint operations
   - Include complete audit trail
   - Store proof on-chain and off-chain
# ---------------------------------------------------------------------------------------------------------------------------------
# 4.3 Token Burning Service
Attribute	Description
Block ID	TOKEN-003
Name	Token Burning Service
Aim	Burn tokens from user wallets upon successful redemption
Priority	P0 (Critical)
# inputs:

// Burn request (internal only)
{
  userId: string;
  walletAddress: string;
  amount: number;
  redemptionType: string;
  redemptionId: string;
  partnerId: string;
}
# outputs:

{
  success: boolean;
  transactionId: string;
  blockchainTxHash: string;
  amount: number;
  newBalance: number;
  redemptionId: string;
}
# Implementation Prompt:

Build a token burning service that:

1. VALIDATION:
   - Verify user has sufficient balance
   - Verify redemption is valid and pending
   - Verify wallet address matches user

2. EXECUTE BURN:
   - Call MomToken.burnForRedemption():
     - from: user's wallet
     - amount: token amount
     - redemptionType: string
     - redemptionId: bytes32

3. CONFIRMATION:
   - Wait for confirmation
   - Update local database
   - Invalidate cache

4. ATOMICITY:
   - Burn happens AFTER redemption partner confirms
   - Or use 2-phase commit:
     - Phase 1: Lock tokens (transfer to escrow)
     - Phase 2: Burn on partner success, unlock on failure

5. ROLLBACK:
   - If partner fulfillment fails after burn:
     - This shouldn't happen with proper sequencing
     - If it does: Mint replacement tokens
     - Log incident for investigation
# ---------------------------------------------------------------------------------------------------------------------------------
# 4.4 Wallet Service
Attribute	Description
Block ID	TOKEN-004
Name	Blockchain Wallet Service
Aim	Manage user wallet interactions including signing and transaction submission
Priority	P0 (Critical)
# inputs:

// Create wallet
{
  userId: string;
  identityProvider: 'PHONE' | 'SOCIAL';
  identityToken: string;
}

// Sign message (for verification)
{
  userId: string;
  message: string;
}

// Submit user operation (ERC-4337)
{
  userId: string;
  targetContract: string;
  callData: string;
  value?: string;
}
# outputs:

// Wallet created
{
  walletAddress: string;
  walletType: 'SMART_ACCOUNT';  // ERC-4337
  recoveryConfigured: boolean;
}

// Signed message
{
  signature: string;
  signerAddress: string;
}

// Transaction submitted
{
  userOpHash: string;
  transactionHash?: string;     // Once mined
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
}
# Implementation Prompt:

Build a wallet service using Web3Auth and ERC-4337:

1. WALLET CREATION:
   - Use Web3Auth MPC (Multi-Party Computation)
   - User authenticates with phone OTP
   - Key shares distributed across:
     - Web3Auth network
     - User's device
     - Recovery factor (trusted contacts or backup)
   - No single point of key custody
   - Create ERC-4337 Smart Account

2. KEY MANAGEMENT:
   - Private keys NEVER touch our servers
   - Keys reconstructed only in user's device
   - Server only facilitates, never possesses

3. SIGNING:
   - For verification QR codes
   - For consent proofs
   - Happens client-side only

4. TRANSACTION SUBMISSION:
   - Build UserOperation
   - Sign with user's key
   - Submit to Bundler (Pimlico or similar)
   - Paymaster covers gas
   - Return UserOperation hash for tracking

5. RECOVERY:
   - 2-of-3 recovery factors
   - Social recovery via trusted contacts
   - Backup codes option
   - Device biometric

6. SECURITY:
   - Rate limit operations
   - Detect and block suspicious activity
   - Notify user of all transactions
# ---------------------------------------------------------------------------------------------------------------------------------
# 5. Community & Social Services
# ---------------------------------------------------------------------------------------------------------------------------------
# 5.1 Community Feed Service
Attribute	Description
Block ID	COMM-001
Name	Community Feed Service
Aim	Provide a safe, moderated space for mothers to share updates, ask questions, and support each other
Priority	P2 (Medium)
# inputs:

// Get feed
{
  userId: string;
  feedType: 'ALL' | 'QUESTIONS' | 'UPDATES' | 'TIPS';
  gestationalWeekFilter?: number; // Show posts from similar stage
  limit: number;
  cursor?: string;              // For pagination
}

// Create post
{
  userId: string;
  postType: 'UPDATE' | 'QUESTION' | 'TIP';
  content: string;
  mediaUrls?: string[];
  isAnonymous: boolean;
  tags?: string[];
}

// Interact with post
{
  userId: string;
  postId: string;
  action: 'LIKE' | 'UNLIKE' | 'REPORT' | 'SAVE';
  reportReason?: string;
}

// Comment on post
{
  userId: string;
  postId: string;
  content: string;
  isAnonymous: boolean;
}

# outputs:

// Feed
{
  posts: Array<{
    id: string;
    author: {
      id: string;
      displayName: string;      // Or "Anonymous Mom"
      gestationalWeek?: number;
      badge?: string;           // "First-time Mom", "Experienced Mom"
    };
    postType: string;
    content: string;
    mediaUrls: string[];
    tags: string[];
    likesCount: number;
    commentsCount: number;
    hasLiked: boolean;
    hasSaved: boolean;
    createdAt: string;
    isOwn: boolean;
  }>;
  nextCursor?: string;
}

// Post created
{
  success: boolean;
  postId: string;
  moderationStatus: 'APPROVED' | 'PENDING_REVIEW';
  tokensEarned?: number;        // If first post milestone
}

# Implementation Prompt:

Build a community feed service that:

1. FEED ALGORITHM:
   - Prioritize posts from similar gestational stage (±4 weeks)
   - Boost questions without answers
   - Boost posts from Digital Doulas
   - Filter by country (show local community)
   - Recent posts weighted higher
   - Personalize based on user's interests/history

2. POST CREATION:
   - Validate content length (10-2000 chars)
   - Scan for banned words/phrases
   - Run through AI moderation:
     - Check for medical misinformation
     - Check for dangerous advice
     - Check for spam/promotion
   - If flagged: Queue for human review
   - If clean: Publish immediately

3. MODERATION:
   - AI first-pass moderation
   - Human review for flagged content
   - Digital Doula escalation path
   - Remove and notify if policy violation

4. ANONYMITY:
   - Anonymous posts show "Anonymous Mom"
   - Still linked to user internally (for moderation)
   - Cannot be anonymous and show gestational week
   
5. ENGAGEMENT TRACKING:
   - Track likes, comments, saves
   - Award community milestones
   - Identify helpful contributors

6. DANGEROUS CONTENT HANDLING:
   - Auto-flag: "stop ARVs", "herbal induction", etc.
   - Immediate removal of dangerous advice
   - Add disclaimer to posts about traditional remedies
# ---------------------------------------------------------------------------------------------------------------------------------
# 5.2 Peer Support Chat Service
Attribute	Description
Block ID	COMM-002
Name	Peer Support Chat Service
Aim	Enable private messaging between mothers and Digital Doulas for personalized support
Priority	P2 (Medium)
# inputs:

// Get conversations
{
  userId: string;
  conversationType?: 'ALL' | 'DOULA' | 'PEER';
}

// Start conversation
{
  userId: string;
  recipientId: string;
  initialMessage: string;
}

// Send message
{
  userId: string;
  conversationId: string;
  content: string;
  attachments?: Array<{
    type: 'IMAGE' | 'AUDIO';
    url: string;
  }>;
}

// Get messages
{
  conversationId: string;
  limit: number;
  beforeMessageId?: string;
}

# outputs:

// Conversations list
{
  conversations: Array<{
    id: string;
    type: 'DOULA' | 'PEER';
    participant: {
      id: string;
      name: string;
      isDoula: boolean;
      isOnline: boolean;
      lastSeen: string;
    };
    lastMessage: {
      content: string;
      timestamp: string;
      isOwn: boolean;
    };
    unreadCount: number;
  }>;
}

// Messages
{
  messages: Array<{
    id: string;
    senderId: string;
    content: string;
    attachments: object[];
    timestamp: string;
    status: 'SENT' | 'DELIVERED' | 'READ';
  }>;
  hasMore: boolean;
}

# Implementation Prompt:

Build a peer support chat service that:

1. CONVERSATION TYPES:
   - DOULA: Mother <-> Assigned Digital Doula
   - PEER: Mother <-> Mother (mutual opt-in)

2. MESSAGE HANDLING:
   - Store messages in MongoDB
   - Encrypt message content
   - Support text and media (images, voice notes)
   - Mark as delivered when recipient online
   - Mark as read when viewed

3. REAL-TIME:
   - WebSocket connection for live chat
   - Push notification if offline
   - Typing indicators
   - Online status

4. MODERATION:
   - Scan messages for dangerous content
   - Allow reporting messages
   - Doulas can escalate to clinical support

5. DOULA ASSIGNMENT:
   - Auto-assign based on:
     - Language match
     - Location proximity
     - Doula availability
   - Allow manual reassignment
   - Track response times for Doula performance

6. PRIVACY:
   - Messages are private
   - Doulas cannot share without consent
   - Delete conversation option
# ---------------------------------------------------------------------------------------------------------------------------------
# 5.3 Digital Doula Management
Attribute	Description
Block ID	COMM-003
Name	Digital Doula Management Service
Aim	Manage Digital Doula recruitment, training, assignment, and reward tracking
Priority	P1 (High)
# inputs:

// Apply to become Doula
{
  userId: string;
  application: {
    experience: string;         // Description of experience
    numberOfChildren: number;
    languages: string[];
    location: {
      region: string;
      district: string;
    };
    availability: string[];     // Days/times
    motivation: string;
    hasSmartphone: boolean;
    references?: Array<{
      name: string;
      phone: string;
    }>;
  };
}

// Get assigned mothers (for Doula)
{
  doulaId: string;
}

// Doula action log
{
  doulaId: string;
  motherId: string;
  actionType: 'MESSAGE' | 'CALL' | 'VISIT' | 'ESCALATION';
  notes: string;
  outcome?: string;
}

// Track Doula performance
{
  doulaId: string;
  period: 'WEEK' | 'MONTH' | 'ALL_TIME';
}

# outputs:

// Application result
{
  applicationId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  nextSteps?: string[];         // Training modules if approved
}

// Assigned mothers
{
  mothers: Array<{
    id: string;
    name: string;
    gestationalAge: number;
    riskLevel: string;
    lastContact: string;
    pendingActions: string[];
  }>;
  summary: {
    totalAssigned: number;
    highRisk: number;
    needsAttention: number;
  };
}

// Performance metrics
{
  doulaId: string;
  period: string;
  metrics: {
    mothersSupported: number;
    messagesExchanged: number;
    escalationsHandled: number;
    mothersDeliveredSafely: number;
    averageResponseTime: string;
    motherSatisfactionScore: number;
  };
  tokensEarned: number;
  rank: number;                 // Among all Doulas
}

# Implementation Prompt:

Build a Digital Doula management service that:

1. RECRUITMENT:
   - Application form validation
   - Reference check integration
   - Background verification (where applicable)
   - Language and location matching

2. TRAINING:
   - Required modules before activation:
     - Danger signs recognition
     - Mental health first aid
     - Platform usage
     - Emergency escalation
   - Quiz to certify completion

3. ASSIGNMENT ALGORITHM:
   - Match based on:
     - Language (primary factor)
     - Location (same district preferred)
     - Capacity (max 20 mothers per Doula)
     - Experience (high-risk to experienced Doulas)
   - Auto-reassign if Doula inactive

4. PERFORMANCE TRACKING:
   - Response time to messages
   - Check-in frequency with mothers
   - Escalation appropriateness
   - Outcome tracking (safe deliveries)
   - Mother satisfaction surveys

5. REWARDS:
   - Base tokens per active mother
   - Bonus for safe delivery outcomes
   - Bonus for high satisfaction scores
   - Monthly top performer recognition

6. ESCALATION PATH:
   - Doula can escalate to:
     - CHW (local follow-up)
     - Clinical support (medical questions)
     - Emergency services (RED flags)
   - Tracked and audited
# ---------------------------------------------------------------------------------------------------------------------------------
# 5.4 Support Circle (Family Dashboard)
Attribute	Description
Block ID	COMM-004
Name	Support Circle Service
Aim	Enable family members and partners to support the mother through a dedicated dashboard with appropriate privacy controls
Priority	P1 (High)
# inputs:

// Add support circle member
{
  userId: string;               // Mother's ID
  member: {
    name: string;
    phone: string;
    relationship: 'SPOUSE' | 'MOTHER' | 'SISTER' | 'FRIEND' | 'OTHER';
    permissions: {
      canViewHealth: boolean;   // See non-sensitive health status
      canReceiveAlerts: boolean;
      canViewTasks: boolean;
      isEmergencyContact: boolean;
    };
  };
}

// Get support dashboard (for family member)
{
  memberId: string;
  motherId: string;
}

// Complete support task
{
  memberId: string;
  taskId: string;
  completionNotes?: string;
}

// Boost tokens (family contribution)
{
  memberId: string;
  motherId: string;
  amount: number;               // In local currency
  paymentMethod: string;
}

# outputs:

// Member added
{
  success: boolean;
  memberId: string;
  inviteSent: boolean;
  inviteLink: string;
}

// Support dashboard
{
  mother: {
    name: string;
    gestationalAge: number;
    trimester: number;
    daysUntilDue: number;
    currentMood?: string;       // If shared
    lastCheckIn: string;
  };
  healthStatus?: {              // If canViewHealth
    status: 'GOOD' | 'NEEDS_ATTENTION' | 'URGENT';
    lastSymptoms: string[];     // High-level only
    upcomingAppointment?: {
      type: string;
      date: string;
    };
  };
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    dueDate?: string;
    priority: string;
    status: 'PENDING' | 'COMPLETED';
  }>;
  recentAlerts: Array<{
    message: string;
    timestamp: string;
    severity: string;
  }>;
}

// Token boost result
{
  success: boolean;
  tokensAdded: number;
  newBalance: number;
  thankYouSent: boolean;
}

# Implementation Prompt:

Build a support circle service that:

1. MEMBER MANAGEMENT:
   - Invite via SMS with unique link
   - Link expires in 7 days
   - Member creates minimal account (or uses as guest)
   - Mother can revoke access anytime

2. PRIVACY CONTROLS:
   - Granular permissions per member
   - Never share: HIV status, detailed medical history
   - Optionally share: General health status, mood
   - Always share: Emergency alerts (if opted in)

3. TASK SYSTEM:
   - Auto-generate tasks based on gestational age:
     - "Help prepare hospital bag" (week 36)
     - "Accompany to 20-week scan"
     - "Ensure she takes vitamins"
   - Custom tasks from mother
   - Completion tracking

4. TOKEN BOOST:
   - Family can contribute money
   - Converted to tokens at rate
   - Added to mother's balance
   - Tax: Small platform fee (5%)
   - Thank you notification to contributor

5. ALERTS:
   - Immediate SMS on RED triage
   - Daily summary of ORANGE events
   - Weekly update on progress (opt-in)

6. PARTNER MODE:
   - Special view for spouse/partner
   - Active involvement encouraged
   - "Protector" framing for cultural sensitivity
# ---------------------------------------------------------------------------------------------------------------------------------
# 6. Content & Education Services
# ---------------------------------------------------------------------------------------------------------------------------------
# 6.1 Educational Content Management
Attribute	Description
Block ID	CONTENT-001
Name	Educational Content Service
Aim	Deliver medically-reviewed, localized educational content in multiple formats (text, audio, video)
Priority	P1 (High)
# inputs:

// Get content for user
{
  userId: string;
  contentType?: 'ARTICLE' | 'AUDIO' | 'VIDEO' | 'TIP';
  category?: string;
  language: string;
  gestationalWeek?: number;
  limit: number;
}

// Get specific content
{
  contentId: string;
  language: string;
}

// Mark content as viewed
{
  userId: string;
  contentId: string;
  completionPercentage: number;
  timeSpent: number;
}

// Create/Update content (admin)
{
  contentType: string;
  category: string;
  translations: Array<{
    language: string;
    title: string;
    body: string;
    audioUrl?: string;
    videoUrl?: string;
  }>;
  gestationalWeekStart?: number;
  gestationalWeekEnd?: number;
  tags: string[];
  medicalReviewer: string;
  reviewDate: string;
}

# outputs:

// Content list
{
  content: Array<{
    id: string;
    type: string;
    category: string;
    title: string;
    summary: string;
    thumbnailUrl?: string;
    duration?: string;          // For audio/video
    hasAudio: boolean;
    hasVideo: boolean;
    isCompleted: boolean;
    completionPercentage: number;
    relevanceScore: number;
  }>;
}

// Content detail
{
  id: string;
  type: string;
  title: string;
  body: string;                 // HTML or markdown
  audioUrl?: string;
  videoUrl?: string;
  relatedContent: string[];
  quiz?: {
    quizId: string;
    questionCount: number;
    tokenReward: number;
  };
  medicalDisclaimer: string;
  lastReviewed: string;
}

# Implementation Prompt:

Build an educational content service that:

1. CONTENT CATEGORIES:
   - Danger Signs (RED FLAG awareness)
   - Nutrition & Diet
   - Fetal Development (week-by-week)
   - Labor & Delivery Preparation
   - Breastfeeding
   - Newborn Care
   - Mental Health
   - Traditional Practices (safe vs unsafe)
   - HIV/PMTCT

2. CONTENT FORMATS:
   - Articles (text with images)
   - Audio (60-second "micro-casts")
   - Video (2-3 minute clips)
   - Tips (short SMS-friendly messages)
   - Infographics

3. LOCALIZATION:
   - All content in multiple languages
   - Audio recorded by native speakers
   - Cultural adaptation per country
   - Vernacular/local expressions

4. PERSONALIZATION:
   - Filter by gestational age
   - Prioritize based on:
     - User's risk factors
     - Recent symptoms
     - Incomplete modules
   - Track completion for milestones

5. OFFLINE SUPPORT:
   - Cache text content locally
   - Download audio for offline play
   - Compress media for low bandwidth

6. MEDICAL REVIEW:
   - All content reviewed by medical board
   - Review date tracked
   - Annual refresh cycle
   - Version control for content
# ---------------------------------------------------------------------------------------------------------------------------------
# 6.2 Quiz & Assessment Service
Attribute	Description
Block ID	CONTENT-002
Name	Quiz & Assessment Service
Aim	Test knowledge retention, unlock education milestones, and reinforce learning
Priority	P1 (High)
# inputs:

// Get quiz
{
  quizId: string;
  language: string;
}

// Submit quiz answers
{
  userId: string;
  quizId: string;
  answers: Array<{
    questionId: string;
    selectedOptionId: string;
  }>;
  timeSpent: number;
}

// Get user quiz history
{
  userId: string;
}
# outputs:

// Quiz structure
{
  quizId: string;
  title: string;
  description: string;
  passingScore: number;         // Percentage
  tokenReward: number;
  timeLimit?: number;           // Seconds
  questions: Array<{
    id: string;
    questionText: string;
    questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    options: Array<{
      id: string;
      text: string;
      imageUrl?: string;
    }>;
    imageUrl?: string;
  }>;
}

// Quiz result
{
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  passingScore: number;
  results: Array<{
    questionId: string;
    correct: boolean;
    correctAnswer: string;
    explanation: string;
  }>;
  tokensAwarded?: number;
  canRetry: boolean;
  nextRetryAt?: string;         // If cooling period
}

// Quiz history
{
  quizzes: Array<{
    quizId: string;
    title: string;
    attempts: number;
    bestScore: number;
    passed: boolean;
    lastAttempt: string;
  }>;
}

# Implementation Prompt:

Build a quiz and assessment service that:

1. QUIZ TYPES:
   - Module completion quizzes (after education content)
   - Standalone assessments (danger signs)
   - Pre/Post knowledge tests (measure learning)

2. QUESTION FORMATS:
   - Single choice (radio buttons)
   - Multiple choice (checkboxes)
   - True/False
   - Image-based (point to danger sign)

3. SCORING:
   - Calculate percentage correct
   - Passing threshold: 80%
   - Partial credit for multiple choice

4. REWARDS:
   - Award tokens on first pass
   - No tokens for retry passes
   - Track best score

5. RETRY LOGIC:
   - Allow unlimited retries
   - Optional cooling period (24h)
   - Shuffle questions on retry
   - Track improvement over attempts

6. ACCESSIBILITY:
   - Audio read-aloud option
   - Large touch targets
   - Visual/icon-based questions for low literacy
# ---------------------------------------------------------------------------------------------------------------------------------
# 7. Notification & Communication Services
# ---------------------------------------------------------------------------------------------------------------------------------
# 7.1 Push Notification Service
Attribute	Description
Block ID	NOTIF-001
Name	Push Notification Service
Aim	Deliver timely push notifications for alerts, reminders, milestones, and engagement
Priority	P0 (Critical)
# inputs:

// Send single notification
{
  userId: string;
  notification: {
    type: 'ALERT' | 'REMINDER' | 'MILESTONE' | 'COMMUNITY' | 'EDUCATION' | 'SYSTEM';
    priority: 'HIGH' | 'NORMAL' | 'LOW';
    title: string;
    body: string;
    data?: object;              // Deep link data
    imageUrl?: string;
    actionButtons?: Array<{
      id: string;
      label: string;
      action: string;
    }>;
    sound?: 'DEFAULT' | 'URGENT' | 'SILENT';
    badge?: number;
    expiresAt?: string;
  };
}

// Send bulk notification
{
  targetType: 'ALL' | 'SEGMENT' | 'COUNTRY' | 'GESTATIONAL_RANGE';
  targetFilter?: {
    country?: string;
    gestationalWeekMin?: number;
    gestationalWeekMax?: number;
    riskLevel?: string;
    language?: string;
  };
  notification: object;         // Same as single
  scheduledAt?: string;         // For scheduled sends
}

// Register device token
{
  userId: string;
  deviceToken: string;
  platform: 'ANDROID' | 'IOS';
  deviceId: string;
}

// Update notification preferences
{
  userId: string;
  preferences: {
    alertsEnabled: boolean;
    remindersEnabled: boolean;
    communityEnabled: boolean;
    educationEnabled: boolean;
    quietHoursStart?: string;   // "22:00"
    quietHoursEnd?: string;     // "07:00"
  };
}

# outputs:

// Single notification result
{
  success: boolean;
  notificationId: string;
  deliveryStatus: 'SENT' | 'QUEUED' | 'FAILED';
  failureReason?: string;
}

// Bulk notification result
{
  success: boolean;
  campaignId: string;
  targetedCount: number;
  sentCount: number;
  failedCount: number;
  scheduledAt?: string;
}

// Device registration
{
  success: boolean;
  deviceId: string;
  activeDevices: number;
}
# Implementation Prompt:

Build a push notification service that:

1. NOTIFICATION TYPES:
   
   ALERT (HIGH priority):
   - RED/ORANGE triage results
   - Emergency contact activations
   - Support circle alerts
   - Sound: URGENT
   - Bypass quiet hours
   
   REMINDER (NORMAL priority):
   - Appointment reminders (1 day, 1 hour before)
   - Daily check-in reminder (if not done by 6pm)
   - Medication reminders
   - Kick count reminder (3rd trimester)
   
   MILESTONE (NORMAL priority):
   - Milestone completed celebration
   - New milestone available
   - Streak at risk warning
   
   COMMUNITY (LOW priority):
   - Reply to your post
   - New message from Doula
   - Weekly community digest
   
   EDUCATION (LOW priority):
   - New content for your week
   - Quiz available
   - Weekly tip

2. DELIVERY INFRASTRUCTURE:
   - Use Firebase Cloud Messaging (FCM)
   - Fallback to SMS if push fails (for HIGH priority)
   - Store notifications in database for in-app inbox
   - Track delivery and open rates

3. PERSONALIZATION:
   - Use user's language
   - Respect timezone for scheduling
   - Honor quiet hours (except emergencies)
   - Personalize with name and gestational age

4. DEVICE MANAGEMENT:
   - Support multiple devices per user
   - Clean up stale tokens
   - Track last active device

5. ANALYTICS:
   - Track sent, delivered, opened, clicked
   - A/B test notification copy
   - Optimize send times

6. RATE LIMITING:
   - Max 10 non-urgent notifications per day
   - Aggregate community notifications
   - Never rate-limit alerts
# ---------------------------------------------------------------------------------------------------------------------------------
# 7.2 SMS Gateway Service
Attribute	Description
Block ID	NOTIF-002
Name	SMS Gateway Service
Aim	Send and receive SMS messages for notifications, OTP, and USSD fallback communication
Priority	P0 (Critical)
# inputs:

// Send templated SMS
{
  phoneNumber: string;
  templateKey: string;
  variables: Record<string, string>;
  language: string;
  priority: 'HIGH' | 'NORMAL';
}

// Send raw SMS (admin/system only)
{
  phoneNumber: string;
  message: string;
  senderId?: string;
}

// Process incoming SMS
{
  from: string;
  to: string;
  text: string;
  messageId: string;
  timestamp: string;
}
# outputs:

// SMS sent
{
  success: boolean;
  messageId: string;
  status: 'SENT' | 'QUEUED' | 'FAILED';
  cost?: string;
  segments: number;
}

// Incoming SMS processed
{
  processed: boolean;
  action: string;               // What was triggered
  response?: string;            // Auto-reply sent
}
# Implementation Prompt:

Build an SMS gateway service using Africa's Talking:

1. TEMPLATES:
   Store all SMS templates with translations:
   
   OTP:
   - "Your Momentum code is {code}. Valid for 5 minutes."
   
   APPOINTMENT_REMINDER:
   - "Reminder: ANC appointment tomorrow at {clinic}. Bring your maternity book."
   
   RED_ALERT:
   - "URGENT: {name} needs help! Location: {location}. Call: {number}"
   
   MILESTONE_COMPLETE:
   - "Well done! You earned {tokens} MomTokens for {milestone}."
   
   WEEKLY_TIP:
   - "Week {week} tip: {tip}"
   
   BALANCE:
   - "Your MomToken balance: {balance} MTK"

2. SENDING:
   - Use Africa's Talking SMS API
   - Handle sender ID per country:
     - SA: Alphanumeric sender ID
     - UG: Short code or alphanumeric
   - Track delivery status via webhooks
   - Retry failed messages (max 3 attempts)

3. INCOMING SMS PROCESSING:
   - Parse keywords:
     - "BALANCE" → Return token balance
     - "STOP" → Opt out of marketing
     - "HELP" → Send help information
     - Symptom keywords → Trigger check-in prompt
   - Route to appropriate service
   - Auto-reply with confirmation

4. COST MANAGEMENT:
   - Track SMS costs per user
   - Optimize message length (avoid multi-segment)
   - Batch non-urgent messages
   - Daily/monthly budget alerts

5. COMPLIANCE:
   - Opt-out handling (STOP)
   - Consent verification
   - Message logging for audit
# ---------------------------------------------------------------------------------------------------------------------------------
# 7.3 Alert Management Service
Attribute	Description
Block ID	NOTIF-003
Name	Alert Management Service
Aim	Orchestrate multi-channel alerts for emergencies and urgent situations
Priority	P0 (Critical)
# inputs:

// Trigger alert
{
  userId: string;
  alertType: 'RED_TRIAGE' | 'ORANGE_TRIAGE' | 'EMERGENCY_SOS' | 'MISSED_APPOINTMENT' | 'STREAK_AT_RISK';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  source: string;               // Service that triggered
  context: {
    symptomLogId?: string;
    symptoms?: string[];
    triageLevel?: string;
    location?: object;
    additionalInfo?: string;
  };
}

// Acknowledge alert
{
  alertId: string;
  acknowledgedBy: string;       // User ID or role
  acknowledgmentType: 'VIEWED' | 'ACTING' | 'RESOLVED' | 'FALSE_ALARM';
  notes?: string;
}

// Get active alerts
{
  userId?: string;              // For specific user
  role?: string;                // For CHW/Doula dashboard
  status?: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
}
# outputs:

// Alert triggered
{
  alertId: string;
  status: 'ACTIVE';
  channelsNotified: Array<{
    channel: string;            // PUSH, SMS, CALL
    recipient: string;
    status: string;
    timestamp: string;
  }>;
  escalationSchedule: Array<{
    level: number;
    triggerAt: string;
    recipients: string[];
  }>;
}

// Active alerts
{
  alerts: Array<{
    id: string;
    userId: string;
    userName: string;
    alertType: string;
    severity: string;
    status: string;
    createdAt: string;
    acknowledgedAt?: string;
    acknowledgedBy?: string;
    context: object;
  }>;
}

# Implementation Prompt:

Build an alert management service that:

1. ALERT TYPES & RESPONSES:

   RED_TRIAGE (CRITICAL):
   - Immediate: Push notification to user (full-screen emergency UI)
   - Immediate: SMS to emergency contact
   - Immediate: SMS to support circle (alert-enabled)
   - 5 min: If not acknowledged, call emergency contact
   - 15 min: Alert CHW/Doula
   - 30 min: Escalate to clinic dashboard
   
   ORANGE_TRIAGE (HIGH):
   - Immediate: Push notification with clinic contact
   - 1 hour: If not acknowledged, SMS reminder
   - 2 hours: Alert CHW/Doula
   - 4 hours: Flag for clinic follow-up
   
   EMERGENCY_SOS (CRITICAL):
   - Immediate: All RED_TRIAGE actions
   - Immediate: Log emergency event
   - Immediate: Prepare patient summary for facility
   
   MISSED_APPOINTMENT (MEDIUM):
   - Immediate: Push + SMS asking about visit
   - 24 hours: Alert CHW for follow-up
   - 48 hours: Update risk assessment
   
   STREAK_AT_RISK (LOW):
   - Immediate: Push reminder
   - Evening: Gentle SMS reminder

2. ESCALATION ENGINE:
   - Configurable escalation timelines
   - Track acknowledgments
   - Auto-escalate if not acknowledged
   - Stop escalation when resolved

3. MULTI-CHANNEL DELIVERY:
   - Try push first
   - SMS as backup/parallel for critical
   - Phone call for unacknowledged critical
   - In-app alert badge

4. DASHBOARDS:
   - CHW dashboard: See all alerts in district
   - Doula dashboard: See assigned mothers' alerts
   - Clinic dashboard: See facility-linked alerts
   - One-click acknowledgment

5. AUDIT TRAIL:
   - Log all alert triggers
   - Log all delivery attempts
   - Log all acknowledgments
   - Track time-to-acknowledge
# ---------------------------------------------------------------------------------------------------------------------------------
# 7.4 Scheduled Notification Service
Attribute	Description
Block ID	NOTIF-004
Name	Scheduled Notification Service
Aim	Manage scheduled and recurring notifications like daily reminders and weekly tips
Priority	P1 (High)
# inputs:

// Schedule notification
{
  userId: string;
  notificationType: string;
  scheduledAt: string;          // ISO timestamp
  recurring?: {
    frequency: 'DAILY' | 'WEEKLY' | 'CUSTOM';
    daysOfWeek?: number[];      // 0-6 for custom
    time: string;               // "08:00"
    endDate?: string;
  };
  notification: object;
}

// Cancel scheduled notification
{
  scheduleId: string;
}

// Get user's scheduled notifications
{
  userId: string;
}

// Trigger scheduled batch (cron job)
{
  batchType: 'DAILY_CHECKIN' | 'WEEKLY_TIP' | 'APPOINTMENT_REMINDER';
  executionTime: string;
}
# outputs:

// Schedule created
{
  scheduleId: string;
  nextExecution: string;
  status: 'ACTIVE';
}

// Batch execution result
{
  batchType: string;
  usersTargeted: number;
  notificationsSent: number;
  errors: number;
  executionTime: number;
}
# Implementation Prompt:

Build a scheduled notification service that:

1. SCHEDULED TYPES:

   DAILY_CHECKIN_REMINDER:
   - Runs at 6:00 PM user's local time
   - Only if user hasn't checked in today
   - "Don't forget to log how you're feeling today!"
   
   APPOINTMENT_REMINDER:
   - 7 days before: "You have an appointment next week at {clinic}"
   - 1 day before: "Reminder: ANC tomorrow at {time}"
   - 2 hours before: "Your appointment is in 2 hours"
   
   WEEKLY_TIP:
   - Every Monday morning
   - Content based on gestational week
   - Different tip each week
   
   KICK_COUNT_REMINDER:
   - Daily at 10:00 AM for 28+ weeks
   - "Time to count your baby's kicks!"
   
   MEDICATION_REMINDER:
   - Configurable time (default 8:00 AM)
   - "Remember to take your prenatal vitamins"
   
   STREAK_WARNING:
   - 8:00 PM if about to lose streak
   - "Log now to keep your {X}-day streak!"

2. SCHEDULING ENGINE:
   - Use Bull queue with Redis
   - Support timezone-aware scheduling
   - Handle recurring jobs efficiently
   - Allow cancellation and modification

3. BATCH PROCESSING:
   - Process in chunks (1000 users)
   - Stagger sends to avoid rate limits
   - Track failures for retry
   - Generate execution reports

4. PERSONALIZATION:
   - Use user's language
   - Use user's timezone
   - Include relevant data (gestational week, name)
   - Respect notification preferences

5. OPTIMIZATION:
   - Don't send if user recently active
   - Consolidate multiple reminders
   - Learn optimal send times per user
# ---------------------------------------------------------------------------------------------------------------------------------
# 8. Connectivity & Fallback Services
# ---------------------------------------------------------------------------------------------------------------------------------
# 8.1 USSD Gateway Service
Attribute	Description
Block ID	CONN-001
Name	USSD Gateway Service
Aim	Provide full platform functionality via USSD for feature phone users and areas with poor internet
Priority	P0 (Critical)
# inputs:

// USSD callback (from Africa's Talking)
{
  sessionId: string;
  phoneNumber: string;
  networkCode: string;
  serviceCode: string;          // *134*MOM#
  text: string;                 // User's input sequence
}

// Session state (internal)
{
  sessionId: string;
  phoneNumber: string;
  userId?: string;
  currentMenu: string;
  menuStack: string[];
  data: Record<string, any>;
  language: string;
  lastActivity: number;
}
# outputs:

// USSD response
{
  response: string;             // Menu text to display
  endSession: boolean;          // CON (false) or END (true)
}
# Implementation Prompt:

Build a complete USSD gateway service:

1. MENU STRUCTURE:

   MAIN MENU (*134*MOM#):
   1. Daily Check-in
   2. My Balance
   3. Emergency
   4. Education
   5. Settings
   
   DAILY CHECK-IN:
   1. I'm feeling good
   2. Headache
   3. Bleeding
   4. Swelling
   5. Baby not moving
   6. Other
   0. Back
   
   → If symptom selected:
   How bad is it?
   1. Mild
   2. Moderate
   3. Severe
   0. Back
   
   → After severity:
   Display triage result
   (RED: Emergency instructions)
   (GREEN: Reassurance + tokens earned)
   
   MY BALANCE:
   Your MomTokens: {balance}
   
   1. Redeem for airtime
   2. View history
   0. Back
   
   EMERGENCY:
   1. Call Ambulance
   2. Alert my family
   3. Nearest clinic
   0. Back
   
   EDUCATION:
   Display tip of the day
   → Press any key for more tips
   
   SETTINGS:
   1. Change language
   2. Update emergency contact
   0. Back

2. SESSION MANAGEMENT:
   - Store session state in Redis
   - 5-minute timeout
   - Support back navigation via menu stack
   - Clean up expired sessions

3. USER IDENTIFICATION:
   - Look up user by phone number
   - If not registered, offer registration flow
   - Store language preference

4. INTEGRATION:
   - Call same backend services as app
   - Log symptoms via Health Service
   - Check balance via Token Service
   - Trigger alerts via Alert Service

5. LOCALIZATION:
   - All menus in user's language
   - Support: English, Zulu, Xhosa, Sotho, Luganda, Swahili
   - Compact text (160 char limit per screen)

6. ERROR HANDLING:
   - Invalid input: Redisplay menu with "Invalid option"
   - Service error: "Service temporarily unavailable. Try again."
   - Timeout: Session expired message
# ---------------------------------------------------------------------------------------------------------------------------------*
# 8.2 IVR (Voice) Service
Attribute	Description
Block ID	CONN-002
Name	IVR Voice Service
Aim	Provide audio-based interaction for illiterate users and voice content delivery
Priority	P2 (Medium)
# inputs:

// IVR callback
{
  sessionId: string;
  phoneNumber: string;
  isActive: boolean;
  direction: 'INBOUND' | 'OUTBOUND';
  dtmfDigits?: string;          // Key presses
  recordingUrl?: string;        // If user recorded message
}

// Initiate outbound call
{
  phoneNumber: string;
  callType: 'EDUCATION' | 'REMINDER' | 'ALERT';
  contentId?: string;
  language: string;
}
# outputs:

// IVR response
{
  response: string;             // XML or text for Africa's Talking
  actions: Array<{
    action: 'SAY' | 'PLAY' | 'GETDIGITS' | 'RECORD' | 'DIAL';
    text?: string;
    audioUrl?: string;
    timeout?: number;
    numDigits?: number;
    finishOnKey?: string;
  }>;
}
# Implementation Prompt:

Build an IVR voice service:

1. INBOUND CALL HANDLING:
   
   Welcome:
   - Play: "Welcome to Momentum. Press 1 for English, 2 for Zulu..."
   
   Main Menu (voice):
   - "Press 1 to listen to today's health tip"
   - "Press 2 to record how you're feeling"
   - "Press 3 for emergency help"
   
   Health Tip:
   - Play pre-recorded audio for user's gestational week
   - "Press 1 to hear again, 0 to go back"
   
   Record Symptom:
   - "Please describe how you are feeling after the beep"
   - Record user's voice message
   - Transcribe and process via NLP
   - Confirm understanding

2. OUTBOUND CALLS:
   
   Appointment Reminder:
   - Call user day before appointment
   - "This is Momentum. You have an appointment tomorrow at {clinic}. Press 1 to confirm, 2 to reschedule"
   
   Emergency Follow-up:
   - If RED alert not acknowledged
   - "This is an urgent call from Momentum. We noticed concerning symptoms. Press 1 if you need help, 2 if you are okay"

3. VOICE CONTENT:
   - Pre-record educational content in all languages
   - Use native speakers
   - 60-second segments
   - Store in CDN for fast playback

4. INTEGRATION:
   - Connect to same backend services
   - Log interactions
   - Track content completion

5. ACCESSIBILITY:
   - Slow, clear speech
   - Repeat options
   - Allow replay
   - Timeout with callback option
# ---------------------------------------------------------------------------------------------------------------------------------
# 8.3 Offline Sync Service
Attribute	Description
Block ID	CONN-003
Name	Offline Sync Service
Aim	Handle synchronization of data between mobile app and server when connectivity is intermittent
Priority	P0 (Critical)
# inputs:

// Sync request from mobile
{
  userId: string;
  deviceId: string;
  lastSyncTimestamp: string;
  pendingOperations: Array<{
    id: string;
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    entity: string;             // symptomLog, quizResult, etc.
    data: object;
    timestamp: string;
    retryCount: number;
  }>;
  localState: {
    symptomLogsCount: number;
    milestonesVersion: number;
    contentVersion: number;
  };
}

// Get changes for client
{
  userId: string;
  since: string;                // Timestamp
  entities: string[];           // Which entities to sync
}
# outputs:

// Sync response
{
  success: boolean;
  syncTimestamp: string;
  
  // Results of pending operations
  operationResults: Array<{
    localId: string;
    status: 'SUCCESS' | 'CONFLICT' | 'ERROR';
    serverId?: string;
    error?: string;
    resolution?: object;        // For conflicts
  }>;
  
  // Server changes to apply
  serverChanges: {
    symptomLogs: Array<{
      action: 'CREATE' | 'UPDATE' | 'DELETE';
      data: object;
    }>;
    milestones: Array<object>;
    content: Array<object>;
    tokenBalance: number;
    user: object;
  };
  
  // Next sync hints
  hasMoreChanges: boolean;
  recommendedSyncInterval: number;
}

# Implementation Prompt:

Build an offline sync service that:

1. SYNC PROTOCOL:
   
   Upload Phase:
   - Receive pending operations from client
   - Process in timestamp order
   - For each operation:
     - Validate data
     - Check for conflicts
     - Apply to database
     - Return result
   
   Download Phase:
   - Query changes since last sync
   - Include: symptom logs, milestones, content, balance
   - Paginate large result sets
   - Return delta updates only

2. CONFLICT RESOLUTION:
   
   Symptom Logs:
   - Last-write-wins (client timestamp)
   - Server never modifies user logs
   - No conflicts expected
   
   Milestones:
   - Server is source of truth
   - Client updates overwritten by server
   - Return latest server state
   
   User Profile:
   - Field-level merge
   - Most recent field value wins
   - Return merged result

3. EFFICIENCY:
   - Use compression for large payloads
   - Delta sync (only changes)
   - Prioritize critical data (alerts first)
   - Background sync when on WiFi

4. QUEUE MANAGEMENT:
   - Client queues operations when offline
   - Persist queue to local storage
   - Retry failed operations with backoff
   - Max retry count (then flag for support)

5. DATA INTEGRITY:
   - Checksums for verification
   - Transaction logging
   - Rollback capability
   - Audit trail of syncs

6. ERROR HANDLING:
   - Partial sync support (some succeed, some fail)
   - Clear error messages for client
   - Automatic retry for transient errors
   - Manual resolution for persistent conflicts
# ---------------------------------------------------------------------------------------------------------------------------------
# 9. Integration Services
# ---------------------------------------------------------------------------------------------------------------------------------
# 9.1 MomConnect Integration (South Africa)
Attribute	Description
Block ID	INTEG-001
Name	MomConnect Integration Service
Aim	Synchronize pregnancy registrations and visit data with South Africa's national MomConnect system
Priority	P1 (High) - SA only
# inputs:

// Register pregnancy with MomConnect
{
  userId: string;
  pregnancyId: string;
  phoneNumber: string;
  facilityCode: string;
  estimatedDueDate: string;
  language: string;
  gravida: number;
  parity: number;
}

// Sync clinic visit
{
  userId: string;
  pregnancyId: string;
  momconnectId: string;
  visitType: string;
  visitDate: string;
  facilityCode: string;
  clinicalData?: object;
}

// Update pregnancy status
{
  momconnectId: string;
  status: 'ACTIVE' | 'DELIVERED' | 'LOSS';
  deliveryDate?: string;
  deliveryOutcome?: string;
}

# outputs:

// Registration result
{
  success: boolean;
  momconnectId: string;
  messagingEnabled: boolean;
  error?: string;
}

// Sync result
{
  success: boolean;
  synced: boolean;
  momconnectResponse?: object;
}
# Implementation Prompt:

Build MomConnect integration service:

1. INTEGRATION POINTS:
   - OpenHIM (Health Information Mediator)
   - HL7 FHIR endpoints
   - MomConnect registration API
   - MomConnect visit tracking API

2. REGISTRATION SYNC:
   - On pregnancy creation in Momentum
   - Map fields to MomConnect format
   - Submit via OpenHIM
   - Store MomConnect ID in our database
   - Handle duplicates (already registered)

3. VISIT SYNC:
   - On verified ANC visit
   - Send visit record to MomConnect
   - Include: visit type, date, facility
   - Don't expose Momentum-specific data

4. BIDIRECTIONAL SYNC (future):
   - Receive MomConnect messages
   - Complement, don't duplicate messaging
   - Query visit history from MomConnect

5. ERROR HANDLING:
   - Queue failed syncs for retry
   - Alert on persistent failures
   - Manual sync trigger option
   - Graceful degradation (Momentum works without MomConnect)

6. DATA MAPPING:
   - Map facility codes between systems
   - Map language codes
   - Transform date formats
   - Handle field length limits
# ---------------------------------------------------------------------------------------------------------------------------------
# 9.2 FamilyConnect Integration (Uganda)
Attribute	Description
Block ID	INTEG-002
Name	FamilyConnect/DHIS2 Integration Service
Aim	Synchronize with Uganda's DHIS2-based health information system
Priority	P1 (High) - UG only
# inputs:

// Register in DHIS2 tracker
{
  userId: string;
  pregnancyId: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  lmpDate: string;
  facilityId: string;           // DHIS2 org unit
  districtId: string;
}

// Record ANC event
{
  trackedEntityId: string;
  visitNumber: number;
  visitDate: string;
  facilityId: string;
  weight?: number;
  bloodPressure?: string;
  gestationalAge: number;
}

// Record delivery event
{
  trackedEntityId: string;
  deliveryDate: string;
  deliveryMethod: string;
  outcome: string;
  birthWeight?: number;
  facilityId: string;
}

# outputs:

// Registration result
{
  success: boolean;
  trackedEntityId: string;
  enrollmentId: string;
}

// Event recorded
{
  success: boolean;
  eventId: string;
}
# Implementation Prompt:

Build FamilyConnect/DHIS2 integration:

1. DHIS2 API INTEGRATION:
   - Authenticate with DHIS2
   - Use Tracker API for individual records
   - Map to Uganda MOH program structure

2. TRACKER REGISTRATION:
   - Create Tracked Entity Instance
   - Enroll in ANC program
   - Assign to facility org unit
   - Store DHIS2 IDs locally

3. EVENT REPORTING:
   - Record ANC visits as program stage events
   - Include standard data elements:
     - Visit number
     - Weight
     - Blood pressure
     - Gestational age
   - Follow DHIS2 data model

4. DATA ELEMENTS:
   - Map Momentum fields to DHIS2 data elements
   - Handle required vs optional fields
   - Validate against DHIS2 rules

5. SYNC SCHEDULING:
   - Real-time sync for visits
   - Batch sync for historical data
   - Retry queue for failures

6. OFFLINE CONSIDERATION:
   - Many Ugandan facilities have limited connectivity
   - Queue events for later sync
   - Support manual trigger
# ---------------------------------------------------------------------------------------------------------------------------------
# 9.3 Mobile Money Integration (Uganda)
Attribute	Description
Block ID	INTEG-003
Name	Mobile Money Integration Service
Aim	Enable token redemption via MTN MoMo and Airtel Money
Priority	P0 (Critical) - UG
# inputs:

// Initiate disbursement
{
  userId: string;
  provider: 'MTN_MOMO' | 'AIRTEL_MONEY';
  phoneNumber: string;
  amount: number;               // In UGX
  reference: string;            // Redemption ID
  note: string;
}

// Check transaction status
{
  provider: string;
  transactionId: string;
}

// Validate phone number
{
  provider: string;
  phoneNumber: string;
}
# outputs:

// Disbursement result
{
  success: boolean;
  transactionId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  providerReference: string;
  amount: number;
  currency: string;
  failureReason?: string;
}

// Status check
{
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  completedAt?: string;
  failureReason?: string;
}

// Validation
{
  valid: boolean;
  accountName?: string;         // If available
}
# Implementation Prompt:

Build mobile money integration service:

1. MTN MOMO INTEGRATION:
   
   API Setup:
   - Disbursement API (sandbox/production)
   - Authentication: API key + User ID
   - OAuth token refresh
   
   Disbursement Flow:
   a) Validate recipient phone
   b) Generate reference ID
   c) Submit disbursement request
   d) Poll for completion (or webhook)
   e) Confirm or handle failure
   
   Error Handling:
   - Insufficient balance: Alert admin
   - Invalid phone: Reject redemption
   - Network error: Queue for retry
   - Duplicate: Check idempotency

2. AIRTEL MONEY INTEGRATION:
   - Similar flow to MTN
   - Different API structure
   - Different authentication

3. PROVIDER SELECTION:
   - Auto-detect from phone prefix
   - MTN: 077, 078, 076
   - Airtel: 070, 075
   - Allow user override

4. RECONCILIATION:
   - Daily balance check
   - Match disbursements with redemptions
   - Flag discrepancies
   - Generate reports

5. SECURITY:
   - Encrypt API credentials
   - IP whitelist for callbacks
   - Transaction signing
   - Rate limiting

6. MONITORING:
   - Track success rates per provider
   - Monitor balance levels
   - Alert on failures
   - Dashboard for operations
# ---------------------------------------------------------------------------------------------------------------------------------
# 9.4 Transport Partner Integration
Attribute	Description
Block ID	INTEG-004
Name	Transport Partner Integration Service
Aim	Generate and manage transport vouchers for Uber, Bolt, SafeBoda
Priority	P1 (High)
# inputs:

// Generate voucher
{
  userId: string;
  provider: 'UBER' | 'BOLT' | 'SAFEBODA';
  value: number;                // In local currency
  redemptionId: string;
  purpose: 'ANC_TRANSPORT' | 'EMERGENCY' | 'GENERAL';
}

// Check voucher status
{
  voucherId: string;
}

// Cancel voucher
{
  voucherId: string;
  reason: string;
}
# outputs:

// Voucher generated
{
  success: boolean;
  voucherId: string;
  voucherCode: string;
  voucherPin?: string;
  value: number;
  currency: string;
  validUntil: string;
  instructions: string;
  provider: string;
}

// Voucher status
{
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED';
  usedAt?: string;
  usedAmount?: number;
  remainingValue?: number;
}
# Implementation Prompt:

Build transport partner integration:

1. UBER INTEGRATION (SA):
   - Uber for Business API
   - Generate voucher codes
   - Track usage
   - Specify pickup zones (clinic areas)
   - Set validity period

2. BOLT INTEGRATION (SA):
   - Bolt Business API
   - Similar flow to Uber
   - Generate ride credits

3. SAFEBODA INTEGRATION (UG):
   - SafeBoda for Business
   - Voucher code generation
   - Track redemption

4. VOUCHER MANAGEMENT:
   - Generate unique codes
   - Store voucher details
   - Track expiry
   - Monitor usage
   - Handle partial use

5. PURPOSE-BASED RULES:
   - ANC_TRANSPORT: Restrict to clinic locations
   - EMERGENCY: No location restriction
   - GENERAL: Standard voucher

6. REPORTING:
   - Track redemption rates
   - Monitor fraud patterns
   - Partner reconciliation
   - Usage analytics
# ---------------------------------------------------------------------------------------------------------------------------------
# 10. Analytics & Reporting Services
# ---------------------------------------------------------------------------------------------------------------------------------
# 10.1 Event Tracking Service
Attribute	Description
Block ID	ANALYTICS-001
Name	Event Tracking Service
Aim	Capture and store all user events for analytics, debugging, and product improvement
Priority	P1 (High)
# inputs:

// Track event
{
  userId?: string;              // Optional for anonymous events
  sessionId: string;
  eventType: string;            // Standardized event name
  eventData: object;
  source: 'APP' | 'USSD' | 'SMS' | 'WEB' | 'API';
  timestamp: string;
  deviceInfo?: {
    platform: string;
    version: string;
    model: string;
    osVersion: string;
  };
  location?: {
    country: string;
    region: string;
  };
}

// Batch track events
{
  events: Array<object>;        // Array of events
}
# outputs:

// Event tracked
{
  success: boolean;
  eventId: string;
}

// Batch result
{
  success: boolean;
  tracked: number;
  failed: number;
}
# Implementation Prompt:

Build an event tracking service:

1. EVENT TYPES:

   USER EVENTS:
   - user.registered
   - user.login
   - user.logout
   - profile.updated
   
   HEALTH EVENTS:
   - pregnancy.registered
   - symptom.logged
   - triage.result (level, action)
   - kick_count.completed
   - appointment.scheduled
   - appointment.attended
   - appointment.missed
   
   MILESTONE EVENTS:
   - milestone.started
   - milestone.progress
   - milestone.completed
   - milestone.expired
   
   TOKEN EVENTS:
   - tokens.minted
   - tokens.burned
   - redemption.initiated
   - redemption.completed
   - redemption.failed
   
   ENGAGEMENT EVENTS:
   - content.viewed
   - content.completed
   - quiz.started
   - quiz.completed
   - post.created
   - post.liked
   - message.sent
   
   SYSTEM EVENTS:
   - alert.triggered
   - alert.acknowledged
   - sync.completed
   - error.occurred

2. STORAGE:
   - Write to MongoDB (flexible schema)
   - Index by userId, eventType, timestamp
   - TTL for raw events (90 days)
   - Aggregate older data

3. PROCESSING:
   - Real-time stream to analytics
   - Batch processing for reports
   - Anomaly detection

4. PRIVACY:
   - Don't track sensitive health details
   - Anonymize for aggregate analytics
   - Respect opt-out preferences
# ---------------------------------------------------------------------------------------------------------------------------------
# 10.2 KPI Dashboard Service
Attribute	Description
Block ID	ANALYTICS-002
Name	KPI Dashboard Service
Aim	Calculate and serve key performance indicators for monitoring platform health and impact
Priority	P1 (High)
# inputs:

// Get dashboard data
{
  dashboardType: 'EXECUTIVE' | 'CLINICAL' | 'ENGAGEMENT' | 'FINANCIAL';
  timeRange: {
    start: string;
    end: string;
    granularity: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
  };
  filters?: {
    country?: string;
    region?: string;
    facility?: string;
  };
}

// Get specific metric
{
  metric: string;
  timeRange: object;
  filters?: object;
  compareWith?: {
    start: string;
    end: string;
  };
}
# outputs:

// Dashboard data
{
  dashboardType: string;
  generatedAt: string;
  timeRange: object;
  
  metrics: {
    // CLINICAL METRICS
    activePregnancies: number;
    averageGestationalAge: number;
    highRiskPregnancies: number;
    redTriagesThisWeek: number;
    ancAttendanceRate: number;
    facilityDeliveryRate: number;
    
    // ENGAGEMENT METRICS
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageCheckInsPerWeek: number;
    streakRetentionRate: number;
    contentCompletionRate: number;
    
    // FINANCIAL METRICS
    tokensInCirculation: number;
    tokensMintedThisPeriod: number;
    tokensBurnedThisPeriod: number;
    redemptionRate: number;
    averageRedemptionValue: number;
    
    // OUTCOME METRICS
    milestonesCompletedTotal: number;
    averageMilestonesPerUser: number;
    educationModulesCompleted: number;
    quizPassRate: number;
  };
  
  trends: Array<{
    date: string;
    values: object;
  }>;
  
  comparisons?: {
    previousPeriod: object;
    percentageChange: object;
  };
}

# Implementation Prompt:

Build a KPI dashboard service:

1. METRIC CALCULATIONS:

   Clinical Metrics:
   - Active pregnancies: COUNT WHERE status = ACTIVE
   - High risk rate: (HIGH risk / total) * 100
   - ANC attendance: (attended / scheduled) * 100
   - Triage distribution: COUNT GROUP BY triage level
   
   Engagement Metrics:
   - DAU: Unique users with activity today
   - WAU: Unique users with activity this week
   - MAU: Unique users with activity this month
   - Retention: Users active this week who were active last week
   - Streak health: Average streak length
   
   Financial Metrics:
   - Tokens in circulation: SUM of all balances
   - Minting rate: Tokens minted per day
   - Burn rate: Tokens redeemed per day
   - Velocity: Tokens burned / Tokens minted

2. DATA PIPELINE:
   - Pre-aggregate daily metrics
   - Store in time-series database (ClickHouse or TimescaleDB)
   - Cache dashboard queries
   - Refresh cache on schedule

3. VISUALIZATION:
   - Time series charts
   - Comparison with previous period
   - Geographic breakdown
   - Funnel analysis

4. ALERTS:
   - Threshold alerts (e.g., RED triages spike)
   - Anomaly detection
   - Daily digest email
   - Slack integration

5. ACCESS CONTROL:
   - Role-based dashboard access
   - Country-specific data isolation
   - Export controls
# ---------------------------------------------------------------------------------------------------------------------------------
# 10.3 Clinical Outcomes Reporting
Attribute	Description
Block ID	ANALYTICS-003
Name	Clinical Outcomes Reporting Service
Aim	Track and report maternal health outcomes for impact measurement and quality improvement
Priority	P1 (High)
# inputs:

// Generate outcomes report
{
  reportType: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM';
  timeRange: {
    start: string;
    end: string;
  };
  filters?: {
    country?: string;
    region?: string;
    facility?: string;
    riskLevel?: string;
  };
  includeComparisons: boolean;
}

// Record delivery outcome
{
  pregnancyId: string;
  deliveryDate: string;
  deliveryOutcome: 'LIVE_BIRTH' | 'STILLBIRTH' | 'NEONATAL_DEATH' | 'MATERNAL_DEATH';
  deliveryMethod: 'VAGINAL' | 'CESAREAN' | 'ASSISTED';
  deliveryLocation: 'FACILITY' | 'HOME' | 'EN_ROUTE';
  complications?: string[];
  birthWeight?: number;
  apgarScore?: number;
  maternalStatus: 'HEALTHY' | 'COMPLICATION' | 'DECEASED';
}
# outputs:

// Outcomes report
{
  reportId: string;
  reportType: string;
  generatedAt: string;
  timeRange: object;
  
  summary: {
    totalPregnancies: number;
    totalDeliveries: number;
    
    deliveryOutcomes: {
      liveBirths: number;
      stillbirths: number;
      neonatalDeaths: number;
      maternalDeaths: number;
    };
    
    deliveryMethods: {
      vaginal: number;
      cesarean: number;
      assisted: number;
    };
    
    deliveryLocations: {
      facility: number;
      home: number;
      enRoute: number;
    };
    
    rates: {
      facilityDeliveryRate: number;
      stillbirthRate: number;
      cesareanRate: number;
      complicationRate: number;
    };
  };
  
  triageEffectiveness: {
    redTriages: number;
    redTriagesWithComplication: number;
    earlyDetectionRate: number;
  };
  
  programImpact: {
    averageANCVisits: number;
    averageMilestonesCompleted: number;
    correlationWithOutcomes: object;
  };
  
  comparisons?: {
    previousPeriod: object;
    nationalBenchmarks: object;
  };
}

# Implementation Prompt:

Build clinical outcomes reporting:

1. OUTCOME TRACKING:
   - Link all pregnancies to outcomes
   - Track delivery date and outcome
   - Record complications
   - Follow up at 6 weeks postnatal

2. KEY METRICS:

   Primary Outcomes:
   - Maternal mortality ratio
   - Stillbirth rate
   - Neonatal death rate
   - Facility delivery rate
   
   Secondary Outcomes:
   - Average ANC visits
   - Early detection rate (complications detected before emergency)
   - Time from RED triage to care
   - Complication rate

3. PROGRAM EFFECTIVENESS:
   - Compare outcomes: Active users vs Inactive users
   - Correlation: Milestones completed vs Outcomes
   - Impact of early detection: Triages that prevented emergencies

4. BENCHMARKING:
   - Compare to national statistics
   - Compare to WHO targets
   - SDG 3.1 progress tracking

5. REPORTING:
   - Automated monthly reports
   - Custom report builder
   - Export to PDF/Excel
   - Integration with MOH reporting

6. DATA QUALITY:
   - Flag missing outcomes
   - Follow-up workflows
   - Data validation rules
# ---------------------------------------------------------------------------------------------------------------------------------
# 11. Administration Services
# ---------------------------------------------------------------------------------------------------------------------------------
# 11.1 Admin User Management
Attribute	Description
Block ID	ADMIN-001
Name	Admin User Management Service
Aim	Manage platform administrators, roles, and permissions
Priority	P1 (High)
# inputs:

// Create admin user
{
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'COUNTRY_ADMIN' | 'CONTENT_ADMIN' | 'SUPPORT_AGENT';
  country?: string;             // For country-specific admins
  permissions: string[];
}

// Update admin
{
  adminId: string;
  updates: {
    role?: string;
    permissions?: string[];
    isActive?: boolean;
  };
}

// List admins
{
  role?: string;
  country?: string;
  isActive?: boolean;
}
# outputs:

// Admin created
{
  success: boolean;
  adminId: string;
  temporaryPassword: string;
  passwordResetRequired: boolean;
}

// Admin list
{
  admins: Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    country: string;
    permissions: string[];
    isActive: boolean;
    lastLogin: string;
    createdAt: string;
  }>;
}
# Implementation Prompt:

Build admin user management:

1. ROLES:
   
   SUPER_ADMIN:
   - Full platform access
   - Can create other admins
   - Access all countries
   
   COUNTRY_ADMIN:
   - Full access within country
   - Can manage verifiers
   - Can view country analytics
   
   CONTENT_ADMIN:
   - Manage educational content
   - Moderate community
   - No access to user data
   
   SUPPORT_AGENT:
   - View user profiles (limited)
   - Handle support tickets
   - Cannot modify core data

2. PERMISSIONS:
   - users.read, users.write
   - content.read, content.write
   - analytics.read
   - verifiers.manage
   - tokens.manage
   - settings.manage

3. SECURITY:
   - MFA required for all admins
   - IP whitelist option
   - Session timeout (15 min)
   - Audit all admin actions

4. ONBOARDING:
   - Generate temporary password
   - Force password change on first login
   - Training requirements tracking
# ---------------------------------------------------------------------------------------------------------------------------------
# 11.2 Verifier Management
Attribute	Description
Block ID	ADMIN-002
Name	Verifier Management Service
Aim	Manage clinics, CHWs, and other entities authorized to verify milestones
Priority	P0 (Critical)
# inputs:

// Register verifier
{
  verifierType: 'CLINIC' | 'CHW' | 'DIGITAL_DOULA';
  name: string;
  facilityName?: string;
  country: string;
  region: string;
  district: string;
  contactPhone: string;
  contactEmail?: string;
  userId?: string;              // If verifier uses app
  publicKey?: string;           // For cryptographic verification
}

// Update verifier
{
  verifierId: string;
  updates: {
    isActive?: boolean;
    region?: string;
    contactPhone?: string;
  };
}

// Generate verification code
{
  verifierId: string;
}

// Get verifiers
{
  country?: string;
  region?: string;
  verifierType?: string;
  isActive?: boolean;
}

// Get verifier stats
{
  verifierId: string;
  timeRange: object;
}

# outputs:

// Verifier registered
{
  success: boolean;
  verifierId: string;
  verificationCode: string;
  qrCodeImage: string;
}

// Verifier list
{
  verifiers: Array<{
    id: string;
    type: string;
    name: string;
    facility: string;
    country: string;
    region: string;
    district: string;
    isActive: boolean;
    verificationsCount: number;
    lastVerification: string;
  }>;
}

// Verifier stats
{
  verifierId: string;
  totalVerifications: number;
  verificationsThisPeriod: number;
  uniqueUsersVerified: number;
  verificationsByType: object;
  averageVerificationsPerDay: number;
}

# Implementation Prompt:

Build verifier management service:

1. VERIFIER TYPES:
   
   CLINIC:
   - Healthcare facility
   - Can verify clinical milestones
   - Linked to facility code (for MomConnect/DHIS2)
   
   CHW (Community Health Worker):
   - Individual field worker
   - Can verify some clinical milestones
   - Linked to supervisor/facility
   
   DIGITAL_DOULA:
   - Community mentor
   - Can verify community milestones
   - Limited clinical verification

2. VERIFICATION CODES:
   - Unique code per verifier
   - Used in QR codes
   - Can be regenerated if compromised
   - Time-limited codes for enhanced security

3. GEOGRAPHIC ASSIGNMENT:
   - Assign to region/district
   - Only verify users in their area
   - Support multi-location verifiers

4. MONITORING:
   - Track verification counts
   - Detect anomalies (too many verifications)
   - Flag suspicious patterns
   - Performance dashboards

5. INTEGRATION:
   - Link to facility codes in national systems
   - Sync verifier list with MOH
# ---------------------------------------------------------------------------------------------------------------------------------
# 11.3 Content Management System
Attribute	Description
Block ID	ADMIN-003
Name	Content Management Service
Aim	Admin interface for managing educational content, translations, and quizzes
Priority	P1 (High)
# inputs:

// Create content
{
  contentType: 'ARTICLE' | 'AUDIO' | 'VIDEO' | 'TIP' | 'QUIZ';
  category: string;
  gestationalWeekStart?: number;
  gestationalWeekEnd?: number;
  country?: string;
  tags: string[];
  translations: Array<{
    language: string;
    title: string;
    body: string;
    summary: string;
    audioFile?: File;
    videoFile?: File;
  }>;
  quiz?: {
    questions: Array<{
      questionText: string;
      questionType: string;
      options: Array<{
        text: string;
        isCorrect: boolean;
        explanation: string;
      }>;
    }>;
    passingScore: number;
    tokenReward: number;
  };
  medicalReviewer: string;
  reviewDate: string;
}

// Update content
{
  contentId: string;
  updates: object;
}

// Publish/Unpublish
{
  contentId: string;
  action: 'PUBLISH' | 'UNPUBLISH' | 'ARCHIVE';
}

// List content
{
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  contentType?: string;
  category?: string;
  language?: string;
}

# outputs:

// Content created
{
  success: boolean;
  contentId: string;
  status: 'DRAFT';
  previewUrl: string;
}

// Content list
{
  content: Array<{
    id: string;
    type: string;
    category: string;
    title: string;
    status: string;
    languages: string[];
    hasAudio: boolean;
    hasVideo: boolean;
    hasQuiz: boolean;
    viewCount: number;
    completionRate: number;
    medicalReviewer: string;
    reviewDate: string;
    lastModified: string;
  }>;
}
# Implementation Prompt:

Build content management system:

1. CONTENT WORKFLOW:
   - Draft: Initial creation
   - In Review: Pending medical review
   - Published: Live to users
   - Archived: Hidden but retained

2. TRANSLATION MANAGEMENT:
   - Primary language first
   - Track translation status per language
   - Flag outdated translations
   - Support machine translation assistance

3. MEDIA HANDLING:
   - Audio upload and processing
   - Video upload to CDN
   - Automatic compression
   - Multiple quality levels

4. QUIZ BUILDER:
   - Visual question editor
   - Image support for questions
   - Explanation for each option
   - Preview mode

5. VERSION CONTROL:
   - Track all changes
   - Rollback capability
   - Compare versions
   - Audit trail

6. MEDICAL REVIEW:
   - Required before publish
   - Reviewer assignment
   - Annual review reminders
   - Review checklist
# ---------------------------------------------------------------------------------------------------------------------------------
# 11.4 Platform Configuration Service
Attribute	Description
Block ID	ADMIN-004
Name	Platform Configuration Service
Aim	Manage platform-wide settings, feature flags, and country-specific configurations
Priority	P1 (High)
# inputs:

// Get configuration
{
  scope: 'GLOBAL' | 'COUNTRY';
  country?: string;
  section?: string;
}

// Update configuration
{
  scope: string;
  country?: string;
  settings: Record<string, any>;
}

// Feature flag management
{
  flagName: string;
  action: 'ENABLE' | 'DISABLE' | 'PERCENTAGE';
  value?: number;               // For percentage rollout
  country?: string;
}
# outputs:

// Configuration
{
  settings: {
    global: {
      maintenanceMode: boolean;
      minAppVersion: string;
      maxSessionDuration: number;
      supportEmail: string;
    };
    tokens: {
      mintingEnabled: boolean;
      redemptionEnabled: boolean;
      maxDailyRedemption: number;
    };
    notifications: {
      pushEnabled: boolean;
      smsEnabled: boolean;
      quietHoursEnabled: boolean;
    };
    features: {
      communityEnabled: boolean;
      kickCounterEnabled: boolean;
      ivrEnabled: boolean;
    };
    countrySpecific: {
      ZA: {
        momconnectEnabled: boolean;
        emergencyNumber: string;
        partners: string[];
      };
      UG: {
        familyconnectEnabled: boolean;
        emergencyNumber: string;
        mobileMoneyEnabled: boolean;
      };
    };
  };
}

# Implementation Prompt:

Build platform configuration service:

1. CONFIGURATION HIERARCHY:
   - Global defaults
   - Country overrides
   - Feature flags
   - Runtime overrides (for emergencies)

2. FEATURE FLAGS:
   - Enable/disable features
   - Percentage rollout
   - User segment targeting
   - Kill switches

3. CRITICAL SETTINGS:
   - Maintenance mode
   - Minimum app version
   - API rate limits
   - Token economics

4. CHANGE MANAGEMENT:
   - All changes logged
   - Approval workflow for critical settings
   - Rollback capability
   - Change notifications

5. CACHING:
   - Cache configuration in Redis
   - Invalidate on changes
   - Client-side caching with refresh

6. VALIDATION:
   - Type checking
   - Range validation
   - Dependency checking (feature A requires B)
# ---------------------------------------------------------------------------------------------------------------------------------
# 12. Mobile Application Modules
# ---------------------------------------------------------------------------------------------------------------------------------
# 12.1 Onboarding Module
Attribute	Description
Block ID	MOBILE-001
Name	Onboarding Flow
Aim	Guide new users through registration, pregnancy setup, and app introduction
Priority	P0 (Critical)
Screens & Flow:

1. WELCOME SCREEN
   - App introduction
   - Language selection
   - "Get Started" button

2. PHONE REGISTRATION
   - Country code selector
   - Phone number input
   - OTP verification
   - Consent checkboxes

3. PROFILE SETUP
   - First name, last name
   - Date of birth (optional)
   - Emergency contact

4. PREGNANCY REGISTRATION
   - Last menstrual period (date picker or "unsure" option)
   - First pregnancy? (Y/N)
   - Number of previous pregnancies
   - Any complications before?

5. MEDICAL HISTORY (simplified)
   - Do you have any health conditions? (checkbox list)
   - Are you taking any medications?
   - HIV status (optional, with privacy explanation)

6. APP TOUR
   - Daily check-in introduction
   - Token rewards explanation
   - Community preview
   - Emergency features

7. NOTIFICATIONS PERMISSION
   - Explain importance
   - Request permission
   - Set preferences

8. COMPLETION
   - Profile summary
   - First milestone available
   - "Start your journey" button
# Implementation Prompt:

Build mobile onboarding module:

1. UX PRINCIPLES:
   - Maximum 10 screens
   - Progress indicator
   - Skip optional steps
   - Back navigation
   - Save progress (can resume)

2. LOCALIZATION:
   - All text in selected language
   - RTL support (future)
   - Date formats per locale
   - Local examples

3. VALIDATION:
   - Real-time input validation
   - Clear error messages
   - Prevent invalid submissions

4. DATA HANDLING:
   - Local state during flow
   - Submit all at completion
   - Handle offline start

5. PERMISSIONS:
   - Request at appropriate time
   - Explain why needed
   - Handle denial gracefully

6. ANALYTICS:
   - Track completion rate
   - Track drop-off points
   - A/B test variations
# ---------------------------------------------------------------------------------------------------------------------------------
# 12.2 Daily Check-In Module
Attribute	Description
Block ID	MOBILE-002
Name	Daily Check-In Screen
Aim	Provide simple, engaging interface for daily symptom logging
Priority	P0 (Critical)
Screen Components:

1. GREETING HEADER
   - "Good morning, {Name}!"
   - Gestational age: "Week 24, Day 3"
   - Streak counter: "🔥 7-day streak!"

2. MOOD SELECTOR
   - 5 emoji faces (1=very sad to 5=very happy)
   - Optional: Feeling tags (tired, anxious, happy, etc.)

3. SYMPTOM GRID
   - Icon-based selection
   - Common symptoms: Headache, Nausea, Swelling, etc.
   - "I feel good" option
   - "Other" with text input

4. SEVERITY SELECTOR (if symptom selected)
   - Mild / Moderate / Severe
   - Visual scale

5. OPTIONAL ADDITIONS
   - Vital signs entry (if user has monitor)
   - Medication taken today?
   - Water intake tracker
   - Fetal movement (3rd trimester)

6. SUBMIT BUTTON
   - "Log how I'm feeling"
   - Loading state
   - Success animation

7. RESULT SCREEN
   - Triage result with appropriate UI:
     - GREEN: Celebration animation, reassurance
     - YELLOW: Gentle guidance, educational link
     - ORANGE: Urgent card, clinic contact
     - RED: Full-screen emergency mode
   - Tokens earned
   - Streak updated
   - Relevant tip of the day
# Implementation Prompt:

Build daily check-in module:

1. UI/UX:
   - Large touch targets (accessibility)
   - Visual/icon-first design
   - Minimal text input required
   - Satisfying animations
   - < 60 seconds to complete

2. OFFLINE SUPPORT:
   - Works fully offline
   - Queues submission
   - Shows pending state
   - Syncs when online

3. TRIAGE DISPLAY:
   - RED: Cannot dismiss easily, emergency UI
   - ORANGE: Prominent but not blocking
   - YELLOW: Informational card
   - GREEN: Celebration focus

4. ENGAGEMENT:
   - Streak visualization
   - Token animation on earn
   - Progress to next milestone
   - Daily tip after submission

5. ACCESSIBILITY:
   - VoiceOver/TalkBack support
   - High contrast mode
   - Scalable text
   - Haptic feedback

6. LOCALIZATION:
   - All UI in user's language
   - Symptom names localized
   - Medical terms explained
# ---------------------------------------------------------------------------------------------------------------------------------
# 12.3 Rewards & Wallet Module
Attribute	Description
Block ID	MOBILE-003
Name	Rewards & Wallet Screen
Aim	Display token balance, milestone progress, and redemption options
Priority	P0 (Critical)
Screen Components:

1. BALANCE CARD
   - Large token balance display
   - "You have 450 MomTokens"
   - Local currency equivalent
   - Animated coin icon

2. QUICK ACTIONS
   - "Redeem Rewards" button
   - "View History" button

3. ACTIVE MILESTONES
   - Carousel of in-progress milestones
   - Progress bar per milestone
   - Days remaining
   - Token reward shown
   - "View All" link

4. REDEMPTION OPTIONS
   - Grid of partner logos
   - Category tabs: Transport, Data, Shopping
   - Token cost per option
   - "Coming Soon" for unavailable

5. TRANSACTION HISTORY
   - List of recent transactions
   - Earned vs Spent indicators
   - Date and description
   - Blockchain link (hidden/advanced)

6. REDEMPTION FLOW (separate screen)
   - Select partner
   - Enter amount
   - Confirm details
   - Processing animation
   - Success with voucher code
# Implementation Prompt:

Build rewards and wallet module:

1. BALANCE DISPLAY:
   - Real-time or cached (< 5 min)
   - Pull-to-refresh
   - Show pending transactions
   - Hide blockchain complexity

2. MILESTONE VISUALIZATION:
   - Clear progress indicators
   - Motivational messaging
   - Urgency for expiring milestones
   - Celebration on completion

3. REDEMPTION FLOW:
   - Simple selection
   - Clear conversion rates
   - Confirmation step
   - Success with clear instructions
   - Voucher code copyable

4. OFFLINE HANDLING:
   - Show cached balance
   - Indicate "last updated"
   - Queue redemption attempts? (risky)
   - Or require online for redemption

5. SECURITY:
   - Confirm large redemptions
   - Rate limiting UI
   - Clear value representation
# ---------------------------------------------------------------------------------------------------------------------------------
# 12.4 Education Hub Module
Attribute	Description
Block ID	MOBILE-004
Name	Education Hub Screen
Aim	Deliver personalized educational content with progress tracking
Priority	P1 (High)
Screen Components:

1. HEADER
   - "Learning for Week {X}"
   - Overall progress ring
   - Tokens available from learning

2. FEATURED CONTENT
   - This week's most important content
   - Danger signs always accessible
   - "Start Learning" CTA

3. CATEGORIES
   - Tabs or grid:
     - This Week
     - Danger Signs
     - Nutrition
     - Labor & Delivery
     - Baby Care
     - Mental Health

4. CONTENT CARDS
   - Thumbnail image
   - Title
   - Duration/length indicator
   - Audio/Video icon
   - Completion checkmark
   - Token reward badge

5. CONTENT VIEWER
   - Article: Scrollable text with images
   - Audio: Player with progress, playback speed
   - Video: Full-screen player
   - Download for offline option

6. QUIZ SCREEN
   - Question display
   - Answer options
   - Submit button
   - Results with explanations
   - Token earned celebration
# Implementation Prompt:

Build education hub module:

1. PERSONALIZATION:
   - Filter by gestational week
   - Prioritize based on risk factors
   - Track viewed content
   - Recommend next content

2. CONTENT FORMATS:
   - Articles: Markdown rendering
   - Audio: Background playback
   - Video: Streaming with quality options
   - Offline: Download management

3. PROGRESS TRACKING:
   - Mark as started
   - Track completion percentage
   - Resume where left off
   - Completion triggers milestone check

4. QUIZ INTEGRATION:
   - Quiz after content
   - Immediate feedback
   - Retry allowed
   - Token award on pass

5. OFFLINE SUPPORT:
   - Pre-download recommended content
   - Manage storage
   - Sync completion when online

6. ACCESSIBILITY:
   - Audio option for all content
   - Adjustable text size
   - High contrast images
# ---------------------------------------------------------------------------------------------------------------------------------
# 12.5 Community Module
Attribute	Description
Block ID	MOBILE-005
Name	Community Screen
Aim	Enable peer support, journey sharing, and Digital Doula connection
Priority	P2 (Medium)
Screen Components:

1. FEED TABS
   - All Posts
   - Questions
   - My Journey
   - My Doula

2. POST CARD
   - Author info (or Anonymous)
   - Gestational week badge
   - Post content
   - Media preview
   - Like, Comment, Save buttons
   - Report option (hidden in menu)

3. CREATE POST
   - Post type selector
   - Text input
   - Photo attachment
   - Anonymous toggle
   - Post button

4. POST DETAIL
   - Full post content
   - Comments section
   - Reply functionality

5. DOULA CHAT
   - Assigned Doula info
   - Message list
   - Text input
   - Send button
   - Attachment option

6. SEARCH & FILTER
   - Search posts
   - Filter by week range
   - Filter by topic
# Implementation Prompt:

Build community module:

1. FEED ALGORITHM:
   - Relevant posts first
   - Similar gestational week
   - Unanswered questions boosted
   - Recent activity

2. MODERATION:
   - AI pre-screening
   - Report flow
   - Flagged content handling
   - User blocking

3. ENGAGEMENT:
   - Like animation
   - Comment notifications
   - Reply threading

4. DOULA CHAT:
   - Real-time messaging
   - Read receipts
   - Typing indicator
   - Push notifications

5. PRIVACY:
   - Anonymous posting
   - Profile visibility settings
   - Block users

6. OFFLINE:
   - Cache feed
   - Queue posts
   - Show pending state
# ---------------------------------------------------------------------------------------------------------------------------------
# 12.6 Emergency Module
Attribute	Description
Block ID	MOBILE-006
Name	Emergency Screen & SOS
Aim	Provide immediate access to emergency assistance
Priority	P0 (Critical)
Screen Components:

1. SOS BUTTON (always accessible)
   - Floating action button
   - Or accessible from any screen header
   - Red color, clear iconography

2. EMERGENCY SCREEN (after SOS tap)
   - Full-screen red background
   - "Getting help..." message
   - Location being shared indicator
   - "Family notified" confirmation

3. EMERGENCY OPTIONS
   - Call Ambulance (one-tap dial)
   - Call Emergency Contact (one-tap dial)
   - Call Clinic (one-tap dial)
   - Share Location (manual send)

4. EMERGENCY INFO CARD
   - Nearest facility name and distance
   - Emergency numbers by country
   - What to bring checklist

5. CANCEL OPTION
   - "I'm okay" button
   - Requires confirmation
   - Notifies family of cancellation

6. POST-EMERGENCY
   - Check-in prompt after resolution
   - Resources about what happened
   - Follow-up appointment suggestion
# Implementation Prompt:

Build emergency module:

1. ACCESSIBILITY:
   - SOS always visible
   - Maximum 2 taps to activate
   - Works with screen locked? (stretch goal)

2. LOCATION:
   - Get current location
   - Fallback to last known
   - Share via SMS link
   - Show on map

3. NOTIFICATIONS:
   - Immediate SMS to emergency contact
   - SMS to support circle
   - Push if contacts have app

4. OFFLINE HANDLING:
   - Emergency calls work offline
   - Queue notifications
   - Show emergency numbers regardless

5. FALSE ALARM:
   - Easy cancellation
   - No penalty
   - Still notify contacts of cancellation

6. AFTER EMERGENCY:
   - Log event
   - Schedule follow-up
   - Provide resources
# ---------------------------------------------------------------------------------------------------------------------------------
# 13. AI/ML Pipeline Modules
# ---------------------------------------------------------------------------------------------------------------------------------
# 13.1 Risk Prediction Model
Attribute	Description
Block ID	ML-001
Name	Pregnancy Risk Prediction Model
Aim	Predict pregnancy complications based on historical data and current health status
Priority	P1 (High)
Model Specification:

Model Type: XGBoost Classifier

Input Features:
  Demographic:
    - age: int (15-50)
    - gravida: int (1-15)
    - parity: int (0-14)
    - bmi: float (optional)
  
  Medical History:
    - previous_preeclampsia: boolean
    - previous_pph: boolean
    - previous_cesarean: boolean
    - previous_stillbirth: boolean
    - chronic_hypertension: boolean
    - diabetes: boolean
    - hiv_positive: boolean
    - anemia: boolean
  
  Current Pregnancy:
    - gestational_age_weeks: int (4-42)
    - multiple_pregnancy: boolean
    - current_bp_systolic: float
    - current_bp_diastolic: float
    - weight_gain: float
    - symptom_count_last_7_days: int
    - red_triages_count: int
    - anc_visits_attended: int
    - anc_visits_expected: int

Output:
  risk_level: LOW | MEDIUM | HIGH
  risk_score: float (0-1)
  risk_factors: list[string]
  confidence: float (0-1)

Training Data:
  - Historical pregnancy outcomes
  - Minimum 10,000 records
  - Balanced classes via SMOTE

Evaluation Metrics:
  - Primary: AUC-ROC > 0.85
  - Secondary: Recall for HIGH risk > 0.90
  - Calibration: Brier score < 0.15

# Implementation Prompt:

Build pregnancy risk prediction model:

1. DATA PIPELINE:
   - Extract features from PostgreSQL
   - Handle missing values
   - Normalize numerical features
   - Encode categorical features
   - Train/validation/test split (70/15/15)

2. MODEL TRAINING:
   - XGBoost with hyperparameter tuning
   - Cross-validation (5-fold)
   - Handle class imbalance
   - Feature importance analysis

3. SERVING:
   - FastAPI endpoint
   - Input validation
   - < 100ms latency
   - Batch prediction support

4. MONITORING:
   - Track prediction distribution
   - Detect data drift
   - Log predictions for audit
   - Retrain triggers

5. EXPLAINABILITY:
   - SHAP values for feature importance
   - Human-readable risk factors
   - Confidence intervals
# ---------------------------------------------------------------------------------------------------------------------------------
# 13.2 Symptom NLP Model
Attribute	Description
Block ID	ML-002
Name	Symptom Text Classification Model
Aim	Extract structured symptom codes from free-text descriptions in multiple languages
Priority	P1 (High)
Model Specification:

Model Type: Fine-tuned Multilingual Transformer

Base Model: xlm-roberta-base or afro-xlmr

Languages Supported:
  - English
  - Zulu
  - Xhosa
  - Sotho
  - Luganda
  - Swahili

Input:
  - text: string (user's symptom description)
  - language: string (detected or provided)

Output:
  symptoms: list[
    {
      code: string (standardized code),
      confidence: float,
      span: {start: int, end: int}
    }
  ]
  severity_indicators: list[string]

Symptom Codes:
  - HEADACHE
  - BLEEDING_VAGINAL
  - SWELLING_FACE
  - SWELLING_LEGS
  - VISION_CHANGES
  - ABDOMINAL_PAIN
  - REDUCED_FETAL_MOVEMENT
  - NAUSEA_VOMITING
  - FEVER
  - ITCHING
  - ...

Training Data:
  - Annotated symptom descriptions
  - Multi-language corpus
  - Medical terminology mapping

# Implementation Prompt:

Build symptom NLP model:

1. DATA PREPARATION:
   - Collect symptom descriptions from users
   - Annotate with medical codes
   - Include local language variations
   - Handle code-switching (mixed languages)

2. MODEL TRAINING:
   - Fine-tune multilingual transformer
   - Multi-label classification
   - Named entity recognition for spans
   - Severity detection

3. PATTERN MATCHING FALLBACK:
   - Regex patterns for common phrases
   - Dictionary of local terms
   - Use when model confidence low

4. SERVING:
   - FastAPI endpoint
   - Language detection
   - < 200ms latency
   - Batch support

5. CONTINUOUS IMPROVEMENT:
   - Log predictions with feedback
   - Active learning for edge cases
   - Regular retraining with new data
# ---------------------------------------------------------------------------------------------------------------------------------
# 13.3 Content Recommendation Model
Attribute	Description
Block ID	ML-003
Name	Educational Content Recommendation Model
Aim	Recommend relevant educational content based on user profile and behavior
Priority	P2 (Medium)
Model Specification:

Model Type: Collaborative Filtering + Content-Based Hybrid

User Features:
  - gestational_age
  - risk_factors
  - viewed_content_ids
  - completed_content_ids
  - quiz_scores
  - symptom_history
  - language
  - engagement_level

Content Features:
  - category
  - gestational_week_range
  - difficulty_level
  - format (article/audio/video)
  - duration
  - topic_tags
  - completion_rate_global

Output:
  recommendations: list[
    {
      content_id: string,
      relevance_score: float,
      reason: string
    }
  ]
# Implementation Prompt:

Build content recommendation model:

1. RECOMMENDATION STRATEGIES:
   - Gestational age matching (primary)
   - Risk factor relevance
   - Collaborative filtering (similar users)
   - Content similarity
   - Completion prediction

2. RANKING:
   - Combine scores from strategies
   - Boost uncompleted important content
   - Diversity in recommendations
   - Recency factor

3. SERVING:
   - Precompute daily recommendations
   - Real-time re-ranking
   - A/B testing support

4. FEEDBACK LOOP:
   - Track clicks and completions
   - Implicit feedback signals
   - Periodic model updates
# ---------------------------------------------------------------------------------------------------------------------------------
# 14. Smart Contract Modules
# ---------------------------------------------------------------------------------------------------------------------------------
# 14.1 MomToken Contract
Attribute	Description
Block ID	CONTRACT-001
Name	MomToken ERC-20 Contract
Aim	Implement the utility token with controlled minting, burning, and transfer restrictions
Priority	P0 (Critical)
Contract Specification:

// See Section 3.2.1 for full implementation

Key Functions:
- mintForMilestone(address to, uint256 amount, string milestoneType, bytes32 milestoneHash)
- burnForRedemption(address from, uint256 amount, string redemptionType, bytes32 redemptionId)
- setRedemptionAddress(address partner, bool approved)
- setTransfersEnabled(bool enabled)

Access Control:
- MINTER_ROLE: Backend service only
- BURNER_ROLE: Backend service only
- DEFAULT_ADMIN_ROLE: Multi-sig admin

Events:
- TokensMinted(address indexed to, uint256 amount, string milestoneType, bytes32 milestoneHash)
- TokensBurned(address indexed from, uint256 amount, string redemptionType, bytes32 redemptionId)
# Implementation Prompt:

Build MomToken smart contract:

1. SECURITY:
   - OpenZeppelin base contracts
   - Reentrancy guards
   - Access control
   - Pausable in emergency

2. GAS OPTIMIZATION:
   - Efficient storage
   - Batch operations where possible
   - Minimize on-chain data

3. UPGRADABILITY:
   - Proxy pattern (optional)
   - Or immutable with migration plan

4. TESTING:
   - Unit tests for all functions
   - Integration tests with other contracts
   - Gas usage tests
   - Fuzzing

5. AUDIT:
   - External audit before mainnet
   - Bug bounty program
# ---------------------------------------------------------------------------------------------------------------------------------
# 14.2 MilestoneRegistry Contract
Attribute	Description
Block ID	CONTRACT-002
Name	Milestone Registry Contract
Aim	Store immutable proof of milestone completions on-chain
Priority	P0 (Critical)
Contract Specification:

// See Section 3.2.2 for full implementation

Key Functions:
- recordMilestone(address user, bytes32 milestoneHash, string milestoneType, string country)
- revokeMilestone(address user, bytes32 milestoneHash, string reason)
- getUserMilestones(address user)
- verifyMilestone(address user, bytes32 milestoneHash)

Data Structures:
- MilestoneRecord struct
- User -> MilestoneRecord[] mapping
- milestoneHash -> exists mapping

Events:
- MilestoneRecorded(...)
- MilestoneRevoked(...)
# Implementation Prompt:

Build MilestoneRegistry contract:

1. DATA INTEGRITY:
   - Prevent duplicate milestones
   - Immutable records (except revocation)
   - Hash verification

2. PRIVACY:
   - Only hashes on-chain
   - No PII ever
   - Country for aggregate stats only

3. GAS EFFICIENCY:
   - Optimize storage patterns
   - Batch recording (future)

4. QUERYABILITY:
   - Efficient lookups
   - Event indexing for off-chain queries
# ---------------------------------------------------------------------------------------------------------------------------------
# 14.3 Paymaster Contract
Attribute	Description
Block ID	CONTRACT-003
Name	Momentum Paymaster Contract
Aim	Sponsor gas fees for all user transactions (ERC-4337)
Priority	P0 (Critical)
Contract Specification:

// See Section 3.2.3 for full implementation

Key Functions:
- _validatePaymasterUserOp(UserOperation calldata, bytes32, uint256)
- _postOp(PostOpMode, bytes calldata, uint256)
- setAllowedTarget(address, bool)
- setDailyGasLimit(uint256)
- withdrawTo(address payable, uint256)

Configuration:
- Allowed target contracts (MomToken, MilestoneRegistry)
- Daily gas limit per user
- Total gas budget

Monitoring:
- totalGasSponsored counter
- userDailyGasUsed mapping
# Implementation Prompt:

Build Paymaster contract:

1. SECURITY:
   - Whitelist allowed contracts
   - Per-user gas limits
   - Total budget limits
   - Admin controls

2. GAS MANAGEMENT:
   - Track usage per user
   - Daily reset
   - Prevent abuse

3. FUNDING:
   - Monitor balance
   - Alert on low balance
   - Auto-refill mechanism

4. INTEGRATION:
   - Compatible with ERC-4337 bundlers
   - Pimlico, Stackup, etc.
   - Entry point compatibility
