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