'use-client';

import { useState, useEffect } from 'react';

interface Quizz {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    country: string | null;
    language: string;
    time_limit_mins: number;
    pass_threshold: number;
    reward_amount: number;
    milestone_def_id: string | null;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    _count: {
        questions: number;
    };
}

interface UseQuizzResult {
    quizzes: Quizz[];
    loading: boolean;
    error: string | null;
}

export function useQuizzes(): UseQuizzResult {
    const [quizzes, setQuizzes] = useState<Quizz[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                setError(null);

                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}api/v1/quizzes`);

                console.log(apiUrl)

                if (!response.ok) {
                    throw new Error(`Error fetching quizzes: ${response.statusText}`);
                }

                const data = await response.json();
                setQuizzes(data);
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                console.error('Error fetching quizzes:', err);
            }
            finally {
                setLoading(false);
            }
        }

        fetchQuizzes();

    }, []); // Empty dependency array means this runs once on mount

    return { quizzes, loading, error };
}