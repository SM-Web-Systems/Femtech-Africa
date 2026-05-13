'use client';

import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { useWalletBalance } from '@/app/lib/hooks/useWallet';
import { useMilestones } from '@/app/lib/hooks/useMilestones';
import { useGetProfile } from '@/app/lib/hooks/useProfile';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: profileData, isLoading: profileLoading } = useGetProfile(true);
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const { data: milestones, isLoading: milestonesLoading } = useMilestones();

  const displayName = profileData?.name || profileData?.phone || 'User';
  const completedCount = milestones?.filter((m) => m.completed).length || 0;
  const totalCount = milestones?.length || 0;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const upcomingMilestones = milestones?.filter((m) => !m.completed).slice(0, 3) || [];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {displayName}! 👋
        </h1>
        <p className="text-gray-600 text-lg">Continue your journey to better maternal health</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card hover className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm">Total Balance</p>
                <p className="text-4xl font-bold mt-2">
                  {balanceLoading ? '...' : balance?.balance || 0}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
            <p className="text-blue-100 text-sm">{balance?.currency} Tokens</p>
          </div>
        </Card>

        <Card hover className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-4xl font-bold mt-2">{completedCount}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
            <p className="text-green-100 text-sm">of {totalCount} milestones</p>
          </div>
        </Card>

        <Card hover className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm">Progress</p>
                <p className="text-4xl font-bold mt-2">{completionRate}%</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
            <div className="w-full bg-purple-400 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </Card>

        <Card hover className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm">Available</p>
                <p className="text-4xl font-bold mt-2">
                  {balance && balance.balance > 0 ? '✓' : '○'}
                </p>
              </div>
              <div className="text-4xl">🎁</div>
            </div>
            <p className="text-orange-100 text-sm">
              {balance && balance.balance > 0 ? 'Ready to redeem' : 'Complete milestones'}
            </p>
          </div>
        </Card>
      </div>

      {/* Upcoming Milestones */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Milestones</h2>
          <Link href="/dashboard/milestones">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {milestonesLoading ? (
          <Card>
            <p className="text-gray-600 text-center py-8">Loading milestones...</p>
          </Card>
        ) : upcomingMilestones.length === 0 ? (
          <Card className="bg-green-50 border-green-200">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-green-700 font-semibold text-lg">All milestones completed!</p>
              <p className="text-green-600 mt-2">You're doing amazing! Keep up the great work.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcomingMilestones.map((milestone) => (
              <Card key={milestone.id} hover>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 flex-1">
                    <div className="text-5xl flex-shrink-0">{milestone.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{milestone.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                      <div className="flex gap-6 mt-3 text-sm text-gray-500">
                        <span>📅 Week {milestone.week}</span>
                        <span>🏆 +{milestone.reward} MAMA</span>
                        <span className="capitalize">{milestone.category}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/milestones/${milestone.id}`}>
                    <Button variant="primary" size="sm">
                      Start
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
