// components/layout/Header.tsx
'use client';

import { useAuthStore } from '@/lib/store/auth.store';
import { useThemeStore } from '@/lib/store/theme.store';

export default function Header() {
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'Mama'}! 👋
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Week {user?.gestationWeek || 'N/A'} of your pregnancy journey
        </p>
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
        title="Toggle theme"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
