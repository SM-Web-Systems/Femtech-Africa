# Femtech Africa - Database Seed Data

## Overview

This directory contains comprehensive seed data for development and testing of the Femtech Africa platform.

## Seed Files

### PostgreSQL Seeds (`postgres/seeds/`)

| File | Description | Records |
|------|-------------|---------|
| `001_partners.sql` | Partner organizations (MTN, M-Pesa, pharmacies, etc.) | 25 partners across 7 countries |
| `002_partner_products.sql` | Redeemable products (vouchers, airtime, vitamins) | 60+ products |
| `003_test_users.sql` | Test user accounts (mothers, verifiers, admins) | 15 users |
| `004_test_pregnancies.sql` | Test facilities and pregnancy records | 8 facilities, 10 pregnancies |
| `005_test_verifiers.sql` | Verifier accounts and digital doulas | 3 verifiers, 12 doulas |
| `006_test_milestones.sql` | User milestone progress and token transactions | 50+ milestones, 25+ transactions |
| `007_test_redemptions.sql` | Redemption history | 8 redemptions |
| `008_test_health_data.sql` | Appointments and kick sessions | 20 appointments, 20 kick sessions |
| `009_test_consents.sql` | User consent records | 15 consents |

### MongoDB Seeds (`mongodb/seeds/`)

| File | Description | Records |
|------|-------------|---------|
| `symptom_logs.js` | Symptom check-in history | 25+ logs across 5 users |

## Test Users Summary

### South Africa (ZA)
| User | Role | Stage | Wallet | Notes |
|------|------|-------|--------|-------|
| Thandi (+27821234001) | Mother | 12 weeks | ✓ | First pregnancy, early stage |
| Nomsa (+27831234002) | Mother | 32 weeks | ✓ | Third trimester, many milestones |
| Lindiwe (+27841234003) | Mother | 24 weeks | ✓ | HIGH RISK (GDM, preterm history) |
| User 4 (+27851234004) | Mother | New | ✗ | No wallet yet |
| Dr. Mokoena | Verifier | HCW | - | Healthcare worker |
| Sipho | Verifier | CHW | - | Community health worker |
| Admin | Admin | - | - | System administrator |

### Kenya (KE)
| User | Role | Stage | Notes |
|------|------|-------|-------|
| Wanjiku (+254722123001) | Mother | 20 weeks | Normal pregnancy |
| Akinyi (+254733123002) | Mother | 28 weeks | Second pregnancy |
| Nurse Ochieng | Verifier | HCW | KNH nurse |

### Nigeria (NG)
| User | Role | Stage | Notes |
|------|------|-------|-------|
| Adaeze (+2348012345001) | Mother | 16 weeks | First pregnancy |
| Folake (+2349023456002) | Mother | 22 weeks | HIGH RISK (twins) |

### Other Countries
- Ghana: Abena (18 weeks)
- Uganda: Nakato (14 weeks)
- Rwanda: Uwimana (15 weeks)
- Tanzania: Rehema (10 weeks)

## Token Balances

| User | Country | Balance (tokens) | Milestones Completed |
|------|---------|------------------|---------------------|
| Thandi | ZA | 170 | 3 |
| Nomsa | ZA | 470 | 16 (after redemption) |
| Wanjiku | KE | 425 | 7 |
| Adaeze | NG | 170 | 3 |

## Partner Coverage by Country

| Country | Mobile Money | Pharmacy | Transport | Grocery | Healthcare |
|---------|-------------|----------|-----------|---------|------------|
| ZA | MTN MoMo, Vodapay | Clicks, Dis-Chem | Uber, Bolt | Pick n Pay, Shoprite | Netcare |
| KE | M-Pesa, Airtel | Goodlife | Little Cab | Naivas | - |
| NG | OPay, Paga | HealthPlus | Bolt | Shoprite | - |
| GH | MTN MoMo, Vodafone Cash | Ernest Chemists | - | - | - |
| TZ | M-Pesa, Tigo Pesa | - | - | - | - |
| UG | MTN MoMo, Airtel | - | SafeBoda | - | - |
| RW | MTN MoMo, Airtel | - | Move | - | - |

## Running Seeds

```bash
# All seeds (development)
./scripts/seed.sh all development

# PostgreSQL only
./scripts/seed.sh postgres

# MongoDB only
./scripts/seed.sh mongodb

# Verify seed data
./scripts/seed.sh verify
