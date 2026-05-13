// lib/types/index.ts
export interface User {
  id: string;
  phone: string;
  country: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gestationWeek?: number;
  dueDate?: string;
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  users: User;
}

export interface OTPRequest {
  phone: string;
  country: string;
}

export interface OTPVerify {
  phone: string;
  otp: string;
}

export interface WalletBalance {
  mama: number;
  xlm: number;
  currency: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  type: 'mint' | 'burn' | 'transfer';
  amount: number;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  week: number;
  tokenReward: number;
  icon: string;
  completed: boolean;
  completedAt?: string;
  rewardMinted: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: Question[];
  reward: number;
  timeLimit?: number;
  completed: boolean;
  score?: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-text';
  options?: string[];
  correctAnswer?: string | string[];
}

export interface HealthRecord {
  id: string;
  date: string;
  weight?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  notes?: string;
  riskFactors?: RiskFactor[];
}

export interface RiskFactor {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface Redemption {
  id: string;
  productId: string;
  productName: string;
  tokensUsed: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
