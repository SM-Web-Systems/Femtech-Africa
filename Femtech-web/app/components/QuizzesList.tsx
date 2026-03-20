'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { useQuizzesWithAttempts } from '../lib/hooks/useQuizzesWithAttempts';
import QuizzCard from './quizzes/QuizzCard';

export default function QuizzesList() {
    const { isAuthenticated, isInitialized } = useAuth();
    const { quizzesWithAttempts, loading, error } = useQuizzesWithAttempts(isAuthenticated, isInitialized);
    const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

    if (loading) {
        return (
            <section className="px-4 py-20">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading quizzes...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600 font-semibold">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (quizzesWithAttempts.length === 0) {
        return (
            <section className="px-4 py-20">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-gray-600 text-lg">No quizzes available yet.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="px-4 py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-12">Available Quizzes</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzesWithAttempts.map((quiz) => (
                        <QuizzCard
                            key={quiz.id}
                            quizz={quiz}
                            isAuthenticated={isAuthenticated}
                            isExpanded={expandedQuiz === quiz.id}
                            onToggleExpand={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}