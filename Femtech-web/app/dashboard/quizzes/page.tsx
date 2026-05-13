'use client';

import { useState } from 'react';
import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { useQuizzes, useStartQuiz, useSubmitQuiz, useMyQuizAttempts } from '@/app/lib/hooks/useQuizzes';
import { useLanguage } from '@/app/lib/i18n/LanguageContext';

export default function QuizzesPage() {
  const { t } = useLanguage();
  const { data: quizzes, isLoading } = useQuizzes();
  const { data: attempts } = useMyQuizAttempts();
  const startQuizMutation = useStartQuiz();
  const submitQuizMutation = useSubmitQuiz();

  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);

  const handleStartQuiz = async (quizId: string) => {
    try {
      const data = await startQuizMutation.mutateAsync(quizId);
      setActiveQuiz(data);
      setAnswers({});
      setResult(null);
    } catch (err) { console.error('Failed to start quiz:', err); }
  };

  const handleSubmit = async () => {
    if (!activeQuiz) return;
    const answerArray = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
    try {
      const data = await submitQuizMutation.mutateAsync({ quizId: activeQuiz.quizId, answers: answerArray, startedAt: activeQuiz.startedAt });
      setResult(data);
    } catch (err) { console.error('Failed to submit quiz:', err); }
  };

  const getQuizAttemptCount = (quizId: string) => attempts?.filter(a => a.quizId === quizId).length || 0;
  const hasPassedQuiz = (quizId: string) => attempts?.some(a => a.quizId === quizId && a.passed) || false;
  const getBestScore = (quizId: string) => {
    const qa = attempts?.filter(a => a.quizId === quizId) || [];
    return qa.length === 0 ? null : Math.max(...qa.map(a => a.score));
  };

  const categoryColors: Record<string, string> = {
    nutrition: 'bg-green-100 text-green-700', pregnancy_basics: 'bg-blue-100 text-blue-700',
    mental_health: 'bg-pink-100 text-pink-700', labor_delivery: 'bg-purple-100 text-purple-700',
    newborn_care: 'bg-yellow-100 text-yellow-700', danger_signs: 'bg-red-100 text-red-700',
    breastfeeding: 'bg-orange-100 text-orange-700',
  };

  // Active quiz
  if (activeQuiz && !result) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => { setActiveQuiz(null); setAnswers({}); }}>← {t('quizzes.backToQuizzes')}</Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{activeQuiz.title}</h1>
        <p className="text-gray-600 mb-8">{t('quizzes.passThreshold')}: {activeQuiz.passThreshold}% · {t('quizzes.reward')}: {activeQuiz.rewardAmount} MAMA</p>
        <div className="space-y-6">
          {activeQuiz.questions.map((q: any, idx: number) => (
            <Card key={q.id}>
              <p className="font-semibold text-gray-900 mb-4">{idx + 1}. {q.questionText}</p>
              <div className="space-y-2">
                {(q.options || []).map((opt: string, optIdx: number) => (
                  <button key={optIdx} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition ${answers[q.id] === optIdx ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 hover:border-gray-300'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit} isLoading={submitQuizMutation.isPending}
            disabled={Object.keys(answers).length < activeQuiz.questions.length}>
            {t('quizzes.submitAnswers')} ({Object.keys(answers).length}/{activeQuiz.questions.length})
          </Button>
        </div>
      </div>
    );
  }

  // Result
  if (result) {
    return (
      <div className="p-8">
        <Card className={`mb-8 ${result.passed ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'}`}>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">{result.passed ? '🎉' : '😔'}</div>
            <h2 className="text-3xl font-bold mb-2">{result.passed ? t('quizzes.congratulations') : t('quizzes.notQuite')}</h2>
            <p className="text-4xl font-bold my-4">{result.score}%</p>
            <p className="text-gray-600">{result.correctCount} {t('common.of')} {result.totalQuestions} {t('quizzes.correct')} ({t('quizzes.needToPass')} {result.passThreshold}%)</p>
            {result.reward && (
              <div className="mt-4 p-4 bg-green-100 rounded-lg inline-block">
                <p className="text-green-800 font-bold text-lg">+{result.reward.amount} MAMA {t('quizzes.earned')}</p>
              </div>
            )}
            {result.alreadyRewarded && result.passed && (
              <p className="mt-4 text-yellow-700 text-sm">{t('quizzes.alreadyRewarded')}</p>
            )}
          </div>
        </Card>
        {result.results && (
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-bold">{t('quizzes.answers')}</h3>
            {result.results.map((r: any, idx: number) => (
              <Card key={idx} className={r.isCorrect ? 'border-green-200' : 'border-red-200'}>
                <p className="font-semibold">{idx + 1}. {r.questionText}</p>
                <p className={`text-sm mt-1 ${r.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {r.isCorrect ? `✓ ${t('quizzes.correctAnswer')}` : `✗ ${t('quizzes.incorrectAnswer')}`}
                </p>
                {r.explanation && <p className="text-gray-600 text-sm mt-2">{r.explanation}</p>}
              </Card>
            ))}
          </div>
        )}
        <Button variant="primary" className="w-full" onClick={() => { setActiveQuiz(null); setResult(null); setAnswers({}); }}>
          {t('quizzes.backToQuizzes')}
        </Button>
      </div>
    );
  }

  // List
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div></div>
          <p className="text-gray-600 mt-4">{t('quizzes.loadingQuizzes')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('quizzes.title')}</h1>
        <p className="text-gray-600 mt-2">{t('quizzes.subtitle')}</p>
      </div>

      {quizzes && quizzes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const passed = hasPassedQuiz(quiz.id);
            const attemptCount = getQuizAttemptCount(quiz.id);
            const bestScore = getBestScore(quiz.id);
            return (
              <Card key={quiz.id} hover>
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900 flex-1">{quiz.title}</h3>
                      {passed ? <span className="text-2xl">✅</span> : <span className="text-2xl">🧠</span>}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600"><span>📊</span><span>{quiz.questionCount} {t('quizzes.questions')}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600"><span>🏆</span><span>{t('quizzes.reward')} {quiz.reward_amount} MAMA</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600"><span>🎯</span><span>{t('quizzes.pass')}: {quiz.pass_threshold}%</span></div>
                      {attemptCount > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600"><span>📝</span><span>{attemptCount} {t('quizzes.attempts')} · {t('quizzes.best')}: {bestScore}%</span></div>
                      )}
                      <div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[quiz.category] || 'bg-gray-100 text-gray-700'}`}>
                          {quiz.category.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant={passed ? 'outline' : 'primary'} className="w-full" onClick={() => handleStartQuiz(quiz.id)} isLoading={startQuizMutation.isPending}>
                    {passed ? t('quizzes.retake') : t('quizzes.start')}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card><p className="text-gray-600 text-center py-12">{t('quizzes.noQuizzes')}</p></Card>
      )}
    </div>
  );
}
