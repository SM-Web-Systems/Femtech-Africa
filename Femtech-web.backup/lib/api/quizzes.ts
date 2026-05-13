// lib/api/quizzes.ts
import apiClient from './client';
import type { Quiz } from '@/lib/types';

export const quizzesApi = {
  getQuizzes: async () => {
    const response = await apiClient.get<Quiz[]>('/quizzes');
    return response.data;
  },

  getQuizById: async (id: string) => {
    const response = await apiClient.get<Quiz>(\/quizzes/\\);
    return response.data;
  },

  submitQuizAnswer: async (
    quizId: string,
    questionId: string,
    answer: string | string[]
  ) => {
    const response = await apiClient.post<{ correct: boolean }>(
      \/quizzes/\/answer\,
      { questionId, answer }
    );
    return response.data;
  },

  completeQuiz: async (quizId: string, score: number) => {
    const response = await apiClient.post<{
      tokensEarned: number;
      totalScore: number;
    }>(\/quizzes/\/complete\, { score });
    return response.data;
  },
};
