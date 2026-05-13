'use client';

import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { useWalletBalance } from '@/app/lib/hooks/useWallet';
import { useMilestoneDefinitions, useMilestones } from '@/app/lib/hooks/useMilestones';
import { useGetProfile } from '@/app/lib/hooks/useProfile';
import { useMyQuizAttempts } from '@/app/lib/hooks/useQuizzes';
import { useAuthStore } from '@/app/lib/store/auth.store';
import Link from 'next/link';

const iconMap: Record<string, string> = {
  hospital: '🏥', scan: '🔍', test: '🧪', vaccine: '💉', calendar: '📅',
  baby: '👶', scale: '⚖️', heart: '❤️', book: '📖', alert: '⚠️',
  user: '👤', users: '👥', share: '🔗', gift: '🎁',
};

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: profileData, isLoading: profileLoading } = useGetProfile(true);
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const { data: userMilestones, isLoading: milestonesLoading } = useMilestones();
  const { data: milestoneDefinitions } = useMilestoneDefinitions();
  const { data: quizAttempts } = useMyQuizAttempts();

  const displayName = profileData?.firstName || user?.phone || 'User';
  const mamaBalance = balance ? parseFloat(balance.mamaBalance || '0') : 0;

  const completedCount = userMilestones?.filter(m => m.status === 'completed').length || 0;
  const totalDefinitions = milestoneDefinitions?.length || 0;
  const completionRate = totalDefinitions > 0 ? Math.round((completedCount / totalDefinitions) * 100) : 0;

  const passedQuizzes = quizAttempts?.filter(a => a.passed).length || 0;
  const totalAttempts = quizAttempts?.length || 0;

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
                <p className="text-blue-100 text-sm">MAMA Balance</p>
                <p className="text-4xl font-bold mt-2">{balanceLoading ? '...' : mamaBalance}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
            <p className="text-blue-100 text-sm">{balance?.hasWallet ? 'Stellar Wallet Active' : 'No Wallet'}</p>
          </div>
        </Card>

        <Card hover className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm">Milestones</p>
                <p className="text-4xl font-bold mt-2">{completedCount}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
            <p className="text-green-100 text-sm">of {totalDefinitions} available</p>
          </div>
        </Card>

        <Card hover className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm">Quizzes Passed</p>
                <p className="text-4xl font-bold mt-2">{passedQuizzes}</p>
              </div>
              <div className="text-4xl">🧠</div>
            </div>
            <p className="text-purple-100 text-sm">{totalAttempts} total attempts</p>
          </div>
        </Card>

        <Card hover className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm">Progress</p>
                <p className="text-4xl font-bold mt-2">{completionRate}%</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
            <div className="w-full bg-orange-400 rounded-full h-2">
              <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/dashboard/quizzes">
            <Card hover className="cursor-pointer">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🧠</span>
                <div>
                  <p className="font-bold text-gray-900">Take a Quiz</p>
                  <p className="text-sm text-gray-600">Earn tokens by testing your knowledge</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/dashboard/wallet">
            <Card hover className="cursor-pointer">
              <div className="flex items-center gap-4">
                <span className="text-4xl">💰</span>
                <div>
                  <p className="font-bold text-gray-900">View Wallet</p>
                  <p className="text-sm text-gray-600">Check balance and transactions</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/dashboard/milestones">
            <Card hover className="cursor-pointer">
              <div className="flex items-center gap-4">
                <span className="text-4xl">✅</span>
                <div>
                  <p className="font-bold text-gray-900">Milestones</p>
                  <p className="text-sm text-gray-600">Track your pregnancy journey</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
