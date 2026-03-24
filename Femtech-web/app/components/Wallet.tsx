'use client';

import { useWalletData } from '../lib/hooks/useWalletData';
import { useWalletTransactions } from '../lib/hooks/useWalletTransactions';
import BalanceCard from './wallet/BalanceCard';
import AddressCard from './wallet/AddressCard';
import TransactionsList from './wallet/TransactionsList';

export default function Wallet() {

    const { mamaBalance, xlmBalance, stellarAddress, loading: balancesLoading, error: balancesError } = useWalletData();
    const { transactionArray, loading: transactionsLoading, error: transactionsError } = useWalletTransactions();

    if (balancesLoading || transactionsLoading) {
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

    if (balancesError || transactionsError) {
        return (
            <div className="bg-white border border-red-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="text-red-600 font-semibold text-sm">{balancesError || transactionsError}</p>
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
                <TransactionsList transactionArray={transactionArray} />
            )}
        </div >
    );
}
