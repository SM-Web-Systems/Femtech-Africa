'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';

interface Transaction {
  id: string;
  type: string;
  userPhone: string;
  amount: number;
  status: string;
  txHash: string | null;
  fullTxHash: string | null;
  createdAt: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getTransactions(page, 20);
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx =>
    filter === 'all' || tx.type.includes(filter)
  );

  const getTypeColor = (type: string) => {
    if (type.includes('mint')) return 'bg-green-100 text-green-800';
    if (type.includes('burn')) return 'bg-red-100 text-red-800';
    if (type.includes('transfer')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('mint')) return '⬆️';
    if (type.includes('burn')) return '🔥';
    if (type.includes('transfer')) return '↔️';
    return '💰';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-lg text-gray-600">Loading transactions...</div></div>;
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">{error}</p><button onClick={fetchTransactions} className="mt-2 text-red-600 underline">Retry</button></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-gray-500">{pagination.total} total transactions</p>
        </div>
        <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('mint')}
            className={`px-4 py-2 rounded-lg ${filter === 'mint' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            ⬆️ Mints
          </button>
          <button
            onClick={() => setFilter('burn')}
            className={`px-4 py-2 rounded-lg ${filter === 'burn' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            🔥 Burns
          </button>
          <button
            onClick={() => setFilter('transfer')}
            className={`px-4 py-2 rounded-lg ${filter === 'transfer' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            ↔️ Transfers
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TX Hash</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(tx.type)}`}>
                      {getTypeIcon(tx.type)} {tx.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{tx.userPhone}</td>
                  <td className="px-6 py-4">
                    <span className={tx.type.includes('mint') ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {tx.type.includes('mint') ? '+' : '-'}{Math.abs(tx.amount)} MAMA
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {tx.fullTxHash ? (
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${tx.fullTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-mono text-sm"
                      >
                        {tx.txHash}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page} of {pagination.pages}</span>
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
