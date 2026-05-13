'use client';

import { useState } from 'react';
import { Transaction } from '../../lib/services/useWallet';

export default function TransactionsList({ transactionArray }: { transactionArray: Transaction[] }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
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
                                        {tx.type.replace("_", " ")}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}