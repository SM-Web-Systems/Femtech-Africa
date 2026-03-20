'use client';

import { QuizzWithAttempts } from '../useQuizzes';
import { formatDate, getStatusIcon, getStatusColor } from '../../lib/utils/quizzUtils';
import AttemptItem from './AttemptItem';

interface AttemptHistoryProps {
    quiz: QuizzWithAttempts;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

export default function AttemptHistory({ quiz, isExpanded, onToggleExpand }: AttemptHistoryProps) {
    return (
        <div className="space-y-3 bg-blue-50 rounded-lg p-4">
            {/* Stats Row */}
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
                    <p className="text-xs opacity-75">{formatDate(quiz.latestAttempt.completedAt)}</p>
                    <p className="font-semibold mt-1">{quiz.latestAttempt.score}%</p>
                    {quiz.attempts.find(attempt => attempt.rewardGranted) && (
                        <p className="text-xs mt-2 font-semibold">✓ Reward Claimed</p>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={onToggleExpand}
                className="w-full text-blue-600 hover:text-blue-700 font-semibold text-sm py-2 border-t border-blue-200"
            >
                {isExpanded ? '▼ Hide Attempts' : '▶ View All Attempts'}
            </button>

            {/* Expanded List */}
            {isExpanded && (
                <div className="space-y-2 pt-2 border-t border-blue-200">
                    {quiz.attempts.map((attempt) => (
                        <AttemptItem key={attempt.id} attempt={attempt} />
                    ))}
                </div>
            )}
        </div>
    );
}