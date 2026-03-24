'use client';

import { useState, useEffect } from 'react';
import { walletApi } from '../lib/services/useWallet';
import { useWalletData } from '../lib/hooks/useWalletData';
import BalanceCard from './wallet/BalanceCard';
import AddressCard from './wallet/AddressCard';

export default function Wallet() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transactionArray, setTransactionArray] = useState<any[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { mamaBalance, xlmBalance, stellarAddress, loading: balancesLoading, error: balancesError } = useWalletData();

    useEffect(() => {
        const fetchWalletTransactions = async () => {
            try {
                setLoading(true);
                setError(null);
                const transactions = await walletApi.getTransactions();
                setTransactionArray(transactions);
            } catch (err) {
                console.error('Failed to fetch wallet info:', err);
                setError('Failed to load wallet information. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchWalletTransactions();
    }, []);

    if (loading || balancesLoading) {
        return (
            <div className="space-y-6">
                <style jsx>{`
                    @keyframes pulse-skeleton {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    .skeleton {
                        animation: pulse-skeleton 2s ease-in-out infinite;
                        background-color: #f1f5f9;
                        border-radius: 0.75rem;
                    }
                `}</style>
                <div className="h-10 skeleton w-32"></div>
                <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 skeleton"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || balancesError) {
        return (
            <div className="bg-white border border-red-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="text-red-600 font-semibold text-sm">{error || balancesError}</p>
                        <p className="text-red-500 text-xs mt-1">Try refreshing the page or contact support.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Balance Cards Grid */}
            <div className="space-y-4">
                <BalanceCard xlmBalance={xlmBalance} mamaBalance={mamaBalance} />
            </div>

            {/* Wallet Address Section */}
            {stellarAddress && (
                <AddressCard address={stellarAddress} />
            )}

            {/* Transactions Section */}
            {transactionArray.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between mb-4 group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📊</span>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                                    {isDropdownOpen ? 'Hide' : 'Show'} Recent Transactions
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">
                                    Last {Math.min(3, transactionArray.length)} transactions
                                </p>
                            </div>
                        </div>
                        <span
                            className={`text-2xl transition-transform duration-300 ${isDropdownOpen ? 'rotate-90' : 'rotate-0'
                                }`}
                        >
                            ▶
                        </span>
                    </button>

                    {/* Transactions List */}
                    <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${isDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        {isDropdownOpen && (
                            <div className="space-y-3 mt-6 pt-6 border-t border-slate-200">
                                {transactionArray.slice(0, 3).map((tx, index) => (
                                    <a
                                        key={index}
                                        href={`https://stellar.expert/explorer/public/tx/${tx.tx_hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
                                                    Transaction {index + 1}
                                                </p>
                                                <span className="text-sm text-blue-600 font-medium">
                                                    View ↗
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-900 font-mono break-all">
                                                {tx.tx_hash}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
