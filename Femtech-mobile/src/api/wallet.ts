import { apiClient } from './client';

export interface WalletBalance {
  walletAddress: string;
  mamaBalance: string;
  balances: Array<{
    asset: string;
    balance: string;
    issuer: string | null;
  }>;
  stellarExpert: string;
}

export interface CreateWalletResponse {
  walletAddress: string;
  secretKey: string;
  stellarExpert: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  tx_hash: string;
  createdAt: string;
}

export const walletApi = {
  createWallet: async (): Promise<CreateWalletResponse> => {
    const { data } = await apiClient.post('/wallet/create');
    return data;
  },

  getBalance: async (): Promise<WalletBalance> => {
    const { data } = await apiClient.get('/wallet/balance');
    return data;
  },

  getTransactions: async (): Promise<{ data: Transaction[] }> => {
    const { data } = await apiClient.get('/wallet/transactions');
    return data;
  },
};
