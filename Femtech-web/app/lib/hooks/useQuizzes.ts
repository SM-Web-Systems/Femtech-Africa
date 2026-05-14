import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';
import { QuizFromApi, QuizDetail, QuizAttempt } from '../types';

export const useQuizzes = (language?: string) => {
  const lang = language || (typeof window !== 'undefined' ? localStorage.getItem('app_language') : null) || 'en';

  return useQuery({
    queryKey: ['quizzes', lang],
    queryFn: async (): Promise<QuizFromApi[]> => {
      // Try user's language first
      const response = await apiClient.get(`/quizzes?language=${lang}`);
      const quizzes = response.data;

      // Fallback to English if no quizzes found for this language
      if ((!quizzes || quizzes.length === 0) && lang !== 'en') {
        const fallback = await apiClient.get('/quizzes?language=en');
        return fallback.data;
      }

      return quizzes;
    },
  });
};

export const useStartQuiz = () => {
  return useMutation({
    mutationFn: async (quizId: string): Promise<QuizDetail> => {
      const response = await apiClient.post(`/quizzes/${quizId}/start`);
      return response.data;
    },
  });
};

export const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: async (data: {
      quizId: string;
      answers: { questionId: string; answer: number }[];
      startedAt: string;
    }) => {
      const response = await apiClient.post(`/quizzes/${data.quizId}/submit`, {
        answers: data.answers,
        startedAt: data.startedAt,
      });
      return response.data;
    },
  });
};

export const useMyQuizAttempts = () => {
  return useQuery({
    queryKey: ['myQuizAttempts'],
    queryFn: async (): Promise<QuizAttempt[]> => {
      const response = await apiClient.get('/quizzes/my/attempts');
      return response.data;
    },
  });
};
