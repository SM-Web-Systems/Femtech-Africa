import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { walletApi } from '../../api';

const COLORS = {
  primary: '#E91E63',
  background: '#FFF5F8',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  card: '#FFFFFF',
  success: '#4CAF50',
};

const MOCK_TRANSACTIONS = [
  { id: '1', type: 'mint_milestone', amount: 10, created_at: '2026-03-07' },
  { id: '2', type: 'mint_milestone', amount: 100, created_at: '2026-03-06' },
  { id: '3', type: 'burn_redemption', amount: -50, created_at: '2026-03-05' },
];

export default function WalletScreen() {
  const [balance, setBalance] = useState<any>({ mamaBalance: '120.00', stellarAddress: 'GDEMO...ADDRESS' });
  const [transactions, setTransactions] = useState<any[]>(MOCK_TRANSACTIONS);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(true);

  const fetchData = async () => {
    try {
      const walletData = await walletApi.getBalance();
      setBalance(walletData);
      setUsingMockData(false);
      
      if (walletData.stellarAddress) {
        const txData = await walletApi.getTransactions();
        setTransactions(txData);
      }
    } catch (error) {
      console.log('Using mock wallet data');
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

  const truncateAddress = (address: string) => {
    if (!address || address.length < 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        <Text style={styles.title}>Wallet</Text>
        
        {usingMockData && (
          <View style={styles.mockBanner}>
            <Text style={styles.mockText}>📱 Demo Mode - Login with SMS for real wallet</Text>
          </View>
        )}
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            {parseFloat(balance?.mamaBalance || '0').toFixed(2)}
          </Text>
          <Text style={styles.tokenLabel}>MAMA Tokens</Text>
          
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Wallet Address:</Text>
            <Text style={styles.address}>{truncateAddress(balance?.stellarAddress || 'Demo Wallet')}</Text>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        {transactions.map((tx: any) => (
          <View key={tx.id} style={styles.transactionCard}>
            <View style={[styles.txIcon, { backgroundColor: parseFloat(tx.amount) > 0 ? '#E8F5E9' : '#FFEBEE' }]}>
              <Text style={styles.txIconText}>{parseFloat(tx.amount) > 0 ? '↓' : '↑'}</Text>
            </View>
            <View style={styles.txDetails}>
              <Text style={styles.txDescription}>{tx.type.replace(/_/g, ' ')}</Text>
              <Text style={styles.txDate}>{new Date(tx.created_at).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.txAmount, parseFloat(tx.amount) > 0 ? styles.txPositive : styles.txNegative]}>
              {parseFloat(tx.amount) > 0 ? '+' : ''}{parseFloat(tx.amount).toFixed(0)} MAMA
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  mockBanner: { backgroundColor: '#FFF3E0', padding: 12, borderRadius: 8, marginBottom: 16 },
  mockText: { color: '#E65100', fontSize: 13, textAlign: 'center' },
  balanceCard: { backgroundColor: COLORS.primary, borderRadius: 20, padding: 24, marginBottom: 24, alignItems: 'center' },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  balanceAmount: { color: COLORS.white, fontSize: 48, fontWeight: 'bold', marginVertical: 8 },
  tokenLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 16 },
  addressContainer: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 12, borderRadius: 12, width: '100%', marginBottom: 16 },
  addressLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  address: { color: COLORS.white, fontSize: 14, marginTop: 4 },
  actions: { flexDirection: 'row', marginTop: 8 },
  actionButton: { backgroundColor: COLORS.white, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20 },
  actionButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  transactionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txIconText: { fontSize: 20, color: COLORS.primary },
  txDetails: { flex: 1 },
  txDescription: { fontSize: 16, fontWeight: '500', color: COLORS.text, textTransform: 'capitalize' },
  txDate: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: 'bold' },
  txPositive: { color: COLORS.success },
  txNegative: { color: COLORS.primary },
});
