'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth on mount
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/auth/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const displayName = user?.name || user?.phone || 'User';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MamaTokens Dashboard</h1>
          <div className="text-sm text-gray-600">
            Welcome, <strong>{displayName}</strong>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar - Desktop only */}
        <nav className="w-64 bg-white border-r border-gray-200 p-6 hidden lg:block min-h-[calc(100vh-80px)]">
          <div className="space-y-2">
            <NavLink href="/dashboard" label="📊 Dashboard" />
            <NavLink href="/dashboard/wallet" label="💰 Wallet" />
            <NavLink href="/dashboard/milestones" label="✅ Milestones" />
            <NavLink href="/dashboard/quizzes" label="🧠 Quizzes" />
            <NavLink href="/dashboard/redemptions" label="🎁 Redemptions" />
            <NavLink href="/dashboard/profile" label="👤 Profile" />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 rounded-lg transition text-gray-700 hover:bg-blue-100 hover:text-blue-700"
    >
      {label}
    </Link>
  );
}
