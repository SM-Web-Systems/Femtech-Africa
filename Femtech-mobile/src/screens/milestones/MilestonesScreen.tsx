import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Header, Button } from '../../components/common';
import { COLORS, SPACING, FONTS } from '../../constants';
import { milestonesApi, UserMilestone } from '../../api';

const TABS = ['All', 'Available', 'In Progress', 'Completed'];

export default function MilestonesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('All');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['userMilestones'],
    queryFn: () => milestonesApi.getUserMilestones(),
  });

  const mintMutation = useMutation({
    mutationFn: (milestoneId: string) => milestonesApi.mintReward(milestoneId),
    onSuccess: (data) => {
      Alert.alert('Success!', `You earned ${data.amount} MAMA tokens!`);
      queryClient.invalidateQueries({ queryKey: ['userMilestones'] });
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message);
    },
  });

  const milestones = data?.data || [];
  
  const filteredMilestones = milestones.filter((m) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Available') return m.status === 'available';
    if (activeTab === 'In Progress') return m.status === 'in_progress';
    if (activeTab === 'Completed') return m.status === 'completed';
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Milestones" />
      
      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {filteredMilestones.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="trophy-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No milestones found</Text>
          </Card>
        ) : (
          filteredMilestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              onMint={() => mintMutation.mutate(milestone.id)}
              isMinting={mintMutation.isPending}
              onPress={() => navigation.navigate('MilestoneDetail', { milestone })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function MilestoneCard({ 
  milestone, 
  onMint, 
  isMinting,
  onPress 
}: { 
  milestone: UserMilestone; 
  onMint: () => void;
  isMinting: boolean;
  onPress: () => void;
}) {
  const def = milestone.milestone_definitions;
  const canMint = milestone.status === 'completed' && !milestone.reward_minted;

  const getStatusColor = () => {
    switch (milestone.status) {
      case 'completed': return COLORS.success;
      case 'in_progress': return COLORS.warning;
      case 'available': return COLORS.info;
      default: return COLORS.textLight;
    }
  };

  const getStatusIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (milestone.status) {
      case 'completed': return 'checkmark-circle';
      case 'in_progress': return 'time';
      case 'available': return 'ellipse-outline';
      default: return 'ellipse-outline';
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.milestoneCard}>
        <View style={styles.milestoneHeader}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
            <Ionicons name={getStatusIcon()} size={16} color={getStatusColor()} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {milestone.status.replace('_', ' ')}
            </Text>
          </View>
          {def?.rewardAmount && (
            <View style={styles.rewardBadge}>
              <Text style={styles.rewardText}>{def.rewardAmount} MAMA</Text>
            </View>
          )}
        </View>

        <Text style={styles.milestoneName}>{def?.name || 'Milestone'}</Text>
        <Text style={styles.milestoneDescription} numberOfLines={2}>
          {def?.description || ''}
        </Text>

        {milestone.status === 'in_progress' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${milestone.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{milestone.progress}%</Text>
          </View>
        )}

        {canMint && (
          <Button
            title={milestone.reward_minted ? 'Claimed' : 'Claim Reward'}
            onPress={onMint}
            loading={isMinting}
            disabled={milestone.reward_minted}
            size="small"
            style={styles.claimButton}
          />
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabs: {
    flexGrow: 0,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.textOnPrimary,
  },
  content: {
    padding: SPACING.lg,
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  milestoneCard: {
    marginBottom: SPACING.md,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  rewardBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.primary,
  },
  milestoneName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  milestoneDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
    width: 40,
  },
  claimButton: {
    marginTop: SPACING.md,
  },
});
