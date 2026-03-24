'use client';

import { walletApi, WalletBalanceResponse } from '../services/useWallet';
import { useState, useEffect } from 'react';

interface UseWalletBalancesResult extends WalletBalanceResponse {
    loading: boolean;
    error: string | null;
}

export const useWalletBalances = (): UseWalletBalancesResult => {
    const [mamaBalance, setMamaBalance] = useState<string>('0');
    const [xlmBalance, setXlmBalance] = useState<string>('0');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const response = await walletApi.getWalletBalance();
                setMamaBalance(response.mamaBalance);
                setXlmBalance(response.xlmBalance);
            } catch (err) {
                console.error('Error fetching wallet balances:', err);
                setError('Failed to load wallet balances. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchBalances();
    }, []);

    return { mamaBalance, xlmBalance, loading, error };
};
