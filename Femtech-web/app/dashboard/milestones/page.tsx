'use client';

import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { useMilestones, useCompleteMilestone } from '@/app/lib/hooks/useMilestones';
import { useState } from 'react';

export default function MilestonesPage() {
  const { data: milestones, isLoading } = useMilestones();
  const completeMutation = useCompleteMilestone();
  const [completedId, setCompletedId] = useState<string | null>(null);

  const handleComplete = async (id: string) => {
    try {
      await completeMutation.mutateAsync(id);
      setCompletedId(id);
    } catch (error) {
      console.error('Failed to complete milestone', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading milestones...</p>
        </div>
      </div>
    );
  }

  const completedMilestones = milestones?.filter((m) => m.completed) || [];
  const pendingMilestones = milestones?.filter((m) => !m.completed) || [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Pregnancy Milestones</h1>
        <p className="text-gray-600 mt-2">Track your pregnancy journey week by week and earn rewards</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Milestones</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{milestones?.length || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{completedMilestones.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Remaining</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{pendingMilestones.length}</p>
          </div>
        </Card>
      </div>

      {/* Pending Milestones */}
      {pendingMilestones.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Continue Your Journey</h2>
          <div className="grid gap-4">
            {pendingMilestones.map((milestone) => (
              <Card key={milestone.id} hover>
                <div className="flex justify-between items-start gap-6">
                  <div className="flex gap-4 flex-1">
                    <div className="text-5xl flex-shrink-0">{milestone.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{milestone.title}</h3>
                      <p className="text-gray-600 mt-1">{milestone.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                        <span>📅 Week {milestone.week}</span>
                        <span>🏆 Reward: {milestone.reward} MAMA</span>
                        <span className="capitalize bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          {milestone.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleComplete(milestone.id)}
                    isLoading={completeMutation.isPending && completedId === milestone.id}
                    className="flex-shrink-0"
                  >
                    Mark Done
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Milestones */}
      {completedMilestones.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ Completed Milestones</h2>
          <div className="grid gap-4">
            {completedMilestones.map((milestone) => (
              <Card key={milestone.id} className="opacity-75 bg-gray-50">
                <div className="flex justify-between items-start gap-6">
                  <div className="flex gap-4 flex-1">
                    <div className="text-5xl flex-shrink-0">{milestone.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{milestone.title}</h3>
                        <span className="text-green-600 font-bold">✓</span>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                        <span>📅 Week {milestone.week}</span>
                        <span>🏆 Earned: {milestone.reward} MAMA</span>
                        <span>{new Date(milestone.completedAt!).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
