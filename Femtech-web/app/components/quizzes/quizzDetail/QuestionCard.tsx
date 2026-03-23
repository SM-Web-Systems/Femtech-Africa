'use client';

import { QuizQuestion } from '../../../lib/hooks/useQuizDetail';

interface QuestionCardProps {
    question: QuizQuestion;
    selectedAnswer: number | null;
    onSelectAnswer: (optionIndex: number) => void;
}

export default function QuestionCard({
    question,
    selectedAnswer,
    onSelectAnswer,
}: QuestionCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{question.questionText}</h2>

            <div className="space-y-4">
                {question.options?.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectAnswer(index)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition font-medium ${selectedAnswer === index
                                ? 'border-blue-600 bg-blue-50 text-blue-900'
                                : 'border-gray-200 bg-white text-gray-900 hover:border-blue-300'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}