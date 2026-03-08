import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { quizzesApi } from '../../api';

const COLORS = {
  primary: '#E91E63',
  background: '#FFF5F8',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
};

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: string[];
}

interface QuizData {
  quizId: string;
  title: string;
  timeLimit: number;
  passThreshold: number;
  rewardAmount: number;
  startedAt: string;
  questions: Question[];
}

interface Result {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  reward?: { amount: number; txHash: string };
  results: any[];
}

export default function QuizDetailScreen({ route, navigation }: any) {
  const { quizId } = route.params;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: number }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Result | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    startQuiz();
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  const startQuiz = async () => {
    try {
      const data = await quizzesApi.startQuiz(quizId);
      setQuizData(data);
      if (data.timeLimit) {
        setTimeLeft(data.timeLimit * 60);
      }
    } catch (error) {
      console.error('Failed to start quiz:', error);
      Alert.alert('Error', 'Failed to load quiz');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null || !quizData) return;

    const question = quizData.questions[currentQuestion];
    const newAnswers = [
      ...answers.filter((a) => a.questionId !== question.id),
      { questionId: question.id, answer: selectedAnswer },
    ];
    setAnswers(newAnswers);

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = answers.find(
        (a) => a.questionId === quizData?.questions[currentQuestion - 1].id
      );
      setSelectedAnswer(prevAnswer?.answer ?? null);
    }
  };

  const handleSubmit = async (finalAnswers?: typeof answers) => {
    if (!quizData) return;

    setSubmitting(true);
    try {
      const result = await quizzesApi.submitQuiz(
        quizId,
        finalAnswers || answers,
        quizData.startedAt
      );
      setResults(result);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      Alert.alert('Error', 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showResults && results) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <View style={styles.resultCard}>
            <Text style={styles.resultEmoji}>
              {results.passed ? '🎉' : '😔'}
            </Text>
            <Text style={styles.resultTitle}>
              {results.passed ? 'Congratulations!' : 'Keep Learning!'}
            </Text>
            <Text style={styles.resultSubtitle}>
              {results.passed
                ? 'You passed the quiz!'
                : 'You can try again to pass'}
            </Text>

            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{results.score}%</Text>
              <Text style={styles.scoreLabel}>Score</Text>
            </View>

            <View style={styles.resultStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{results.correctCount}</Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{results.totalQuestions}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>

            {results.reward && (
              <View style={styles.rewardCard}>
                <Text style={styles.rewardEmoji}>🪙</Text>
                <Text style={styles.rewardText}>
                  You earned {results.reward.amount} MAMA tokens!
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!quizData) return null;

  const question = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{quizData.title}</Text>
        {timeLeft !== null && (
          <Text
            style={[
              styles.timer,
              timeLeft < 60 && styles.timerWarning,
            ]}
          >
            {formatTime(timeLeft)}
          </Text>
        )}
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1} / {quizData.questions.length}
        </Text>
      </View>

      {/* Question */}
      <ScrollView style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.questionText}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.optionButtonSelected,
              ]}
              onPress={() => handleSelectAnswer(index)}
            >
              <View
                style={[
                  styles.optionCircle,
                  selectedAnswer === index && styles.optionCircleSelected,
                ]}
              >
                {selectedAnswer === index && (
                  <View style={styles.optionCircleFill} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  selectedAnswer === index && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navContainer}>
        {currentQuestion > 0 && (
          <TouchableOpacity style={styles.prevButton} onPress={handlePrevious}>
            <Text style={styles.prevButtonText}>← Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedAnswer === null && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedAnswer === null || submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.nextButtonText}>
              {currentQuestion === quizData.questions.length - 1
                ? 'Submit'
                : 'Next →'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: COLORS.textSecondary },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
  },
  closeButton: { fontSize: 24, color: COLORS.textSecondary },
  headerTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, flex: 1, textAlign: 'center' },
  timer: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  timerWarning: { color: COLORS.error },

  progressContainer: { padding: 16, paddingTop: 8 },
  progressBar: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  progressText: { textAlign: 'center', marginTop: 8, color: COLORS.textSecondary },

  questionContainer: { flex: 1, padding: 20 },
  questionText: { fontSize: 20, fontWeight: '600', color: COLORS.text, marginBottom: 24 },

  optionsContainer: { gap: 12 },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  optionButtonSelected: { borderColor: COLORS.primary, backgroundColor: '#FFF0F5' },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCircleSelected: { borderColor: COLORS.primary },
  optionCircleFill: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  optionText: { flex: 1, fontSize: 16, color: COLORS.text },
  optionTextSelected: { color: COLORS.primary, fontWeight: '500' },

  navContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: COLORS.white,
  },
  prevButton: { flex: 1, padding: 16, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: COLORS.primary },
  prevButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
  nextButton: { flex: 2, padding: 16, alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 12 },
  nextButtonDisabled: { backgroundColor: '#CCC' },
  nextButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },

  // Results
  resultsContainer: { flexGrow: 1, padding: 20 },
  resultCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, alignItems: 'center' },
  resultEmoji: { fontSize: 64 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginTop: 16 },
  resultSubtitle: { fontSize: 16, color: COLORS.textSecondary, marginTop: 8 },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  scoreText: { fontSize: 32, fontWeight: 'bold', color: COLORS.white },
  scoreLabel: { fontSize: 14, color: COLORS.white, opacity: 0.9 },
  resultStats: { flexDirection: 'row', gap: 40 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 14, color: COLORS.textSecondary },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  rewardEmoji: { fontSize: 24, marginRight: 12 },
  rewardText: { fontSize: 16, color: '#FF8F00', fontWeight: '600' },
  doneButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 24,
  },
  doneButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});
