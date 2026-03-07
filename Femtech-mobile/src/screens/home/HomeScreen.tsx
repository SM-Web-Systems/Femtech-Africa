import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../store/AuthContext';
import { walletApi, milestonesApi } from '../../api';

const COLORS = {
  primary: '#E91E63',
  background: '#FFF5F8',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  card: '#FFFFFF',
  success: '#4CAF50',
};

// Mock data for when API isn't available
const MOCK_BALANCE = '120.00';
const MOCK_MILESTONES = [
  { id: '1', status: 'completed', reward_minted: true, milestone_definition: { name: 'Complete Profile', token_reward: 10 } },
  { id: '2', status: 'completed', reward_minted: false, milestone_definition: { name: 'First Prenatal Visit', token_reward: 100 } },
  { id: '3', status: 'in_progress', progress_pct: 60, milestone_definition: { name: 'Weekly Check-in', token_reward: 5 } },
];

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [balance, setBalance] = useState<string>(MOCK_BALANCE);
  const [milestones, setMilestones] = useState<any[]>(MOCK_MILESTONES);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  const fetchData = async () => {
    try {
      const [walletData, milestonesData] = await Promise.all([
        walletApi.getBalance(),
        milestonesApi.getUserMilestones(),
      ]);
      
      setBalance(walletData.mamaBalance || '0.00');
      setMilestones(milestonesData.slice(0, 3));
      setUsingMockData(false);
    } catch (error) {
      console.log('Using mock data - API not available');
      setBalance(MOCK_BALANCE);
      setMilestones(MOCK_MILESTONES);
      setUsingMockData(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const pendingRewards = milestones.filter(m => m.status === 'completed' && !m.reward_minted).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        <Text style={styles.greeting}>Hello, Mama! 👋</Text>
        
        {usingMockData && (
          <View style={styles.mockBanner}>
            <Text style={styles.mockText}>📱 Demo Mode - Connect SMS to use real data</Text>
          </View>
        )}
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <Text style={styles.balanceAmount}>{parseFloat(balance).toFixed(2)} MAMA</Text>
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
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionText}>Appointments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionText}>Articles</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, padding: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  mockBanner: { backgroundColor: '#FFF3E0', padding: 12, borderRadius: 8, marginBottom: 16 },
  mockText: { color: '#E65100', fontSize: 13, textAlign: 'center' },
  balanceCard: { backgroundColor: COLORS.primary, borderRadius: 20, padding: 24, marginBottom: 20 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  balanceAmount: { color: COLORS.white, fontSize: 36, fontWeight: 'bold', marginVertical: 8 },
  pendingBadge: { backgroundColor: COLORS.success, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 10 },
  pendingText: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
  redeemButton: { backgroundColor: COLORS.white, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20, alignSelf: 'flex-start', marginTop: 10 },
  redeemButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 16, alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { width: '48%', backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  actionIcon: { fontSize: 32, marginBottom: 8 },
  actionText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
});
