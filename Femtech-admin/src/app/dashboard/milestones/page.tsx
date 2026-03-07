'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';

interface Milestone {
  id: string;
  name: string;
  category: string;
  rewardAmount: number;
  completions: number;
  active?: boolean;
}

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getMilestones();
      setMilestones(data.milestones);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  const filteredMilestones = milestones.filter(m =>
    filter === 'all' || m.category === filter
  );

  const categories = [...new Set(milestones.map(m => m.category))];

  const totalCompletions = milestones.reduce((sum, m) => sum + m.completions, 0);
  const totalTokensDistributed = milestones.reduce((sum, m) => sum + (m.completions * m.rewardAmount), 0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      clinical: 'bg-blue-100 text-blue-800',
      wellness: 'bg-green-100 text-green-800',
      education: 'bg-purple-100 text-purple-800',
      community: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      clinical: '🏥',
      wellness: '💪',
      education: '📚',
      community: '👥',
    };
    return icons[category] || '🎯';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-lg text-gray-600">Loading milestones...</div></div>;
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">{error}</p><button onClick={fetchMilestones} className="mt-2 text-red-600 underline">Retry</button></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Milestones</h1>
        <p className="text-gray-500">Manage reward milestones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Total Milestones</p>
          <p className="text-3xl font-bold text-gray-800">{milestones.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Total Completions</p>
          <p className="text-3xl font-bold text-green-600">{totalCompletions}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Tokens to Distribute</p>
          <p className="text-3xl font-bold text-pink-600">{totalTokensDistributed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Avg per User</p>
          <p className="text-3xl font-bold text-blue-600">{totalCompletions > 0 ? (totalTokensDistributed / totalCompletions).toFixed(0) : 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg ${filter === cat ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {getCategoryIcon(cat)} {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Milestone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reward</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tokens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredMilestones.map((milestone) => (
              <tr key={milestone.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(milestone.category)}</span>
                    <span className="font-medium text-gray-900">{milestone.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(milestone.category)}`}>
                    {milestone.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-pink-600">
                  {milestone.rewardAmount} MAMA
                </td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {milestone.completions}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {milestone.completions * milestone.rewardAmount} MAMA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
