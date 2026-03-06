# MamaTokens - MoSCoW Prioritization

**Project:** MamaTokens (Femtech Africa)  
**Date:** 2026-03-06  
**Version:** 1.0

---

## Overview

MoSCoW is a prioritization framework that categorizes features into:
- **M**ust Have - Critical for launch, non-negotiable
- **S**hould Have - Important but not critical for MVP
- **C**ould Have - Nice to have, enhances UX
- **W**on't Have (this time) - Future releases

---

## MUST HAVE (Critical for MVP Launch)

### ✅ Completed

| Feature                   | Status   | Notes                           |
|---------------------------|---------|--------------------------------- |
| User Authentication (OTP) | ✅ Done | Phone-based OTP login           |
| User Registration         | ✅ Done | Auto-create on first login      |
| Pregnancy Tracking        | ✅ Done | CRUD endpoints working          |
| Milestone System          | ✅ Done | 22 milestone definitions        |
| Stellar Wallet Creation   | ✅ Done | Auto-fund on testnet            |
| MAMA Token Minting        | ✅ Done | Mint on milestone completion    |
| Wallet Balance Display    | ✅ Done | XLM + MAMA balances             |
| Partner Catalog           | ✅ Done | 16 partners seeded              |
| Product Catalog           | ✅ Done | 18 products available           |
| API Security (JWT)        | ✅ Done | Bearer token auth               | 
| HTTPS/SSL                 | ✅ Done | Let's Encrypt certificate       |
| Database (PostgreSQL)     | ✅ Done | All tables, indexes, triggers   |
| API Documentation         | ✅ Done | Complete endpoint docs          |

### 🔲 Pending

| Feature                           | Priority  | Effort  | Notes                         |
|-----------------------------------|-----------|---------|-------------------------------|
| Real SMS OTP (Africa's Talking)   | HIGH      | 2 days  | Currently using debug OTP     |
| User Profile Encryption           | HIGH      | 1 day   | PII data protection           |
| Token Redemption Flow             | HIGH      | 3 days  | Redeem MAMA for products      |
| Basic Admin Dashboard             | HIGH      | 3 days  | User & transaction management |
| Mobile App (React Native)         | HIGH      | 2 weeks | Core user interface           |

---

## SHOULD HAVE (Important, Post-MVP)

| Feature                       | Priority | Effort | Notes                                |
|-------------------------------|----------|--------|--------------------------------------|
| Push Notifications (Firebase) | MEDIUM   | 2 days | Appointment reminders                |
| Appointment Verification      | MEDIUM   | 2 days | QR code/PIN verification at facility |
| Kick Counter UI               | MEDIUM   | 1 day  | Baby movement tracking               |
| Quiz System                   | MEDIUM   | 3 days | Educational quizzes with rewards     |
| Article Content               | MEDIUM   | 2 days | Pregnancy health articles            |
| Partner API Integration       | MEDIUM   | 5 days | MTN MoMo, Vodacom, etc.              |
| Facility Locator              | MEDIUM   | 2 days | Map integration for nearby clinics   |
| Multi-language Support        | MEDIUM   | 3 days | Swahili, Zulu, English               |
| User Referral System          | MEDIUM   | 2 days | Bonus tokens for referrals           |
| Pregnancy Risk Assessment     | MEDIUM   | 2 days | Auto-calculate risk score            |

## COULD HAVE (Nice to Have, Future Sprints)

| Feature                      | Priority | Effort  | Notes                          |
|------------------------------|----------|---------|--------------------------------|
| Digital Doula Chat           | LOW      | 1 week  | AI-powered pregnancy assistant |
| Community Forum              | LOW      | 1 week  | User-to-user support           |
| Telemedicine Integration     | LOW      | 2 weeks | Video consultations            |
| Wearable Device Sync         | LOW      | 2 weeks | Fitbit, Apple Watch data       |
| Gamification (Badges/Levels) | LOW      | 3 days  | Engagement features            |
| Family/Partner Access        | LOW      | 3 days  | Share pregnancy with spouse    |
| Offline Mode                 | LOW      | 1 week  | Work without internet          |
| Analytics Dashboard          | LOW      | 3 days  | User insights for mothers      |
| Social Sharing               | LOW      | 1 day   | Share milestones on WhatsApp   |
| Dark Mode                    | LOW      | 1 day   | UI preference                  |

## WON'T HAVE (This Release)

| Feature                       | Reason                  | Future Consideration     |
|-------------------------------|-------------------------|--------------------------|
| Stellar Mainnet               | Need audit & compliance | v2.0 after pilot         |
| Insurance Integration         | Complex partnerships    | v2.0+                    |
| E-commerce Store              | Out of scope            | v3.0                     |
| Video Content                 | Bandwidth constraints   | v2.0                     |
| AI Symptom Checker            | Liability concerns      | v3.0 with medical review |
| Cryptocurrency Exchange       | Regulatory complexity   | Not planned              |
| Desktop Web App               | Mobile-first focus      | v2.0                     |
| Third-party Login (Google/FB) | Phone-based is simpler  | Maybe v2.0               |

## MVP Feature Matrix

### Core User Journey

┌─────────────────────────────────────────────────────────────┐ │ MVP USER JOURNEY │ ├─────────────────────────────────────────────────────────────┤ │ │ │ 1. ONBOARDING │ │ ├── Phone verification (OTP) ✅ │ │ ├── Profile creation ✅ │ │ ├── Pregnancy info ✅ │ │ ├── Emergency contact ✅ │ │ └── Wallet creation ✅ │ │ │ │ 2. DAILY ENGAGEMENT │ │ ├── View milestones ✅ │ │ ├── Track pregnancy progress ✅ │ │ ├── Complete health tasks 🔲 │ │ └── Earn MAMA tokens ✅ │ │ │ │ 3. HEALTHCARE │ │ ├── Book appointments ✅ │ │ ├── Appointment reminders 🔲 │ │ ├── Verify clinic visits 🔲 │ │ └── Track medical history ✅ │ │ │ │ 4. REWARDS │ │ ├── View token balance ✅ │ │ ├── Browse partners ✅ │ │ ├── Redeem for airtime/data 🔲 │ │ └── Transaction history ✅ │ │ │ │ ✅ = Completed 🔲 = Pending MVP │ └─────────────────────────────────────────────────────────────┘

## Technical Infrastructure Status

| Component       | Status        | Notes                       |
|-----------------|---------------|-----------------------------|
| PostgreSQL      | ✅ Running    | 30 tables, seeded data      |
| Redis           | ✅ Running    | Session caching ready       |
| MongoDB         | ✅ Running    | For analytics (future)      |
| RabbitMQ        | ✅ Running    | Message queue ready         |
| Nginx + SSL     | ✅ Running    | HTTPS on api.mamatokens.com |
| PM2             | ✅ Running    | Process management          |
| Stellar Testnet | ✅ Connected  | MAMA token live             |
| Daily Backups   | ✅ Configured | 2 AM daily                  |
| UFW Firewall    | ✅ Active     | Ports secured               |

## Sprint Planning Recommendation

### Sprint 1 (Current - Week 1-2)
**Goal:** Complete MVP Backend + Basic Mobile App

| Task                                        | Owner    | Days |
|---------------------------------------------|----------|------|
| Africa's Talking SMS Integration            | Backend  | 2    |
| Token Redemption API                        | Backend  | 3    |
| Mobile App Screens (Auth, Home, Milestones) | Frontend | 5    |
| Basic Admin Dashboard                       | Backend  | 3    |
| User Testing Setup                          | QA       | 1    |

### Sprint 2 (Week 3-4)
**Goal:** Healthcare Features + Partner Integration

| Task                            | Owner    | Days |
|---------------------------------|----------|------|
| Push Notifications              | Backend  | 2    |
| Appointment Verification        | Backend  | 2    |
| Mobile App (Wallet, Redemption) | Frontend | 5    |
| MTN MoMo Integration            | Backend  | 3    |
| End-to-end Testing              | QA       | 2    |

### Sprint 3 (Week 5-6)
**Goal:** Polish + Pilot Launch

| Task                     | Owner    | Days |
|--------------------------|----------|------|  
| Quiz System              | Backend  | 3    |
| Multi-language (EN, ZU)  | Frontend | 2    |
| Performance Optimization | Backend  | 2    |
| Security Audit           | DevOps   | 2    |
| Pilot Launch (100 users) | All      | 1    |

## Success Metrics for MVP

| Metric                | Target      | Measurement                  |
|-----------------------|-------------|------------------------------|
| User Registrations    | 100 users   | First month pilot            |
| Milestone Completions | 500         | Total across all users       |
| Tokens Minted         | 10,000 MAMA | Distributed to users         |
| Redemptions           | 50          | Successful token redemptions |
| App Rating            | 4.0+        | Play Store / App Store       |
| API Uptime            | 99.5%       | Monitoring                   |

## Risk Assessment

| Risk                   | Impact | Probability | Mitigation             |
|------------------------|--------|-------------|------------------------|
| SMS delivery failures  | HIGH   | MEDIUM      | Multiple SMS providers |
| Stellar network issues | HIGH   | LOW         | Retry logic, fallback  |
| Partner API downtime   | MEDIUM | MEDIUM      | Queue redemptions      |
| Data breach            | HIGH   | LOW         | Encryption, audits     |
| Low user adoption      | HIGH   | MEDIUM      | Incentive programs     |

## Conclusion

**MVP Readiness: 75%**

The backend infrastructure is solid with all core APIs working. The main gaps for MVP are:
1. Real SMS OTP delivery
2. Token redemption flow
3. Mobile application
4. Basic admin tools

Estimated time to MVP: **4-6 weeks** with focused development.

---

*Document maintained by: Femtech Africa Development Team*
*Last updated: 2026-03-06*