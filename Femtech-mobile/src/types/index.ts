export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  PhoneEntry: undefined;
  OtpVerification: { phone: string; country: string };
};

export type MainTabParamList = {
  Home: undefined;
  Milestones: undefined;
  Wallet: undefined;
  Profile: undefined;
};

export type MilestoneStatus = 'available' | 'in_progress' | 'completed' | 'expired';
export type RedemptionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
