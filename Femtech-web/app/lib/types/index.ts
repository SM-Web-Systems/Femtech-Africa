// User & Auth Types
export interface User {
  id: string;
  phone: string;
  country: string;
  email?: string;
  name?: string;
  pregnancyWeek?: number;
  dueDate?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  message: string;
  users: User;
}

export interface OtpRequest {
  success: boolean;
  message: string;
}

// Wallet Types
export interface WalletBalance {
  balance: number;
  currency: string;
  accountId?: string;
}

export interface Transaction {
  id: string;
  type: 'earned' | 'spent' | 'transferred';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

// Milestone Types
export interface Milestone {
  id: string;
  week: number;
  title: string;
  description: string;
  category: 'health' | 'education' | 'wellness';
  icon: string;
  reward: number;
  completed: boolean;
  completedAt?: string;
}

// Quiz Types
export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  options?: string[];
  correctAnswer?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: Question[];
  reward: number;
  completedAt?: string;
  score?: number;
}

// Redemption Types
export interface RedemptionItem {
  id: string;
  name: string;
  description: string;
  category: string;
  cost: number;
  image?: string;
  provider: string;
}

export interface Redemption {
  id: string;
  itemId: string;
  itemName: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  redeemedAt: string;
  provider: string;
}

// API Error
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
