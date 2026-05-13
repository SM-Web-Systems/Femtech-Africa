import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';
import { ProfileData } from '../types';

export const useGetProfile = (enabled = true) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<ProfileData> => {
      const response = await apiClient.get('/profile');
      return response.data;
    },
    enabled,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: { firstName?: string; lastName?: string; dateOfBirth?: string; avatarUrl?: string }) => {
      const response = await apiClient.put('/profile', data);
      return response.data;
    },
  });
};
