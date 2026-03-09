import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Modal, TextInput } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { walletApi } from '../../api';
import { useWallet } from '../../store/WalletContext';
import { useTheme } from '../../store/ThemeContext';

interface Token {
  symbol: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
  value?: string;
}

export default function WalletScreen({ navigation }: any) {
  const { balance, refreshBalance } = useWallet();
  const { colors, isDark } = useTheme();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [newWalletKeys, setNewWalletKeys] = useState<{ publicKey: string; secretKey: string } | null>(null);
  const [importKey, setImportKey] = useState('');
  const [creating, setCreating] = useState(false);

  const styles = createStyles(colors, isDark);

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
      
      // Save the secret key to SecureStore for later retrieval
      if (result.secretKey) {
        await SecureStore.setItemAsync('wallet_secret_key', result.secretKey);
        console.log('Secret key saved to SecureStore');
      }
      
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
      
      // Save the imported secret key to SecureStore
      await SecureStore.setItemAsync('wallet_secret_key', importKey);
      console.log('Imported secret key saved to SecureStore');
      
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

  const handleCopySecretKey = async () => {
    if (newWalletKeys?.secretKey) {
      await Clipboard.setStringAsync(newWalletKeys.secretKey);
      Alert.alert('Copied', 'Secret key copied to clipboard. Store it safely!');
    }
  };

  const handleCopyAddress = async () => {
    if (balance?.address) {
      await Clipboard.setStringAsync(balance.address);
      Alert.alert('Copied', 'Wallet address copied to clipboard');
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
    return `${address.slice(0, 12)}...${address.slice(-12)}`;
  };

  const getNumericBalance = (value: string | number | undefined): number => {
    if (!value) return 0;
    return typeof value === 'string' ? parseFloat(value) : value;
  };

  const hasWallet = balance?.hasWallet || false;

  const getOtherTokens = (): Token[] => {
    const tokens: Token[] = [];
    const xlmBalance = getNumericBalance(balance?.xlmBalance);
    tokens.push({
      symbol: 'XLM',
      name: 'Stellar Lumens',
      balance: xlmBalance,
      icon: '✦',
      color: '#000000',
      value: 'Network Fee',
    });
    return tokens;
  };

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
                  placeholderTextColor={colors.textSecondary}
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
                <TouchableOpacity style={styles.copyKeyButton} onPress={handleCopySecretKey}>
                  <Text style={styles.copyKeyButtonText}>📋 Copy Secret Key</Text>
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
  const mamaBalance = getNumericBalance(balance?.mamaBalance);
  const otherTokens = getOtherTokens();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <Text style={styles.title}>Wallet</Text>

        {/* Wallet Address Row */}
        <View style={styles.addressRow}>
          <View style={styles.addressInfo}>
            <Text style={styles.addressLabel}>Wallet Address</Text>
            <Text style={styles.addressValue}>{truncateAddress(balance?.address || '')}</Text>
          </View>
          <TouchableOpacity style={styles.copyIconButton} onPress={handleCopyAddress}>
            <Text style={styles.copyIconText}>📋</Text>
          </TouchableOpacity>
        </View>

        {/* MAMA Token Card - Highlighted */}
        <View style={styles.mamaCard}>
          <View style={styles.mamaLeft}>
            <View style={styles.mamaIconContainer}>
              <Text style={styles.mamaIcon}>🪙</Text>
            </View>
            <View style={styles.mamaInfo}>
              <Text style={styles.mamaSymbol}>MAMA</Text>
              <Text style={styles.mamaName}>MamaTokens</Text>
            </View>
          </View>
          <View style={styles.mamaRight}>
            <Text style={styles.mamaBalance}>{mamaBalance.toFixed(2)}</Text>
            <Text style={styles.mamaValue}>≈ R {(mamaBalance * 0.10).toFixed(2)}</Text>
          </View>
        </View>

        {/* Other Tokens Section */}
        <Text style={styles.sectionTitle}>Other Tokens</Text>
        <View style={styles.tokensList}>
          {otherTokens.map((token, index) => (
            <View key={token.symbol}>
              <View style={styles.tokenItem}>
                <View style={[styles.tokenIconContainer, { backgroundColor: isDark ? '#333333' : `${token.color}15` }]}>
                  <Text style={styles.tokenIcon}>{token.icon}</Text>
                </View>
                <View style={styles.tokenInfo}>
                  <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                  <Text style={styles.tokenName}>{token.name}</Text>
                </View>
                <View style={styles.tokenBalanceContainer}>
                  <Text style={styles.tokenBalance}>
                    {token.symbol === 'XLM' ? token.balance.toFixed(4) : token.balance.toFixed(2)}
                  </Text>
                  {token.value && <Text style={styles.tokenValue}>{token.value}</Text>}
                </View>
              </View>
              {index < otherTokens.length - 1 && <View style={styles.tokenDivider} />}
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Redeem')}
          >
            <Text style={styles.quickActionIcon}>🛒</Text>
            <Text style={styles.quickActionText}>Redeem</Text>
            <Text style={styles.quickActionSubtext}>Get vouchers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('VoucherList')}
          >
            <Text style={styles.quickActionIcon}>🎫</Text>
            <Text style={styles.quickActionText}>Vouchers</Text>
            <Text style={styles.quickActionSubtext}>View & use</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions Section */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {transactions.length === 0 ? (
          <View style={styles.emptyTransactions}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>Complete milestones to earn MAMA tokens!</Text>
          </View>
        ) : (
          transactions.slice(0, 10).map((tx: any) => (
            <View key={tx.id} style={styles.transactionCard}>
              <View style={[
                styles.txIcon, 
                { backgroundColor: parseFloat(tx.amount) > 0 
                  ? (isDark ? '#1B5E20' : '#E8F5E9') 
                  : (isDark ? '#B71C1C' : '#FFEBEE') 
                }
              ]}>
                <Text style={[
                  styles.txIconText,
                  { color: parseFloat(tx.amount) > 0 ? '#4CAF50' : '#F44336' }
                ]}>
                  {parseFloat(tx.amount) > 0 ? '↓' : '↑'}
                </Text>
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

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  scroll: { 
    flex: 1, 
    padding: 20 
  },
  noWalletContainer: { 
    flexGrow: 1 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: colors.text, 
    marginBottom: 20 
  },

  // No Wallet Styles
  noWalletCard: { 
    backgroundColor: colors.card, 
    borderRadius: 20, 
    padding: 32, 
    alignItems: 'center', 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noWalletIcon: { 
    fontSize: 64, 
    marginBottom: 16 
  },
  noWalletTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: colors.text, 
    marginBottom: 12 
  },
  noWalletText: { 
    fontSize: 16, 
    color: colors.textSecondary, 
    textAlign: 'center', 
    marginBottom: 24, 
    lineHeight: 24 
  },
  createButton: { 
    backgroundColor: colors.primary, 
    paddingVertical: 16, 
    paddingHorizontal: 40, 
    borderRadius: 25, 
    width: '100%', 
    marginBottom: 12 
  },
  createButtonText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 18, 
    textAlign: 'center' 
  },
  importButton: { 
    backgroundColor: 'transparent', 
    paddingVertical: 16, 
    paddingHorizontal: 40, 
    borderRadius: 25, 
    width: '100%', 
    borderWidth: 2, 
    borderColor: colors.primary 
  },
  importButtonText: { 
    color: colors.primary, 
    fontWeight: 'bold', 
    fontSize: 18, 
    textAlign: 'center' 
  },

  infoCard: { 
    backgroundColor: isDark ? '#1A237E' : '#E3F2FD', 
    borderRadius: 16, 
    padding: 20 
  },
  infoTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: isDark ? '#90CAF9' : '#1565C0', 
    marginBottom: 8 
  },
  infoText: { 
    fontSize: 14, 
    color: isDark ? '#90CAF9' : '#1565C0', 
    lineHeight: 22 
  },

  // Modal Styles
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: colors.card, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    padding: 24, 
    paddingBottom: 40 
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: colors.text, 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  modalText: { 
    fontSize: 16, 
    color: colors.textSecondary, 
    textAlign: 'center', 
    marginBottom: 20, 
    lineHeight: 24 
  },
  warningBox: { 
    backgroundColor: isDark ? '#4E342E' : '#FFF3E0', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 20 
  },
  warningText: { 
    color: isDark ? '#FFCC80' : '#E65100', 
    fontSize: 14, 
    lineHeight: 20 
  },
  modalButtons: { 
    flexDirection: 'row', 
    gap: 12 
  },
  modalCancelButton: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: colors.textSecondary 
  },
  modalCancelText: { 
    color: colors.textSecondary, 
    fontWeight: '600', 
    fontSize: 16, 
    textAlign: 'center' 
  },
  modalConfirmButton: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 12, 
    backgroundColor: colors.primary 
  },
  modalConfirmText: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: 16, 
    textAlign: 'center' 
  },

  secretKeyInput: { 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    marginBottom: 20, 
    color: colors.text, 
    backgroundColor: isDark ? colors.surface : colors.background 
  },

  keyBox: { 
    backgroundColor: isDark ? colors.surface : colors.background, 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    width: '100%' 
  },
  secretKeyBox: { 
    backgroundColor: isDark ? '#4A1A1A' : '#FFEBEE' 
  },
  keyLabel: { 
    fontSize: 12, 
    color: colors.textSecondary, 
    marginBottom: 4 
  },
  keyValue: { 
    fontSize: 14, 
    color: colors.text, 
    fontFamily: 'monospace' 
  },
  secretKeyValue: { 
    fontSize: 12, 
    color: isDark ? '#EF9A9A' : '#C62828', 
    fontFamily: 'monospace' 
  },
  copyKeyButton: { 
    backgroundColor: isDark ? '#0D47A1' : '#E3F2FD', 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 12, 
    marginBottom: 16 
  },
  copyKeyButtonText: { 
    color: isDark ? '#90CAF9' : '#1565C0', 
    fontWeight: '600', 
    fontSize: 16, 
    textAlign: 'center' 
  },
  savedButton: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 16, 
    borderRadius: 12, 
    width: '100%' 
  },
  savedButtonText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 16, 
    textAlign: 'center' 
  },

  // Address Row
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: colors.text,
  },
  copyIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? colors.surface : colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyIconText: {
    fontSize: 20,
  },

  // MAMA Card - Highlighted
  mamaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  mamaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mamaIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  mamaIcon: {
    fontSize: 26,
  },
  mamaInfo: {},
  mamaSymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mamaName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  mamaRight: {
    alignItems: 'flex-end',
  },
  mamaBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mamaValue: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  // Other Tokens List
  tokensList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  tokenDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  tokenIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tokenIcon: {
    fontSize: 22,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  tokenName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tokenBalanceContainer: {
    alignItems: 'flex-end',
  },
  tokenBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  tokenValue: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Quick Actions
  quickActions: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 24 
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: { 
    fontSize: 32, 
    marginBottom: 8 
  },
  quickActionText: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: colors.text 
  },
  quickActionSubtext: { 
    fontSize: 12, 
    color: colors.textSecondary, 
    marginTop: 4 
  },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.text, 
    marginBottom: 16 
  },
  emptyTransactions: { 
    backgroundColor: colors.card, 
    borderRadius: 16, 
    padding: 32, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: colors.textSecondary 
  },
  emptySubtext: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    marginTop: 8 
  },

  transactionCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.card, 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.2 : 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  txIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  txIconText: { 
    fontSize: 20,
  },
  txDetails: { 
    flex: 1 
  },
  txDescription: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: colors.text, 
    textTransform: 'capitalize' 
  },
  txDate: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    marginTop: 2 
  },
  txAmount: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  txPositive: { 
    color: '#4CAF50' 
  },
  txNegative: { 
    color: colors.primary 
  },

  bottomPadding: { 
    height: 40 
  },
});
