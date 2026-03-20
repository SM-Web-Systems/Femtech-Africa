'use-client';

import apiClient from '../lib/apiClient';

export interface Quizz {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    time_limit_mins: number;
    pass_threshold: number;
    reward_amount: number;
    _count: {
        questions: number;
    };
    questionCount: number;
}

export interface QuizzAttempt {
    id: string;
    userId: string;
    quizId: string;
    score: number;
    passed: boolean;
    answers: any[];
    started_at: string;
    completedAt: string;
    duration_seconds: number;
    rewardGranted: boolean;
    created_at: string;
    quiz: {
        id: string;
        title: string;
        category: string;
        reward_amount: number;
    };
}

export interface QuizzWithAttempts extends Quizz {
    attempts: QuizzAttempt[];
    totalAttempts: number;
    latestAttempt: QuizzAttempt | null;
    bestScore: number;
}

export interface UseQuizzResult {
    quizzes: Quizz[];
    loading: boolean;
    error: string | null;
}

export const quizzesApi = {
    // Get all quizzes
    getQuizzes: async (category?: string) => {
        const params = category ? `?category=${category}` : '';
        const response = await apiClient.get(`/quizzes${params}`);
        return response.data;
    },

    // Get quiz details with questions
    getQuiz: async (quizId: string) => {
        const response = await apiClient.get(`/quizzes/${quizId}`);
        return response.data;
    },

    // Start quiz attempt
    startQuiz: async (quizId: string) => {
        const response = await apiClient.post(`/quizzes/${quizId}/start`);
        return response.data;
    },

    // Submit quiz answers
    submitQuiz: async (quizId: string, answers: any[], startedAt: string) => {
        const response = await apiClient.post(`/quizzes/${quizId}/submit`, {
            answers,
            startedAt,
        });
        return response.data;
    },

    // Get user's quiz attempts
    getMyAttempts: async () => {
        const response = await apiClient.get('/quizzes/my/attempts');
        return response.data;
    },
};