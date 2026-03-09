import apiClient from './client';

export const milestonesApi = {
  getDefinitions: async () => {
    const response = await apiClient.get('/milestones');
    return response.data;
  },

  getUserMilestones: async () => {
    const response = await apiClient.get('/milestones/my');
    return response.data;
  },

  mintReward: async (milestoneId: string) => {
    const response = await apiClient.post('/milestones/mint', { milestoneId });
    return response.data;
  },
};