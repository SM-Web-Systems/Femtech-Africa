'use client';

import { useQuizzes } from './useQuizzes';

export default function QuizzesList() {
    const { quizzes, loading, error } = useQuizzes();

    if (loading) {
        return <div className="text-center py-8">Loading quizzes...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    if (quizzes.length === 0) {
        return <div className="text-center py-8">No quizzes found.</div>;
    }

    return (
        <section className="px-4 py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                    Quizzes
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {quiz.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {quiz.description || 'Description not specified'}
                            </p>
                            <p className="text-gray-600 text-sm">
                                Difficulty: {quiz.difficulty || 'Not specified'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}