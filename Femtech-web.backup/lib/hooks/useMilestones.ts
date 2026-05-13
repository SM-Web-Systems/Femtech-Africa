// lib/hooks/useMilestones.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { milestonesApi } from '@/lib/api/milestones';

export const useMilestones = () => {
  const queryClient = useQueryClient();

  const milestonesQuery = useQuery({
    queryKey: ['milestones'],
    queryFn: () => milestonesApi.getUserMilestones(),
    staleTime: 1000 * 60 * 5,
  });

  const mintRewardMutation = useMutation({
    mutationFn: (milestoneId: string) =>
      milestonesApi.mintReward(milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
    },
  });

  const completeMilestoneMutation = useMutation({
    mutationFn: (milestoneId: string) =>
      milestonesApi.completeMilestone(milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    },
  });

  return {
    milestones: milestonesQuery.data || [],
    isLoading: milestonesQuery.isLoading,
    error: milestonesQuery.error,
    mintReward: mintRewardMutation.mutate,
    completeMilestone: completeMilestoneMutation.mutate,
    isMinting: mintRewardMutation.isPending,
  };
};
