import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  options?: string[];
  correctAnswer?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: Question[];
  reward: number;
  completedAt?: string;
  score?: number;
}

const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Prenatal Nutrition Basics',
    description: 'Test your knowledge on proper nutrition during pregnancy',
    category: 'education',
    questions: [
      {
        id: '1',
        text: 'How many additional calories do pregnant women need daily?',
        type: 'multiple-choice',
        options: ['200-300', '500-600', '800-900', '1000+'],
        correctAnswer: '200-300',
      },
      {
        id: '2',
        text: 'Which vitamin is essential for fetal development?',
        type: 'multiple-choice',
        options: ['Vitamin A', 'Folic Acid', 'Vitamin C', 'All of the above'],
        correctAnswer: 'All of the above',
      },
    ],
    reward: 75,
  },
  {
    id: '2',
    title: 'Mental Health Awareness',
    description: 'Learn about maternal mental health and wellness',
    category: 'wellness',
    questions: [
      {
        id: '1',
        text: 'It is normal to feel anxious during pregnancy',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 'True',
      },
      {
        id: '2',
        text: 'Postpartum depression affects about 1 in 7 mothers',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 'True',
      },
    ],
    reward: 100,
  },
  {
    id: '3',
    title: 'Pregnancy Safety',
    description: 'Important safety information during pregnancy',
    category: 'health',
    questions: [
      {
        id: '1',
        text: 'What should you do if you experience severe abdominal pain?',
        type: 'multiple-choice',
        options: ['Wait and see', 'Call your doctor immediately', 'Rest at home', 'Take pain medication'],
        correctAnswer: 'Call your doctor immediately',
      },
    ],
    reward: 125,
  },
];

export const useQuizzes = () => {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: async (): Promise<Quiz[]> => {
      try {
        const response = await apiClient.get('/quizzes');
        return response.data;
      } catch (error) {
        console.warn('Using mock quizzes:', error);
        return mockQuizzes;
      }
    },
  });
};

export const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: async ({ quizId, answers }: { quizId: string; answers: Record<string, string> }) => {
      const response = await apiClient.post('/quizzes/submit', { quizId, answers });
      return response.data;
    },
  });
};
