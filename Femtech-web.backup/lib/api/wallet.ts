// lib/api/wallet.ts
import apiClient from './client';
import type { WalletBalance, Transaction } from '@/lib/types';

export const walletApi = {
  getBalance: async () => {
    const response = await apiClient.get<WalletBalance>('/wallet/balance');
    return response.data;
  },

  createWallet: async () => {
    const response = await apiClient.post<{ address: string; publicKey: string }>(
      '/wallet/create'
    );
    return response.data;
  },

  importWallet: async (secretKey: string) => {
    const response = await apiClient.post<{ address: string }>(
      '/wallet/import',
      { secretKey }
    );
    return response.data;
  },

  getTransactions: async (limit: number = 50, offset: number = 0) => {
    const response = await apiClient.get<Transaction[]>(
      '/wallet/transactions',
      {
        params: { limit, offset },
      }
    );
    return response.data;
  },

  getSecretKey: async () => {
    const response = await apiClient.get<{ secretKey: string }>(
      '/wallet/secret-key'
    );
    return response.data;
  },

  transferTokens: async (recipientAddress: string, amount: number) => {
    const response = await apiClient.post<Transaction>(
      '/wallet/transfer',
      { recipientAddress, amount }
    );
    return response.data;
  },
};
