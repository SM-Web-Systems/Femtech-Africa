'use client';

import { useState, useEffect } from 'react';
import { quizzesApi } from '../../lib/services/useQuizzes';

export interface QuizQuestion {
    id: string;
    questionText: string;
    questionType: string;
    options: string[];
    sortOrder: number;
}

export interface QuizDetail {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    country: string | null;
    language: string | null;
    time_limit_mins: number;
    pass_threshold: number;
    reward_amount: number;
    milestone_def_id: string | null;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    questions: QuizQuestion[];
    alreadyPassed: boolean;
    questionCount: number;
}

export interface QuizResult {
    score: number;
    correctCount: number;
    totalQuestions: number;
    reward?: { amount: number; txHash: string };
}

interface UseQuizDetailReturn {
    quiz: QuizDetail | null;
    loading: boolean;
    error: string | null;
    currentQuestionIndex: number;
    answers: (number | null)[];
    quizStarted: boolean;
    quizCompleted: boolean;
    result: QuizResult | null;
    submitting: boolean;
    rewardAlreadyClaimed: boolean;
    setCurrentQuestionIndex: (index: number) => void;
    setAnswers: (answers: (number | null)[]) => void;
    selectAnswer: (optionIndex: number) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    startQuiz: () => Promise<void>;
    submitQuiz: () => Promise<void>;
    resetQuiz: () => void;
}

export const useQuizDetail = (quizId: string, isAuthenticated: boolean, isInitialized: boolean): UseQuizDetailReturn => {
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [rewardAlreadyClaimed, setRewardAlreadyClaimed] = useState(false);

    // Fetch quiz data on mount
    useEffect(() => {
        if (!isInitialized || !isAuthenticated || !quizId) return;

        const fetchQuiz = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await quizzesApi.getQuiz(quizId);

                setQuiz(response);
                setAnswers(new Array(response.questions?.length || 0).fill(null));

                // Check if reward already claimed
                const attempts = await quizzesApi.getMyAttempts();
                const claimedReward = attempts.some(
                    (a: any) => a.quizId === quizId && a.passed && a.rewardGranted
                );
                setRewardAlreadyClaimed(claimedReward);
            } catch (err) {
                console.error('Failed to fetch quiz:', err);
                setError(err instanceof Error ? err.message : 'Failed to load quiz. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId, isAuthenticated, isInitialized]);

    const selectAnswer = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const startQuiz = async () => {
        try {
            setSubmitting(true);
            setError(null);
            await quizzesApi.startQuiz(quizId);
            setQuizStarted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start quiz');
        } finally {
            setSubmitting(false);
        }
    };

    const submitQuiz = async () => {
        try {
            setSubmitting(true);
            setError(null);

            const formattedAnswers = quiz!.questions.map((question, index) => ({
                questionId: question.id,
                answer: answers[index],
            }));

            const response = await quizzesApi.submitQuiz(
                quizId,
                formattedAnswers,
                new Date().toISOString()
            );

            setResult({
                score: response.score,
                correctCount: response.correctCount,
                totalQuestions: response.totalQuestions,
                reward: response.reward,
            });
            setQuizCompleted(true);
        } catch (err) {
            console.error('Submit error:', err);
            setError(err instanceof Error ? err.message : 'Failed to submit quiz');
        } finally {
            setSubmitting(false);
        }
    };

    const resetQuiz = () => {
        setQuizStarted(false);
        setQuizCompleted(false);
        setCurrentQuestionIndex(0);
        setAnswers(new Array(quiz?.questions?.length || 0).fill(null));
        setResult(null);
        setError(null);
    };

    return {
        quiz,
        loading,
        error,
        currentQuestionIndex,
        answers,
        quizStarted,
        quizCompleted,
        result,
        submitting,
        rewardAlreadyClaimed,
        setCurrentQuestionIndex,
        setAnswers,
        selectAnswer,
        nextQuestion,
        previousQuestion,
        startQuiz,
        submitQuiz,
        resetQuiz,
    };
};