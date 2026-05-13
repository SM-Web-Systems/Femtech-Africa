'use client';

import { QuizDetail } from '../../../lib/hooks/useQuizDetail';
import QuestionCard from './QuestionCard';
import QuestionNavigation from './QuestionNavigation';
import { calculateProgress, calculateAnsweredCount } from '../../../lib/utils/quizzUtils';

interface QuizQuestionProps {
    quiz: QuizDetail;
    currentQuestionIndex: number;
    answers: (number | null)[];
    submitting: boolean;
    onSelectAnswer: (optionIndex: number) => void;
    onNext: () => void;
    onPrevious: () => void;
    onSubmit: () => Promise<void>;
}

export default function QuizQuestion({
    quiz,
    currentQuestionIndex,
    answers,
    submitting,
    onSelectAnswer,
    onNext,
    onPrevious,
    onSubmit,
}: QuizQuestionProps) {
    const currentQuestion = quiz.questions?.[currentQuestionIndex];
    const totalQuestions = quiz.questions?.length || 0;
    const progress = calculateProgress(currentQuestionIndex, totalQuestions);
    const answeredCount = calculateAnsweredCount(answers);
    const hasAnsweredAll = answers.every((a) => a !== null);

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                        <span className="text-lg font-bold text-blue-600">
                            Question {currentQuestionIndex + 1} of {totalQuestions}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question */}
                {currentQuestion && (
                    <QuestionCard
                        question={currentQuestion}
                        selectedAnswer={answers[currentQuestionIndex]}
                        onSelectAnswer={onSelectAnswer}
                    />
                )}

                {/* Navigation */}
                <QuestionNavigation
                    currentIndex={currentQuestionIndex}
                    answers={answers}
                    totalQuestions={totalQuestions}
                    hasAnsweredAll={hasAnsweredAll}
                    submitting={submitting}
                    onPrevious={onPrevious}
                    onNext={onNext}
                    onSubmit={onSubmit}
                />

                {/* Progress Info */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    You've answered {answeredCount} of {totalQuestions} questions
                </div>
            </div>
        </main>
    );
}