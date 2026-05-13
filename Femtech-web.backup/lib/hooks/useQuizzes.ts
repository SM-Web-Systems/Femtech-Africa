// lib/hooks/useQuizzes.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizzesApi } from '@/lib/api/quizzes';

export const useQuizzes = () => {
  const queryClient = useQueryClient();

  const quizzesQuery = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizzesApi.getQuizzes(),
    staleTime: 1000 * 60 * 10,
  });

  const completeQuizMutation = useMutation({
    mutationFn: ({ quizId, score }: { quizId: string; score: number }) =>
      quizzesApi.completeQuiz(quizId, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
    },
  });

  return {
    quizzes: quizzesQuery.data || [],
    isLoading: quizzesQuery.isLoading,
    error: quizzesQuery.error,
    completeQuiz: completeQuizMutation.mutate,
    isCompleting: completeQuizMutation.isPending,
  };
};
