'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';

interface User {
  id: string;
  phone: string;
  country: string;
  status: string;
  walletAddress: string | null;
  milestones: number;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers(page, 20);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.phone.toLowerCase().includes(search.toLowerCase()) ||
    user.country.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = { ZA: '🇿🇦', KE: '🇰🇪', UG: '🇺🇬', NG: '🇳🇬', GH: '🇬🇭' };
    return flags[country] || '🌍';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-lg text-gray-800">Loading users...</div></div>;
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-700">{error}</p><button onClick={fetchUsers} className="mt-2 text-red-700 underline font-medium">Retry</button></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-700">{pagination.total} total users</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <input
          type="text"
          placeholder="Search by phone or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Country</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Wallet</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Milestones</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.phone}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-gray-900">
                    {getCountryFlag(user.country)} {user.country}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {user.walletAddress ? (
                    <span className="font-mono">{user.walletAddress.substring(0, 8)}...</span>
                  ) : (
                    <span className="text-gray-600 italic">No wallet</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
                    {user.milestones}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
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
