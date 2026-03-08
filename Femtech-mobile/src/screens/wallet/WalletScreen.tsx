import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Modal, TextInput, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { walletApi } from '../../api';
import { useWallet } from '../../store/WalletContext';

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

export default function WalletScreen({ navigation }: any) {
  const { balance, refreshBalance } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [newWalletKeys, setNewWalletKeys] = useState<{ publicKey: string; secretKey: string } | null>(null);
  const [importKey, setImportKey] = useState('');
  const [creating, setCreating] = useState(false);

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
      await refreshBalance();

      if (balance?.hasWallet && balance?.address) {
        try {
          const txData = await walletApi.getTransactions();
          setTransactions(txData || []);
        } catch {
          setTransactions([]);
        }
      }
    } catch (error) {
      console.log('Error fetching wallet:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshBalance, balance?.hasWallet, balance?.address]);

  useFocusEffect(
    useCallback(() => {
      fetchData(false);
    }, [fetchData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const handleCreateWallet = async () => {
    setCreating(true);
    try {
      const result = await walletApi.createWallet();
      setNewWalletKeys({
        publicKey: result.publicKey,
        secretKey: result.secretKey,
      });
      setShowCreateModal(false);
      setShowSecretKey(true);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create wallet');
    } finally {
      setCreating(false);
    }
  };

  const handleImportWallet = async () => {
    if (!importKey.startsWith('S') || importKey.length !== 56) {
      Alert.alert('Invalid Key', 'Please enter a valid Stellar secret key (starts with S, 56 characters)');
      return;
    }

    setCreating(true);
    try {
      await walletApi.importWallet(importKey);
      setShowImportModal(false);
      setImportKey('');
      Alert.alert('Success', 'Wallet imported successfully!');
      await refreshBalance();
      fetchData(true);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to import wallet');
    } finally {
      setCreating(false);
    }
  };

  const handleCopySecretKey = () => {
    if (newWalletKeys?.secretKey) {
      Clipboard.setString(newWalletKeys.secretKey);
      Alert.alert('Copied', 'Secret key copied to clipboard. Store it safely!');
    }
  };

  const handleSecretKeySaved = () => {
    Alert.alert(
      'Confirm',
      'Have you saved your secret key in a safe place? You will NOT be able to recover it later!',
      [
        { text: 'Go Back', style: 'cancel' },
        {
          text: 'Yes, I Saved It',
          onPress: async () => {
            setShowSecretKey(false);
            setNewWalletKeys(null);
            await refreshBalance();
            fetchData(true);
          }
        }
      ]
    );
  };

  const truncateAddress = (address: string) => {
    if (!address || address.length < 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const hasWallet = balance?.hasWallet || false;

  // No Wallet State
  if (!loading && !hasWallet) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.noWalletContainer}>
          <Text style={styles.title}>Wallet</Text>

          <View style={styles.noWalletCard}>
            <Text style={styles.noWalletIcon}>💳</Text>
            <Text style={styles.noWalletTitle}>No Wallet Yet</Text>
            <Text style={styles.noWalletText}>
              Create a new wallet to start earning and redeeming MAMA tokens for completing health milestones.
            </Text>

            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.createButtonText}>Create New Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.importButton}
              onPress={() => setShowImportModal(true)}
            >
              <Text style={styles.importButtonText}>Import Existing Wallet</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>ℹ️ About MAMA Tokens</Text>
            <Text style={styles.infoText}>
              MAMA tokens are earned by completing prenatal care milestones. You can redeem them for airtime, data, and other rewards from our partners.
            </Text>
          </View>

          {/* Create Wallet Modal */}
          <Modal visible={showCreateModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Create New Wallet</Text>
                <Text style={styles.modalText}>
                  A new Stellar wallet will be created for you. You'll receive a secret key that you MUST save securely.
                </Text>
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>
                    ⚠️ Your secret key is the ONLY way to recover your wallet. If you lose it, your tokens are gone forever!
                  </Text>
                </View>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowCreateModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalConfirmButton}
                    onPress={handleCreateWallet}
                    disabled={creating}
                  >
                    <Text style={styles.modalConfirmText}>
                      {creating ? 'Creating...' : 'Create Wallet'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Import Wallet Modal */}
          <Modal visible={showImportModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Import Wallet</Text>
                <Text style={styles.modalText}>
                  Enter your Stellar secret key to import an existing wallet.
                </Text>
                <TextInput
                  style={styles.secretKeyInput}
                  placeholder="Secret key (starts with S...)"
                  value={importKey}
                  onChangeText={setImportKey}
                  autoCapitalize="characters"
                  secureTextEntry
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => { setShowImportModal(false); setImportKey(''); }}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalConfirmButton}
                    onPress={handleImportWallet}
                    disabled={creating}
                  >
                    <Text style={styles.modalConfirmText}>
                      {creating ? 'Importing...' : 'Import'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Secret Key Display Modal */}
          <Modal visible={showSecretKey} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>🔐 Save Your Secret Key</Text>
                <Text style={styles.modalText}>
                  Your wallet has been created! Save this secret key NOW. You will only see it once.
                </Text>
                <View style={styles.keyBox}>
                  <Text style={styles.keyLabel}>Public Address:</Text>
                  <Text style={styles.keyValue}>{truncateAddress(newWalletKeys?.publicKey || '')}</Text>
                </View>
                <View style={[styles.keyBox, styles.secretKeyBox]}>
                  <Text style={styles.keyLabel}>Secret Key (SAVE THIS!):</Text>
                  <Text style={styles.secretKeyValue}>{newWalletKeys?.secretKey}</Text>
                </View>
                <TouchableOpacity style={styles.copyButton} onPress={handleCopySecretKey}>
                  <Text style={styles.copyButtonText}>📋 Copy Secret Key</Text>
                </TouchableOpacity>
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>
                    ⚠️ Write this down or save it in a password manager. NEVER share it with anyone!
                  </Text>
                </View>
                <TouchableOpacity style={styles.savedButton} onPress={handleSecretKeySaved}>
                  <Text style={styles.savedButtonText}>I've Saved My Secret Key</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Has Wallet State
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        <Text style={styles.title}>Wallet</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            {parseFloat(balance?.mamaBalance || '0').toFixed(2)}
          </Text>
          <Text style={styles.tokenLabel}>MAMA Tokens</Text>

          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Wallet Address:</Text>
            <Text style={styles.address}>{truncateAddress(balance?.address || '')}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Redeem')}
            >
              <Text style={styles.actionButtonText}>🎁 Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Redeem')}
          >
            <Text style={styles.quickActionIcon}>🛒</Text>
            <Text style={styles.quickActionText}>Redeem Tokens</Text>
            <Text style={styles.quickActionSubtext}>Convert to vouchers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('VoucherList')}
          >
            <Text style={styles.quickActionIcon}>🎫</Text>
            <Text style={styles.quickActionText}>My Vouchers</Text>
            <Text style={styles.quickActionSubtext}>View & use vouchers</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {transactions.length === 0 ? (
          <View style={styles.emptyTransactions}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>Complete milestones to earn MAMA tokens!</Text>
          </View>
        ) : (
          transactions.map((tx: any) => (
            <View key={tx.id} style={styles.transactionCard}>
              <View style={[styles.txIcon, { backgroundColor: parseFloat(tx.amount) > 0 ? '#E8F5E9' : '#FFEBEE' }]}>
                <Text style={styles.txIconText}>{parseFloat(tx.amount) > 0 ? '↓' : '↑'}</Text>
              </View>
              <View style={styles.txDetails}>
                <Text style={styles.txDescription}>{tx.type.replace(/_/g, ' ')}</Text>
                <Text style={styles.txDate}>{new Date(tx.createdAt).toLocaleDateString()}</Text>
              </View>
              <Text style={[styles.txAmount, parseFloat(tx.amount) > 0 ? styles.txPositive : styles.txNegative]}>
                {parseFloat(tx.amount) > 0 ? '+' : ''}{parseFloat(tx.amount).toFixed(0)} MAMA
              </Text>
            </View>
          ))
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, padding: 20 },
  noWalletContainer: { flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },

  // No Wallet Styles
  noWalletCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 32, alignItems: 'center', marginBottom: 20 },
  noWalletIcon: { fontSize: 64, marginBottom: 16 },
  noWalletTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  noWalletText: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 24 },
  createButton: { backgroundColor: COLORS.primary, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 25, width: '100%', marginBottom: 12 },
  createButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
  importButton: { backgroundColor: 'transparent', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 25, width: '100%', borderWidth: 2, borderColor: COLORS.primary },
  importButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18, textAlign: 'center' },

  infoCard: { backgroundColor: '#E3F2FD', borderRadius: 16, padding: 20 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#1565C0', marginBottom: 8 },
  infoText: { fontSize: 14, color: '#1565C0', lineHeight: 22 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 12, textAlign: 'center' },
  modalText: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  warningBox: { backgroundColor: '#FFF3E0', padding: 16, borderRadius: 12, marginBottom: 20 },
  warningText: { color: '#E65100', fontSize: 14, lineHeight: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalCancelButton: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: COLORS.textSecondary },
  modalCancelText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 16, textAlign: 'center' },
  modalConfirmButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: COLORS.primary },
  modalConfirmText: { color: COLORS.white, fontWeight: '600', fontSize: 16, textAlign: 'center' },

  secretKeyInput: { borderWidth: 1, borderColor: '#DDD', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 20 },

  keyBox: { backgroundColor: '#F5F5F5', padding: 16, borderRadius: 12, marginBottom: 12, width: '100%' },
  secretKeyBox: { backgroundColor: '#FFEBEE' },
  keyLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  keyValue: { fontSize: 14, color: COLORS.text, fontFamily: 'monospace' },
  secretKeyValue: { fontSize: 12, color: '#C62828', fontFamily: 'monospace' },
  copyButton: { backgroundColor: '#E3F2FD', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, marginBottom: 16 },
  copyButtonText: { color: '#1565C0', fontWeight: '600', fontSize: 16, textAlign: 'center' },
  savedButton: { backgroundColor: COLORS.success, paddingVertical: 16, borderRadius: 12, width: '100%' },
  savedButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16, textAlign: 'center' },

  // Has Wallet Styles
  balanceCard: { backgroundColor: COLORS.primary, borderRadius: 20, padding: 24, marginBottom: 20, alignItems: 'center' },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  balanceAmount: { color: COLORS.white, fontSize: 48, fontWeight: 'bold', marginVertical: 8 },
  tokenLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 16 },
  addressContainer: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 12, borderRadius: 12, width: '100%', marginBottom: 16 },
  addressLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  address: { color: COLORS.white, fontSize: 14, marginTop: 4 },
  actions: { flexDirection: 'row', marginTop: 8 },
  actionButton: { backgroundColor: COLORS.white, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 20 },
  actionButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },

  // Quick Actions
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  quickActionCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: { fontSize: 32, marginBottom: 8 },
  quickActionText: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  quickActionSubtext: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  emptyTransactions: { backgroundColor: COLORS.white, borderRadius: 16, padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
  emptySubtext: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },

  transactionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txIconText: { fontSize: 20, color: COLORS.primary },
  txDetails: { flex: 1 },
  txDescription: { fontSize: 16, fontWeight: '500', color: COLORS.text, textTransform: 'capitalize' },
  txDate: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: 'bold' },
  txPositive: { color: COLORS.success },
  txNegative: { color: COLORS.primary },

  bottomPadding: { height: 40 },
});
