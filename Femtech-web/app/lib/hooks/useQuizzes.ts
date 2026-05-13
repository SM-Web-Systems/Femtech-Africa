import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';
import { QuizFromApi, QuizDetail, QuizAttempt } from '../types';

export const useQuizzes = () => {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: async (): Promise<QuizFromApi[]> => {
      const response = await apiClient.get('/quizzes');
      return response.data;
    },
  });
};

export const useQuizDetail = (quizId: string) => {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async (): Promise<QuizDetail> => {
      const response = await apiClient.get(`/quizzes/${quizId}`);
      return response.data;
    },
    enabled: !!quizId,
  });
};

export const useStartQuiz = () => {
  return useMutation({
    mutationFn: async (quizId: string) => {
      const response = await apiClient.post(`/quizzes/${quizId}/start`);
      return response.data;
    },
  });
};

export const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: async ({ quizId, answers, startedAt }: { quizId: string; answers: { questionId: string; answer: number }[]; startedAt: string }) => {
      const response = await apiClient.post(`/quizzes/${quizId}/submit`, { answers, startedAt });
      return response.data;
    },
  });
};

export const useMyQuizAttempts = () => {
  return useQuery({
    queryKey: ['quizAttempts'],
    queryFn: async (): Promise<QuizAttempt[]> => {
      const response = await apiClient.get('/quizzes/my/attempts');
      return response.data;
    },
  });
};
