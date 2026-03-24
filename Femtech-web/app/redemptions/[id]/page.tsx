'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { useWalletData } from '../../lib/hooks/useWalletData';
import BalanceCard from '../../components/wallet/BalanceCard';

export default function RedeemVoucherPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();
    const { mamaBalance, xlmBalance, loading: balancesLoading, error: balancesError } = useWalletData();

    // Redirect to login if not authenticated
    if (isInitialized && !isAuthenticated) {
        router.push('/login');
    }

    if (balancesLoading) {
        return (
            <div className="space-y-6">
                <style jsx>{`
                    @keyframes pulse-skeleton {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `}</style>
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (balancesError) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600 font-semibold">{balancesError}</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
                <div className="mb-4 text-4xl">🎁</div>
                <h1 className="text-xl font-semibold mb-2">Redeem Voucher</h1>
                <p className="text-gray-600 mb-6">Voucher ID: {id}</p>
                <p className="text-gray-600">This is a placeholder page for redeeming voucher with ID: {id}. Implement redemption logic here.</p>
            </div>
            <div className="ml-10">
                <BalanceCard xlmBalance={xlmBalance} mamaBalance={mamaBalance} />
            </div>
        </main>
    );
}