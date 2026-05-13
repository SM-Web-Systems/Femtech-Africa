'use client';

import { Card } from '@/app/components/common/Card';
import { useMilestoneDefinitions, useMilestones } from '@/app/lib/hooks/useMilestones';

const iconMap: Record<string, string> = {
  hospital: '🏥', scan: '🔍', test: '🧪', vaccine: '💉', calendar: '📅',
  baby: '👶', scale: '⚖️', heart: '❤️', book: '📖', alert: '⚠️',
  user: '👤', users: '👥', share: '🔗', gift: '🎁',
};

const categoryColors: Record<string, string> = {
  clinical: 'bg-blue-100 text-blue-700',
  wellness: 'bg-green-100 text-green-700',
  education: 'bg-purple-100 text-purple-700',
  community: 'bg-orange-100 text-orange-700',
};

export default function MilestonesPage() {
  const { data: definitions, isLoading: defsLoading } = useMilestoneDefinitions();
  const { data: userMilestones, isLoading: myLoading } = useMilestones();

  const isLoading = defsLoading || myLoading;

  const getUserMilestone = (defId: string) => {
    return userMilestones?.find(m => m.milestone_def_id === defId);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed': return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">Completed</span>;
      case 'in_progress': return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">In Progress</span>;
      case 'pending_verification': return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Pending Verification</span>;
      default: return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">Not Started</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div></div>
          <p className="text-gray-600 mt-4">Loading milestones...</p>
        </div>
      </div>
    );
  }

  const completedCount = definitions?.filter(d => getUserMilestone(d.id)?.status === 'completed').length || 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Health Milestones</h1>
        <p className="text-gray-600 mt-2">Complete milestones to earn MAMA tokens · {completedCount} of {definitions?.length || 0} completed</p>
      </div>

      {definitions && definitions.length > 0 ? (
        <div className="grid gap-4">
          {definitions.map((def) => {
            const userMs = getUserMilestone(def.id);
            const isCompleted = userMs?.status === 'completed';

            return (
              <Card key={def.id} hover className={isCompleted ? 'border-green-200 bg-green-50' : ''}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 flex-1">
                    <div className="text-4xl flex-shrink-0">{iconMap[def.icon] || '📌'}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg text-gray-900">{def.name}</h3>
                        {getStatusBadge(userMs?.status)}
                      </div>
                      <p className="text-gray-600 text-sm">{def.description}</p>
                      <div className="flex gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                        <span>🏆 {def.rewardAmount} MAMA</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColors[def.category] || 'bg-gray-100 text-gray-700'}`}>
                          {def.category}
                        </span>
                        {def.gestationalWeekMin && (
                          <span>📅 Week {def.gestationalWeekMin}–{def.gestationalWeekMax}</span>
                        )}
                      </div>
                      {userMs && userMs.progress > 0 && userMs.status !== 'completed' && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${userMs.progress}%` }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{userMs.progress}% complete</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {isCompleted && <span className="text-3xl">✅</span>}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <p className="text-gray-600 text-center py-12">No milestones available yet.</p>
        </Card>
      )}
    </div>
  );
}
