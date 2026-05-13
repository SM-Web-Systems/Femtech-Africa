'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { useLanguage } from '@/app/lib/i18n/LanguageContext';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t } = useLanguage();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_data');

    if (!storedToken) {
      router.push('/auth/login');
      return;
    }

    if (!token && storedToken) setToken(storedToken);
    if (!user && storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (e) { console.error('Failed to parse stored user data'); }
    }

    setIsLoading(false);
  }, [router, token, user, setToken, setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div></div>
          <p className="text-gray-600 font-medium">{t('dashboard.loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  const displayName = user?.name || user?.phone || 'User';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MamaTokens {t('nav.dashboard')}</h1>
          <div className="text-sm text-gray-600">
            {t('dashboard.welcomeBack')} <strong>{displayName}</strong>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="w-64 bg-white border-r border-gray-200 p-6 hidden lg:block min-h-[calc(100vh-80px)]">
          <div className="space-y-2">
            <NavLink href="/dashboard" label={`📊 ${t('nav.dashboard')}`} />
            <NavLink href="/dashboard/wallet" label={`💰 ${t('nav.wallet')}`} />
            <NavLink href="/dashboard/milestones" label={`✅ ${t('nav.milestones')}`} />
            <NavLink href="/dashboard/quizzes" label={`🧠 ${t('nav.quizzes')}`} />
            <NavLink href="/dashboard/redemptions" label={`🎁 ${t('nav.redemptions')}`} />
            <NavLink href="/dashboard/profile" label={`👤 ${t('nav.profile')}`} />
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block px-4 py-2 rounded-lg transition text-gray-700 hover:bg-blue-100 hover:text-blue-700">
      {label}
    </Link>
  );
}
