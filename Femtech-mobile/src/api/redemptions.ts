import apiClient from './client';

export const redemptionsApi = {
  getPartners: async () => {
    const response = await apiClient.get('/redemptions/partners');
    return response.data;
  },

  getPartnerProducts: async (partnerId: string) => {
    const response = await apiClient.get(`/redemptions/partners/${partnerId}/products`);
    return response.data;
  },

  redeem: async (partnerId: string, tokenAmount: number, productId?: string) => {
    const response = await apiClient.post('/redemptions/redeem', {
      partnerId,
      tokenAmount,
      productId,
    });
    return response.data;
  },

  getMyVouchers: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/redemptions/my/vouchers', { params });
    return response.data;
  },

  getVoucher: async (id: string) => {
    const response = await apiClient.get(`/redemptions/my/vouchers/${id}`);
    return response.data;
  },
};