'use client';

import { useRouter } from 'next/navigation';
import { QuizDetail, QuizResult } from '../../../lib/hooks/useQuizDetail';
import ResultsStats from './ResultsStats';
import RewardSection from './RewardSection';
import { didUserPass } from '../../../lib/utils/quizzUtils';

interface QuizResultsProps {
    quiz: QuizDetail;
    result: QuizResult;
    rewardAlreadyClaimed: boolean;
    onTryAgain: () => void;
}

export default function QuizResults({
    quiz,
    result,
    rewardAlreadyClaimed,
    onTryAgain,
}: QuizResultsProps) {
    const router = useRouter();
    const passed = didUserPass(result.score, quiz.pass_threshold);

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center shadow-lg">
                <ResultsStats
                    score={result.score}
                    correctCount={result.correctCount}
                    totalQuestions={result.totalQuestions}
                    passed={passed}
                    passThreshold={quiz.pass_threshold}
                />

                <RewardSection
                    rewardAmount={quiz.reward_amount}
                    rewardEarned={!!result.reward && !rewardAlreadyClaimed}
                    rewardAlreadyClaimed={rewardAlreadyClaimed}
                />

                <div className="space-y-3">
                    <button
                        onClick={() => router.push('/quizzes')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-medium"
                    >
                        Back to Quizzes
                    </button>
                    {!passed && (
                        <button
                            onClick={onTryAgain}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg transition font-medium"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}