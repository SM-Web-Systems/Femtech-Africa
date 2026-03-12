'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';

interface WalletData {
    xlmBalance: string;
    mamaBalance: string;
    stellarAddress: string;
}

export default function Wallet() {
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWalletInfo = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiClient.get('/wallet/balance');
                setWallet({
                    xlmBalance: response.data.xlmBalance,
                    mamaBalance: response.data.mamaBalance,
                    stellarAddress: response.data.stellarAddress,
                });
            } catch (err) {
                console.error('Failed to fetch wallet info:', err);
                setError('Failed to load wallet information. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchWalletInfo();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading wallet information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Wallet</h2>

            <div className="grid md:grid-cols-3 gap-6">
                {/* XLM Balance Card */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-8 text-white shadow-lg hover:shadow-xl transition">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-purple-100 text-sm font-medium mb-2">XLM Balance</p>
                            <p className="text-4xl font-bold">{wallet?.xlmBalance || '0'}</p>
                        </div>
                        <span className="text-3xl">⭐</span>
                    </div>
                    <p className="text-purple-100 text-xs">Stellar Lumens</p>
                </div>

                {/* MAMA Balance Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 text-white shadow-lg hover:shadow-xl transition">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-2">MAMA Balance</p>
                            <p className="text-4xl font-bold">{wallet?.mamaBalance || '0'}</p>
                        </div>
                        <span className="text-3xl">💎</span>
                    </div>
                    <p className="text-blue-100 text-xs">MAMA Tokens</p>
                </div>

                {/* Quick Stats Card */}
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-8 text-white shadow-lg hover:shadow-xl transition">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-green-100 text-sm font-medium mb-2">Total Value</p>
                            <p className="text-4xl font-bold">
                                {wallet?.xlmBalance && wallet?.mamaBalance
                                    ? (parseFloat(wallet.xlmBalance) + parseFloat(wallet.mamaBalance)).toFixed(2)
                                    : '0'}
                            </p>
                        </div>
                        <span className="text-3xl">💰</span>
                    </div>
                    <p className="text-green-100 text-xs">Combined Value</p>
                </div>
            </div>

            {/* Wallet Address Section */}
            {wallet?.stellarAddress && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Address</h3>
                    <div className="bg-gray-50 rounded p-4 border border-gray-200">
                        <p className="text-sm text-gray-600 font-mono break-all">
                            {wallet.stellarAddress}
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        This is your Stellar blockchain wallet address. Use it to receive payments.
                    </p>
                </div>
            )}
        </div>
    );
}