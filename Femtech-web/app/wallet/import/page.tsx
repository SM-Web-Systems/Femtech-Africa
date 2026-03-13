'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { walletApi } from "../../components/useWallet";

export default function ImportWallet() {

    const [secretKey, setSecretKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const router = useRouter();

    async function handleWalletImport(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            await walletApi.importWallet(secretKey);

            setSuccess("Wallet imported successfully!");
            setSecretKey("");
            router.push('/profile');

        } catch (err: any) {
            setError(err.message || "Failed to import wallet");
        }

        setLoading(false);
    }

    return (
        <main className="min-h-screen bg-white">

            {/* Hero */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold mb-6">Import Your Existing Wallet</h1>

                    <p className="text-xl text-blue-100 mb-10">
                        If you already have a Stellar wallet, enter your secret key below to import it
                        and manage your MamaTokens.
                    </p>

                    {/* Form */}
                    <form
                        onSubmit={handleWalletImport}
                        className="bg-white text-gray-800 rounded-xl p-8 shadow-lg max-w-xl"
                    >

                        <label className="block text-sm font-semibold mb-2">
                            Stellar Secret Key
                        </label>

                        <input
                            type="password"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            placeholder="SA..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />

                        <p className="text-sm text-gray-500 mb-6">
                            Your secret key is encrypted before being stored. Never share it with anyone.
                        </p>

                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition w-full"
                        >
                            {loading ? "Importing..." : "Import Wallet"}
                        </button>

                    </form>

                </div>
            </section>

        </main>
    );
}