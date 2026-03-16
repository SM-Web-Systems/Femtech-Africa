'use client';

import { useState, useEffect } from 'react';
import { walletApi } from './useWallet';

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

    const xlmValue = parseFloat(wallet?.xlmBalance || '0');
    const mamaValue = parseFloat(wallet?.mamaBalance || '0');
    const totalValue = (xlmValue + mamaValue).toFixed(2);

    return (
        <div className="space-y-8">
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

                * {
                    font-family: 'Sora', sans-serif;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes shimmer {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }

                @keyframes glow {
                    0%, 100% {
                        box-shadow: 0 0 0 0 var(--glow-color);
                    }
                    50% {
                        box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
                    }
                }

                .wallet-card {
                    animation: fadeInScale 0.5s ease-out;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .wallet-card:nth-child(1) {
                    animation-delay: 0s;
                    --glow-color: rgba(168, 85, 247, 0.5);
                }

                .wallet-card:nth-child(2) {
                    animation-delay: 0.1s;
                    --glow-color: rgba(59, 130, 246, 0.5);
                }

                .wallet-card:nth-child(3) {
                    animation-delay: 0.2s;
                    --glow-color: rgba(34, 197, 94, 0.5);
                }

                .wallet-card:hover {
                    transform: translateY(-8px) scale(1.02);
                }

                .wallet-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
                    pointer-events: none;
                }

                .balance-number {
                    background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .wallet-icon {
                    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
                    animation: shimmer 3s ease-in-out infinite;
                }

                .transaction-item {
                    animation: fadeInUp 0.3s ease-out;
                    transition: all 0.2s ease-out;
                }

                .transaction-item:hover {
                    background-color: rgba(59, 130, 246, 0.05);
                    transform: translateX(4px);
                }
            `}</style>

            {/* Balance Cards Grid - Horizontal Layout */}
            <div className="space-y-4">
                {/* XLM Balance Card */}
                <div className="wallet-card bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl border border-purple-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div>
                            <p className="text-purple-100 text-xs font-semibold uppercase tracking-wider mr-3 opacity-80">
                                XLM Balance
                            </p>
                            <p className="text-purple-200 text-xs font-medium mt-1">Stellar Lumens</p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="balance-number text-4xl font-bold">
                            {wallet?.xlmBalance || '0'}
                        </p>
                        <p className="text-purple-100 text-xs opacity-75 mt-1">Primary network token</p>
                    </div>
                </div>

                {/* MAMA Balance Card */}
                <div className="wallet-card bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl border border-blue-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div>
                            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mr-3 opacity-80">
                                MAMA Balance
                            </p>
                            <p className="text-blue-200 text-xs font-medium mt-1">MAMA Tokens</p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="balance-number text-4xl font-bold">
                            {wallet?.mamaBalance || '0'}
                        </p>
                        <p className="text-blue-100 text-xs opacity-75 mt-1">Community token</p>
                    </div>
                </div>

                {/* Total Value Card */}
                <div className="wallet-card bg-gradient-to-r from-emerald-600 via-green-700 to-teal-800 rounded-2xl p-6 text-white shadow-xl border border-green-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div>
                            <p className="text-green-100 text-xs font-semibold uppercase tracking-wider opacity-80">
                                Total Value
                            </p>
                            <p className="text-green-200 text-xs font-medium mt-1">Combined Value</p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="balance-number text-4xl font-bold">
                            {totalValue}
                        </p>
                        <p className="text-green-100 text-xs opacity-75 mt-1">XLM + MAMA</p>
                    </div>
                </div>
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
                        <p className="text-sm text-slate-900 font-mono break-all leading-relaxed font-medium">
                            {wallet.stellarAddress}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
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
                    </div>

                    <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                        Use this address to receive payments on the Stellar network. Keep it private and secure.
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
                            className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${isDropdownOpen ? 'rotate-90' : 'rotate-0'
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
                                        className="transaction-item block"
                                    >
                                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200 hover:border-blue-300 group">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
                                                    Transaction {index + 1}
                                                </p>
                                                <span className="text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition">
                                                    View ↗
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-900 font-mono break-all leading-relaxed font-medium">
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
