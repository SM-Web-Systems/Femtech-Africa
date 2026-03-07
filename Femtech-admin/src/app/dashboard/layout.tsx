"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Users", href: "/dashboard/users", icon: "👥" },
  { name: "Transactions", href: "/dashboard/transactions", icon: "💰" },
  { name: "Redemptions", href: "/dashboard/redemptions", icon: "🎁" },
  { name: "Milestones", href: "/dashboard/milestones", icon: "🎯" },
  { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) router.push("/");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800">MamaTokens</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? "bg-pink-50 text-pink-600" : "text-gray-600 hover:bg-gray-50"}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 w-full">
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="bg-white shadow-sm lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setSidebarOpen(true)} className="text-2xl">☰</button>
            <h1 className="font-bold text-gray-800">MamaTokens Admin</h1>
            <div className="w-6" />
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
