'use client';

import { useState, useEffect } from 'react';
import { milestonesApi, UserMilestoneResponse } from './useMilestones';

export default function UserMilestones() {
    const [userMilestones, setUserMilestones] = useState<UserMilestoneResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserMilestones = async () => {
            try {

                const data = await milestonesApi.getUserMilestones();
                setUserMilestones(data);
            } catch (err) {
                console.error('Error fetching user milestones:', err);
                setError('Failed to load milestones. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserMilestones();
    }, []);

    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white border border-red-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="text-red-600 font-semibold text-sm">{error}</p>
                        <p className="text-red-500 text-xs mt-1">Try refreshing the page or contact support.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (<>
        {userMilestones[0].id}
    </>);
}