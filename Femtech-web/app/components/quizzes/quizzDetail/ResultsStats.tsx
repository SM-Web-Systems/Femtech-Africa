'use client';

interface ResultsStatsProps {
    score: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    passThreshold: number;
}

export default function ResultsStats({
    score,
    correctCount,
    totalQuestions,
    passed,
    passThreshold,
}: ResultsStatsProps) {
    return (
        <>
            <div className="mb-6 text-6xl text-center">{passed ? '🎉' : '📝'}</div>
            <h2 className={`text-3xl font-bold mb-2 text-center ${passed ? 'text-green-600' : 'text-gray-900'}`}>
                {passed ? 'Quiz Passed!' : 'Quiz Complete'}
            </h2>
            <p className="text-4xl font-bold text-gray-900 mb-6 text-center">{score}%</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-blue-600">{correctCount}</p>
                    <p className="text-xs text-gray-600 uppercase tracking-wider">Correct</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
                    <p className="text-xs text-gray-600 uppercase tracking-wider">Total</p>
                </div>
            </div>

            {!passed && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-900 font-semibold">You need {passThreshold}% to pass</p>
                    <p className="text-sm text-yellow-800">Try again to earn the reward!</p>
                </div>
            )}
        </>
    );
}