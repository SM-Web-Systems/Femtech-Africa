import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { User, OtpRequest, AuthResponse } from '../types';

export const useRequestOtp = () => {
  return useMutation({
    mutationFn: async ({ phone, country }: { phone: string; country: string }): Promise<OtpRequest> => {
      const response = await apiClient.post('/auth/otp/request', { phone, country });
      return response.data;
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }): Promise<AuthResponse> => {
      const response = await apiClient.post('/auth/otp/verify', { phone, otp });
      return response.data;
    },
  });
};

export const useGetCurrentUser = (enabled = true) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get('/auth/me');
      return response.data;
    },
    enabled,
  });
};
