import { QuizzAttempt } from '../../lib/services/useQuizzes';

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

export const calculateProgress = (current: number, total: number): number => {
    return ((current + 1) / total) * 100;
};

export const hasAnsweredAll = (answers: (number | null)[]): boolean => {
    return answers.every((a) => a !== null);
};

export const calculateAnsweredCount = (answers: (number | null)[]): number => {
    return answers.filter((a) => a !== null).length;
};

export const didUserPass = (score: number, passThreshold: number): boolean => {
    return score >= passThreshold;
};

export const formatQuizTime = (minutes: number): string => {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
};