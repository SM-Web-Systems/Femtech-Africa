// D:\SM-WEB\FEMTECH-AFRICA\Femtech-mobile\src\screens\profile\SecurityScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Clipboard from 'expo-clipboard';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../../store/ThemeContext';
import { useWallet } from '../../store/WalletContext';
import { useAuth } from '../../store/AuthContext';
import { useAlert } from '../../hooks/useAlert';
import { profileApi } from '../../api/profile';

export default function SecurityScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const { balance, loading: walletLoading, refreshBalance } = useWallet();
  const { eraseProfile, logout } = useAuth();
  const { alert, success, error } = useAlert();
  
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [loadingKey, setLoadingKey] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deletingProfile, setDeletingProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFinalWarning, setShowFinalWarning] = useState(false);

  const styles = createStyles(colors, isDark);

  useEffect(() => {
    const loadData = async () => {
      await refreshBalance();
      setInitialLoading(false);
    };
    loadData();
  }, []);

  const hasWallet = balance?.hasWallet || !!balance?.address;
  const walletAddress = balance?.address || '';

  const handleRevealSecretKey = async () => {
    if (isRevealed) {
      setIsRevealed(false);
      setSecretKey(null);
      return;
    }

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to reveal secret key',
          fallbackLabel: 'Use passcode',
        });

        if (!result.success) {
          error('Authentication Failed', 'Could not verify your identity');
          return;
        }
      }

      setLoadingKey(true);

      const storedKey = await SecureStore.getItemAsync('wallet_secret_key');
      
      if (storedKey) {
        setSecretKey(storedKey);
        setIsRevealed(true);
      } else {
        alert(
          'Secret Key Not Available',
          'Your secret key was only displayed once when your wallet was created. If you saved it, you can use it to restore your wallet on another device.'
        );
      }
    } catch (err) {
      console.log('Error revealing secret key:', err);
      error('Error', 'Could not retrieve secret key');
    } finally {
      setLoadingKey(false);
    }
  };

  const handleCopySecretKey = async () => {
    if (secretKey) {
      await Clipboard.setStringAsync(secretKey);
      success('Copied', 'Secret key copied to clipboard');
    }
  };

  const handleCopyAddress = async () => {
    if (walletAddress) {
      await Clipboard.setStringAsync(walletAddress);
      success('Copied', 'Wallet address copied to clipboard');
    }
  };

  const handleDeleteProfile = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProfile = () => {
    setShowDeleteConfirm(false);
    setShowFinalWarning(true);
  };

  const executeDeleteProfile = async () => {
    setShowFinalWarning(false);
    try {
      setDeletingProfile(true);
      
      await profileApi.deleteProfile();
      
      await SecureStore.deleteItemAsync('wallet_secret_key');
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_phone');
      
      if (eraseProfile) {
        await eraseProfile();
      } else if (logout) {
        await logout();
      }
      
      success('Profile Deleted', 'Your profile has been permanently deleted.');
    } catch (err) {
      console.error('Error deleting profile:', err);
      error('Error', 'Failed to delete profile. Please try again.');
    } finally {
      setDeletingProfile(false);
    }
  };

  const handleCreateWallet = () => {
    navigation.navigate('Wallet');
  };

  if (initialLoading || walletLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading wallet data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Wallet Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallet Security</Text>

          {hasWallet ? (
            <>
              {/* Wallet Address */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="wallet-outline" size={24} color={colors.primary} />
                  <Text style={styles.cardTitle}>Wallet Address</Text>
                </View>
                <View style={styles.keyRow}>
                  <Text style={styles.keyText} numberOfLines={1}>
                    {walletAddress}
                  </Text>
                  <TouchableOpacity style={styles.copyIcon} onPress={handleCopyAddress}>
                    <Ionicons name="copy-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Secret Key */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="key-outline" size={24} color={isDark ? '#FFB74D' : '#F57C00'} />
                  <Text style={styles.cardTitle}>Secret Key</Text>
                </View>
                
                <View style={styles.warningBanner}>
                  <Ionicons name="warning" size={20} color={isDark ? '#FFB74D' : '#F57C00'} />
                  <Text style={styles.warningText}>
                    Never share your secret key. Anyone with access can control your wallet.
                  </Text>
                </View>

                <View style={styles.keyRow}>
                  <Text style={styles.keyText} numberOfLines={1}>
                    {isRevealed && secretKey ? secretKey : '••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </Text>
                  {isRevealed && secretKey && (
                    <TouchableOpacity style={styles.copyIcon} onPress={handleCopySecretKey}>
                      <Ionicons name="copy-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.revealButton, isRevealed && styles.hideButton]}
                  onPress={handleRevealSecretKey}
                  disabled={loadingKey}
                >
                  {loadingKey ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name={isRevealed ? "eye-off-outline" : "eye-outline"} size={20} color="#FFFFFF" />
                      <Text style={styles.revealButtonText}>
                        {isRevealed ? 'Hide Secret Key' : 'Reveal Secret Key'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.noWalletCard}>
              <Ionicons name="wallet-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.noWalletText}>No wallet found</Text>
              <Text style={styles.noWalletSubtext}>
                Create a wallet to manage your MAMA tokens
              </Text>
              <TouchableOpacity style={styles.createWalletButton} onPress={handleCreateWallet}>
                <Text style={styles.createWalletButtonText}>Create Wallet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="finger-print" size={24} color={colors.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Biometric Login</Text>
                  <Text style={styles.settingDescription}>Use fingerprint or Face ID to login</Text>
                </View>
              </View>
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
          <View style={[styles.card, styles.dangerCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
              <Text style={[styles.cardTitle, styles.dangerText]}>Delete Profile</Text>
            </View>
            <Text style={styles.dangerDescription}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteProfile}
              disabled={deletingProfile}
            >
              {deletingProfile ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="trash" size={20} color="#FFFFFF" />
                  <Text style={styles.deleteButtonText}>Delete My Profile</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.deleteModalIcon}>
              <Ionicons name="warning" size={48} color="#EF4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Delete Your Profile?</Text>
            <Text style={styles.deleteModalText}>
              This will permanently remove all your data, including your wallet, tokens, and transaction history.
            </Text>
            
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={confirmDeleteProfile}
              >
                <Text style={styles.confirmDeleteButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Final Warning Modal */}
      <Modal visible={showFinalWarning} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.deleteModalIcon}>
              <Ionicons name="alert-circle" size={48} color="#EF4444" />
            </View>
            <Text style={styles.deleteModalTitle}>⚠️ Final Warning</Text>
            <Text style={styles.deleteModalText}>
              This will permanently delete:{'\n\n'}
              • Your profile data{'\n'}
              • Your wallet and all tokens{'\n'}
              • Your transaction history{'\n'}
              • Your quiz progress{'\n'}
              • Your vouchers{'\n\n'}
              This action CANNOT be undone.
            </Text>
            
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowFinalWarning(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={executeDeleteProfile}
              >
                <Text style={styles.confirmDeleteButtonText}>Delete Everything</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 12,
    },
    keyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#2D2D2D' : '#F3F4F6',
      borderRadius: 8,
      paddingLeft: 12,
      paddingRight: 4,
      paddingVertical: 4,
      marginBottom: 12,
    },
    keyText: {
      flex: 1,
      fontSize: 13,
      fontFamily: 'monospace',
      color: colors.text,
      paddingVertical: 8,
    },
    copyIcon: {
      padding: 10,
    },
    warningBanner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: isDark ? '#4E342E' : '#FFF3E0',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    warningText: {
      flex: 1,
      fontSize: 13,
      color: isDark ? '#FFB74D' : '#E65100',
      marginLeft: 8,
      lineHeight: 18,
    },
    revealButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 8,
    },
    hideButton: {
      backgroundColor: isDark ? '#4B5563' : '#6B7280',
    },
    revealButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      marginLeft: 8,
    },
    noWalletCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 32,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    noWalletText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginTop: 16,
    },
    noWalletSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
    createWalletButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 20,
    },
    createWalletButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 16,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingTextContainer: {
      marginLeft: 12,
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    settingDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    dangerTitle: {
      color: '#EF4444',
    },
    dangerCard: {
      borderWidth: 1,
      borderColor: isDark ? '#7F1D1D' : '#FEE2E2',
      backgroundColor: isDark ? '#1F1215' : '#FEF2F2',
    },
    dangerText: {
      color: '#EF4444',
    },
    dangerDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#EF4444',
      padding: 14,
      borderRadius: 8,
    },
    deleteButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      marginLeft: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 340,
    },
    deleteModalIcon: {
      alignItems: 'center',
      marginBottom: 16,
    },
    deleteModalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    deleteModalText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
    deleteModalButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      padding: 14,
      borderRadius: 8,
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
      alignItems: 'center',
    },
    cancelButtonText: {
      color: colors.text,
      fontWeight: '600',
    },
    confirmDeleteButton: {
      flex: 1,
      padding: 14,
      borderRadius: 8,
      backgroundColor: '#EF4444',
      alignItems: 'center',
    },
    confirmDeleteButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });
