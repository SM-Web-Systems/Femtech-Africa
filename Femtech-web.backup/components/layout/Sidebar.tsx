// components/layout/Sidebar.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import Link from 'next/link';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Milestones', href: '/dashboard/milestones', icon: '🎯' },
  { name: 'Quizzes', href: '/dashboard/quizzes', icon: '🧠' },
  { name: 'Wallet', href: '/dashboard/wallet', icon: '💰' },
  { name: 'Redemptions', href: '/dashboard/redemptions', icon: '🎁' },
  { name: 'Health', href: '/dashboard/health', icon: '❤️' },
  { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          F
        </div>
        <span className="font-bold text-lg text-gray-900">Femtech</span>
      </Link>

      {/* User Info */}
      {user && (
        <div className="mb-8 pb-6 border-b border-gray-200">
          <p className="text-xs text-gray-600 uppercase tracking-wider">Welcome</p>
          <p className="font-semibold text-gray-900 truncate">{user.firstName || user.phone}</p>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={\lex items-center gap-3 px-4 py-3 rounded-lg transition \\}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition w-full font-medium"
      >
        <span className="text-xl">🚪</span>
        Logout
      </button>
    </aside>
  );
}
