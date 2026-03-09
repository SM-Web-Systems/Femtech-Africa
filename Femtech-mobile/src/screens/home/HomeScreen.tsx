// D:\SM-WEB\FEMTECH-AFRICA\Femtech-mobile\src\screens\home\HomeScreen.tsx

import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { walletApi, milestonesApi } from '../../api';

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const [balance, setBalance] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasWallet, setHasWallet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = createStyles(colors);

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
    setError(null);

    try {
      const [walletData, milestonesData] = await Promise.all([
        walletApi.getBalance(),
        milestonesApi.getUserMilestones(),
      ]);

      setBalance(walletData);
      setHasWallet(!!walletData?.address || !!walletData?.hasWallet);
      setMilestones(milestonesData.slice(0, 3));
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load data';
      console.log('API Error:', message);
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData(false);
    }, [fetchData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const pendingRewards = milestones.filter(m => m.status === 'completed' && !m.reward_minted).length;

  if (loading && !hasFetchedOnce.current) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Mama! 👋</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity onPress={onRefresh}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!hasWallet ? (
          <TouchableOpacity
            style={styles.noWalletCard}
            onPress={() => navigation.navigate('Wallet')}
          >
            <View style={styles.noWalletContent}>
              <Text style={styles.noWalletIcon}>💳</Text>
              <View style={styles.noWalletTextContainer}>
                <Text style={styles.noWalletTitle}>Create Your Wallet</Text>
                <Text style={styles.noWalletSubtitle}>Start earning MAMA tokens for your health journey</Text>
              </View>
              <Text style={styles.noWalletArrow}>→</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Your Balance</Text>
            <Text style={styles.balanceAmount}>
              {parseFloat(balance?.mamaBalance || '0').toFixed(2)} MAMA
            </Text>
            {pendingRewards > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>{pendingRewards} rewards to claim!</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.redeemButton}
              onPress={() => navigation.navigate('Wallet')}
            >
              <Text style={styles.redeemButtonText}>View Wallet</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{milestones.length - completedCount}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Milestones')}>
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionText}>Milestones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Wallet')}>
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionText}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Learn')}>
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionText}>Quizzes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionText}>Appointments</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Logged in as: {user?.phone}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: colors.textSecondary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: colors.text },
  logoutButton: { backgroundColor: colors.primary + '20', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  logoutText: { color: colors.primary, fontWeight: '600' },
  errorBanner: { backgroundColor: '#FFEBEE', padding: 12, borderRadius: 8, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  errorText: { color: '#C62828', fontSize: 13, flex: 1 },
  retryText: { color: colors.primary, fontWeight: 'bold', marginLeft: 10 },

  noWalletCard: { backgroundColor: colors.card, borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed' },
  noWalletContent: { flexDirection: 'row', alignItems: 'center' },
  noWalletIcon: { fontSize: 40, marginRight: 16 },
  noWalletTextContainer: { flex: 1 },
  noWalletTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  noWalletSubtitle: { fontSize: 14, color: colors.textSecondary },
  noWalletArrow: { fontSize: 24, color: colors.primary, fontWeight: 'bold' },

  balanceCard: { backgroundColor: colors.primary, borderRadius: 20, padding: 24, marginBottom: 20 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  balanceAmount: { color: colors.white, fontSize: 36, fontWeight: 'bold', marginVertical: 8 },
  pendingBadge: { backgroundColor: colors.success, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 10 },
  pendingText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  redeemButton: { backgroundColor: colors.white, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20, alignSelf: 'flex-start', marginTop: 10 },
  redeemButtonText: { color: colors.primary, fontWeight: 'bold', fontSize: 16 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 16, alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: colors.primary },
  statLabel: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { width: '48%', backgroundColor: colors.card, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  actionIcon: { fontSize: 32, marginBottom: 8 },
  actionText: { fontSize: 14, fontWeight: '600', color: colors.text },
  userInfo: { marginTop: 20, padding: 16, backgroundColor: colors.card, borderRadius: 12 },
  userInfoText: { color: colors.textSecondary, fontSize: 12, textAlign: 'center' },
});
