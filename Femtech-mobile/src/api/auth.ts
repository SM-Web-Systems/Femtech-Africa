import apiClient from './client';

export const authApi = {
  requestOtp: async (phone: string, country: string) => {
    const response = await apiClient.post('/auth/otp/request', { phone, country });
    return response.data;
  },

  verifyOtp: async (phone: string, otp: string) => {
    const response = await apiClient.post('/auth/otp/verify', { phone, otp });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
