'use client';

import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { useQuizzes } from '@/app/lib/hooks/useQuizzes';
import Link from 'next/link';

export default function QuizzesPage() {
  const { data: quizzes, isLoading } = useQuizzes();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    education: 'bg-blue-100 text-blue-700',
    wellness: 'bg-green-100 text-green-700',
    health: 'bg-purple-100 text-purple-700',
    mental: 'bg-pink-100 text-pink-700',
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Wellness Quizzes</h1>
        <p className="text-gray-600 mt-2">Test your knowledge and earn MAMA tokens</p>
      </div>

      {/* Info Card */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="space-y-3">
          <p className="font-semibold text-gray-900">💡 How Quizzes Work</p>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>✓ Each quiz has multiple questions</li>
            <li>✓ Answer correctly to earn tokens</li>
            <li>✓ Retake quizzes to improve your score</li>
            <li>✓ Learn valuable information about maternal health</li>
          </ul>
        </div>
      </Card>

      {quizzes && quizzes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} hover>
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">{quiz.title}</h3>
                    <span className="text-2xl">🧠</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📊</span>
                      <span>{(quiz.questions || []).length} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>🏆</span>
                      <span>Earn {quiz.reward} MAMA</span>
                    </div>
                    <div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                        categoryColors[quiz.category] || 'bg-gray-100 text-gray-700'
                      }`}>
                        {quiz.category}
                      </span>
                    </div>
                  </div>
                </div>

                <Button variant="primary" className="w-full">
                  Take Quiz
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-gray-600 text-center py-12">No quizzes available yet. Check back soon!</p>
        </Card>
      )}
    </div>
  );
}
