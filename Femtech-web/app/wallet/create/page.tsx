'use client';

import { useState } from "react";
import { walletApi, CreateWalletResponse } from "../../components/useWallet";
import { useRouter } from 'next/navigation';

export default function CreateWallet() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [walletData, setWalletData] = useState<CreateWalletResponse | null>(null);

    const router = useRouter();

    const handleCreateWallet = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await walletApi.createWallet();
            if (response.success) {
                setWalletData(response);
            } else {
                setError(response.message || 'Failed to create wallet. Please try again.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleDone = () => {
        setWalletData(null);
        router.push('/profile');
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold mb-6">Create Wallet</h1>
                    <p className="text-xl text-blue-100">
                        Our mission is to support the mental health and wellbeing of pregnant mothers
                        across Africa through accessible, compassionate, and evidence-based resources.
                    </p>
                </div>
            </section>

            {/* Create Wallet Button */}
            {!walletData ? (
                <section className="px-4 py-20">
                    <div className="max-w-4xl mx-auto text-center">

                        <button
                            onClick={handleCreateWallet}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
                            disabled={loading}
                        >
                            {loading ? 'Creating Wallet...' : 'Create Wallet'}
                        </button>
                        {error && <p className="text-red-600 mt-4">{error}</p>}
                    </div>
                </section>) :
                (
                    <section className="px-4 py-20">
                        <div className="max-w-4xl mx-auto text-center">
                            {walletData && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <h2 className="text-2xl font-bold text-green-700 mb-4">Wallet Created Successfully!</h2>
                                    <p className="text-green-700 mb-2"><strong>Stellar Address:</strong> {walletData.publicKey}</p>
                                    <p className="text-green-700 mb-4"><strong>Secret Key:</strong> {walletData.secretKey}</p>
                                    <p className="text-green-700 mb-4">{walletData.message}</p>
                                </div>
                            )}
                        </div>
                        <div className="max-w-4xl mx-auto text-center mt-6">
                            <div className="max-w-4xl mx-auto text-center">
                                <button
                                    onClick={handleDone}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </section>)}
        </main>
    )
}