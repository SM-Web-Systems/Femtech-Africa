import { QuizzAttempt } from '../../components/useQuizzes';

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getStatusColor = (passed: boolean): string => {
    return passed ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
};

export const getStatusIcon = (passed: boolean): string => {
    return passed ? '✅' : '❌';
};

export const getButtonText = (latestAttempt: QuizzAttempt | null): string => {
    return latestAttempt ? 'Retake Quiz' : 'Start Quiz';
};