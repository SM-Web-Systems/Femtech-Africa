import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Milestone } from '../types';

// Mock data for development
const mockMilestones: Milestone[] = [
  {
    id: '1',
    week: 8,
    title: 'First Prenatal Checkup',
    description: 'Complete your first prenatal visit and confirm pregnancy',
    category: 'health',
    icon: '🏥',
    reward: 100,
    completed: true,
    completedAt: '2026-05-01',
  },
  {
    id: '2',
    week: 12,
    title: 'First Trimester Screening',
    description: 'Complete the first trimester ultrasound and screening',
    category: 'health',
    icon: '📊',
    reward: 150,
    completed: false,
  },
  {
    id: '3',
    week: 16,
    title: 'Nutrition Education Module',
    description: 'Learn about proper nutrition during pregnancy',
    category: 'education',
    icon: '📖',
    reward: 75,
    completed: false,
  },
  {
    id: '4',
    week: 20,
    title: 'Anatomy Scan',
    description: 'Detailed ultrasound to check baby development',
    category: 'health',
    icon: '🔍',
    reward: 200,
    completed: false,
  },
];

export const useMilestones = () => {
  return useQuery({
    queryKey: ['milestones'],
    queryFn: async (): Promise<Milestone[]> => {
      try {
        const response = await apiClient.get('/milestones/my');
        return response.data;
      } catch (error) {
        console.warn('Using mock milestones:', error);
        return mockMilestones;
      }
    },
  });
};

export const useCompleteMilestone = () => {
  return useMutation({
    mutationFn: async (milestoneId: string) => {
      const response = await apiClient.post('/milestones/complete', { milestoneId });
      return response.data;
    },
  });
};
