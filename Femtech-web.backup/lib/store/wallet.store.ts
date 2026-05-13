// lib/store/wallet.store.ts
'use client';

import { create } from 'zustand';
import type { WalletBalance, Transaction } from '@/lib/types';

interface WalletStore {
  balance: WalletBalance | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  setBalance: (balance: WalletBalance) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateBalance: (amount: number) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  balance: null,
  transactions: [],
  isLoading: false,
  error: null,
  
  setBalance: (balance) => set({ balance }),
  setTransactions: (transactions) => set({ transactions }),
  
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  updateBalance: (amount) =>
    set((state) => ({
      balance: state.balance
        ? {
            ...state.balance,
            mama: state.balance.mama + amount,
          }
        : null,
    })),
}));
