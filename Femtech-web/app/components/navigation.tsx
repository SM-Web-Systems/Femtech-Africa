'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    }

    // Check if we're on the profile page
    const isProfilePage = pathname === '/profile';

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo/Brand */}
                <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                    Femtech
                </Link>

                {/* Navigation Links */}
                <div className="flex gap-8">
                    <Link
                        href="/"
                        className="text-gray-700 hover:text-blue-600 font-medium transition"
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className="text-gray-700 hover:text-blue-600 font-medium transition"
                    >
                        About
                    </Link>
                    <Link
                        href="/quizzes"
                        className="text-gray-700 hover:text-blue-600 font-medium transition"
                    >
                        Quizzes
                    </Link>

                    {/* Auth Button */}
                    {isAuthenticated ? (
                        <div className="flex gap-6 items-center">
                            {/* Dropdown Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
                                >
                                    Wallet
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Dropdown Menu Items */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10">
                                        <button
                                            onClick={() => {
                                                // Add your import wallet logic here
                                                router.push('/wallet/import');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                                        >
                                            Import Wallet
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Add your create wallet logic here
                                                router.push('/wallet/create');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                                        >
                                            Create Wallet
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Logout
                            </button>

                            {/* Only show Profile link if NOT on profile page */}
                            {!isProfilePage && (
                                <Link
                                    href="/profile"
                                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                                >
                                    Profile
                                </Link>
                            )}
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