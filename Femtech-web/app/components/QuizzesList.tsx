'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { quizzesApi, QuizWithAttempts, QuizAttempt, Quizz } from './useQuizzes';
import Link from 'next/link';


export default function QuizzesList() {
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();
    const [quizzes, setQuizzes] = useState<Quizz[]>([]);
    const [userAttempts, setUserAttempts] = useState<QuizAttempt[]>([]);
    const [quizzesWithAttempts, setQuizzesWithAttempts] = useState<QuizWithAttempts[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

    useEffect(() => {
        if (!isInitialized) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all quizzes
                const quizzesResponse = await quizzesApi.getQuizzes();
                const allQuizzes = quizzesResponse;
                setQuizzes(quizzesResponse);

                // Fetch user attempts if authenticated
                if (isAuthenticated) {
                    const attemptsResponse = await quizzesApi.getMyAttempts();
                    const attempts = attemptsResponse;
                    setUserAttempts(attemptsResponse);

                    // Merge quizzes with user attempts
                    const merged = allQuizzes.map((quiz: Quizz) => {
                        const quizAttempts = attempts.filter((a: QuizAttempt) => a.quizId === quiz.id);
                        const latestAttempt = quizAttempts.length > 0 ? quizAttempts[0] : null;
                        const bestScore = quizAttempts.length > 0 ? Math.max(...quizAttempts.map((a: QuizAttempt) => a.score)) : 0;

                        return {
                            ...quiz,
                            attempts: quizAttempts,
                            totalAttempts: quizAttempts.length,
                            latestAttempt,
                            bestScore,
                        };
                    });

                    setQuizzesWithAttempts(merged);
                } else {
                    // If not authenticated, just show quizzes without attempts
                    setQuizzesWithAttempts(
                        allQuizzes.map((quiz: Quizz) => ({
                            ...quiz,
                            attempts: [],
                            totalAttempts: 0,
                            latestAttempt: null,
                            bestScore: 0,
                        }))
                    );
                }
            } catch (err) {
                console.error('Failed to fetch quizzes:', err);
                setError('Failed to load quizzes. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, isInitialized]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (passed: boolean) => {
        return passed ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
    };

    const getStatusIcon = (passed: boolean) => {
        return passed ? '✅' : '❌';
    };

    if (loading) {
        return (
            <section className="px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading quizzes...</p>
                    </div>
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

    return (
        <section className="px-4 py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-12">Available Quizzes</h2>

                {quizzesWithAttempts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No quizzes available yet.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzesWithAttempts.map((quiz) => (
                            <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                                    <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                                    <p className="text-blue-100 text-sm">{quiz.category} • {quiz.difficulty}</p>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-4">
                                    <p className="text-gray-600 text-sm">{quiz.description}</p>

                                    {/* Quiz Stats */}
                                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Questions</p>
                                            <p className="text-2xl font-bold text-gray-900">{quiz.questionCount}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Reward</p>
                                            <p className="text-2xl font-bold text-blue-600">{quiz.reward_amount} MAMA</p>
                                        </div>
                                    </div>

                                    {/* User Attempts Section */}
                                    {isAuthenticated && quiz.totalAttempts > 0 ? (
                                        <div className="space-y-3 bg-blue-50 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    Attempts: <span className="text-blue-600">{quiz.totalAttempts}</span>
                                                </p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    Best: <span className="text-blue-600">{quiz.bestScore}%</span>
                                                </p>
                                            </div>

                                            {/* Latest Attempt */}
                                            {quiz.latestAttempt && (
                                                <div className={`rounded-lg p-3 text-sm ${getStatusColor(quiz.latestAttempt.passed)}`}>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-semibold">Latest Attempt</span>
                                                        <span className="text-lg">{getStatusIcon(quiz.latestAttempt.passed)}</span>
                                                    </div>
                                                    <p className="text-xs opacity-75">
                                                        {formatDate(quiz.latestAttempt.completedAt)}
                                                    </p>
                                                    <p className="font-semibold mt-1">{quiz.latestAttempt.score}%</p>
                                                    {quiz.latestAttempt.rewardGranted && (
                                                        <p className="text-xs mt-2 font-semibold">✓ Reward Claimed</p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Expand Attempts */}
                                            <button
                                                onClick={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
                                                className="w-full text-blue-600 hover:text-blue-700 font-semibold text-sm py-2 border-t border-blue-200"
                                            >
                                                {expandedQuiz === quiz.id ? '▼ Hide Attempts' : '▶ View All Attempts'}
                                            </button>

                                            {/* Expanded Attempts List */}
                                            {expandedQuiz === quiz.id && (
                                                <div className="space-y-2 pt-2 border-t border-blue-200">
                                                    {quiz.attempts.map((attempt) => (
                                                        <div
                                                            key={attempt.id}
                                                            className={`p-3 rounded text-sm ${attempt.passed ? 'bg-green-100' : 'bg-red-100'
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-semibold">
                                                                    {attempt.score}% {getStatusIcon(attempt.passed)}
                                                                </span>
                                                                <span className="text-xs opacity-75">
                                                                    {formatDate(attempt.completedAt)}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs opacity-75">
                                                                Duration: {attempt.duration_seconds}s
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : isAuthenticated ? (
                                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                                            <p className="text-sm text-gray-600">Not attempted yet</p>
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                                            <p className="text-sm text-gray-600 mb-3">
                                                <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                                                    Sign in
                                                </Link>
                                                {' '}to see your attempts
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <Link
                                        href={`/quizzes/${quiz.id}`}
                                        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                                    >
                                        {quiz.latestAttempt ? 'Retake Quiz' : 'Start Quiz'}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}