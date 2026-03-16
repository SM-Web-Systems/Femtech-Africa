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
    const [loading, setLoading] = useState(true); // Start with true (not false!)
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
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-6 relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin"></div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 tracking-wide">Loading your profile...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
                <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md text-center shadow-sm">
                    <div className="mb-4 text-4xl">⚠️</div>
                    <p className="text-red-600 font-semibold mb-2">{error}</p>
                    <p className="text-sm text-slate-500 mb-6">Try logging in again or contact support if the problem persists.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium text-sm"
                    >
                        Back to Login
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Main Content */}
            <section className="relative px-4 py-16 lg:py-20">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
                        {/* Wallet Section - Spans 1 column on desktop */}
                        <div className="lg:col-span-1">
                            <div className="mb-3">
                                <h2 className="text-2xl font-bold text-slate-900">Wallet</h2>
                                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
                            </div>

                            {user?.walletAddress ? (
                                <Wallet />
                            ) : (
                                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm h-full flex flex-col justify-between">
                                    <div>
                                        <p className="text-slate-600 mb-6 leading-relaxed text-sm">Get started by creating a new wallet or importing an existing one.</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            href="/wallet/create"
                                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-sm"
                                        >
                                            Create Wallet
                                        </Link>
                                        <Link
                                            href="/wallet/import"
                                            className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-semibold rounded-lg transition-all duration-200 text-sm"
                                        >
                                            Import Wallet
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Account Information Section - Spans 2 columns on desktop */}
                        <div className="lg:col-span-2">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Account Information</h2>
                                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
                            </div>

                            {/* 2-Column Grid for Account Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Phone Card */}
                                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                                            <p className="text-lg font-bold text-slate-900 break-all">{user?.phone}</p>
                                        </div>
                                        <span className="text-2xl">📱</span>
                                    </div>
                                </div>

                                {/* Country Card */}
                                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Country</p>
                                            <p className="text-lg font-bold text-slate-900">{user?.country}</p>
                                        </div>
                                        <span className="text-2xl">🌍</span>
                                    </div>
                                </div>

                                {/* Role Card */}
                                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Role</p>
                                            <p className="text-lg font-bold text-slate-900 capitalize">{user?.role}</p>
                                        </div>
                                        <span className="text-2xl">👤</span>
                                    </div>
                                </div>

                                {/* Status Card */}
                                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`h-3 w-3 rounded-full ${user?.status === 'active' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-yellow-500 shadow-lg shadow-yellow-500/50'}`}></div>
                                                <p className="text-lg font-bold text-slate-900 capitalize">{user?.status}</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl">✓</span>
                                    </div>
                                </div>

                                {/* Member Since Card */}
                                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Joined</p>
                                            <p className="text-lg font-bold text-slate-900">
                                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                            </p>
                                        </div>
                                        <span className="text-2xl">📅</span>
                                    </div>
                                </div>

                                {/* Last Login Card */}
                                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Last Login</p>
                                            <p className="text-lg font-bold text-slate-900">
                                                {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                            </p>
                                        </div>
                                        <span className="text-2xl">🔐</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
