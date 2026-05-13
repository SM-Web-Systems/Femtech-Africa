import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { WalletBalance, Transaction } from '../types';

const mockBalance: WalletBalance = {
  balance: 450,
  currency: 'MAMA',
  accountId: 'test-account-123',
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'earned',
    amount: 100,
    description: 'Completed: First Prenatal Checkup',
    timestamp: '2026-05-01T10:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    type: 'earned',
    amount: 150,
    description: 'Completed: Prenatal Quiz',
    timestamp: '2026-05-05T14:15:00Z',
    status: 'completed',
  },
  {
    id: '3',
    type: 'spent',
    amount: 50,
    description: 'Redeemed: Health Checkup with partner clinic',
    timestamp: '2026-05-08T09:00:00Z',
    status: 'completed',
  },
  {
    id: '4',
    type: 'earned',
    amount: 250,
    description: 'Completed: Educational Module',
    timestamp: '2026-05-10T16:45:00Z',
    status: 'completed',
  },
];

export const useWalletBalance = () => {
  return useQuery({
    queryKey: ['walletBalance'],
    queryFn: async (): Promise<WalletBalance> => {
      try {
        const response = await apiClient.get('/wallet/balance');
        return response.data;
      } catch (error) {
        console.warn('Using mock wallet balance:', error);
        return mockBalance;
      }
    },
  });
};

export const useWalletTransactions = () => {
  return useQuery({
    queryKey: ['walletTransactions'],
    queryFn: async (): Promise<Transaction[]> => {
      try {
        const response = await apiClient.get('/wallet/transactions');
        return response.data;
      } catch (error) {
        console.warn('Using mock transactions:', error);
        return mockTransactions;
      }
    },
  });
};
