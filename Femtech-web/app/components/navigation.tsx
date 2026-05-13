'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/lib/store/auth.store';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    const handleLogout = () => {
        logout();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        router.push('/auth/login');
    }

    // Hide nav on auth pages
    const isAuthPage = pathname.startsWith('/auth');
    if (isAuthPage) return null;

    // Don't render auth-dependent links until hydrated
    const showAuthLinks = hydrated && isAuthenticated;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                    MamaTokens
                </Link>

                <div className="flex gap-8">
                    <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
                        Home
                    </Link>
                    
                    {showAuthLinks && (
                        <>
                            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition">
                                Dashboard
                            </Link>
                            <Link href="/dashboard/milestones" className="text-gray-700 hover:text-blue-600 font-medium transition">
                                Milestones
                            </Link>
                            <Link href="/dashboard/wallet" className="text-gray-700 hover:text-blue-600 font-medium transition">
                                Wallet
                            </Link>
                            <Link href="/dashboard/quizzes" className="text-gray-700 hover:text-blue-600 font-medium transition">
                                Quizzes
                            </Link>
                            <Link href="/dashboard/profile" className="text-gray-700 hover:text-blue-600 font-medium transition">
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Logout
                            </button>
                        </>
                    )}

                    {hydrated && !isAuthenticated && (
                        <Link
                            href="/auth/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
