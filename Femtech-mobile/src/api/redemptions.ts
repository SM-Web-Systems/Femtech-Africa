import apiClient from './client';

export const redemptionsApi = {
  getPartners: async () => {
    const response = await apiClient.get('/partners');
    return response.data;
  },

  getProducts: async (partnerId?: string) => {
    const url = partnerId ? `/products?partnerId=${partnerId}` : '/products';
    const response = await apiClient.get(url);
    return response.data;
  },

  getUserRedemptions: async () => {
    const response = await apiClient.get('/my/redemptions');
    return response.data;
  },

  createRedemption: async (data: {
    partnerId: string;
    products: { productId: string; quantity: number }[];
    recipientPhone: string;
    userSecretKey: string;
  }) => {
    const response = await apiClient.post('/my/redemptions', data);
    return response.data;
  },
};
