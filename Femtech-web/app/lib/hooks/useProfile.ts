import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';
import { User } from '../types';

export const useGetProfile = (enabled = true) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get('/profile');
      return response.data;
    },
    enabled,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await apiClient.put('/profile', data);
      return response.data;
    },
  });
};
