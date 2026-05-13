// app/(dashboard)/page.tsx
'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useWallet } from '@/lib/hooks/useWallet';
import { useMilestones } from '@/lib/hooks/useMilestones';
import Loading from '@/components/common/Loading';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { balance, isLoading: walletLoading } = useWallet();
  const { milestones, isLoading: milestonesLoading } = useMilestones();

  if (walletLoading || milestonesLoading) {
    return <Loading />;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Wallet Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Balance</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">MAMA Tokens</p>
                <p className="text-3xl font-bold text-pink-600">{balance?.mama || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">XLM Balance</p>
                <p className="text-3xl font-bold text-blue-600">{balance?.xlm || 0}</p>
              </div>
            </div>
          </div>

          {/* Milestones Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Milestones</h2>
              <a href="/dashboard/milestones" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                View All →
              </a>
            </div>
            <div className="space-y-2">
              {milestones.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{milestone.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{milestone.title}</p>
                      <p className="text-sm text-gray-600">Week {milestone.week}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-pink-600">+{milestone.tokenReward}</p>
                    {milestone.completed ? (
                      <span className="text-xs text-green-600">✓ Completed</span>
                    ) : (
                      <span className="text-xs text-gray-600">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a href="/dashboard/quizzes" className="block w-full p-3 text-center bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition font-medium text-sm">
                Take a Quiz
              </a>
              <a href="/dashboard/wallet" className="block w-full p-3 text-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium text-sm">
                View Wallet
              </a>
              <a href="/dashboard/profile" className="block w-full p-3 text-center bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition font-medium text-sm">
                Edit Profile
              </a>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Milestones Completed</p>
            <p className="text-3xl font-bold text-purple-600">{milestones.filter(m => m.completed).length}/{milestones.length}</p>
            <p className="text-xs text-gray-600 mt-2">Keep going! You're doing great! 💪</p>
          </div>
        </div>
      </div>
    </div>
  );
}
