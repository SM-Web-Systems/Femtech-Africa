import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/common';
import { COLORS, SPACING, FONTS, SHADOWS } from '../../constants';
import { useAuth, useWalletStore } from '../../store';
import { milestonesApi } from '../../api';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { balance, fetchBalance } = useWalletStore();

  const { data: milestonesData, refetch, isRefetching } = useQuery({
    queryKey: ['userMilestones'],
    queryFn: () => milestonesApi.getUserMilestones(),
  });

  useEffect(() => {
    fetchBalance();
  }, []);

  const milestones = milestonesData?.data || [];
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const inProgressCount = milestones.filter(m => m.status === 'in_progress').length;
  const pendingRewards = milestones.filter(m => m.status === 'completed' && !m.reward_minted);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 20 }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.phone || 'Mama'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <Card style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Ionicons name="wallet" size={24} color={COLORS.textOnPrimary} />
          <Text style={styles.balanceLabel}>MAMA Balance</Text>
        </View>
        <Text style={styles.balanceAmount}>
          {balance?.mamaBalance ? parseFloat(balance.mamaBalance).toFixed(0) : '0'}
        </Text>
        <Text style={styles.balanceSubtext}>tokens available</Text>
        <View style={styles.balanceActions}>
          <TouchableOpacity 
            style={styles.balanceAction}
            onPress={() => navigation.navigate('Wallet')}
          >
            <Ionicons name="arrow-up-circle" size={20} color={COLORS.textOnPrimary} />
            <Text style={styles.balanceActionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.balanceAction}
            onPress={() => navigation.navigate('Wallet', { screen: 'Redeem' })}
          >
            <Ionicons name="gift" size={20} color={COLORS.textOnPrimary} />
            <Text style={styles.balanceActionText}>Redeem</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Pending Rewards */}
      {pendingRewards.length > 0 && (
        <Card style={styles.rewardsCard}>
          <View style={styles.rewardsHeader}>
            <Ionicons name="gift" size={24} color={COLORS.warning} />
            <Text style={styles.rewardsTitle}>{pendingRewards.length} Rewards to Claim!</Text>
          </View>
          <Text style={styles.rewardsSubtext}>
            You have completed milestones with unclaimed tokens
          </Text>
          <TouchableOpacity 
            style={styles.claimButton}
            onPress={() => navigation.navigate('Milestones')}
          >
            <Text style={styles.claimButtonText}>Claim Now</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Quick Stats */}
      <Text style={styles.sectionTitle}>Your Progress</Text>
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
        <Card style={styles.statCard}>
          <Ionicons name="time" size={32} color={COLORS.warning} />
          <Text style={styles.statNumber}>{inProgressCount}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </Card>
        <Card style={styles.statCard}>
          <Ionicons name="trophy" size={32} color={COLORS.primary} />
          <Text style={styles.statNumber}>{milestones.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </Card>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <QuickAction 
          icon="fitness" 
          label="Track Kicks" 
          color={COLORS.primary}
          onPress={() => {}}
        />
        <QuickAction 
          icon="calendar" 
          label="Appointments" 
          color={COLORS.secondary}
          onPress={() => {}}
        />
        <QuickAction 
          icon="book" 
          label="Articles" 
          color={COLORS.info}
          onPress={() => {}}
        />
        <QuickAction 
          icon="help-circle" 
          label="Get Help" 
          color={COLORS.success}
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
}

function QuickAction({ icon, label, color, onPress }: { 
  icon: keyof typeof Ionicons.glyphMap; 
  label: string; 
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color={COLORS.textOnPrimary} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  greeting: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  balanceCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  balanceLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textOnPrimary,
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.textOnPrimary,
  },
  balanceSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textOnPrimary,
    opacity: 0.8,
    marginBottom: SPACING.md,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  balanceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  balanceActionText: {
    color: COLORS.textOnPrimary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  rewardsCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  rewardsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  rewardsSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  claimButton: {
    backgroundColor: COLORS.warning,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  claimButtonText: {
    color: COLORS.textOnPrimary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
  },
  statNumber: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  quickAction: {
    width: '47%',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    ...SHADOWS.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
});
