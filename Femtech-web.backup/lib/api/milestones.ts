// lib/api/milestones.ts
import apiClient from './client';
import type { Milestone } from '@/lib/types';

export const milestonesApi = {
  getDefinitions: async () => {
    const response = await apiClient.get<Milestone[]>('/milestones');
    return response.data;
  },

  getUserMilestones: async () => {
    const response = await apiClient.get<Milestone[]>('/milestones/my');
    return response.data;
  },

  getMilestoneById: async (id: string) => {
    const response = await apiClient.get<Milestone>(\/milestones/\\);
    return response.data;
  },

  mintReward: async (milestoneId: string) => {
    const response = await apiClient.post<{
      transactionHash: string;
      amount: number;
    }>('/milestones/mint', { milestoneId });
    return response.data;
  },

  completeMilestone: async (milestoneId: string) => {
    const response = await apiClient.post<Milestone>(
      \/milestones/\/complete\
    );
    return response.data;
  },
};
