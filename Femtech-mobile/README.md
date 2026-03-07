# MamaTokens Mobile App

React Native (Expo) mobile application for the MamaTokens maternal health rewards platform.

## Features

- **Authentication**: Phone-based OTP login
- **Wallet Management**: Stellar blockchain wallet with MAMA token balance
- **Milestones**: Track pregnancy milestones and claim token rewards
- **Redemptions**: Redeem tokens for airtime, data, and vouchers
- **Profile**: User settings and account management

## Tech Stack

- **Framework**: React Native with Expo SDK 50
- **Navigation**: React Navigation 6
- **State Management**: Zustand + React Query
- **API Client**: Axios
- **Secure Storage**: expo-secure-store
- **Styling**: StyleSheet with custom theme

## Project Structure

src/ ├── api/ # API client and service functions ├── components/ # Reusable UI components ├── constants/ # Theme, config, and constants ├── hooks/ # Custom React hooks ├── navigation/ # Navigation configuration ├── screens/ # Screen components ├── store/ # State management (Zustand, Context) ├── types/ # TypeScript type definitions └── utils/ # Utility functions


## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
cd Femtech-mobile
npm install
Running the App
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
Building for Production
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
npm run build:android

# Build for iOS
npm run build:ios
API Configuration
The app connects to the MamaTokens API at https://api.mamatokens.com.

To change the API URL, edit src/constants/config.ts:

export const API_CONFIG = {
  BASE_URL: 'https://api.mamatokens.com',
  TIMEOUT: 30000,
  VERSION: 'v1',
};
Screens
Screen	Description
Welcome	Onboarding welcome screen
PhoneEntry	Phone number input for login
OtpVerification	OTP code verification
Home	Dashboard with balance and stats
Milestones	List and manage milestones
MilestoneDetail	View milestone details and claim rewards
Wallet	Token balance and transactions
Redeem	Browse and redeem products
Redemptions	Redemption history
Profile	User settings and account
Token Integration
The app integrates with the Stellar blockchain for MAMA token management:

Network: Stellar Testnet
Asset Code: MAMA
Explorer: https://stellar.expert/explorer/testnet
License
Proprietary - Femtech Africa