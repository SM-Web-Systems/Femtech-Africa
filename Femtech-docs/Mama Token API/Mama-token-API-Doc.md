# MAMATOKENS API Documentation

Base URL
https://api.mamatokens.com
Authentication
Request OTP

# POST /api/v1/auth/request-otp
Content-Type: application/json

{
  "phone": "+27821234567",
  "country": "ZA"
}
Response:

{
  "message": "OTP sent successfully",
  "debug_otp": "123456"
}

# Verify OTP & Login
# POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "phone": "+27821234567",
  "otp": "123456"
}
Response:

{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "a1000000-0000-4000-8000-000000000001",
    "phone": "+27821234567",
    "country": "ZA",
    "role": "mother",
    "status": "active"
  }
}

# Get Current User
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
# Wallet Endpoints
# Create Wallet
# Creates a new Stellar wallet for the user, funds it on testnet, and sets up MAMA token trustline.

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

# Get Wallet Balance
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

# Get Wallet Transactions
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

# Milestone Endpoints
# Get User Milestones

# GET /api/v1/my/milestones
Authorization: Bearer {JWT_TOKEN}
Response:

{
  "data": [
    {
      "id": "f1000000-0000-4000-8000-000000000001",
      "status": "completed",
      "progress": 100,
      "reward_minted": false,
      "rewardAmount": 20,
      "milestone_definitions": {
        "code": "PROFILE_COMPLETE",
        "name": "Complete Profile",
        "description": "Complete your health profile",
        "rewardAmount": 20,
        "category": "community"
      }
    }
  ],
  "count": 5
}
Milestone Statuses:

# Status	Description
- available	    Can be started
- in_progress	Currently working on
- completed	    Done, ready to mint
- expired	    Time limit exceeded

# Mint Tokens for Milestone

# POST /api/v1/mint
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
- 400	User has no wallet address	Call /api/v1/wallet/create first
- 400	Reward already minted	Milestone already claimed
- 404	Milestone not found	Invalid ID or not owned by user

# Public Endpoints (No Auth Required)
# Health Check

# GET /health
Response:

{
  "status": "healthy",
  "database": "connected",
  "users": 16,
  "timestamp": "2026-03-05T18:00:00.000Z"
}

# Get All Milestones
# GET /api/v1/milestones

# GET /api/v1/milestones?category=clinical
Categories: clinical, wellness, education, community

# Get Partners
# GET /api/v1/partners
# GET /api/v1/partners?country=ZA
# Get Products
# GET /api/v1/products
# GET /api/v1/products?country=ZA&category=mobile_money

# Frontend Flow

# New User Flow
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
         │            │ POST /wallet/   │
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
│  (POST /mint)   │
└─────────────────┘

# Minting Flow

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

# Token Details
Property	Value
Asset Code	MAMA
Network	Stellar Testnet
Issuer	GA5CGTJ6X4HZVQB6PEZNFRVU2V3KRLXVALV7QGXYT6XAIUNGNSM6FZ6V
Distributor	GDHV6FMZYGJOUNSTEFPNLV3KXP6MEOULBHOMYMHBPE6BOJB3BEEGDPLM
Total Supply	10,000,000 MAMA
Explorer	View on Stellar Expert
Error Codes
# Status	Meaning
- 200	Success
- 201	Created
- 400	Bad Request (validation error)
- 401	Unauthorized (missing/invalid token)
- 404	Not Found
- 500	Server Error