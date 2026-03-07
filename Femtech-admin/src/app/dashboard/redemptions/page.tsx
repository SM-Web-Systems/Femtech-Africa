'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';

interface Redemption {
  id: string;
  userPhone: string;
  partnerName: string;
  productName: string;
  tokensSpent: number;
  voucherCode: string | null;
  status: string;
  createdAt: string;
}

export default function RedemptionsPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchRedemptions();
  }, [page]);

  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getRedemptions(page, 20);
      setRedemptions(data.redemptions);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load redemptions');
    } finally {
      setLoading(false);
    }
  };

  const filteredRedemptions = redemptions.filter(r => filter === 'all' || r.status === filter);
  const totalTokensRedeemed = redemptions.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.tokensSpent, 0);
  const pendingCount = redemptions.filter(r => r.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'failed': return '❌';
      default: return '📋';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-lg text-gray-800">Loading redemptions...</div></div>;
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-700">{error}</p><button onClick={fetchRedemptions} className="mt-2 text-red-700 underline font-medium">Retry</button></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Redemptions</h1>
        <p className="text-gray-700">Token redemption history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-700">Total Redemptions</p>
          <p className="text-3xl font-bold text-gray-900">{pagination.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-700">Tokens Redeemed</p>
          <p className="text-3xl font-bold text-pink-600">{totalTokensRedeemed} MAMA</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-700">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'completed', 'processing', 'pending', 'failed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg font-medium ${filter === f ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Partner</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tokens</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Voucher</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRedemptions.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-700">No redemptions found</td></tr>
            ) : (
              filteredRedemptions.map((redemption) => (
                <tr key={redemption.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-medium">{redemption.userPhone}</td>
                  <td className="px-6 py-4 text-gray-900">{redemption.partnerName}</td>
                  <td className="px-6 py-4 text-gray-800">{redemption.productName}</td>
                  <td className="px-6 py-4 font-medium text-pink-600">{redemption.tokensSpent} MAMA</td>
                  <td className="px-6 py-4">
                    {redemption.voucherCode ? (
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-900">{redemption.voucherCode}</span>
                    ) : (
                      <span className="text-gray-600 italic">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(redemption.status)}`}>
                      {getStatusIcon(redemption.status)} {redemption.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{new Date(redemption.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 text-gray-800">Previous</button>
          <span className="px-4 py-2 text-gray-800">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 text-gray-800">Next</button>
        </div>
      )}
    </div>
  );
}
