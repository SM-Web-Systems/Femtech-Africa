import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { quizzesApi, walletApi } from '../../api';
import { useTheme } from '../../store/ThemeContext';

const CATEGORY_ICONS: Record<string, string> = {
  pregnancy_basics: '🤰',
  nutrition: '🥗',
  exercise: '🏃‍♀️',
  mental_health: '🧠',
  labor_delivery: '👶',
  breastfeeding: '🍼',
  newborn_care: '👼',
  postpartum: '💪',
  danger_signs: '⚠️',
  family_planning: '👨‍👩‍👧',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: '#4CAF50',
  intermediate: '#FF9800',
  advanced: '#F44336',
};

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  time_limit_mins: number;
  pass_threshold: number;
  reward_amount: number;
  _count: { questions: number };
}

interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  passed: boolean;
  rewardGranted: boolean;
}

export default function QuizListScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);

  const styles = createStyles(colors, isDark);

  // Rate limiting protection
  const lastFetchTime = useRef<number>(0);
  const hasFetchedOnce = useRef<boolean>(false);
  const MIN_FETCH_INTERVAL = 5000;

  const fetchData = useCallback(async (force = false) => {
    const now = Date.now();

    if (!force && hasFetchedOnce.current && now - lastFetchTime.current < MIN_FETCH_INTERVAL) {
      setLoading(false);
      return;
    }

    lastFetchTime.current = now;
    hasFetchedOnce.current = true;

    try {
      // Check wallet first
      const balance = await walletApi.getBalance();
      const walletExists = balance.hasWallet !== false && balance.stellarAddress !== null;
      setHasWallet(walletExists);

      if (walletExists) {
        // Fetch quizzes and attempts in parallel
        const [quizzesData, attemptsData] = await Promise.all([
          quizzesApi.getQuizzes(selectedCategory || undefined),
          quizzesApi.getMyAttempts().catch(() => []), // Handle if endpoint doesn't exist yet
        ]);
        setQuizzes(quizzesData);
        setAttempts(attemptsData || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setHasWallet(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      fetchData(false);
    }, [fetchData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    hasFetchedOnce.current = false; // Force refetch on category change
    setLoading(true);
  };

  // Check if user has passed a quiz (with reward granted)
  const getQuizStatus = (quizId: string): { passed: boolean; bestScore: number | null } => {
    const quizAttempts = attempts.filter(a => a.quizId === quizId);
    if (quizAttempts.length === 0) {
      return { passed: false, bestScore: null };
    }
    const passedWithReward = quizAttempts.find(a => a.passed && a.rewardGranted);
    const bestScore = Math.max(...quizAttempts.map(a => a.score));
    return { passed: !!passedWithReward, bestScore };
  };

  const categories = [
    { key: null, label: 'All' },
    { key: 'pregnancy_basics', label: 'Pregnancy' },
    { key: 'nutrition', label: 'Nutrition' },
    { key: 'mental_health', label: 'Mental Health' },
    { key: 'labor_delivery', label: 'Labor' },
    { key: 'breastfeeding', label: 'Breastfeeding' },
    { key: 'newborn_care', label: 'Newborn' },
    { key: 'danger_signs', label: 'Warning Signs' },
  ];

  if (loading && !hasFetchedOnce.current) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading quizzes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // No wallet - show create wallet prompt
  if (!hasWallet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noWalletContainer}>
          <Text style={styles.noWalletIcon}>📚</Text>
          <Text style={styles.noWalletTitle}>Quizzes</Text>
          <Text style={styles.noWalletSubtitle}>
            Learn about pregnancy and earn MAMA tokens!
          </Text>

          <View style={styles.noWalletCard}>
            <Text style={styles.noWalletCardIcon}>💰</Text>
            <Text style={styles.noWalletCardTitle}>Wallet Required</Text>
            <Text style={styles.noWalletCardText}>
              Create a wallet first to take quizzes and earn rewards for your knowledge.
            </Text>
            <TouchableOpacity
              style={styles.createWalletButton}
              onPress={() => navigation.navigate('Wallet')}
            >
              <Text style={styles.createWalletButtonText}>Create Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quizzes</Text>
        <Text style={styles.subtitle}>Learn & earn MAMA tokens</Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key || 'all'}
            style={[
              styles.categoryChip,
              selectedCategory === cat.key && styles.categoryChipActive,
            ]}
            onPress={() => handleCategoryChange(cat.key)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === cat.key && styles.categoryChipTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quiz List */}
      <ScrollView
        style={styles.quizList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {quizzes.map((quiz) => {
          const { passed, bestScore } = getQuizStatus(quiz.id);

          return (
            <TouchableOpacity
              key={quiz.id}
              style={[styles.quizCard, passed && styles.quizCardPassed]}
              onPress={() => navigation.navigate('QuizDetail', { quizId: quiz.id })}
            >
              {/* Passed Stamp */}
              {passed && (
                <View style={styles.passedStamp}>
                  <Text style={styles.passedStampText}>✓ PASSED</Text>
                </View>
              )}

              <View style={styles.quizHeader}>
                <Text style={styles.quizIcon}>
                  {CATEGORY_ICONS[quiz.category] || '📝'}
                </Text>
                <View style={styles.quizInfo}>
                  <Text style={styles.quizTitle}>{quiz.title}</Text>
                  <Text style={styles.quizDescription} numberOfLines={2}>
                    {quiz.description}
                  </Text>
                  {bestScore !== null && (
                    <View style={styles.bestScoreBadge}>
                      <Text style={styles.bestScoreText}>Best: {bestScore}%</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.quizMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Questions</Text>
                  <Text style={styles.metaValue}>{quiz._count.questions}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Time</Text>
                  <Text style={styles.metaValue}>{quiz.time_limit_mins} min</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Pass</Text>
                  <Text style={styles.metaValue}>{quiz.pass_threshold}%</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Reward</Text>
                  <Text style={[styles.metaValue, passed ? styles.rewardClaimed : styles.rewardText]}>
                    {passed ? 'Claimed' : `${quiz.reward_amount} MAMA`}
                  </Text>
                </View>
              </View>

              <View style={styles.quizFooter}>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: DIFFICULTY_COLORS[quiz.difficulty] + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: DIFFICULTY_COLORS[quiz.difficulty] },
                    ]}
                  >
                    {quiz.difficulty}
                  </Text>
                </View>
                <View style={[styles.startButton, passed && styles.retakeButton]}>
                  <Text style={[styles.startText, passed && styles.retakeText]}>
                    {passed ? 'Retake Quiz →' : 'Start Quiz →'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {quizzes.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No quizzes available in this category</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // No wallet styles
  noWalletContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noWalletIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  noWalletTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  noWalletSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  noWalletCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.4 : 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noWalletCardIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noWalletCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  noWalletCardText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  createWalletButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  createWalletButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  categoryScroll: {
    maxHeight: 50,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  quizList: {
    flex: 1,
    padding: 16,
  },

  // Quiz Card
  quizCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.4 : 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  quizCardPassed: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },

  // Passed Stamp
  passedStamp: {
    position: 'absolute',
    top: 12,
    right: -30,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 36,
    paddingVertical: 6,
    transform: [{ rotate: '45deg' }],
    zIndex: 10,
    elevation: 5,
  },
  passedStampText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  quizHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  quizIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  quizDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // Best Score Badge
  bestScoreBadge: {
    backgroundColor: isDark ? '#0D47A1' : '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  bestScoreText: {
    color: isDark ? '#90CAF9' : '#1976D2',
    fontSize: 12,
    fontWeight: '600',
  },

  quizMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  rewardText: {
    color: colors.primary,
  },
  rewardClaimed: {
    color: '#4CAF50',
  },

  quizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  retakeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  retakeText: {
    color: '#4CAF50',
  },

  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },

  bottomPadding: {
    height: 20,
  },
});
