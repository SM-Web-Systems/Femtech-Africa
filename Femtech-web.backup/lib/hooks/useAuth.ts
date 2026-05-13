// lib/hooks/useAuth.ts
'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth.store';
import type { OTPRequest, OTPVerify } from '@/lib/types';

export const useAuth = () => {
  const router = useRouter();
  const { setAuth, logout: clearAuth, user } = useAuthStore();

  const requestOtpMutation = useMutation({
    mutationFn: (data: OTPRequest) => authApi.requestOtp(data.phone, data.country),
    onError: (error: any) => {
      console.error('OTP request failed:', error);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: OTPVerify) => authApi.verifyOtp(data.phone, data.otp),
    onSuccess: (data) => {
      setAuth(data);
      localStorage.setItem('auth_token', data.token);
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.error('OTP verification failed:', error);
    },
  });

  const getCurrentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authApi.getCurrentUser(),
    staleTime: 1000 * 60 * 5,
    enabled: !!localStorage.getItem('auth_token'),
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logOut(),
    onSuccess: () => {
      clearAuth();
      localStorage.removeItem('auth_token');
      router.push('/login');
    },
  });

  return {
    requestOtp: requestOtpMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    currentUser: user || getCurrentUserQuery.data,
    isAuthenticated: !!user,
    isLoading: getCurrentUserQuery.isLoading,
    logout: logoutMutation.mutate,
  };
};
