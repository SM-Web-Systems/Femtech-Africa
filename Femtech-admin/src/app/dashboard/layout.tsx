'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard/', label: 'Dashboard', icon: '' },
  { href: '/dashboard/users/', label: 'Users', icon: '' },
  { href: '/dashboard/transactions/', label: 'Transactions', icon: '' },
  { href: '/dashboard/redemptions/', label: 'Redemptions', icon: '' },
  { href: '/dashboard/milestones/', label: 'Milestones', icon: '' },
  { href: '/dashboard/settings/', label: 'Settings', icon: '' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/';
  };

  if (!mounted) return null;

  const isActive = (href: string) => {
    if (href === '/dashboard/') {
      return pathname === '/dashboard' || pathname === '/dashboard/';
    }
    return pathname?.startsWith(href.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg relative">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-pink-600">MamaTokens</h1>
          <p className="text-sm text-gray-700">Admin Dashboard</p>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive(item.href)
                  ? 'bg-pink-100 text-pink-700 font-medium'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
          >
            <span></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
