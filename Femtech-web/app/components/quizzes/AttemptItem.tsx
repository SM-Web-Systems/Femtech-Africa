'use client';

import { QuizzAttempt } from '../../lib/services/useQuizzes';
import { formatDate, getStatusIcon } from '../../lib/utils/quizzUtils';

interface AttemptItemProps {
    attempt: QuizzAttempt;
}

export default function AttemptItem({ attempt }: AttemptItemProps) {
    return (
        <div className={`p-3 rounded text-sm ${attempt.passed ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">
                    {attempt.score}% {getStatusIcon(attempt.passed)}
                </span>
                <span className="text-xs opacity-75">{formatDate(attempt.completedAt)}</span>
            </div>
            <p className="text-xs opacity-75">Duration: {attempt.duration_seconds}s</p>
        </div>
    );
}