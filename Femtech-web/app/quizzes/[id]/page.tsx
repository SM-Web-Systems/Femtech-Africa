'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { quizzesApi } from '../../components/useQuizzes';
import { useAuth } from '../../lib/AuthContext';
import Link from 'next/link';

interface Question {
    id: string;
    questionText: string;
    questionType: string;
    options: string[];
    sortOrder: number;
}

interface QuizDetail {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    country: string | null;
    language: string | null;
    time_limit_mins: number;
    pass_threshold: number;
    reward_amount: number;
    milestone_def_id: string | null;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    questions: Question[];
    alreadyPassed: boolean;
    questionCount: number;
}

interface QuizResult {
    score: number;
    correctCount: number;
    totalQuestions: number;
    reward?: { amount: number; txHash: string };
}

export default function QuizDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();

    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Wait for auth to completely finish initializing
        if (!isInitialized) {
            return; // Still loading, don't do anything yet
        }

        // Now auth is done. Check if user is NOT authenticated
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchQuiz = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await quizzesApi.getQuiz(id as string);

                console.log('Quiz response:', response);
                console.log('Questions:', response.questions);

                setQuiz(response);
                setAnswers(new Array(response.questions?.length || 0).fill(null));
            } catch (err) {
                console.error('Failed to fetch quiz:', err);
                setError('Failed to load quiz. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchQuiz();
        }
    }, [id, isInitialized, isAuthenticated]);

    const handleStartQuiz = async () => {
        try {
            setSubmitting(true);
            setError(null);
            await quizzesApi.startQuiz(id as string);
            setQuizStarted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start quiz');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSelectAnswer = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        try {
            setSubmitting(true);
            setError(null);

            // Format answers to match API expectations (structured with question IDs)
            // This matches the format the mobile app uses
            const formattedAnswers = quiz!.questions.map((question, index) => ({
                questionId: question.id,
                answer: answers[index],
            }));

            console.log('📤 Submitting formatted answers:', formattedAnswers);

            const response = await quizzesApi.submitQuiz(
                id as string,
                formattedAnswers,
                new Date().toISOString()
            );

            console.log('📥 Quiz submission response:', response);
            console.log('📥 Response structure:', {
                score: response.score,
                correctCount: response.correctCount,
                totalQuestions: response.totalQuestions,
                reward: response.reward,
            });

            // Store the complete result for display
            setResult({
                score: response.score,
                correctCount: response.correctCount,
                totalQuestions: response.totalQuestions,
                reward: response.reward,
            });
            setQuizCompleted(true);
        } catch (err) {
            console.error('❌ Submit error:', err);
            setError(err instanceof Error ? err.message : 'Failed to submit quiz');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-6 relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin"></div>
                    </div>
                    <p className="text-sm font-medium text-slate-500">Loading quiz...</p>
                </div>
            </main>
        );
    }

    if (error && !quiz) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
                <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md text-center shadow-sm">
                    <div className="mb-4 text-4xl">⚠️</div>
                    <p className="text-red-600 font-semibold mb-2">Error</p>
                    <p className="text-red-500 text-sm mb-6">{error}</p>
                    <Link
                        href="/quizzes"
                        className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-medium text-sm"
                    >
                        Back to Quizzes
                    </Link>
                </div>
            </main>
        );
    }

    if (!quiz) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-8 max-w-md text-center shadow-sm">
                    <p className="text-gray-600 font-semibold mb-6">Quiz not found</p>
                    <Link
                        href="/quizzes"
                        className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-medium text-sm"
                    >
                        Back to Quizzes
                    </Link>
                </div>
            </main>
        );
    }

    // Before Quiz Starts - Information Screen
    if (!quizStarted) {
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
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Questions</p>
                                <p className="text-3xl font-bold text-gray-900">{quiz.questions?.length || 0}</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Time Limit</p>
                                <p className="text-3xl font-bold text-gray-900">{quiz.time_limit_mins} mins</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Difficulty</p>
                                <p className="text-3xl font-bold text-gray-900 capitalize">{quiz.difficulty}</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Reward</p>
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
                            onClick={handleStartQuiz}
                            disabled={submitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2 text-lg"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

    // Quiz Completed - Results Screen
    if (quizCompleted && result) {
        const passed = result.score >= quiz.pass_threshold;

        return (
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center shadow-lg">
                    <div className="mb-6 text-6xl">{passed ? '🎉' : '📝'}</div>
                    <h2 className={`text-3xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-gray-900'}`}>
                        {passed ? 'Quiz Passed!' : 'Quiz Complete'}
                    </h2>
                    <p className="text-4xl font-bold text-gray-900 mb-6">{result.score}%</p>

                    {/* Results Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-2xl font-bold text-blue-600">{result.correctCount}</p>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Correct</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-2xl font-bold text-blue-600">{result.totalQuestions}</p>
                            <p className="text-xs text-gray-600 uppercase tracking-wider">Total</p>
                        </div>
                    </div>

                    {passed && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-green-900 font-semibold mb-1">You earned {quiz.reward_amount} MAMA tokens!</p>
                            <p className="text-sm text-green-800">These have been added to your wallet.</p>
                        </div>
                    )}

                    {!passed && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-yellow-900 font-semibold">You need {quiz.pass_threshold}% to pass</p>
                            <p className="text-sm text-yellow-800">Try again to earn the reward!</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/quizzes')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-medium"
                        >
                            Back to Quizzes
                        </button>
                        {!passed && (
                            <button
                                onClick={() => {
                                    setQuizStarted(false);
                                    setQuizCompleted(false);
                                    setCurrentQuestionIndex(0);
                                    setAnswers(new Array(quiz.questions?.length || 0).fill(null));
                                    setResult(null);
                                }}
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

    // Quiz In Progress - Question Screen
    const currentQuestion = quiz.questions?.[currentQuestionIndex];
    const totalQuestions = quiz.questions?.length || 0;
    const answeredCount = answers.filter((a) => a !== null).length;

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
                            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentQuestion?.questionText}</h2>

                    {/* Options */}
                    <div className="space-y-4">
                        {currentQuestion?.options?.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelectAnswer(index)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition font-medium ${answers[currentQuestionIndex] === index
                                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                                    : 'border-gray-200 bg-white text-gray-900 hover:border-blue-300'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg transition disabled:text-gray-400"
                    >
                        ← Previous
                    </button>

                    {currentQuestionIndex === totalQuestions - 1 ? (
                        <button
                            onClick={handleSubmitQuiz}
                            disabled={submitting || answers.some((a) => a === null)}
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
                            onClick={handleNextQuestion}
                            disabled={answers[currentQuestionIndex] === null}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition disabled:text-gray-300"
                        >
                            Next →
                        </button>
                    )}
                </div>

                {/* Progress Info */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    You've answered {answeredCount} of {totalQuestions} questions
                </div>
            </div>
        </main>
    );
}
