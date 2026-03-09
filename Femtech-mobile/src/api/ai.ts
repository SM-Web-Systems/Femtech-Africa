import apiClient from './client';

export const aiApi = {
  chat: async (message: string, conversationId?: string) => {
    const response = await apiClient.post('/ai/chat', {
      message,
      conversationId,
    });
    return response.data;
  },

  getSuggestions: async () => {
    const response = await apiClient.get('/ai/suggestions');
    return response.data;
  },

  clearConversation: async (conversationId: string) => {
    const response = await apiClient.delete(`/ai/chat/${conversationId}`);
    return response.data;
  },
};