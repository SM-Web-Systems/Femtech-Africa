// D:\SM-WEB\FEMTECH-AFRICA\Femtech-mobile\src\screens\wallet\RedeemScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { useWallet } from '../../store/WalletContext';
import { redemptionsApi } from '../../api';

const COLORS = {
  primary: '#E91E63',
  secondary: '#9C27B0',
  background: '#FFF5F8',
  white: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  border: '#F0F0F0',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  card: '#FFFFFF',
};

const EXCHANGE_RATE = 0.10; // 1 MAMA = 0.10 ZAR

interface Partner {
  id: string;
  name: string;
  type: string;
  description: string;
  logoUrl?: string;
  country: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  tokenCost: number;
  stock: number;
}

export default function RedeemScreen({ navigation }: any) {
  const { balance, refreshBalance } = useWallet();
  
  const [partners, setPartners] = useState<Partner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tokenAmount, setTokenAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Partner, 2: Enter Amount, 3: Confirm
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    fetchPartners();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
    } catch (error) {
      console.log('Biometric check error:', error);
      setBiometricAvailable(false);
    }
  };
  
  const getNumericBalance = (): number => {
    if (!balance?.mamaBalance) return 0;
    return typeof balance.mamaBalance === 'string' 
      ? parseFloat(balance.mamaBalance) 
      : balance.mamaBalance;
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await redemptionsApi.getPartners();
      setPartners(data);
    } catch (error: any) {
      console.log('Failed to fetch partners:', error);
      Alert.alert('Error', 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (partnerId: string) => {
    try {
      const data = await redemptionsApi.getPartnerProducts(partnerId);
      setProducts(data);
    } catch (error: any) {
      console.log('Failed to fetch products:', error);
      setProducts([]);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPartners();
    await refreshBalance();
    setRefreshing(false);
  }, [refreshBalance]);

  const handlePartnerSelect = async (partner: Partner) => {
    setSelectedPartner(partner);
    setSelectedProduct(null);
    setTokenAmount('');
    await fetchProducts(partner.id);
    setStep(2);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setTokenAmount(product.tokenCost.toString());
  };

  const handleAmountChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    setTokenAmount(numericText);
    // Clear product selection if manually entering amount
    if (selectedProduct && numericText !== selectedProduct.tokenCost.toString()) {
      setSelectedProduct(null);
    }
  };

  const calculateZARValue = () => {
    const amount = parseInt(tokenAmount) || 0;
    return (amount * EXCHANGE_RATE).toFixed(2);
  };

  const canProceedToConfirm = () => {
    const amount = parseInt(tokenAmount) || 0;
    const available = typeof balance?.mamaBalance === 'string' 
      ? parseFloat(balance.mamaBalance) 
      : (balance?.mamaBalance || 0);
    return amount > 0 && amount <= available && selectedPartner;
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Confirm Redemption - Redeem ${tokenAmount} MAMA tokens`,
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.log('Biometric authentication error:', error);
      return false;
    }
  };

  const handleRedeem = async () => {
    if (!canProceedToConfirm()) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Require biometric authentication
    if (biometricAvailable) {
      const authenticated = await authenticateWithBiometrics();
      if (!authenticated) {
        Alert.alert(
          'Authentication Failed',
          'Biometric authentication is required to redeem tokens.',
          [{ text: 'OK' }]
        );
        return;
      }
    } else {
      // Fallback confirmation for devices without biometrics
      const confirmed = await new Promise<boolean>((resolve) => {
        Alert.alert(
          'Confirm Redemption',
          `Are you sure you want to redeem ${tokenAmount} MAMA tokens for R${calculateZARValue()}?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Confirm', onPress: () => resolve(true) },
          ]
        );
      });

      if (!confirmed) return;
    }

    // Proceed with redemption
    await proceedWithRedemption();
  };

  const proceedWithRedemption = async () => {
    setRedeeming(true);

    try {
      const response = await redemptionsApi.redeem({
        partnerId: selectedPartner!.id,
        productId: selectedProduct?.id,
        tokenAmount: parseInt(tokenAmount),
      });

      // Refresh balance after successful redemption
      await refreshBalance();

      // Navigate to voucher detail
      Alert.alert(
        'Redemption Successful! 🎉',
        `You've redeemed ${tokenAmount} MAMA tokens.\n\nVoucher Code: ${response.voucher.code}\nValue: R${response.voucher.valueAmount.toFixed(2)}`,
        [
          {
            text: 'View Voucher',
            onPress: () => {
              navigation.navigate('VoucherDetail', { voucherId: response.voucher.id });
            },
          },
          {
            text: 'Done',
            onPress: () => {
              // Reset state
              setSelectedPartner(null);
              setSelectedProduct(null);
              setTokenAmount('');
              setStep(1);
            },
          },
        ]
      );
    } catch (error: any) {
      console.log('Redemption error:', error);
      const message = error.response?.data?.error || error.response?.data?.details || 'Redemption failed. Please try again.';
      Alert.alert('Redemption Failed', message);
    } finally {
      setRedeeming(false);
    }
  };

  const renderPartnerCard = (partner: Partner) => (
    <TouchableOpacity
      key={partner.id}
      style={[
        styles.partnerCard,
        selectedPartner?.id === partner.id && styles.partnerCardSelected,
      ]}
      onPress={() => handlePartnerSelect(partner)}
    >
      <View style={styles.partnerIcon}>
        <Text style={styles.partnerIconText}>
          {partner.type === 'retail' ? '🛒' :
           partner.type === 'transport' ? '🚗' :
           partner.type === 'pharmacy' ? '💊' :
           partner.type === 'telecom' ? '📱' : '🏪'}
        </Text>
      </View>
      <View style={styles.partnerInfo}>
        <Text style={styles.partnerName}>{partner.name}</Text>
        <Text style={styles.partnerType}>{partner.type.toUpperCase()} • {partner.country}</Text>
        <Text style={styles.partnerDescription} numberOfLines={2}>
          {partner.description}
        </Text>
      </View>
      <Text style={styles.partnerArrow}>›</Text>
    </TouchableOpacity>
  );

  const renderProductCard = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={[
        styles.productCard,
        selectedProduct?.id === product.id && styles.productCardSelected,
      ]}
      onPress={() => handleProductSelect(product)}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>
      <View style={styles.productCost}>
        <Text style={styles.productCostAmount}>{product.tokenCost}</Text>
        <Text style={styles.productCostLabel}>MAMA</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading partners...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redeem Tokens</Text>
        <View style={styles.headerRight}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceValue}>{getNumericBalance().toFixed(2)} MAMA</Text>
        </View>
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]}>
          <Text style={[styles.progressStepText, step >= 1 && styles.progressStepTextActive]}>1</Text>
        </View>
        <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
        <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]}>
          <Text style={[styles.progressStepText, step >= 2 && styles.progressStepTextActive]}>2</Text>
        </View>
        <View style={[styles.progressLine, step >= 3 && styles.progressLineActive]} />
        <View style={[styles.progressStep, step >= 3 && styles.progressStepActive]}>
          <Text style={[styles.progressStepText, step >= 3 && styles.progressStepTextActive]}>3</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* Step 1: Select Partner */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Partner</Text>
            <Text style={styles.stepSubtitle}>Choose where to redeem your tokens</Text>
            
            {partners.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No partners available</Text>
              </View>
            ) : (
              partners.map(renderPartnerCard)
            )}
          </View>
        )}

        {/* Step 2: Enter Amount */}
        {step === 2 && selectedPartner && (
          <View style={styles.stepContainer}>
            <View style={styles.selectedPartnerBanner}>
              <Text style={styles.selectedPartnerLabel}>Redeeming at</Text>
              <Text style={styles.selectedPartnerName}>{selectedPartner.name}</Text>
            </View>

            {products.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Available Products</Text>
                {products.map(renderProductCard)}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>
              </>
            )}

            <Text style={styles.sectionTitle}>Enter Custom Amount</Text>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                value={tokenAmount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={COLORS.textLight}
              />
              <Text style={styles.amountLabel}>MAMA</Text>
            </View>

            <View style={styles.conversionCard}>
              <Text style={styles.conversionLabel}>You will receive</Text>
              <Text style={styles.conversionValue}>R {calculateZARValue()}</Text>
              <Text style={styles.conversionRate}>Rate: 1 MAMA = R{EXCHANGE_RATE.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                !canProceedToConfirm() && styles.continueButtonDisabled,
              ]}
              onPress={() => setStep(3)}
              disabled={!canProceedToConfirm()}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedPartner && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Confirm Redemption</Text>
            
            <View style={styles.confirmCard}>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Partner</Text>
                <Text style={styles.confirmValue}>{selectedPartner.name}</Text>
              </View>
              
              {selectedProduct && (
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Product</Text>
                  <Text style={styles.confirmValue}>{selectedProduct.name}</Text>
                </View>
              )}
              
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Tokens to Burn</Text>
                <Text style={styles.confirmValueHighlight}>{tokenAmount} MAMA</Text>
              </View>
              
              <View style={styles.confirmDivider} />
              
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Voucher Value</Text>
                <Text style={styles.confirmValueLarge}>R {calculateZARValue()}</Text>
              </View>
              
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Remaining Balance</Text>
                <Text style={styles.confirmValue}>
                  {(getNumericBalance() - (parseInt(tokenAmount) || 0)).toFixed(2)} MAMA
                </Text>
              </View>
            </View>

            {/* Biometric Info */}
            {biometricAvailable && (
              <View style={styles.biometricInfo}>
                <Text style={styles.biometricIcon}>🔐</Text>
                <Text style={styles.biometricText}>
                  Biometric authentication required to confirm
                </Text>
              </View>
            )}

            <View style={styles.warningCard}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningText}>
                This action cannot be undone. Tokens will be permanently burned and a voucher will be generated.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.redeemButton, redeeming && styles.redeemButtonDisabled]}
              onPress={handleRedeem}
              disabled={redeeming}
            >
              {redeeming ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.redeemButtonText}>
                  {biometricAvailable ? '🔐 Confirm & Redeem' : 'Confirm & Redeem'}
                </Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.bottomPadding} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textLight,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: COLORS.white,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: COLORS.primary,
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  progressStepTextActive: {
    color: COLORS.white,
  },
  progressLine: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  partnerCardSelected: {
    borderColor: COLORS.primary,
  },
  partnerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerIconText: {
    fontSize: 24,
  },
  partnerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  partnerType: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 2,
  },
  partnerDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  partnerArrow: {
    fontSize: 24,
    color: COLORS.textLight,
  },
  selectedPartnerBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  selectedPartnerLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  selectedPartnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  productCardSelected: {
    borderColor: COLORS.success,
    backgroundColor: '#E8F5E9',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  productDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  productCost: {
    alignItems: 'center',
  },
  productCostAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  productCostLabel: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    color: COLORS.textLight,
    fontSize: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  amountLabel: {
    fontSize: 18,
    color: COLORS.textLight,
    marginLeft: 8,
  },
  conversionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  conversionLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  conversionValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.success,
    marginVertical: 8,
  },
  conversionRate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  confirmLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  confirmValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  confirmValueHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  confirmValueLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  confirmDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  biometricInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  biometricIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  biometricText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
    lineHeight: 20,
  },
  redeemButton: {
    backgroundColor: COLORS.success,
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  redeemButtonDisabled: {
    opacity: 0.7,
  },
  redeemButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 100,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});
