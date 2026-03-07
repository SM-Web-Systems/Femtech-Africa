import { apiClient } from './client';

export interface MilestoneDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  rewardAmount: number;
  country: string;
}

export interface UserMilestone {
  id: string;
  status: 'available' | 'in_progress' | 'completed' | 'expired';
  progress: number;
  rewardAmount: number;
  reward_minted: boolean;
  startedAt: string | null;
  completedAt: string | null;
  milestone_definitions: MilestoneDefinition;
}

export interface MintResponse {
  success: boolean;
  amount: number;
  txHash: string;
  stellarExpert: string;
}

export const milestonesApi = {
  getDefinitions: async (category?: string): Promise<{ data: MilestoneDefinition[] }> => {
    const params = category ? { category } : {};
    const { data } = await apiClient.get('/milestones', { params });
    return data;
  },

  getUserMilestones: async (): Promise<{ data: UserMilestone[] }> => {
    const { data } = await apiClient.get('/my/milestones');
    return data;
  },

  startMilestone: async (milestoneDefId: string): Promise<{ data: UserMilestone }> => {
    const { data } = await apiClient.post('/my/milestones', { milestoneDefId });
    return data;
  },

  updateProgress: async (
    id: string, 
    params: { progress?: number; status?: string }
  ): Promise<{ data: UserMilestone }> => {
    const { data } = await apiClient.put(`/my/milestones/${id}`, params);
    return data;
  },

  mintReward: async (milestoneId: string): Promise<MintResponse> => {
    const { data } = await apiClient.post('/mint', { milestoneId });
    return data;
  },
};
