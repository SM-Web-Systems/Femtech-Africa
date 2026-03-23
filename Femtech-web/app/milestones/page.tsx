'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { milestonesApi, MilestoneResponse, UserMilestoneResponse } from '../lib/services/useMilestones';
import Link from 'next/link';

interface MilestoneWithProgress extends MilestoneResponse {
    userProgress?: UserMilestoneResponse;
    isStarted: boolean;
}

export default function MilestonePage() {
    const { isAuthenticated, isInitialized } = useAuth();

    const [milestones, setMilestones] = useState<MilestoneWithProgress[]>([]);
    const [userMilestones, setUserMilestones] = useState<UserMilestoneResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMilestones = async () => {
            try {
                setLoading(true);
                setError(null);

                // Always fetch generic milestone definitions
                const data = await milestonesApi.getDefinitions();

                if (isAuthenticated && isInitialized) {
                    // Fetch user's milestones
                    const userMilestonesData = await milestonesApi.getUserMilestones();
                    setUserMilestones(userMilestonesData);

                    // Merge user progress with definitions
                    const mergedMilestones: MilestoneWithProgress[] = data.map((milestone) => {
                        const userProgress = userMilestonesData.find(
                            (um) => um.milestone_def_id === milestone.id
                        );

                        return {
                            ...milestone,
                            userProgress: userProgress,
                            isStarted: !!userProgress,
                        };
                    });

                    setMilestones(mergedMilestones);
                } else {
                    // Not authenticated - show all as not started
                    const genericMilestones: MilestoneWithProgress[] = data.map((milestone) => ({
                        ...milestone,
                        isStarted: false,
                    }));

                    setMilestones(genericMilestones);
                }
            } catch (err) {
                console.error('Error fetching milestones:', err);
                setError('Failed to fetch milestones. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (isInitialized) {
            fetchMilestones();
        }
    }, [isAuthenticated, isInitialized]);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'pending_verification':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'available':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'completed':
                return '✅';
            case 'in_progress':
                return '🔄';
            case 'pending_verification':
                return '⏳';
            default:
                return '🎯';
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                <section className="bg-gradient-to-r from-pink-300 to-purple-400 py-12">
                    <div className="max-w-6xl mx-auto px-4">
                        <h1 className="text-4xl font-bold text-white mb-2">Milestones</h1>
                        <p className="text-white text-opacity-90">Track your pregnancy journey</p>
                    </div>
                </section>

                <section className="px-4 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="mb-6 relative w-16 h-16 mx-auto">
                                    <div className="absolute inset-0 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin"></div>
                                </div>
                                <p className="text-sm font-medium text-slate-500">Loading milestones...</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                <section className="bg-gradient-to-r from-pink-300 to-purple-400 py-12">
                    <div className="max-w-6xl mx-auto px-4">
                        <h1 className="text-4xl font-bold text-white mb-2">Milestones</h1>
                        <p className="text-white text-opacity-90">Track your pregnancy journey</p>
                    </div>
                </section>

                <section className="px-4 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <section className="bg-gradient-to-r from-pink-300 to-purple-400 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-white mb-2">Milestones</h1>
                    <p className="text-white text-opacity-90">
                        {isAuthenticated ? 'Track your progress and earn MAMA tokens' : 'Login to track your pregnancy milestones'}
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {!isAuthenticated ? (
                        // Not authenticated - show generic milestones
                        <>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">ℹ️</span>
                                    <div>
                                        <p className="text-blue-900 font-semibold mb-1">Log in to track your progress</p>
                                        <p className="text-blue-800 text-sm">Sign in to see your milestone progress, track completion, and earn MAMA tokens.</p>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Milestones</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {milestones.map((milestone) => (
                                    <div
                                        key={milestone.id}
                                        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                                    {milestone.category}
                                                </p>
                                                <h3 className="text-lg font-bold text-gray-900">{milestone.name}</h3>
                                            </div>
                                            <span className="text-2xl ml-2">🎯</span>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-4">{milestone.description}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                {milestone.rewardAmount} MAMA
                                            </span>
                                            {milestone.requiresVerification && (
                                                <span className="text-xs text-gray-500">Needs verification</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        // Authenticated - show user progress merged with milestones
                        <>
                            {/* Completed Milestones Section */}
                            {milestones.some((m) => m.userProgress?.status === 'completed') && (
                                <div className="mb-12">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <span>✅</span>
                                        Completed Milestones
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {milestones
                                            .filter((m) => m.userProgress?.status === 'completed')
                                            .map((milestone) => (
                                                <Link key={milestone.id} href={`/milestones/${milestone.id}`}>
                                                    <div className="bg-white rounded-lg border border-green-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer h-full bg-gradient-to-br from-white to-green-50">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex-1">
                                                                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
                                                                    {milestone.category}
                                                                </p>
                                                                <h3 className="text-lg font-bold text-gray-900">{milestone.name}</h3>
                                                            </div>
                                                            <span className="text-2xl ml-2">✅</span>
                                                        </div>

                                                        <p className="text-sm text-gray-600 mb-4">{milestone.description}</p>

                                                        <div className="flex items-center justify-between pt-4 border-t border-green-200">
                                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                                                {milestone.rewardAmount} MAMA ✓
                                                            </span>
                                                            <span className="text-xs text-green-600 font-semibold">Completed</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* In Progress Milestones Section */}
                            {milestones.some(
                                (m) => m.userProgress?.status === 'in_progress' || m.userProgress?.status === 'pending_verification'
                            ) && (
                                    <div className="mb-12">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                            <span>🔄</span>
                                            In Progress
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {milestones
                                                .filter(
                                                    (m) =>
                                                        m.userProgress?.status === 'in_progress' ||
                                                        m.userProgress?.status === 'pending_verification'
                                                )
                                                .map((milestone) => (
                                                    <Link key={milestone.id} href={`/milestones/${milestone.id}`}>
                                                        <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer h-full bg-gradient-to-br from-white to-blue-50">
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className="flex-1">
                                                                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                                                                        {milestone.category}
                                                                    </p>
                                                                    <h3 className="text-lg font-bold text-gray-900">{milestone.name}</h3>
                                                                </div>
                                                                <span className="text-2xl ml-2">🔄</span>
                                                            </div>

                                                            <p className="text-sm text-gray-600 mb-4">{milestone.description}</p>

                                                            {milestone.userProgress?.progressData?.progress && (
                                                                <div className="mb-4">
                                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                                        <div
                                                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                                                            style={{ width: `${milestone.userProgress.progressData.progress}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <p className="text-xs text-gray-600 mt-2">
                                                                        {milestone.userProgress.progressData.progress}% complete
                                                                    </p>
                                                                </div>
                                                            )}

                                                            <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                                                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                                    {milestone.rewardAmount} MAMA
                                                                </span>
                                                                <span className={`text-xs font-semibold px-2 py-1 rounded border ${getStatusColor(milestone.userProgress?.status)}`}>
                                                                    {milestone.userProgress?.status === 'pending_verification'
                                                                        ? 'Pending'
                                                                        : 'In Progress'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>
                                )}

                            {/* Not Started Milestones Section */}
                            {milestones.some((m) => !m.isStarted) && (
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <span>🎯</span>
                                        Available to Start
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {milestones
                                            .filter((m) => !m.isStarted)
                                            .map((milestone) => (
                                                <Link key={milestone.id} href={`/milestones/${milestone.id}`}>
                                                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer h-full">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex-1">
                                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                                                    {milestone.category}
                                                                </p>
                                                                <h3 className="text-lg font-bold text-gray-900">{milestone.name}</h3>
                                                            </div>
                                                            <span className="text-2xl ml-2">🎯</span>
                                                        </div>

                                                        <p className="text-sm text-gray-600 mb-4">{milestone.description}</p>

                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                                {milestone.rewardAmount} MAMA
                                                            </span>
                                                            <span className="text-xs text-gray-500">Start Now →</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}