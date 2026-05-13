'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { useLanguage, languages as langList } from '@/app/lib/i18n/LanguageContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [hydrated, setHydrated] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/auth/login');
  };

  const isAuthPage = pathname.startsWith('/auth');
  if (isAuthPage) return null;

  const showAuthLinks = hydrated && isAuthenticated;

  const currentLang = langList.find(l => l.code === language);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          MamaTokens
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
            {t('nav.home')}
          </Link>

          {showAuthLinks && (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition">
                {t('nav.dashboard')}
              </Link>
              <Link href="/dashboard/milestones" className="text-gray-700 hover:text-blue-600 font-medium transition">
                {t('nav.milestones')}
              </Link>
              <Link href="/dashboard/wallet" className="text-gray-700 hover:text-blue-600 font-medium transition">
                {t('nav.wallet')}
              </Link>
              <Link href="/dashboard/quizzes" className="text-gray-700 hover:text-blue-600 font-medium transition">
                {t('nav.quizzes')}
              </Link>
              <Link href="/dashboard/profile" className="text-gray-700 hover:text-blue-600 font-medium transition">
                {t('nav.profile')}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                {t('nav.logout')}
              </button>
            </>
          )}

          {hydrated && !isAuthenticated && (
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              {t('nav.login')}
            </Link>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition px-2 py-1 rounded-lg hover:bg-gray-100"
            >
              <span>{currentLang?.flag}</span>
              <span className="text-sm">{currentLang?.code.toUpperCase()}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {langList.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 ${
                      language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.native}</span>
                    {language === lang.code && (
                      <span className="ml-auto text-blue-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
