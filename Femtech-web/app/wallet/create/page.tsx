'use client';

import { useState } from "react";
import { walletApi, CreateWalletResponse } from "../../lib/services/useWallet";
import { useRouter } from 'next/navigation';

export default function CreateWallet() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [walletData, setWalletData] = useState<CreateWalletResponse | null>(null);
    const [secretKeyCopied, setSecretKeyCopied] = useState(false);
    const [addressCopied, setAddressCopied] = useState(false);

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

    const copyToClipboard = (text: string, type: 'secret' | 'address') => {
        navigator.clipboard.writeText(text);
        if (type === 'secret') {
            setSecretKeyCopied(true);
            setTimeout(() => setSecretKeyCopied(false), 2000);
        } else {
            setAddressCopied(true);
            setTimeout(() => setAddressCopied(false), 2000);
        }
    };

    const handleDone = () => {
        setWalletData(null);
        router.push('/profile');
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-12 lg:py-16">
                <div className="max-w-full mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-400 flex items-center justify-center text-2xl">
                            💰
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold">Create Your Wallet</h1>
                            <p className="text-blue-100 text-sm lg:text-base">Securely store and manage your MAMA tokens</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-4 py-12 lg:py-16">
                <div className="w-full">
                    {!walletData ? (
                        /* Pre-Creation State */
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            {/* Left Column: Information Cards */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* What is a Wallet Card */}
                                <div className="bg-white rounded-lg border border-gray-200 p-5 lg:p-6 hover:shadow-md transition-shadow">
                                    <div className="flex gap-4">
                                        <span className="text-3xl flex-shrink-0">🔐</span>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">What is a Stellar Wallet?</h3>
                                            <p className="text-gray-600 text-sm lg:text-base">
                                                A Stellar wallet is your secure digital account on the blockchain. It holds your MAMA tokens and allows you to send, receive, and manage your rewards.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Why You Need It Card */}
                                <div className="bg-white rounded-lg border border-gray-200 p-5 lg:p-6 hover:shadow-md transition-shadow">
                                    <div className="flex gap-4">
                                        <span className="text-3xl flex-shrink-0">⭐</span>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Why You Need a Wallet</h3>
                                            <ul className="text-gray-600 text-sm lg:text-base space-y-2">
                                                <li className="flex gap-2">
                                                    <span className="flex-shrink-0">✓</span>
                                                    <span>Earn MAMA tokens by completing milestones</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="flex-shrink-0">✓</span>
                                                    <span>Redeem tokens for real rewards and services</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="flex-shrink-0">✓</span>
                                                    <span>Track your rewards on the blockchain</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="flex-shrink-0">✓</span>
                                                    <span>Secure access to your digital assets</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* How to Save Card */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 lg:p-6">
                                    <div className="flex gap-4">
                                        <span className="text-3xl flex-shrink-0">💡</span>
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Best Practices to Save Your Keys</h3>
                                            <ul className="text-blue-800 text-sm lg:text-base space-y-2">
                                                <li className="flex gap-2">
                                                    <span className="flex-shrink-0">✓</span>
                                                    <span>Write it down on paper and store it safely</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="flex-shrink-0">✓</span>
                                                    <span>Use a password manager (1Password, Bitwarden, LastPass)</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="flex-shrink-0">✓</span>
                                                    <span>Store multiple copies in different secure locations</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="flex-shrink-0">✓</span>
                                                    <span>Consider a hardware wallet for large amounts</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="flex-shrink-0">✓</span>
                                                    <span>Never store it in plain text files or email</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Security Warning & CTA */}
                            <div className="space-y-4 lg:space-y-6">
                                {/* Critical Warning Card */}
                                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5 lg:p-6 lg:sticky lg:top-4">
                                    <div className="flex gap-3 mb-4">
                                        <span className="text-3xl flex-shrink-0">⚠️</span>
                                        <h3 className="text-lg font-semibold text-red-900">Important Security Warning</h3>
                                    </div>
                                    <p className="text-red-800 mb-4 font-medium text-sm lg:text-base">
                                        Your Secret Key is like the master password to your wallet.
                                    </p>
                                    <ul className="text-red-800 text-sm lg:text-base space-y-2 mb-4">
                                        <li className="flex gap-2">
                                            <span className="flex-shrink-0">🔴</span>
                                            <span><strong>NEVER</strong> share your secret key with anyone</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="flex-shrink-0">🔴</span>
                                            <span><strong>NEVER</strong> post it online or in screenshots</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="flex-shrink-0">🔴</span>
                                            <span><strong>SAVE IT IMMEDIATELY</strong> in a safe place</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="flex-shrink-0">🔴</span>
                                            <span><strong>WE CANNOT RECOVER</strong> your wallet if you lose this key</span>
                                        </li>
                                    </ul>
                                    <p className="text-red-800 font-medium text-sm lg:text-base">
                                        If you lose your secret key, your wallet and all tokens will be permanently inaccessible.
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-600 font-medium text-sm lg:text-base">{error}</p>
                                    </div>
                                )}

                                {/* Create Button */}
                                <button
                                    onClick={handleCreateWallet}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 lg:py-4 rounded-lg transition flex items-center justify-center gap-2 text-base lg:text-lg"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Wallet...
                                        </>
                                    ) : (
                                        <>
                                            <span>🔐</span>
                                            Create My Wallet
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-gray-600 text-xs lg:text-sm">
                                    Once created, you'll see your wallet details. Make sure to save your secret key immediately!
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Post-Creation State */
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            {/* Main Content: Wallet Details */}
                            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                                {/* Success Banner */}
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6 lg:p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="text-5xl lg:text-6xl">✅</div>
                                        <div>
                                            <h2 className="text-2xl lg:text-3xl font-bold text-green-900 mb-1">Wallet Created Successfully!</h2>
                                            <p className="text-green-800 text-base lg:text-lg">
                                                Your Stellar wallet is ready. Now save your secret key!
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Wallet Address */}
                                <div className="bg-white rounded-lg border border-gray-200 p-5 lg:p-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Your Wallet Address (Public Key)
                                    </label>
                                    <div className="flex flex-col lg:flex-row gap-2">
                                        <input
                                            type="text"
                                            value={walletData.publicKey}
                                            readOnly
                                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-xs lg:text-sm text-gray-700"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(walletData.publicKey, 'address')}
                                            className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold rounded-lg transition whitespace-nowrap text-sm lg:text-base"
                                        >
                                            {addressCopied ? '✓ Copied' : 'Copy'}
                                        </button>
                                    </div>
                                    <p className="text-xs lg:text-sm text-gray-500 mt-2">
                                        You can safely share this address to receive payments
                                    </p>
                                </div>

                                {/* Secret Key */}
                                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5 lg:p-6">
                                    <div className="flex items-start gap-3 mb-4">
                                        <span className="text-2xl flex-shrink-0">⚠️</span>
                                        <div className="min-w-0">
                                            <label className="block text-sm font-bold text-red-900 mb-1">
                                                Your Secret Key (SAVE THIS NOW!)
                                            </label>
                                            <p className="text-xs lg:text-sm text-red-800 mb-3">
                                                This is your master password. Save it in a safe place. We cannot recover it if you lose it.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col lg:flex-row gap-2">
                                        <input
                                            type="text"
                                            value={walletData.secretKey}
                                            readOnly
                                            className="flex-1 px-4 py-3 bg-red-100 border-2 border-red-300 rounded-lg font-mono text-xs lg:text-sm text-red-900"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(walletData.secretKey, 'secret')}
                                            className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition whitespace-nowrap text-sm lg:text-base"
                                        >
                                            {secretKeyCopied ? '✓ Copied' : 'Copy Key'}
                                        </button>
                                    </div>
                                </div>

                                {/* Stellar Expert Link */}
                                {walletData.stellarExpert && (
                                    <div className="text-center">
                                        <a
                                            href={walletData.stellarExpert}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 font-semibold underline text-sm lg:text-base"
                                        >
                                            View wallet on Stellar Expert →
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Next Steps & CTA */}
                            <div className="space-y-4 lg:space-y-6">
                                {/* Next Steps */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 lg:p-6 lg:sticky lg:top-4">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Steps</h3>
                                    <ol className="text-blue-800 text-sm lg:text-base space-y-3">
                                        <li className="flex gap-3">
                                            <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                                            <span>Copy your secret key and save it in a secure location</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                                            <span>Use a password manager or write it down safely</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                                            <span>Do NOT share your secret key with anyone</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                                            <span>Click "Done" to go to your profile</span>
                                        </li>
                                    </ol>
                                </div>

                                {/* Done Button */}
                                <button
                                    onClick={handleDone}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 lg:py-4 rounded-lg transition text-base lg:text-lg flex items-center justify-center gap-2"
                                >
                                    <span>✓</span>
                                    I've Saved My Secret Key - Go to Profile
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
