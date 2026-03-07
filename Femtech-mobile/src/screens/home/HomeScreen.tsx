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

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState<string>('0.00');
  const [milestones, setMilestones] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setError(null);
    try {
      const [walletData, milestonesData] = await Promise.all([
        walletApi.getBalance(),
        milestonesApi.getUserMilestones(),
      ]);

      setBalance(walletData.mamaBalance || '0.00');
      setMilestones(milestonesData.slice(0, 3));
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load data';
      console.log('API Error:', message);
      setError(message);
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

  const handleLogout = async () => {
    await logout();
  };

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const pendingRewards = milestones.filter(m => m.status === 'completed' && !m.reward_minted).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Mama! </Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}> {error}</Text>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.reloginText}>Re-login</Text>
            </TouchableOpacity>
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
            <Text style={styles.actionIcon}></Text>
            <Text style={styles.actionText}>Milestones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Wallet')}>
            <Text style={styles.actionIcon}></Text>
            <Text style={styles.actionText}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}></Text>
            <Text style={styles.actionText}>Appointments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}></Text>
            <Text style={styles.actionText}>Articles</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Logged in as: {user?.phone}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  logoutButton: { backgroundColor: '#FFE0E6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  logoutText: { color: COLORS.primary, fontWeight: '600' },
  errorBanner: { backgroundColor: '#FFEBEE', padding: 12, borderRadius: 8, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  errorText: { color: '#C62828', fontSize: 13, flex: 1 },
  reloginText: { color: COLORS.primary, fontWeight: 'bold', marginLeft: 10 },
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
  userInfo: { marginTop: 20, padding: 16, backgroundColor: '#F5F5F5', borderRadius: 12 },
  userInfoText: { color: COLORS.textSecondary, fontSize: 12, textAlign: 'center' },
});
