'use client';

import apiClient from '../lib/apiClient';

export interface MilestoneResponse {
    id: string;
    code: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    country: string | null;
    rewardAmount: number;
    maxClaimsPerPregnancy: number;
    requiresVerification: boolean;
    verificationTypes: string[];
    gestationalWeekMin: number;
    gestationalWeekMax: number;
    daysToComplete: number;
    prerequisiteMilestones: string[];
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserMilestoneResponse {
    id: string;
    userId: string;
    pregnancyId: string;
    milestone_def_id: string;
    status: string;
    progress: number;
    progressData: any;
    startedAt: string;
    completedAt: string;
    expiresAt: string | null;
    rewardAmount: number;
    reward_minted: boolean;
    reward_tx_hash: string;
    reward_minted_at: string;
    createdAt: string;
    updatedAt: string;
    milestone_definitions: {
        id: string;
        code: string;
        name: string;
        description: string;
        icon: string;
        category: string;
        country: string | null;
        rewardAmount: number;
        maxClaimsPerPregnancy: number;
        requiresVerification: boolean;
        verificationTypes: string[];
        gestationalWeekMin: number | null;
        gestationalWeekMax: number | null;
        daysToComplete: number;
        prerequisiteMilestones: string[];
        isActive: boolean;
        sortOrder: number;
        createdAt: string;
        updatedAt: string;
    }
}

export const milestonesApi = {
    getDefinitions: async (): Promise<MilestoneResponse[]> => {
        const response = await apiClient.get('/milestones');
        return response.data;
    },

    getUserMilestones: async (): Promise<UserMilestoneResponse[]> => {
        const response = await apiClient.get('/milestones/my');
        return response.data;
    },

    mintReward: async (milestoneId: string) => {
        const response = await apiClient.post('/milestones/mint', { milestoneId });
        return response.data;
    },
};