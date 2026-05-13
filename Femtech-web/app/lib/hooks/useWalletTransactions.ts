'use client';

import { walletApi, Transaction } from '../services/useWallet';
import { useState, useEffect } from 'react';

interface WalletTransactionResponse {
    transactionArray: Transaction[];
    loading: boolean;
    error: string | null;
}

export const useWalletTransactions = (): WalletTransactionResponse => {
    const [transactionArray, setTransactionArray] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWalletTransactions = async () => {
            try {
                const data = await walletApi.getTransactions();
                setTransactionArray(data);
            } catch (err) {
                console.error('Failed to fetch wallet transactions:', err);
                setError('Failed to load wallet transactions. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchWalletTransactions();
    }, []);

    return { transactionArray, loading, error };
};