'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';

export default function RedeemVoucherPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();

    // Redirect to login if not authenticated
    if (isInitialized && !isAuthenticated) {
        router.push('/login');
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
                <div className="mb-4 text-4xl">🎁</div>
                <h1 className="text-xl font-semibold mb-2">Redeem Voucher</h1>
                <p className="text-gray-600 mb-6">Voucher ID: {id}</p>
                <p className="text-gray-600">This is a placeholder page for redeeming voucher with ID: {id}. Implement redemption logic here.</p>
            </div>
        </main>
    );
}