// lib/hooks/useWallet.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { walletApi } from '@/lib/api/wallet';
import { useWalletStore } from '@/lib/store/wallet.store';

export const useWallet = () => {
  const { setBalance, setTransactions } = useWalletStore();

  const balanceQuery = useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: () => walletApi.getBalance(),
    onSuccess: (data) => setBalance(data),
    staleTime: 1000 * 30,
  });

  const transactionsQuery = useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: () => walletApi.getTransactions(),
    onSuccess: (data) => setTransactions(data),
    staleTime: 1000 * 60 * 2,
  });

  return {
    balance: balanceQuery.data,
    transactions: transactionsQuery.data || [],
    isLoading: balanceQuery.isLoading || transactionsQuery.isLoading,
    error: balanceQuery.error || transactionsQuery.error,
    refetchBalance: balanceQuery.refetch,
    refetchTransactions: transactionsQuery.refetch,
  };
};
