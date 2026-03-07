import apiClient from './client';

export const walletApi = {
  getBalance: async () => {
    const response = await apiClient.get('/wallet/balance');
    return response.data;
  },

  createWallet: async () => {
    const response = await apiClient.post('/wallet/create');
    return response.data;
  },

  getTransactions: async () => {
    const response = await apiClient.get('/my/transactions');
    return response.data;
  },
};
