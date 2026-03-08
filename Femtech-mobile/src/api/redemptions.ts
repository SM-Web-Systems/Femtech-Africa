// D:\SM-WEB\FEMTECH-AFRICA\Femtech-mobile\src\api\redemptions.ts

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

  redeem: async (data: { partnerId: string; productId?: string; tokenAmount: number }) => {
    const response = await apiClient.post('/redemptions/redeem', data);
    return response.data;
  },

  getMyVouchers: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/redemptions/my/vouchers', { params });
    return response.data;
  },

  getVoucher: async (voucherId: string) => {
    const response = await apiClient.get(`/redemptions/my/vouchers/${voucherId}`);
    return response.data;
  },
};
