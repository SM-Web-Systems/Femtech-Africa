import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';
import { MilestoneDefinition, UserMilestone } from '../types';

export const useMilestoneDefinitions = () => {
  return useQuery({
    queryKey: ['milestoneDefinitions'],
    queryFn: async (): Promise<MilestoneDefinition[]> => {
      const response = await apiClient.get('/milestones');
      return response.data;
    },
  });
};

export const useMilestones = () => {
  return useQuery({
    queryKey: ['myMilestones'],
    queryFn: async (): Promise<UserMilestone[]> => {
      const response = await apiClient.get('/milestones/my');
      return response.data;
    },
  });
};

export const useMintMilestone = () => {
  return useMutation({
    mutationFn: async (milestoneId: string) => {
      const response = await apiClient.post('/milestones/mint', { milestoneId });
      return response.data;
    },
  });
};
