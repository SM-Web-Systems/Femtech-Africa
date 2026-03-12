'use client';

import apiClient from '../lib/apiClient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import Wallet from '../components/wallet';

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
            <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="h-20 w-20 rounded-full bg-blue-400 flex items-center justify-center text-3xl font-bold">
                            {user?.phone?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
                            <p className="text-blue-100 text-lg">{user?.phone}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Wallet Section */}
            <section className="px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <Wallet />
                </div>
            </section>

            {/* Profile Information Section */}
            <section className="px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Account Information</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            {/* Phone Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <span className="text-xl">📱</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                                        <p className="text-lg font-semibold text-gray-900">{user?.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Country Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                                        <span className="text-xl">🌍</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Country</p>
                                        <p className="text-lg font-semibold text-gray-900">{user?.country}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Role Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <span className="text-xl">👤</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Account Role</p>
                                        <p className="text-lg font-semibold text-gray-900 capitalize">{user?.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            {/* Status Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                                        <span className="text-xl">✓</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Account Status</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`h-2 w-2 rounded-full ${user?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                            <p className="text-lg font-semibold text-gray-900 capitalize">{user?.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Member Since Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <span className="text-xl">📅</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Member Since</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Last Login Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                                        <span className="text-xl">🔐</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Last Login</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wallet Address Section */}
                    {user?.walletAddress && (
                        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stellar Wallet</h3>
                            <div className="bg-gray-50 rounded p-4 break-all font-mono text-sm text-gray-700">
                                {user.walletAddress}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}