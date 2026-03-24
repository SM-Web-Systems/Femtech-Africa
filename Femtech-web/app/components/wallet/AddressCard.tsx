'use client';

import { useState } from 'react';

export default function AddressCard({ address }: { address: string }) {
    const [copiedAddress, setCopiedAddress] = useState(false);

    const copyToClipboard = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopiedAddress(true);
            setTimeout(() => setCopiedAddress(false), 2000);
        }
    };

    return (
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
                    {address}
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
    )
}