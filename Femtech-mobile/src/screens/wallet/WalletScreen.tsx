import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header, Button } from '../../components/common';
import { COLORS, SPACING, FONTS, STELLAR_CONFIG } from '../../constants';
import { useWalletStore } from '../../store';

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { balance, transactions, isLoading, fetchBalance, fetchTransactions, createWallet, hasSecretKey } = useWalletStore();

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const handleCreateWallet = async () => {
    try {
      await createWallet();
      fetchBalance();
    } catch (error) {
      // Error handled in store
    }
  };

  const openExplorer = () => {
    if (balance?.stellarExpert) {
      Linking.openURL(balance.stellarExpert);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Wallet" rightIcon="open-outline" onRightPress={openExplorer} />
      
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchBalance} />}
      >
        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>
              {balance?.mamaBalance ? parseFloat(balance.mamaBalance).toFixed(0) : '0'}
            </Text>
            <Text style={styles.tokenSymbol}>MAMA</Text>
          </View>
          
          {balance?.walletAddress ? (
            <TouchableOpacity style={styles.addressContainer} onPress={openExplorer}>
              <Ionicons name="wallet-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.address} numberOfLines={1}>
                {balance.walletAddress.slice(0, 8)}...{balance.walletAddress.slice(-8)}
              </Text>
              <Ionicons name="open-outline" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ) : (
            <Button
              title="Create Wallet"
              onPress={handleCreateWallet}
              loading={isLoading}
              style={styles.createButton}
            />
          )}
        </Card>

        {/* Action Buttons */}
        {balance?.walletAddress && (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Redeem')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.primary }]}>
                <Ionicons name="gift" size={24} color={COLORS.textOnPrimary} />
              </View>
              <Text style={styles.actionLabel}>Redeem</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Redemptions')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.secondary }]}>
                <Ionicons name="receipt" size={24} color={COLORS.textOnPrimary} />
              </View>
              <Text style={styles.actionLabel}>History</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          {transactions.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>Complete milestones to earn tokens</Text>
            </Card>
          ) : (
            transactions.slice(0, 10).map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function TransactionItem({ transaction }: { transaction: any }) {
  const isMint = transaction.type.includes('mint');
  const amount = transaction.amount;
  
  return (
    <Card style={styles.txCard}>
      <View style={[styles.txIcon, { backgroundColor: isMint ? COLORS.success + '20' : COLORS.error + '20' }]}>
        <Ionicons 
          name={isMint ? 'arrow-down' : 'arrow-up'} 
          size={20} 
          color={isMint ? COLORS.success : COLORS.error} 
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txType}>{transaction.type.replace('_', ' ')}</Text>
        <Text style={styles.txDate}>
          {new Date(transaction.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={[styles.txAmount, { color: isMint ? COLORS.success : COLORS.error }]}>
        {isMint ? '+' : ''}{amount} MAMA
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  balanceCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  balanceLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
  },
  balanceAmount: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tokenSymbol: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.primary,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 20,
  },
  address: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  createButton: {
    marginTop: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  actionLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  section: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
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
  emptySubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    padding: SPACING.md,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  txType: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  txDate: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  txAmount: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});
