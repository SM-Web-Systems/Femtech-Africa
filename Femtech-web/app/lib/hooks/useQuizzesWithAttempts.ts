'use client';

import { useState, useEffect } from 'react';
import { quizzesApi, Quizz, QuizzAttempt, QuizzWithAttempts } from '../../lib/services/useQuizzes';

export const useQuizzesWithAttempts = (isAuthenticated: boolean, isInitialized: boolean) => {
    const [quizzesWithAttempts, setQuizzesWithAttempts] = useState<QuizzWithAttempts[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isInitialized) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const allQuizzes = await quizzesApi.getQuizzes();
                const attempts = isAuthenticated ? await quizzesApi.getMyAttempts() : [];

                const merged = allQuizzes.map((quiz: Quizz) => {
                    const quizAttempts = attempts.filter((a: QuizzAttempt) => a.quizId === quiz.id);
                    const latestAttempt = quizAttempts[0] || null;
                    const bestScore = quizAttempts.length > 0 ? Math.max(...quizAttempts.map((a: QuizzAttempt) => a.score)) : 0;

                    return {
                        ...quiz,
                        attempts: quizAttempts,
                        totalAttempts: quizAttempts.length,
                        latestAttempt,
                        bestScore,
                    } as QuizzWithAttempts;
                });

                setQuizzesWithAttempts(merged);
            } catch (err) {
                console.error('Failed to fetch quizzes:', err);
                setError('Failed to load quizzes. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, isInitialized]);

    return { quizzesWithAttempts, loading, error };
};