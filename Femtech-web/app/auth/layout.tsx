'use client';

import { useLanguage } from '@/app/lib/i18n/LanguageContext';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">MamaTokens</h1>
          <p className="text-gray-600 mt-2">{t('auth.maternalHealthRewards')}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
