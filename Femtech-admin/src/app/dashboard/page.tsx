'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalTokensMinted: number;
  totalRedemptions: number;
  milestonesCompleted: number;
  pendingRewards: number;
}

interface Activity {
  type: string;
  description: string;
  user: string;
  timestamp: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, activityData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getActivity(),
      ]);
      setStats(statsData);
      // API returns array directly
      setActivities(Array.isArray(activityData) ? activityData : activityData.activities || []);
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-800">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <button onClick={fetchData} className="mt-2 text-red-700 underline font-medium">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-700">Welcome to MamaTokens Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-2xl"></span>
            </div>
          </div>
          <p className="text-sm text-green-700 mt-2 font-medium">
            {stats?.activeUsers || 0} active in last 24h
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Tokens Minted</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalTokensMinted || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl"></span>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-2 font-medium">MAMA tokens</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Redemptions</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalRedemptions || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl"></span>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-2 font-medium">Total redemptions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Milestones Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.milestonesCompleted || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl"></span>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-2 font-medium">Across all users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Pending Rewards</p>
              <p className="text-3xl font-bold text-orange-600">{stats?.pendingRewards || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl"></span>
            </div>
          </div>
          <p className="text-sm text-orange-700 mt-2 font-medium">Awaiting minting</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.length === 0 ? (
            <div className="p-6 text-center text-gray-700">No recent activity</div>
          ) : (
            activities.slice(0, 10).map((activity, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'transaction' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <span>{activity.type === 'transaction' ? '' : ''}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-700">{activity.user}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
