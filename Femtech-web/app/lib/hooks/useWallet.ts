import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { WalletBalance, Transaction } from '../types';

export const useWalletBalance = () => {
  return useQuery({
    queryKey: ['walletBalance'],
    queryFn: async (): Promise<WalletBalance> => {
      const response = await apiClient.get('/wallet/balance');
      return response.data;
    },
  });
};

export const useWalletTransactions = () => {
  return useQuery({
    queryKey: ['walletTransactions'],
    queryFn: async (): Promise<Transaction[]> => {
      const response = await apiClient.get('/wallet/transactions');
      return response.data;
    },
  });
};
