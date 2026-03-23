'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { milestonesApi, UserMilestoneResponse } from '../../lib/services/useMilestones';

const getMilestoneIcon = (status: string): string => {
    const icons: { [key: string]: string } = {
        completed: '🏆',
        in_progress: '⚙️',
        not_started: '🎯',
        pending: '⏳',
    };
    return icons[status] || '📌';
};

const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
        completed: 'bg-green-50 border-green-200 text-green-700',
        in_progress: 'bg-blue-50 border-blue-200 text-blue-700',
        not_started: 'bg-slate-50 border-slate-200 text-slate-700',
        pending: 'bg-amber-50 border-amber-200 text-amber-700',
    };
    return colors[status] || 'bg-slate-50 border-slate-200 text-slate-700';
};

const getProgressColor = (progress: number): string => {
    if (progress === 100) return 'from-green-500 to-emerald-500';
    if (progress >= 75) return 'from-blue-500 to-indigo-500';
    if (progress >= 50) return 'from-purple-500 to-blue-500';
    return 'from-amber-500 to-orange-500';
};

export default function MilestoneDetailPage() {
    const { id } = useParams();
    const [userMilestone, setUserMilestone] = useState<UserMilestoneResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserMilestones = async () => {
            try {
                setIsLoading(true);
                const data = await milestonesApi.getUserMilestones();
                const milestone = data.find((m) => m.id === id);
                if (milestone) {
                    setUserMilestone([milestone]);
                } else {
                    console.warn(`Milestone with ID ${id} not found in user's milestones.`);
                }
            } catch (err) {
                console.error('Error fetching user milestones:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserMilestones();
    }, [id]);

    const milestone = userMilestone?.[0];
    const hasData = milestone && Object.keys(milestone).length > 0;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <section className="relative px-4 py-16 lg:py-20">
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-slate-200 rounded-lg w-48 mb-4"></div>
                            <div className="h-96 bg-slate-100 rounded-xl border border-slate-200"></div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <section className="relative px-4 py-16 lg:py-20">
                <div className="w-full max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">Milestone Details</h1>
                            {hasData && <span className="text-3xl">{getMilestoneIcon(milestone.status)}</span>}
                        </div>
                        <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                    </div>

                    {/* Main Card */}
                    {hasData ? (
                        <div className="space-y-6">
                            {/* Milestone Overview Card */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                {/* Title Section */}
                                <div className="mb-8 pb-8 border-b border-slate-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Milestone Name</p>
                                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                                                {milestone.milestone_definitions.name}
                                            </h2>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg border font-semibold text-sm capitalize ${getStatusColor(milestone.status)}`}>
                                            {milestone.status.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Section */}
                                <div className="mb-10">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Progress</p>
                                    <div className="space-y-3">
                                        <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${getProgressColor(milestone.progress)} transition-all duration-500 ease-out`}
                                                style={{ width: `${milestone.progress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                            {milestone.progress}% Complete
                                        </p>
                                    </div>
                                </div>

                                {/* Rewards Section */}
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 mb-8 border border-indigo-100">
                                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-4">💎 Rewards</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Reward Amount</p>
                                            <p className="text-3xl font-bold text-indigo-600">{milestone.rewardAmount} MAMA</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Reward Status</p>
                                            <div className="flex items-center gap-2">
                                                <div className={`h-3 w-3 rounded-full ${milestone.reward_minted ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-slate-300'}`}></div>
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {milestone.reward_minted ? 'Minted' : 'Not Minted'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                    {/* Detail ID */}
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Detail ID</p>
                                        <p className="font-mono text-sm text-slate-900 break-all">{milestone.id}</p>
                                    </div>

                                    {/* Pregnancy ID */}
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pregnancy ID</p>
                                        <p className="font-mono text-sm text-slate-900 break-all">{milestone.pregnancyId}</p>
                                    </div>

                                    {/* Created At */}
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Created</p>
                                        <p className="text-sm text-slate-900">
                                            {milestone.createdAt
                                                ? new Date(milestone.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })
                                                : '—'}
                                        </p>
                                    </div>

                                    {/* Updated At */}
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Updated</p>
                                        <p className="text-sm text-slate-900">
                                            {milestone.updatedAt
                                                ? new Date(milestone.updatedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })
                                                : '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Transaction Details */}
                                <div className="border-t border-slate-100 pt-8">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Transaction Details</p>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Reward Minted At</p>
                                            <p className="text-sm text-slate-900 break-all">
                                                {milestone.reward_minted_at || '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Transaction Hash</p>
                                            <p className="font-mono text-xs text-slate-600 break-all bg-slate-50 p-3 rounded border border-slate-100">
                                                {milestone.reward_tx_hash || '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/milestones"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    ← Back to Milestones
                                </Link>
                                <button
                                    onClick={() => alert('Minting functionality coming soon!')}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-semibold rounded-lg transition-all duration-200"
                                >
                                    Mint Reward
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center">
                            <p className="text-lg text-slate-600 mb-6">No milestone data found</p>
                            <Link
                                href="/milestones"
                                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200"
                            >
                                View All Milestones
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
