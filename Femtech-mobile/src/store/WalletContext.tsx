import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { walletApi } from '../api';

interface WalletBalance {
  mamaBalance: string;
  xlmBalance: string;
  address: string | null;
  hasWallet: boolean;
}

interface WalletContextType {
  balance: WalletBalance | null;
  loading: boolean;
  refreshBalance: () => Promise<void>;
  setBalanceData: (data: any) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshBalance = useCallback(async () => {
    setLoading(true);
    try {
      const data = await walletApi.getBalance();
      setBalance({
        mamaBalance: data.mamaBalance || '0',
        xlmBalance: data.xlmBalance || '0',
        address: data.stellarAddress || data.address || null,
        hasWallet: !!data.stellarAddress || !!data.address || data.hasWallet === true,
      });
    } catch (error) {
      console.log('Failed to refresh balance:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const setBalanceData = useCallback((data: any) => {
    setBalance({
      mamaBalance: data.mamaBalance || '0',
      xlmBalance: data.xlmBalance || '0',
      address: data.stellarAddress || data.address || null,
      hasWallet: !!data.stellarAddress || !!data.address || data.hasWallet === true,
    });
  }, []);

  return (
    <WalletContext.Provider value={{ balance, loading, refreshBalance, setBalanceData }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
