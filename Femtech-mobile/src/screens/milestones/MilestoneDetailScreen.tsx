import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Header, Button } from '../../components/common';
import { COLORS, SPACING, FONTS } from '../../constants';
import { milestonesApi, UserMilestone } from '../../api';

export default function MilestoneDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
  const { milestone } = route.params as { milestone: UserMilestone };
  const def = milestone.milestone_definitions;

  const mintMutation = useMutation({
    mutationFn: () => milestonesApi.mintReward(milestone.id),
    onSuccess: (data) => {
      Alert.alert('Success!', `You earned ${data.amount} MAMA tokens!\n\nTransaction: ${data.txHash.slice(0, 16)}...`);
      queryClient.invalidateQueries({ queryKey: ['userMilestones'] });
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message);
    },
  });

  const canMint = milestone.status === 'completed' && !milestone.reward_minted;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Header title="Milestone Details" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.mainCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="trophy" size={48} color={COLORS.primary} />
          </View>
          
          <Text style={styles.name}>{def?.name}</Text>
          <Text style={styles.category}>{def?.category}</Text>
          <Text style={styles.description}>{def?.description}</Text>

          <View style={styles.rewardContainer}>
            <Text style={styles.rewardLabel}>Reward</Text>
            <Text style={styles.rewardAmount}>{def?.rewardAmount || milestone.rewardAmount || 0} MAMA</Text>
          </View>
        </Card>

        <Card style={styles.statusCard}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Current Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(milestone.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(milestone.status) }]}>
                {milestone.status.replace('_', ' ')}
              </Text>
            </View>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Progress</Text>
            <Text style={styles.statusValue}>{milestone.progress}%</Text>
          </View>

          {milestone.startedAt && (
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Started</Text>
              <Text style={styles.statusValue}>
                {new Date(milestone.startedAt).toLocaleDateString()}
              </Text>
            </View>
          )}

          {milestone.completedAt && (
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Completed</Text>
              <Text style={styles.statusValue}>
                {new Date(milestone.completedAt).toLocaleDateString()}
              </Text>
            </View>
          )}

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Reward Claimed</Text>
            <Ionicons 
              name={milestone.reward_minted ? 'checkmark-circle' : 'close-circle'} 
              size={24} 
              color={milestone.reward_minted ? COLORS.success : COLORS.textLight} 
            />
          </View>
        </Card>

        {canMint && (
          <Button
            title="Claim Reward"
            onPress={() => mintMutation.mutate()}
            loading={mintMutation.isPending}
            size="large"
            style={styles.claimButton}
          />
        )}

        {milestone.reward_minted && (
          <Card style={styles.claimedCard}>
            <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
            <Text style={styles.claimedText}>Reward Already Claimed</Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return COLORS.success;
    case 'in_progress': return COLORS.warning;
    case 'available': return COLORS.info;
    default: return COLORS.textLight;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  mainCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  category: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  rewardContainer: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  rewardAmount: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  statusLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  statusValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  claimButton: {
    marginTop: SPACING.md,
  },
  claimedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.lg,
    backgroundColor: COLORS.success + '10',
  },
  claimedText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.success,
  },
});
