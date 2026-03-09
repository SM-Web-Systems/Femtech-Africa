import apiClient from './client';

export const riskApi = {
  getAssessment: async () => {
    const response = await apiClient.get('/risk/assessment');
    return response.data;
  },

  getAnalysis: async () => {
    const response = await apiClient.get('/risk/analysis');
    return response.data;
  },

  checkSymptoms: async (data: { symptoms: string[]; description: string }) => {
    const response = await apiClient.post('/risk/symptom-check', data);
    return response.data;
  },
};

export const recommendationsApi = {
  getContent: async () => {
    const response = await apiClient.get('/recommendations/content');
    return response.data;
  },

  getMilestones: async () => {
    const response = await apiClient.get('/recommendations/milestones');
    return response.data;
  },
};
