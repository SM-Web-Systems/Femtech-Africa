'use client';

import { quizzesApi, Quizz } from './useQuizzes';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QuizzesList() {
    const [quizzes, setQuizzes] = useState<Quizz[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await quizzesApi.getQuizzes();
                setQuizzes(response);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                console.error('Error fetching quizzes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) {
        return (
            <section className="px-4 py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="mb-4 relative w-12 h-12 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin"></div>
                    </div>
                    <p className="text-gray-600 font-medium">Loading quizzes...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="px-4 py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600 font-medium">Error: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (quizzes.length === 0) {
        return (
            <section className="px-4 py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-gray-600 font-medium">No quizzes available yet.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="px-4 py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                    Quizzes
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <Link key={quiz.id} href={`/quizzes/${quiz.id}`}>
                            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {quiz.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {quiz.description || 'Description not specified'}
                                        </p>
                                    </div>
                                    <span className="text-2xl ml-2">📝</span>
                                </div>

                                {/* Quiz Info Grid */}
                                <div className="space-y-2 mb-4 pb-4 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500 font-semibold">Difficulty</span>
                                        <span className="text-xs font-bold text-gray-900 capitalize">
                                            {quiz.difficulty || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500 font-semibold">Questions</span>
                                        <span className="text-xs font-bold text-gray-900">
                                            {quiz._count?.questions || quiz.questionCount || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500 font-semibold">Time Limit</span>
                                        <span className="text-xs font-bold text-gray-900">
                                            {quiz.time_limit_mins} mins
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500 font-semibold">Reward</span>
                                        <span className="text-xs font-bold text-blue-600">
                                            {quiz.reward_amount} MAMA
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition text-sm">
                                    Take Quiz →
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}