'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { useQuizDetail } from '../../lib/hooks/useQuizDetail';
import QuizInfoScreen from '../../components/quizzes/quizzDetail/QuizInfoScreen';
import QuizQuestion from '../../components/quizzes/quizzDetail/QuizQuestion';
import QuizResults from '../../components/quizzes/quizzDetail/QuizResults';
import Link from 'next/link';

export default function QuizDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();

    // Redirect to login if not authenticated
    if (isInitialized && !isAuthenticated) {
        router.push('/login');
    }

    const {
        quiz,
        loading,
        error,
        currentQuestionIndex,
        answers,
        quizStarted,
        quizCompleted,
        result,
        submitting,
        rewardAlreadyClaimed,
        selectAnswer,
        nextQuestion,
        previousQuestion,
        startQuiz,
        submitQuiz,
        resetQuiz,
    } = useQuizDetail(id as string, isAuthenticated, isInitialized);

    // Loading state
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

    // Error state (no quiz loaded)
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

    // Quiz not found
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

    // Before quiz starts
    if (!quizStarted) {
        return (
            <QuizInfoScreen
                quiz={quiz}
                error={error}
                loading={submitting}
                onStart={startQuiz}
            />
        );
    }

    // Quiz completed
    if (quizCompleted && result) {
        return (
            <QuizResults
                quiz={quiz}
                result={result}
                rewardAlreadyClaimed={rewardAlreadyClaimed}
                onTryAgain={resetQuiz}
            />
        );
    }

    // Quiz in progress
    return (
        <QuizQuestion
            quiz={quiz}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            submitting={submitting}
            onSelectAnswer={selectAnswer}
            onNext={nextQuestion}
            onPrevious={previousQuestion}
            onSubmit={submitQuiz}
        />
    );
}