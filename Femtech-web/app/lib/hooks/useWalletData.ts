'use client';

import { walletApi, WalletDataResponse } from '../services/useWallet';
import { useState, useEffect } from 'react';

interface UseWalletDataResult extends WalletDataResponse {
    loading: boolean;
    error: string | null;
}

export const useWalletData = (): UseWalletDataResult => {
    const [mamaBalance, setMamaBalance] = useState<string>('0');
    const [xlmBalance, setXlmBalance] = useState<string>('0');
    const [stellarAddress, setStellarAddress] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const data: WalletDataResponse = await walletApi.getWalletData();
                setMamaBalance(data.mamaBalance);
                setXlmBalance(data.xlmBalance);
                setStellarAddress(data.stellarAddress);
            } catch (err) {
                console.error('Failed to fetch wallet data:', err);
                setError('Failed to load wallet data. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchWalletData();
    }, []);

    return { mamaBalance, xlmBalance, stellarAddress, loading, error };
};