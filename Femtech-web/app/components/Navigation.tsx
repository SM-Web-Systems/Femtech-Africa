'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import Link from 'next/link';

export default function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push('/');
    }

    // Check if we're on the profile page or the create wallet page to conditionally hide the Profile link
    const isProfilePage = pathname === '/profile';
    const isCreateWalletPage = pathname === '/wallet/create';
    const isImportWalletPage = pathname === '/wallet/import';
    const isMilestonePage = pathname === '/milestones';
    const isQuizzesPage = pathname === '/quizzes';
    const isRedemptionsPage = pathname === '/redemptions';

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo/Brand */}
                <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                    MamaTokens
                </Link>

                {/* Navigation Links */}
                <div className="flex gap-8">
                    <Link
                        href="/"
                        className="text-gray-700 hover:text-blue-600 font-medium transition"
                    >
                        Home
                    </Link>
                    {!isMilestonePage && (
                        <Link
                            href="/milestones"
                            className="text-gray-700 hover:text-blue-600 font-medium transition"
                        >
                            Milestones
                        </Link>)}
                    {!isQuizzesPage && (
                        <Link
                            href="/quizzes"
                            className="text-gray-700 hover:text-blue-600 font-medium transition"
                        >
                            Quizzes
                        </Link>
                    )}
                    {!isRedemptionsPage && isAuthenticated && (
                        <Link
                            href="/redemptions"
                            className="text-gray-700 hover:text-blue-600 font-medium transition"
                        >
                            Redemptions
                        </Link>
                    )}

                    {/* Auth Button */}
                    {isAuthenticated ? (
                        <div className="flex gap-6 items-center">
                            {/* Only show Profile link if NOT on profile page, create wallet page, or import wallet page */}
                            {!isProfilePage && !isCreateWalletPage && !isImportWalletPage && (
                                <Link
                                    href="/profile"
                                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                                >
                                    Profile
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Logout
                            </button>
                        </div>

                    ) : (
                        <Link
                            href="/login"
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