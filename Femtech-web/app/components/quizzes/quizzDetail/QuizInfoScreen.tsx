'use client';

import Link from 'next/link';
import { QuizDetail } from '../../../lib/hooks/useQuizDetail';

interface QuizInfoScreenProps {
    quiz: QuizDetail;
    error: string | null;
    loading: boolean;
    onStart: () => Promise<void>;
}

export default function QuizInfoScreen({
    quiz,
    error,
    loading,
    onStart,
}: QuizInfoScreenProps) {
    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/quizzes"
                        className="mb-6 text-blue-100 hover:text-white font-medium flex items-center gap-2 transition"
                    >
                        ← Back to Quizzes
                    </Link>
                    <h1 className="text-4xl font-bold mb-4">{quiz.title}</h1>
                    <p className="text-lg text-blue-100">{quiz.description}</p>
                </div>
            </section>

            {/* Content */}
            <section className="px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Quiz Info Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Questions
                            </p>
                            <p className="text-3xl font-bold text-gray-900">{quiz.questions?.length || 0}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Time Limit
                            </p>
                            <p className="text-3xl font-bold text-gray-900">{quiz.time_limit_mins} mins</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Difficulty
                            </p>
                            <p className="text-3xl font-bold text-gray-900 capitalize">{quiz.difficulty}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Reward
                            </p>
                            <p className="text-3xl font-bold text-blue-600">{quiz.reward_amount} MAMA</p>
                        </div>
                    </div>

                    {/* Pass Threshold Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <p className="text-blue-900 font-semibold mb-2">
                            ℹ️ You need to score {quiz.pass_threshold}% or higher to pass and earn the reward.
                        </p>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={onStart}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Starting Quiz...
                            </>
                        ) : (
                            <>
                                <span>🚀</span>
                                Start Quiz
                            </>
                        )}
                    </button>
                </div>
            </section>
        </main>
    );
}