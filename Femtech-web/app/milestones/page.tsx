'use client';

import { useState, useEffect } from 'react';

import { milestonesApi, MilestoneResponse } from '../components/useMilestones';

export default function MilestonelPage() {
    const [milestones, setMilestones] = useState<MilestoneResponse[]>([]);

    useEffect(() => {
        const fetchUserMilestones = async () => {
            try {
                const data = await milestonesApi.getDefinitions();
                setMilestones(data);

            } catch (err) {
                console.error('Error fetching user milestones:', err);
            }
        };

        fetchUserMilestones();
    }, []);

    return (
        <>
            <div className="bg-gradient-to-r from-pink-300 to-purple-400 py-6 mb-8 rounded-lg shadow-md">
                <div className="container mx-auto px-4">
                    <h3 className="text-2xl font-bold mb-4">Milestones</h3>
                    {/* Milestone cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {milestones.map((milestone) => (
                            <div
                                key={milestone.id}
                                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                                <h4 className="text-lg font-semibold mb-2">{milestone.name}</h4>
                                <p className="text-gray-600">{milestone.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>


    )
}