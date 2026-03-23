'use client';

import Link from 'next/link';
import { QuizzWithAttempts, QuizzAttempt } from '../../lib/services/useQuizzes';
import { formatDate, getStatusIcon, getButtonText } from '../../lib/utils/quizzUtils';
import AttemptHistory from './AttemptHistory';

interface QuizzCardProps {
    quizz: QuizzWithAttempts;
    isAuthenticated: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

export default function QuizzCard({ quizz, isAuthenticated, isExpanded, onToggleExpand }: QuizzCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <h3 className="text-xl font-bold mb-2">{quizz.title}</h3>
                <p className="text-blue-100 text-sm">{quizz.category} • {quizz.difficulty}</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
                <p className="text-gray-600 text-sm">{quizz.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Questions</p>
                        <p className="text-2xl font-bold text-gray-900">{quizz.questionCount}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Reward</p>
                        <p className="text-2xl font-bold text-blue-600">{quizz.reward_amount} MAMA</p>
                    </div>
                </div>

                {/* Attempts Section */}
                {isAuthenticated ? (
                    quizz.totalAttempts > 0 ? (
                        <AttemptHistory
                            quiz={quizz}
                            isExpanded={isExpanded}
                            onToggleExpand={onToggleExpand}
                        />
                    ) : (
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-600">Not attempted yet</p>
                        </div>
                    )
                ) : (
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600">
                            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                                Sign in
                            </Link>
                            {' '}to see your attempts
                        </p>
                    </div>
                )}

                {/* Action Button */}
                <Link
                    href={`/quizzes/${quizz.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                    {getButtonText(quizz.latestAttempt)}
                </Link>
            </div>
        </div>
    );
}

