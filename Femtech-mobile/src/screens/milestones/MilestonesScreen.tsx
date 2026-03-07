import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { milestonesApi } from '../../api';

const COLORS = {
  primary: '#E91E63',
  background: '#FFF5F8',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  card: '#FFFFFF',
  success: '#4CAF50',
  warning: '#FF9800',
};

const MOCK_MILESTONES = [
  { id: '1', milestone_id: 'm1', status: 'completed', reward_minted: true, milestone_definition: { name: 'Complete Profile', description: 'Fill out your profile information', token_reward: 10 } },
  { id: '2', milestone_id: 'm2', status: 'completed', reward_minted: false, milestone_definition: { name: 'First Prenatal Visit', description: 'Attend your first prenatal appointment', token_reward: 100 } },
  { id: '3', milestone_id: 'm3', status: 'in_progress', progress_pct: 60, milestone_definition: { name: 'Weekly Check-in', description: 'Complete 7 daily check-ins', token_reward: 5 } },
  { id: '4', milestone_id: 'm4', status: 'available', milestone_definition: { name: 'Nutrition Quiz', description: 'Complete the pregnancy nutrition quiz', token_reward: 20 } },
  { id: '5', milestone_id: 'm5', status: 'available', milestone_definition: { name: 'Exercise Goal', description: 'Log 30 minutes of pregnancy-safe exercise', token_reward: 15 } },
];

export default function MilestonesScreen() {
  const [milestones, setMilestones] = useState<any[]>(MOCK_MILESTONES);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const fetchMilestones = async () => {
    try {
      const data = await milestonesApi.getUserMilestones();
      setMilestones(data);
      setUsingMockData(false);
    } catch (error) {
      console.log('Using mock milestones');
      setUsingMockData(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMilestones();
  };

  const handleClaimReward = async (milestone: any) => {
    if (usingMockData) {
      // Mock claim
      Alert.alert('Demo Mode', `You would earn ${milestone.milestone_definition.token_reward} MAMA tokens!`);
      return;
    }
    
    setClaimingId(milestone.milestone_id);
    try {
      const result = await milestonesApi.mintReward(milestone.milestone_id);
      Alert.alert('Reward Claimed! 🎉', `You earned ${result.tokensEarned} MAMA tokens!`);
      fetchMilestones();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to claim reward');
    } finally {
      setClaimingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return COLORS.success;
      case 'in_progress': return COLORS.warning;
      default: return COLORS.primary;
    }
  };

  const getStatusText = (status: string, rewardMinted: boolean) => {
    if (status === 'completed' && rewardMinted) return '✓ Claimed';
    if (status === 'completed') return 'Ready to Claim';
    if (status === 'in_progress') return 'In Progress';
    return 'Available';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        <Text style={styles.title}>Milestones</Text>
        <Text style={styles.subtitle}>Complete milestones to earn MAMA tokens</Text>
        
        {usingMockData && (
          <View style={styles.mockBanner}>
            <Text style={styles.mockText}>📱 Demo Mode - Login with SMS for real milestones</Text>
          </View>
        )}
        
        {milestones.map((milestone) => (
          <View key={milestone.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.milestoneName}>
                {milestone.milestone_definition?.name || milestone.name}
              </Text>
              <View style={[styles.badge, { backgroundColor: getStatusColor(milestone.status) }]}>
                <Text style={styles.badgeText}>
                  {getStatusText(milestone.status, milestone.reward_minted)}
                </Text>
              </View>
            </View>
            
            <Text style={styles.description}>
              {milestone.milestone_definition?.description || ''}
            </Text>
            
            <Text style={styles.reward}>
              🪙 {milestone.milestone_definition?.token_reward || 0} MAMA
            </Text>
            
            {milestone.status === 'in_progress' && milestone.progress_pct > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${milestone.progress_pct}%` }]} />
                </View>
                <Text style={styles.progressText}>{milestone.progress_pct}%</Text>
              </View>
            )}
            
            {milestone.status === 'completed' && !milestone.reward_minted && (
              <TouchableOpacity 
                style={[styles.claimButton, claimingId === milestone.milestone_id && styles.buttonDisabled]}
                onPress={() => handleClaimReward(milestone)}
                disabled={claimingId === milestone.milestone_id}
              >
                <Text style={styles.claimButtonText}>
                  {claimingId === milestone.milestone_id ? 'Claiming...' : 'Claim Reward'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 16 },
  mockBanner: { backgroundColor: '#FFF3E0', padding: 12, borderRadius: 8, marginBottom: 16 },
  mockText: { color: '#E65100', fontSize: 13, textAlign: 'center' },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  milestoneName: { fontSize: 18, fontWeight: '600', color: COLORS.text, flex: 1, marginRight: 12 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  description: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 12 },
  reward: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  progressBar: { flex: 1, height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, marginRight: 10 },
  progressFill: { height: '100%', backgroundColor: COLORS.warning, borderRadius: 4 },
  progressText: { fontSize: 14, color: COLORS.textSecondary, width: 40 },
  claimButton: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  claimButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  buttonDisabled: { opacity: 0.6 },
});
