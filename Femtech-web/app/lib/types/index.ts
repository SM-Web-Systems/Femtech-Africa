// User & Auth Types
export interface User {
  id: string;
  phone: string;
  country: string;
  email?: string;
  name?: string;
  language?: string;
  status?: string;
  role?: string;
  walletAddress?: string;
  walletCreatedAt?: string;
  pregnancyWeek?: number;
  dueDate?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  message: string;
  user: User;
}

export interface OtpRequest {
  success: boolean;
  message: string;
}

// Wallet Types
export interface WalletBalance {
  hasWallet: boolean;
  stellarAddress: string | null;
  mamaBalance: string;
  xlmBalance: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  tx_hash: string | null;
  milestoneId: string | null;
  redemptionId: string | null;
  createdAt: string;
}

// Milestone Types (from API: milestoneDefinition)
export interface MilestoneDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rewardAmount: number;
  isActive: boolean;
  sortOrder: number;
  gestationalWeekMin: number | null;
  gestationalWeekMax: number | null;
}

export interface UserMilestone {
  id: string;
  userId: string;
  milestone_def_id: string;
  status: string;
  progress: number;
  startedAt: string | null;
  completedAt: string | null;
  rewardAmount: number | null;
  reward_minted: boolean;
  reward_tx_hash: string | null;
  milestone_definitions: MilestoneDefinition;
}

// Keep old Milestone type for compatibility
export interface Milestone {
  id: string;
  week: number;
  title: string;
  description: string;
  category: string;
  icon: string;
  reward: number;
  completed: boolean;
  completedAt?: string;
}

// Quiz Types (from API)
export interface QuizFromApi {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  time_limit_mins: number;
  pass_threshold: number;
  reward_amount: number;
  questionCount: number;
  _count?: { questions: number };
}

export interface QuizDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  timeLimit: number;
  passThreshold: number;
  rewardAmount: number;
  alreadyPassed: boolean;
  questionCount: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: string;
  options: string[];
  sortOrder: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  passed: boolean;
  rewardGranted: boolean;
  started_at: string;
  completedAt: string;
  duration_seconds: number;
  quiz?: {
    id: string;
    title: string;
    category: string;
    reward_amount: number;
  };
}

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

// Profile Types
export interface ProfileData {
  exists: boolean;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  email?: string | null;
  memberSince?: string | null;
  updatedAt?: string;
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
