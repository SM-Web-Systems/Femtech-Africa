'use client';

import apiClient from '../lib/apiClient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import Wallet from '../components/wallet';

import Link from 'next/link';

interface User {
    id: string;
    phone: string;
    country: string;
    role: string;
    status: string;
    walletAddress: string;
    lastLoginAt: string;
    createdAt: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const { isAuthenticated, isLoading, isInitialized } = useAuth();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isInitialized) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiClient.get('/auth/me');
                setUser(response.data);
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
                setError('Failed to load profile. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [isAuthenticated, isInitialized]);

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                    <p className="text-red-600 font-semibold mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        Back to Login
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header Section */}
            <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-4 py-12 lg:py-16">
                <div className="w-full">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
                        <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-blue-400 flex items-center justify-center text-2xl lg:text-3xl font-bold flex-shrink-0">
                            {user?.phone?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl lg:text-4xl font-bold mb-1">Welcome back!</h1>
                            <p className="text-blue-100 text-base lg:text-lg truncate">{user?.phone}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-4 py-12 lg:py-16">
                <div className="w-full">
                    {/* Wallet Section */}
                    {user?.walletAddress ? (
                        <div className="mb-12 lg:mb-16">
                            <Wallet />
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8 mb-12 lg:mb-16">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Wallet</h2>
                            <p className="text-gray-600 mb-6">You don't have a wallet yet. Get started by creating a new one or importing an existing wallet.</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/wallet/create"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-base"
                                >
                                    Create Wallet
                                </Link>
                                <Link
                                    href="/wallet/import"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition text-base"
                                >
                                    Import Wallet
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Account Information Section */}
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Account Information</h2>

                        {/* Grid Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            {/* Phone Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-5 lg:p-6 hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg lg:text-xl">📱</span>
                                    </div>
                                    <p className="text-xs lg:text-sm text-gray-500 font-medium uppercase tracking-wide">Phone</p>
                                </div>
                                <p className="text-base lg:text-lg font-semibold text-gray-900 break-all">{user?.phone}</p>
                            </div>

                            {/* Country Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-5 lg:p-6 hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg lg:text-xl">🌍</span>
                                    </div>
                                    <p className="text-xs lg:text-sm text-gray-500 font-medium uppercase tracking-wide">Country</p>
                                </div>
                                <p className="text-base lg:text-lg font-semibold text-gray-900">{user?.country}</p>
                            </div>

                            {/* Role Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-5 lg:p-6 hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg lg:text-xl">👤</span>
                                    </div>
                                    <p className="text-xs lg:text-sm text-gray-500 font-medium uppercase tracking-wide">Role</p>
                                </div>
                                <p className="text-base lg:text-lg font-semibold text-gray-900 capitalize">{user?.role}</p>
                            </div>

                            {/* Status Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-5 lg:p-6 hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg lg:text-xl">✓</span>
                                    </div>
                                    <p className="text-xs lg:text-sm text-gray-500 font-medium uppercase tracking-wide">Status</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`h-2.5 w-2.5 rounded-full ${user?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    <p className="text-base lg:text-lg font-semibold text-gray-900 capitalize">{user?.status}</p>
                                </div>
                            </div>

                            {/* Member Since Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-5 lg:p-6 hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg lg:text-xl">📅</span>
                                    </div>
                                    <p className="text-xs lg:text-sm text-gray-500 font-medium uppercase tracking-wide">Joined</p>
                                </div>
                                <p className="text-base lg:text-lg font-semibold text-gray-900">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                </p>
                            </div>

                            {/* Last Login Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-5 lg:p-6 hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg lg:text-xl">🔐</span>
                                    </div>
                                    <p className="text-xs lg:text-sm text-gray-500 font-medium uppercase tracking-wide">Last Login</p>
                                </div>
                                <p className="text-base lg:text-lg font-semibold text-gray-900">
                                    {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
