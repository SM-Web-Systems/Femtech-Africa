import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants';
import { walletApi, WalletBalance, Transaction } from '../api';

interface WalletState {
  balance: WalletBalance | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  hasSecretKey: boolean;
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  createWallet: () => Promise<{ address: string; secretKey: string }>;
  storeSecretKey: (secretKey: string) => Promise<void>;
  getSecretKey: () => Promise<string | null>;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: null,
  transactions: [],
  isLoading: false,
  error: null,
  hasSecretKey: false,

  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      const balance = await walletApi.getBalance();
      const secretKey = await SecureStore.getItemAsync(STORAGE_KEYS.SECRET_KEY);
      set({ balance, isLoading: false, hasSecretKey: !!secretKey });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTransactions: async () => {
    try {
      const { data } = await walletApi.getTransactions();
      set({ transactions: data });
    } catch (error: any) {
      console.error('Failed to fetch transactions:', error);
    }
  },

  createWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await walletApi.createWallet();
      await SecureStore.setItemAsync(STORAGE_KEYS.SECRET_KEY, result.secretKey);
      set({ isLoading: false, hasSecretKey: true });
      return { address: result.walletAddress, secretKey: result.secretKey };
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  storeSecretKey: async (secretKey: string) => {
    await SecureStore.setItemAsync(STORAGE_KEYS.SECRET_KEY, secretKey);
    set({ hasSecretKey: true });
  },

  getSecretKey: async () => {
    return await SecureStore.getItemAsync(STORAGE_KEYS.SECRET_KEY);
  },

  clearError: () => set({ error: null }),
}));
