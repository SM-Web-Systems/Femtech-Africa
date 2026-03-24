'use client';

import { useState, useEffect } from 'react';
import { walletApi } from '../lib/services/useWallet';
import { useWalletBalances } from '../lib/hooks/useWalletBalances';
import BalanceCard from './wallet/BalanceCard';

interface WalletData {
    xlmBalance: string;
    mamaBalance: string;
    stellarAddress: string;
}

export default function Wallet() {
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transactionArray, setTransactionArray] = useState<any[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [copiedAddress, setCopiedAddress] = useState(false);

    const { mamaBalance, xlmBalance, loading: balancesLoading, error: balancesError } = useWalletBalances();

    useEffect(() => {
        const fetchWalletInfo = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await walletApi.getWalletData();
                setWallet({
                    xlmBalance: response.xlmBalance,
                    mamaBalance: response.mamaBalance,
                    stellarAddress: response.stellarAddress,
                });
                const transactions = await walletApi.getTransactions();
                setTransactionArray(transactions);
            } catch (err) {
                console.error('Failed to fetch wallet info:', err);
                setError('Failed to load wallet information. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchWalletInfo();
    }, []);

    const copyToClipboard = () => {
        if (wallet?.stellarAddress) {
            navigator.clipboard.writeText(wallet.stellarAddress);
            setCopiedAddress(true);
            setTimeout(() => setCopiedAddress(false), 2000);
        }
    };

    if (loading) {
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

    if (error) {
        return (
            <div className="bg-white border border-red-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="text-red-600 font-semibold text-sm">{error}</p>
                        <p className="text-red-500 text-xs mt-1">Try refreshing the page or contact support.</p>
                    </div>
                </div>
            </div>
        );
    }
    const totalValue = (parseFloat(xlmBalance) + parseFloat(mamaBalance)).toFixed(2);

    return (
        <div className="space-y-8">
            {/* Balance Cards Grid */}
            <div className="space-y-4">
                <BalanceCard xlmBalance={xlmBalance} mamaBalance={mamaBalance} totalValue={totalValue} />
            </div>

            {/* Wallet Address Section */}
            {wallet?.stellarAddress && (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Wallet Address</h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Stellar blockchain address</p>
                        </div>
                        <span className="text-2xl">🔐</span>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200 mb-3">
                        <p className="text-sm text-slate-900 font-mono break-all leading-relaxed">
                            {wallet.stellarAddress}
                        </p>
                    </div>

                    <button
                        onClick={copyToClipboard}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${copiedAddress
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-700 active:scale-95'
                            }`}
                    >
                        {copiedAddress ? (
                            <>
                                <span>✓</span>
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <span>📋</span>
                                <span>Copy Address</span>
                            </>
                        )}
                    </button>

                    <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                        Use this address to receive payments on the Stellar network.
                    </p>
                </div>
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
