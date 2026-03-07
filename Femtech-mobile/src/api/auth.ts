import { apiClient } from './client';

export interface RequestOtpParams {
  phone: string;
  country: string;
}

export interface VerifyOtpParams {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  isNewUser: boolean;
  user: User;
}

export interface User {
  id: string;
  phone: string;
  country: string;
  role: string;
  status: string;
  walletAddress?: string;
  createdAt?: string;
}

export const authApi = {
  requestOtp: async (params: RequestOtpParams) => {
    const { data } = await apiClient.post('/auth/request-otp', params);
    return data;
  },

  verifyOtp: async (params: VerifyOtpParams): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/verify-otp', params);
    return data;
  },

  getCurrentUser: async (): Promise<{ data: User }> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};
