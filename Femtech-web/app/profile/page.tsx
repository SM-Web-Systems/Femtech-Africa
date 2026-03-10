'use client';

import apiClient from '../lib/apiClient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';

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
                setUser(response.data); // unwrap the data object
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
                setError('Failed to load profile. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [isAuthenticated, isInitialized]);

    if (loading) return <p className="p-8">Checking authentication...</p>;
    if (error) return <p className="p-8 text-red-600">{error}</p>;

    return (
        <main className="min-h-screen bg-white">
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold mb-6">Profile</h1>
                    <p className="text-xl text-blue-100">
                        {user?.phone}
                    </p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 py-12">
                <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                    <div><span className="font-medium text-gray-500">Phone:</span> <span>{user?.phone}</span></div>
                    <div><span className="font-medium text-gray-500">Country:</span> <span>{user?.country}</span></div>
                    <div><span className="font-medium text-gray-500">Role:</span> <span>{user?.role}</span></div>
                    <div><span className="font-medium text-gray-500">Status:</span> <span>{user?.status}</span></div>
                    <div><span className="font-medium text-gray-500">Wallet:</span> <span>{user?.walletAddress ?? 'No wallet yet'}</span></div>
                    <div><span className="font-medium text-gray-500">Member since:</span> <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span></div>
                </div>
            </section>
        </main>
    );
}