'use client';

interface QuestionNavigationProps {
    currentIndex: number;
    answers: (number | null)[];
    totalQuestions: number;
    hasAnsweredAll: boolean;
    submitting: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onSubmit: () => void;
}

export default function QuestionNavigation({
    currentIndex,
    answers,
    totalQuestions,
    hasAnsweredAll,
    submitting,
    onPrevious,
    onNext,
    onSubmit,
}: QuestionNavigationProps) {
    const isLastQuestion = currentIndex === totalQuestions - 1;

    return (
        <div className="flex gap-4">
            <button
                onClick={onPrevious}
                disabled={currentIndex === 0}
                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg transition disabled:text-gray-400"
            >
                ← Previous
            </button>

            {isLastQuestion ? (
                <button
                    onClick={onSubmit}
                    disabled={submitting || !hasAnsweredAll}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <span>✓</span>
                            Submit Quiz
                        </>
                    )}
                </button>
            ) : (
                <button
                    onClick={onNext}
                    disabled={answers[currentIndex] === null}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition disabled:text-gray-300"
                >
                    Next →
                </button>
            )}
        </div>
    );
}