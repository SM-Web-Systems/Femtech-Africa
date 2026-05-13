'use client';

import { Card } from '@/app/components/common/Card';
import { useWalletBalance } from '@/app/lib/hooks/useWallet';
import { useMilestoneDefinitions, useMilestones } from '@/app/lib/hooks/useMilestones';
import { useGetProfile } from '@/app/lib/hooks/useProfile';
import { useMyQuizAttempts } from '@/app/lib/hooks/useQuizzes';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { useLanguage } from '@/app/lib/i18n/LanguageContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { t } = useLanguage();
  const user = useAuthStore((state) => state.user);
  const { data: profileData } = useGetProfile(true);
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const { data: userMilestones } = useMilestones();
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('dashboard.welcomeBack')} {displayName}! 👋</h1>
        <p className="text-gray-600 text-lg">{t('dashboard.continueJourney')}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card hover className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm">{t('dashboard.mamaBalance')}</p>
                <p className="text-4xl font-bold mt-2">{balanceLoading ? '...' : mamaBalance}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
            <p className="text-blue-100 text-sm">{balance?.hasWallet ? t('dashboard.stellarWalletActive') : t('dashboard.noWallet')}</p>
          </div>
        </Card>

        <Card hover className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm">{t('dashboard.milestones')}</p>
                <p className="text-4xl font-bold mt-2">{completedCount}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
            <p className="text-green-100 text-sm">{t('common.of')} {totalDefinitions} {t('common.available')}</p>
          </div>
        </Card>

        <Card hover className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm">{t('dashboard.quizzesPassed')}</p>
                <p className="text-4xl font-bold mt-2">{passedQuizzes}</p>
              </div>
              <div className="text-4xl">🧠</div>
            </div>
            <p className="text-purple-100 text-sm">{totalAttempts} {t('dashboard.totalAttempts')}</p>
          </div>
        </Card>

        <Card hover className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm">{t('dashboard.progress')}</p>
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

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('dashboard.quickActions')}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/dashboard/quizzes">
            <Card hover className="cursor-pointer">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🧠</span>
                <div>
                  <p className="font-bold text-gray-900">{t('dashboard.takeQuiz')}</p>
                  <p className="text-sm text-gray-600">{t('dashboard.takeQuizDesc')}</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/dashboard/wallet">
            <Card hover className="cursor-pointer">
              <div className="flex items-center gap-4">
                <span className="text-4xl">💰</span>
                <div>
                  <p className="font-bold text-gray-900">{t('dashboard.viewWallet')}</p>
                  <p className="text-sm text-gray-600">{t('dashboard.viewWalletDesc')}</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/dashboard/milestones">
            <Card hover className="cursor-pointer">
              <div className="flex items-center gap-4">
                <span className="text-4xl">✅</span>
                <div>
                  <p className="font-bold text-gray-900">{t('dashboard.milestonesAction')}</p>
                  <p className="text-sm text-gray-600">{t('dashboard.milestonesActionDesc')}</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
