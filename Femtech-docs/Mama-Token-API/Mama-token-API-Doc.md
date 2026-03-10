# MamaTokens API Documentation

**Base URL:** `https://api.mamatokens.com`  
**Version:** 2.0  
**Last Updated:** 2026-03-06

---

## Table of Contents

1. [Authentication](#authentication)
2. [Wallet Management](#wallet-management)
3. [User Profile](#user-profile)
4. [Pregnancies](#pregnancies)
5. [Milestones & Token Minting](#milestones--token-minting)
6. [Medical History](#medical-history)
7. [Appointments](#appointments)
8. [Kick Sessions](#kick-sessions)
9. [Emergency Contacts](#emergency-contacts)
10. [Partners & Products](#partners--products)
11. [Redemptions](#redemptions)
12. [Facilities](#facilities)
13. [Articles & Quizzes](#articles--quizzes)
14. [Notifications](#notifications)
15. [Digital Doula](#digital-doula)
16. [Admin Endpoints](#admin-endpoints)
17. [Roles: super_admin, admin, viewer]
18. [AI Agent] (MamaAI)
19. [Risk Assessment]
20. [Recommendations]


---

## Authentication

### Request OTP
# POST /api/v1/auth/otp/request 
Content-Type: application/json

{ "phone": "+27821234567", "country": "ZA" }

Response:
{
  "message": "OTP sent successfully",
  "debug_otp": "123456"
}

### Verify OTP & Login
# POST /api/v1/auth/otp/verify
Content-Type: application/json

{
  "phone": "+27821234567",
  "otp": "123456"
}

Response:

{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "isNewUser": false,
  "user": {
    "id": "a1000000-0000-4000-8000-000000000001",
    "phone": "+27821234567",
    "country": "ZA",
    "role": "mother",
    "status": "active"
  }
}

### Get Current User
# GET /api/v1/auth/me
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "data": {
    "id": "a1000000-0000-4000-8000-000000000001",
    "phone": "+27821234567",
    "country": "ZA",
    "role": "mother",
    "status": "active",
    "walletAddress": "GDY7M6SFBNRRP4C57IVK2MLVWWNC4MVEGUN7GJMUYYNFNSWTAP2FNMYR",
    "pregnancies": [...],
    "milestones": [...]
  }
}

## Wallet Endpoints
### Create Wallet

Creates a new Stellar wallet for the user, funds it on testnet, and sets up MAMA token trustline.

# POST /api/v1/wallet/create
Authorization: Bearer {JWT_TOKEN}
Success Response (200):

{
  "success": true,
  "walletAddress": "GDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "secretKey": "SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "message": "Wallet created successfully. SAVE YOUR SECRET KEY - it cannot be recovered!",
  "stellarExpert": "https://stellar.expert/explorer/testnet/account/GDXX..."
}
Error Response (400):

{
  "error": "User already has a wallet",
  "walletAddress": "GDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
⚠️ IMPORTANT: Display a prominent warning to users to save their secret key. It cannot be recovered!

### Wallet Import (add after Create Wallet)

# POST /api/v1/wallet/import
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "secretKey": "SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
Success Response (200):

{
  "success": true,
  "publicKey": "GDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "message": "Wallet imported successfully"
}
Error Responses:

Status	Error	Cause
400	Invalid secret key format	Key doesn't start with 'S' or wrong length
400	User already has a wallet	Wallet already exists
400	Wallet address already in use	Another user owns this wallet

### Get Wallet Balance

# GET /api/v1/wallet/balance
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "walletAddress": "GDY7M6SFBNRRP4C57IVK2MLVWWNC4MVEGUN7GJMUYYNFNSWTAP2FNMYR",
  "balances": [
    { "asset": "XLM", "balance": "9999.9999900", "issuer": null },
    { "asset": "MAMA", "balance": "20.0000000", "issuer": "GA5CGTJ6X4HZVQB6PEZNFRVU2V3KRLXVALV7QGXYT6XAIUNGNSM6FZ6V" }
  ],
  "mamaBalance": "20.0000000",
  "stellarExpert": "https://stellar.expert/explorer/testnet/account/GDY7M6..."
}
Error Response (400):

{
  "error": "User has no wallet"
}

### Get Wallet Transactions

# GET /api/v1/wallet/transactions
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "walletAddress": "GDY7M6SFBNRRP4C57IVK2MLVWWNC4MVEGUN7GJMUYYNFNSWTAP2FNMYR",
  "transactions": [
    {
      "id": "123456789",
      "hash": "feaace09b5f6a1867ec6804f49d58db35e7fc633604995fd5cc8275b091ec122",
      "createdAt": "2026-03-05T18:30:00Z",
      "memo": "Milestone: PROFILE_COMPLETE",
      "stellarExpert": "https://stellar.expert/explorer/testnet/tx/feaace09..."
    }
  ],
  "count": 1
}

## User Profile

### Get Profile

# GET /api/v1/profile
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "firstName": "Jane",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "avatarUrl": "https://..."
  }
}
Update Profile
PUT /api/v1/profile
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15"
}

### Delete Profile (Permanent)

# DELETE /api/v1/profile
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "success": true,
  "message": "Profile and all data permanently deleted"
}

⚠️ **WARNING:** This permanently deletes ALL user data including:
- User profile
- Wallet and token balance
- All pregnancies
- Milestones and rewards
- Appointments
- Medical history
- Quiz attempts
- Vouchers and redemptions
- Notifications
- Emergency contacts

This action **cannot be undone**.

## Pregnancies

### List User's Pregnancies

# GET /api/v1/my/pregnancies
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "data": [
    {
      "id": "uuid",
      "status": "active",
      "last_period_date": "2025-12-01",
      "estimated_due_date": "2026-09-07",
      "gravida": 1,
      "parity": 0,
      "isHighRisk": false,
      "bloodType": "O_positive",
      "milestones": [...],
      "appointments": [...],
      "kickSessions": [...]
    }
  ],
  "count": 1
}

### Get Single Pregnancy

# GET /api/v1/my/pregnancies/:id
Authorization: Bearer {JWT_TOKEN}
Create Pregnancy

# POST /api/v1/my/pregnancies
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "lastPeriodDate": "2025-12-01",
  "estimatedDueDate": "2026-09-07",
  "gravida": 1,
  "parity": 0,
  "bloodType": "O_positive"
}

### Update Pregnancy

# PUT /api/v1/my/pregnancies/:id
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "status": "active",
  "isHighRisk": true,
  "riskFactors": ["hypertension", "diabetes"]
}

### Milestones & Token Minting

Get All Milestone Definitions (Public)

# GET /api/v1/milestones

# GET /api/v1/milestones?category=clinical&country=ZA
Query Parameters:

category (optional): clinical, wellness, education, community
country (optional): ZA, KE, UG
Response:

{
  "data": [
    {
      "id": "uuid",
      "code": "FIRST_ANC_VISIT",
      "name": "First ANC Visit",
      "description": "Complete your first antenatal care visit",
      "category": "clinical",
      "rewardAmount": 100,
      "requiresVerification": true
    }
  ],
  "count": 22
}

### Get User's Milestones

# GET /api/v1/milestones/my
Authorization: Bearer {JWT_TOKEN}
Response:
{
  "milestones": [
    {
      "id": "uuid",
      "milestoneDefinitionId": "uuid",
      "status": "IN_PROGRESS",
      "progressData": {},
      "startedAt": "2026-03-09T10:00:00.000Z",
      "milestoneDefinition": {
        "id": "uuid",
        "name": "First Antenatal Visit",
        "description": "Complete your first clinic visit",
        "rewardAmount": 50,
        "category": "antenatal"
      }
    }
  ]
}

## Milestone Statuses:

Status	Description
available	Can be started
in_progress	Currently working on
pending_verification	Awaiting verification
completed	Done, ready to mint
expired	Time limit exceeded

### Start a Milestone

# POST /api/v1/my/milestones
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "milestoneDefId": "uuid",
  "pregnancyId": "uuid"
}
Update Milestone Progress
PUT /api/v1/my/milestones/:id
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "progress": 50,
  "status": "in_progress",
  "progressData": { "daysCompleted": 3 }
}

### Mint Tokens for Milestone

# POST /api/v1/milestones/mint
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  Body: { "milestoneId": "uuid" }
}
Success Response (200):

{
  "success": true,
  "tokensAwarded": 20,
  "transactionHash": "feaace09b5f6a1867ec6804f49d58db35e7fc633604995fd5cc8275b091ec122",
}
Error Responses:

Status	Error	Cause
400	User has no wallet address	Call /api/v1/wallet/create first
400	Milestone not completed	Status must be "completed"
400	Reward already minted	Milestone already claimed
404	Milestone not found	Invalid ID or not owned by user

## Medical History

### List Medical History

# GET /api/v1/my/medical-history
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "data": [
    {
      "id": "uuid",
      "conditionType": "chronic",
      "condition_code": "E11",
      "description": "Type 2 Diabetes",
      "severity": "moderate",
      "diagnosedDate": "2024-06-15"
    }
  ],
  "count": 1
}

### Add Medical Record

# POST /api/v1/my/medical-history
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "pregnancyId": "uuid",
  "conditionType": "chronic",
  "conditionCode": "E11",
  "description": "Type 2 Diabetes",
  "severity": "moderate",
  "diagnosedDate": "2024-06-15"
}
Condition Types: chronic, pregnancy_related, allergy, medication, surgical

## Appointments

### List Appointments

# GET /api/v1/my/appointments

# GET /api/v1/my/appointments?status=scheduled&upcoming=true
Authorization: Bearer {JWT_TOKEN}
Query Parameters:

status (optional): scheduled, completed, cancelled, no_show
upcoming (optional): true/false
Response:

{
  "data": [
    {
      "id": "uuid",
      "appointment_type": "anc_visit",
      "status": "scheduled",
      "scheduled_at": "2026-03-15T10:00:00Z",
      "duration_minutes": 30,
      "notes": "First trimester checkup",
      "facility": {
        "id": "uuid",
        "name": "City Hospital"
      },
      "pregnancy": {...}
    }
  ],
  "count": 2
}

### Create Appointment

# POST /api/v1/my/appointments
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "pregnancyId": "uuid",
  "facilityId": "uuid",
  "appointmentType": "anc_visit",
  "scheduledAt": "2026-03-15T10:00:00Z",
  "notes": "First trimester checkup"
}
Appointment Types: anc_visit, ultrasound, lab_test, vaccination, postnatal, emergency

### Update Appointment

# PUT /api/v1/my/appointments/:id
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "status": "completed",
  "notes": "All tests normal"
}

## Kick Sessions (Baby Movement Tracking)

### List Kick Sessions

# GET /api/v1/my/kick-sessions

# GET /api/v1/my/kick-sessions?pregnancyId=uuid
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "data": [
    {
      "id": "uuid",
      "pregnancyId": "uuid",
      "start_time": "2026-03-06T14:00:00Z",
      "end_time": "2026-03-06T14:30:00Z",
      "kick_count": 12,
      "notes": "Baby very active after lunch"
    }
  ],
  "count": 5
}

### Create Kick Session

# POST /api/v1/my/kick-sessions
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "pregnancyId": "uuid",
  "startTime": "2026-03-06T14:00:00Z"
}
Update Kick Session
PUT /api/v1/my/kick-sessions/:id
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "endTime": "2026-03-06T14:30:00Z",
  "kickCount": 12,
  "notes": "Baby very active after lunch"
}

## Emergency Contacts

### List Emergency Contacts

# GET /api/v1/my/emergency-contacts
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "relationship": "spouse",
      "phone": "+27821234567",
      "priority": 1,
      "is_active": true
    }
  ],
  "count": 2
}

### Add Emergency Contact

# POST /api/v1/my/emergency-contacts
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "name": "John Doe",
  "relationship": "spouse",
  "phone": "+27821234567",
  "priority": 1
}

### Update Emergency Contact

# PUT /api/v1/my/emergency-contacts/:id
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "phone": "+27829876543",
  "priority": 2
}
Delete Emergency Contact
DELETE /api/v1/my/emergency-contacts/:id
Authorization: Bearer {JWT_TOKEN}

## Partners & Products

### List Partners (Public)

# GET /api/v1/partners

# GET /api/v1/partners?country=ZA&type=mobile_money
Query Parameters:

country (optional): ZA, KE, UG
type (optional): mobile_money, pharmacy, retail, healthcare
Response:

{
  "data": [
    {
      "id": "uuid",
      "name": "MTN MoMo ZA",
      "type": "mobile_money",
      "country": "ZA",
      "logoUrl": "https://...",
      "products": [
        {
          "id": "uuid",
          "name": "R10 Airtime",
          "tokenCost": 50,
          "is_available": true
        }
      ]
    }
  ],
  "count": 16
}

### Get Partner Details

# GET /api/v1/partners/:id

### List Products (Public)

# GET /api/v1/products

# GET /api/v1/products?category=airtime&partnerId=uuid
Query Parameters:

category (optional): airtime, data, voucher, health_product
partnerId (optional): Filter by partner

## Redemptions

### List User's Redemptions

# GET /api/v1/my/redemptions
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "data": [
    {
      "id": "uuid",
      "totalTokens": 100,
      "status": "completed",
      "recipient_phone": "+27821234567",
      "createdAt": "2026-03-05T12:00:00Z",
      "partners": {
        "name": "MTN MoMo ZA",
        "type": "mobile_money"
      },
      "items": [
        {
          "quantity": 2,
          "tokenCost": 50,
          "product": {
            "name": "R10 Airtime"
          }
        }
      ]
    }
  ],
  "count": 1
}
Redemption Statuses: pending, processing, completed, failed, cancelled

### Create Redemption

# POST /api/v1/my/redemptions
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "partnerId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "recipientPhone": "+27821234567",
  "recipientName": "Jane Doe"
}

## Token Transactions

### List Token Transactions

# GET /api/v1/my/transactions
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "data": [
    {
      "id": "uuid",
      "type": "mint",
      "amount": 100,
      "txHash": "feaace09b5f6a1867...",
      "milestoneId": "uuid",
      "createdAt": "2026-03-05T15:00:00Z"
    }
  ],
  "count": 5
}
Transaction Types: mint, redeem, transfer, bonus

## Facilities

### List Facilities (Public)

# GET /api/v1/facilities

# GET /api/v1/facilities?country=ZA&type=hospital
Query Parameters:

country (optional): ZA, KE, UG
type (optional): hospital, clinic, pharmacy, lab
Response:

{
  "data": [
    {
      "id": "uuid",
      "name": "City Hospital",
      "type": "hospital",
      "country": "ZA",
      "address": "123 Main Street",
      "phone": "+27111234567",
      "isActive": true
    }
  ],
  "count": 10
}

### Get Facility Details

# GET /api/v1/facilities/:id

## Articles & Quizzes

### List Articles (Public)

# GET /api/v1/articles

# GET /api/v1/articles?category=pregnancy&language=en

### Get Article

# GET /api/v1/articles/:id

### List Quizzes (Public)

# GET /api/v1/quizzes

# GET /api/v1/quizzes?category=nutrition
Response:

{
  "data": [
    {
      "id": "uuid",
      "title": "Nutrition Basics Quiz",
      "description": "Test your knowledge",
      "category": "nutrition",
      "difficulty": "beginner",
      "time_limit_mins": 10,
      "pass_threshold": 70,
      "reward_amount": 25,
      "_count": { "questions": 10 }
    }
  ],
  "count": 5
}

### Get Quiz with Questions

# GET /api/v1/quizzes/:id
Authorization: Bearer {JWT_TOKEN}

### Submit Quiz Attempt

# POST /api/v1/quizzes/:id/attempt
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "answers": [
    { "questionId": "uuid", "selectedOption": 2 },
    { "questionId": "uuid", "selectedOption": 1 }
  ]
}

### Get User's Quiz Attempts

# GET /api/v1/my/quiz-attempts
Authorization: Bearer {JWT_TOKEN}

## Notifications

### List Notifications

# GET /api/v1/my/notifications

# GET /api/v1/my/notifications?unreadOnly=true
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "data": [
    {
      "id": "uuid",
      "type": "milestone_complete",
      "title": "Milestone Completed!",
      "message": "You completed the First ANC Visit milestone",
      "isRead": false,
      "createdAt": "2026-03-05T12:00:00Z"
    }
  ],
  "count": 5,
  "unreadCount": 2
}
Mark Notification as Read
PUT /api/v1/my/notifications/:id/read
Authorization: Bearer {JWT_TOKEN}

## Consents

### List User's Consents

# GET /api/v1/my/consents
Authorization: Bearer {JWT_TOKEN}
Consent Types: terms_of_service, privacy_policy, data_processing, marketing, research

Update Consent
PUT /api/v1/my/consents/:type
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "accepted": true
}

## Digital Doula

### Get Assigned Doula

# GET /api/v1/my/doula
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "data": {
    "id": "uuid",
    "display_name": "Sarah",
    "bio": "Certified doula with 5 years experience",
    "avatarUrl": "https://...",
    "specializations": ["prenatal", "postnatal"],
    "languages": ["en", "zu"],
    "rating": 4.8
  }
}

## Onboarding Endpoints

### Step 1: Create/Update Profile

# POST /api/v1/onboarding/profile
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15"
}

### Step 2: Add Pregnancy Info

# POST /api/v1/onboarding/pregnancy
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "lastPeriodDate": "2025-12-01",
  "estimatedDueDate": "2026-09-07",
  "isFirstPregnancy": true,
  "bloodType": "O_positive"
}

### Step 3: Add Emergency Contact

# POST /api/v1/onboarding/emergency-contact
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "name": "John Doe",
  "relationship": "spouse",
  "phone": "+27821234567"
}

### Step 4: Accept Consents

# POST /api/v1/onboarding/consents
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "consents": [
    { "type": "terms_of_service", "accepted": true },
    { "type": "privacy_policy", "accepted": true },
    { "type": "data_processing", "accepted": true }
  ]
}

### Step 5: Complete Onboarding & Create Wallet

# POST /api/v1/onboarding/complete
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "success": true,
  "message": "Onboarding complete",
  "wallet": {
    "address": "GDXXXXX...",
    "secretKey": "SXXXXX..."
  },
  "initialMilestones": [...]
}

## Admin Endpoints

### List All Users (Admin)

# GET /api/v1/admin/users

# GET /api/v1/admin/users?country=ZA&status=active
Authorization: Bearer {ADMIN_JWT_TOKEN}
Get User Details (Admin)

# GET /api/v1/admin/users/:id
Authorization: Bearer {ADMIN_JWT_TOKEN}
Update User (Admin)
PUT /api/v1/admin/users/:id
Authorization: Bearer {ADMIN_JWT_TOKEN}
Content-Type: application/json

{
  "status": "suspended",
  "role": "mother"
}

### Dashboard Stats (Admin)

# GET /api/v1/admin/stats
Authorization: Bearer {ADMIN_JWT_TOKEN}
Response:

{
  "users": 16,
  "pregnancies": 8,
  "milestones": 150,
  "partners": 16,
  "redemptions": 25
}

### Admin Login (add to Admin Endpoints section)

# POST /api/v1/admin/login
Content-Type: application/json

{
  "email": "admin@mamatokens.com",
  "password": "MamaAdmin2026!"
}
Response:

{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@mamatokens.com",
    "name": "Super Admin",
    "role": "super_admin"
  }
}

### Admin Get Profile

# GET /api/v1/admin/me
Authorization: Bearer {ADMIN_JWT_TOKEN}
Response:

{
  "id": "uuid",
  "email": "admin@mamatokens.com",
  "name": "Super Admin",
  "role": "super_admin",
  "isActive": true,
  "lastLoginAt": "2026-03-08T10:00:00Z"
}

### Admin List Admins (super_admin only)

# GET /api/v1/admin/admins
Authorization: Bearer {ADMIN_JWT_TOKEN}
Response:

[
  {
    "id": "uuid",
    "email": "admin@mamatokens.com",
    "name": "Super Admin",
    "role": "super_admin",
    "isActive": true,
    "lastLoginAt": "2026-03-08T10:00:00Z",
    "createdAt": "2026-03-08T09:00:00Z"
  }
]

### Admin Create Admin (super_admin only)

# POST /api/v1/admin/admins
Authorization: Bearer {ADMIN_JWT_TOKEN}
Content-Type: application/json

{
  "email": "newadmin@mamatokens.com",
  "password": "SecurePassword123!",
  "name": "New Admin",
  "role": "admin"
}
Response:

{
  "id": "uuid",
  "email": "newadmin@mamatokens.com",
  "name": "New Admin",
  "role": "admin",
  "isActive": true
}

## Roles: super_admin, admin, viewer

### Admin Update Admin (super_admin only)

# PUT /api/v1/admin/admins/:id
Authorization: Bearer {ADMIN_JWT_TOKEN}
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "viewer",
  "isActive": false,
  "password": "NewPassword123!"
}

### Admin Delete Admin (super_admin only)

# DELETE /api/v1/admin/admins/:id
Authorization: Bearer {ADMIN_JWT_TOKEN}

### Admin Get Transactions

# GET /api/v1/admin/transactions?page=1&limit=20
Authorization: Bearer {ADMIN_JWT_TOKEN}
Response:

{
  "transactions": [
    {
      "id": "uuid",
      "type": "mint_milestone",
      "amount": 100,
      "status": "confirmed",
      "txHash": "feaace09b5f6a1867...",
      "user": {
        "phone": "+27821234567"
      },
      "createdAt": "2026-03-08T10:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}

### Admin Get Redemptions
# GET /api/v1/admin/redemptions?page=1&limit=20
Authorization: Bearer {ADMIN_JWT_TOKEN}
Response:

{
  "redemptions": [
    {
      "id": "uuid",
      "totalTokens": 50,
      "status": "completed",
      "user": {
        "phone": "+27821234567"
      },
      "partners": {
        "name": "MTN MoMo ZA"
      },
      "createdAt": "2026-03-08T10:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 20
}

### Admin Get Milestones

# GET /api/v1/admin/milestones
Authorization: Bearer {ADMIN_JWT_TOKEN}
Response:

[
  {
    "id": "uuid",
    "code": "FIRST_ANC_VISIT",
    "name": "First ANC Visit",
    "category": "clinical",
    "rewardAmount": 100,
    "completions": 45
  }
]

### Admin Get Activity

# GET /api/v1/admin/activity?limit=10
Authorization: Bearer {ADMIN_JWT_TOKEN}
Response:

[
  {
    "type": "new_user",
    "description": "New user registered",
    "phone": "+27821234567",
    "createdAt": "2026-03-08T10:00:00Z"
  },
  {
    "type": "transaction",
    "description": "Mint milestone 100 MAMA",
    "phone": "+27821234567",
    "createdAt": "2026-03-08T09:30:00Z"
  }
]

### Health Check

# GET /health
Response:

{
  "status": "healthy",
  "database": "connected",
  "users": 16,
  "timestamp": "2026-03-06T08:00:00.000Z"
}

## AI Agent (MamaAI)

### Chat with MamaAI

# POST /api/v1/ai/chat
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "message": "How do I earn MAMA tokens?",
  "conversationId": "optional-conversation-id"
}

Response:
{
  "message": "You can earn MAMA tokens by:\n\n1. Completing educational quizzes\n2. Achieving pregnancy milestones\n3. Attending antenatal appointments\n\nGo to the Quiz section to start earning! 💜",
  "conversationId": "user-id:default"
}

**Features:**
- Context-aware responses based on user's pregnancy stage, milestones, and token balance
- Multi-language support (English, Zulu, Xhosa, Sotho, Swahili)
- Emergency symptom detection with immediate care recommendations
- Conversation history maintained per session

---

### Get Suggested Prompts

# GET /api/v1/ai/suggestions
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "suggestions": [
    "What should I expect at 24 weeks?",
    "How do I earn MAMA tokens?",
    "What are pregnancy warning signs?",
    "How do I redeem my vouchers?",
    "What should I eat during pregnancy?",
    "How do I count baby kicks?"
  ]
}

**Note:** Suggestions are personalized based on gestational age and user activity.

### Clear Conversation

# DELETE /api/v1/ai/chat/:conversationId
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "success": true
}

## Risk Assessment

### Get Risk Assessment

# GET /api/v1/risk/assessment
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "score": 0.25,
  "level": "LOW",
  "factors": ["First pregnancy"],
  "assessedAt": "2026-03-09T14:00:00.000Z"
}

**Risk Levels:**
| Level | Score Range | Description |
|-------|-------------|-------------|
| LOW | < 0.3 | No significant risk factors |
| MEDIUM | 0.3 - 0.6 | Some factors require monitoring |
| HIGH | > 0.6 | Close monitoring recommended |

---

### Get Detailed Risk Analysis (AI-Powered)

# GET /api/v1/risk/analysis
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "riskLevel": "LOW",
  "riskScore": 0.25,
  "riskFactors": ["First pregnancy"],
  "gestationalWeeks": 24,
  "summary": "Your pregnancy is progressing well with no major concerns identified. Continue your regular antenatal visits and healthy habits.",
  "recommendations": [
    "Attend all scheduled antenatal appointments",
    "Take your prenatal vitamins daily",
    "Stay hydrated and eat nutritious foods",
    "Get adequate rest and manage stress",
    "Report any unusual symptoms immediately"
  ],
  "warningSignsToWatch": [
    "Severe headache or vision changes",
    "Heavy vaginal bleeding",
    "Severe abdominal pain",
    "Reduced baby movement",
    "High fever"
  ],
  "nextSteps": [
    "Schedule your next antenatal visit",
    "Review your birth plan with your healthcare provider"
  ],
  "assessedAt": "2026-03-09T14:00:00.000Z"
}

**Risk Factors Evaluated:**

| Factor | Weight | Description |
|--------|--------|-------------|
| age_under_18 | 2.0 | Mother under 18 years |
| age_over_35 | 1.5 | Mother over 35 years |
| first_pregnancy | 0.5 | First-time mother |
| multiple_pregnancy | 2.5 | Twins/triplets |
| previous_preeclampsia | 3.0 | History of preeclampsia |
| previous_cesarean | 1.5 | Previous C-section |
| previous_stillbirth | 3.0 | History of stillbirth |
| chronic_hypertension | 2.5 | Chronic high blood pressure |
| diabetes | 2.0 | Diabetes (any type) |
| hiv_positive | 2.0 | HIV positive status |
| anemia | 1.5 | Anemia diagnosis |
| missed_appointments | 1.0 | 2+ missed antenatal visits |

## Recommendations

### Get Personalized Content Recommendations

# GET /api/v1/recommendations/content
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "gestationalWeeks": 24,
  "quizzes": [
    {
      "id": "uuid",
      "title": "Second Trimester Nutrition",
      "relevanceScore": 45,
      "rewardAmount": 5
    }
  ],
  "updatedAt": "2026-03-09T14:00:00.000Z"
}

**Note:** Content is ranked by relevance based on:
- Gestational age
- Risk factors
- Completed quizzes
- User activity patterns

## Frontend Flow Diagrams

### New User Flow

┌─────────────────┐
│  User Signs Up  │
│  (OTP Login)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  No Wallet?     │──── Yes ────┐
└────────┬────────┘             │
         │ No                   ▼
         │            ┌─────────────────┐
         │            │ # POST /wallet/   │
         │            │    create       │
         │            └────────┬────────┘
         │                     │
         │◄────────────────────┘
         ▼
┌─────────────────┐
│  Show Wallet    │
│  Balance        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Complete       │
│  Milestones     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Claim Rewards  │
│  (# POST /mint)   │
└─────────────────┘

### Minting Flow

┌─────────────────────────────────────────────────────────┐
│                    MILESTONES SCREEN                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ✅ Complete Profile           20 MAMA           │   │
│  │    Status: Completed                            │   │
│  │    [CLAIM REWARD]  ← enabled if !reward_minted  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ✅ First ANC Visit           100 MAMA           │   │
│  │    Status: Completed                            │   │
│  │    [CLAIMED ✓]  ← reward_minted = true          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔄 Nutrition Quiz             25 MAMA           │   │
│  │    Status: In Progress (60%)                    │   │
│  │    [CONTINUE]  ← status != completed            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘

## Complete Endpoint Summary

### Public Endpoints (No Auth)

# Method	Endpoint	                Description
# GET	    /health	                  Health check
# GET	    /api/v1/milestones	      List milestone definitions
# GET	    /api/v1/partners	        List partners
# GET	    /api/v1/products	        List products
# GET	    /api/v1/facilities	      List facilities
# GET	    /api/v1/facilities/:id  	Get facility details
# GET	    /api/v1/articles	        List articles
# GET	    /api/v1/articles/:id	    Get article
# GET	    /api/v1/quizzes	          List quizzes
# POST	  /api/v1/auth/request-otp	Request OTP
# POST	  /api/v1/auth/verify-otp	  Verify OTP & login

### Protected Endpoints (Auth Required)

# Method	Endpoint	Description
# GET	    /api/v1/auth/me	Get current user
# GET	    /api/v1/profile	Get user profile
# PUT	    /api/v1/profile	Update profile
# GET	    /api/v1/my/pregnancies	List pregnancies
# GET	    /api/v1/my/pregnancies/:id	Get pregnancy
# POST	  /api/v1/my/pregnancies	Create pregnancy
# PUT	    /api/v1/my/pregnancies/:id	Update pregnancy
# GET	    /api/v1/milestones/my	List user milestones
# POST	  /api/v1/my/milestones	Start milestone
# PUT	    /api/v1/my/milestones/:id	Update milestone
# POST	  /api/v1/milestones/mint	Mint tokens
# GET	    /api/v1/my/medical-history	List medical history
# POST	  /api/v1/my/medical-history	Add medical record
# GET	    /api/v1/my/appointments	List appointments
# POST	  /api/v1/my/appointments	Create appointment
# PUT	    /api/v1/my/appointments/:id	Update appointment
# GET	    /api/v1/my/kick-sessions	List kick sessions
# POST	  /api/v1/my/kick-sessions	Create kick session
# PUT	    /api/v1/my/kick-sessions/:id	Update kick session
# GET	    /api/v1/my/emergency-contacts	List emergency contacts
# POST	  /api/v1/my/emergency-contacts	Add emergency contact
# PUT	    /api/v1/my/emergency-contacts/:id	Update emergency contact
# DELETE	/api/v1/my/emergency-contacts/:id	Delete emergency contact
# GET	    /api/v1/my/redemptions	List redemptions
# POST	  /api/v1/my/redemptions	Create redemption
# GET	    /api/v1/my/transactions	List token transactions
# GET	    /api/v1/my/notifications	List notifications
# PUT	    /api/v1/my/notifications/:id/read	Mark as read
# GET	    /api/v1/my/consents	List consents
# PUT	    /api/v1/my/consents/:type	Update consent
# GET	    /api/v1/my/doula	Get assigned doula
# POST	  /api/v1/wallet/create	Create wallet
# POST    /api/v1/wallet/import Import an existing Wallet
# GET	    /api/v1/wallet/balance	Get wallet balance
# GET	    /api/v1/wallet/transactions	Get wallet transactions
# GET	    /api/v1/quizzes/:id	Get quiz with questions
# POST	  /api/v1/quizzes/:id/attempt	Submit quiz attempt
# GET	    /api/v1/my/quiz-attempts	List quiz attempts

### Onboarding Endpoints

# Method	Endpoint	Description
# POST	  /api/v1/onboarding/profile	Step 1: Profile
# POST	  /api/v1/onboarding/pregnancy	Step 2: Pregnancy
# POST	  /api/v1/onboarding/emergency-contact	Step 3: Emergency contact
# POST	  /api/v1/onboarding/consents	Step 4: Consents
# POST	  /api/v1/onboarding/complete	Step 5: Complete & create wallet

### Admin Endpoints

# Method	Endpoint	Description
# POST	  /api/v1/admin/login	Admin login
# GET	    /api/v1/admin/me	Get admin profile
# GET	    /api/v1/admin/stats	Dashboard statistics
# GET	    /api/v1/admin/users	List users (paginated)
# GET	    /api/v1/admin/users/:id	Get user details
# PUT	    /api/v1/admin/users/:id	Update user
# GET	    /api/v1/admin/transactions	List transactions
# GET	    /api/v1/admin/redemptions	List redemptions
# GET	    /api/v1/admin/milestones	List milestones with stats
# GET	    /api/v1/admin/activity	Recent activity feed
# GET	    /api/v1/admin/admins	List admins (super_admin)
# POST	  /api/v1/admin/admins	Create admin (super_admin)
# PUT	    /api/v1/admin/admins/:id	Update admin (super_admin)S
# DELETE	/api/v1/admin/admins/:id	Delete admin (super_admin)

### AI & Risk Endpoints (Auth Required)

# POST    /api/v1/ai/chat | Chat with MamaAI |
# GET     /api/v1/ai/suggestions | Get suggested prompts |
# DELETE  /api/v1/ai/chat/:conversationId | Clear conversation |
# GET     /api/v1/risk/assessment | Get risk assessment |
# GET     /api/v1/risk/analysis | Get detailed AI-powered risk analysis |
# GET     /api/v1/recommendations/content | Get personalized content recommendations |
# DELETE  /api/v1/profile | Delete profile permanently |
# POST    /api/v1/ai/chat | Chat with MamaAI |
# GET     /api/v1/ai/suggestions | Get AI suggestions |
# DELETE  /api/v1/ai/chat/:id | Clear AI conversation |
# GET     /api/v1/risk/assessment | Get risk score |
# GET     /api/v1/risk/analysis | Get AI risk analysis |
# GET     /api/v1/recommendations/content | Get recommendations |

## Token Details

Property	      Value
Asset Code	    MAMA
Network	Stellar Testnet
Issuer	        GA5CGTJ6X4HZVQB6PEZNFRVU2V3KRLXVALV7QGXYT6XAIUNGNSM6FZ6V
Distributor	    GDHV6FMZYGJOUNSTEFPNLV3KXP6MEOULBHOMYMHBPE6BOJB3BEEGDPLM
Total Supply	  10,000,000 MAMA
Explorer	      View on Stellar Expert

## Error Codes

Status	  Meaning
200	      Success
201	      Created
400	      Bad Request (validation error)
401	      Unauthorized (missing/invalid token)
403	      Forbidden (insufficient permissions)
404	      Not Found
500	      Server Error
Rate      Limits

Endpoint    Type	          Limit
            Authentication	5 requests/minute
            Mint	          10 requests/minute
            General API	    100 requests/minute

## Support

GitHub: https://github.com/SM-Web-Systems/Femtech-Africa
Stellar Explorer: https://stellar.expert/explorer/testnet/asset/MAMA-GA5CGTJ6X4HZVQB6PEZNFRVU2V3KRLXVALV7QGXYT6XAIUNGNSM6FZ6V

**Version:** 2.1  
**Last Updated:** 2026-03-09

### Changelog v2.1:
- Added DELETE /profile endpoint for GDPR-compliant account deletion
- Added AI Agent (MamaAI) chat endpoints
- Added Risk Assessment endpoints with AI-powered analysis
- Added Content Recommendations endpoint