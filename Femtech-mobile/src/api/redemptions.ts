import { apiClient } from './client';

export interface Partner {
  id: string;
  name: string;
  type: string;
  country: string;
  logoUrl: string;
  description: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  partnerId: string;
  name: string;
  description: string;
  category: string;
  tokenCost: number;
  imageUrl: string;
  is_available: boolean;
}

export interface RedemptionItem {
  id: string;
  productId: string;
  quantity: number;
  tokenCost: number;
  voucherCode: string;
  voucher_expires_at: string;
  product: Product;
}

export interface Redemption {
  id: string;
  userId: string;
  partner_id: string;
  type: string;
  totalTokens: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  recipient_phone: string;
  burn_tx_hash: string;
  completedAt: string;
  createdAt: string;
  partners: Partner;
  items: RedemptionItem[];
}

export interface CreateRedemptionParams {
  partnerId: string;
  products: Array<{ productId: string; quantity: number }>;
  recipientPhone: string;
  userSecretKey: string;
}

export const redemptionsApi = {
  getPartners: async (country?: string): Promise<{ data: Partner[] }> => {
    const params = country ? { country } : {};
    const { data } = await apiClient.get('/partners', { params });
    return data;
  },

  getProducts: async (partnerId?: string): Promise<{ data: Product[] }> => {
    const params = partnerId ? { partnerId } : {};
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  getUserRedemptions: async (): Promise<{ data: Redemption[] }> => {
    const { data } = await apiClient.get('/my/redemptions');
    return data;
  },

  createRedemption: async (params: CreateRedemptionParams): Promise<{ data: Redemption }> => {
    const { data } = await apiClient.post('/my/redemptions', params);
    return data;
  },
};
