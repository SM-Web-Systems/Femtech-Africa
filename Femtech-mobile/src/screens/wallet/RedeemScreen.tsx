// D:\SM-WEB\FEMTECH-AFRICA\Femtech-mobile\src\screens\wallet\RedeemScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { useWallet } from '../../store/WalletContext';
import { useTheme } from '../../store/ThemeContext';
import { useAlert } from '../../hooks/useAlert';
import { redemptionsApi } from '../../api';

const EXCHANGE_RATE = 0.10;

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
  const { colors, isDark } = useTheme();
  const { alert, error, confirm } = useAlert();
  
  const [partners, setPartners] = useState<Partner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tokenAmount, setTokenAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [step, setStep] = useState(1);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const styles = createStyles(colors, isDark);

  useEffect(() => {
    checkBiometricAvailability();
    fetchPartners();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
    } catch (err) {
      console.log('Biometric check error:', err);
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
    } catch (err: any) {
      console.log('Failed to fetch partners:', err);
      error('Error', 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (partnerId: string) => {
    try {
      const data = await redemptionsApi.getPartnerProducts(partnerId);
      setProducts(data);
    } catch (err: any) {
      console.log('Failed to fetch products:', err);
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
    const numericText = text.replace(/[^0-9]/g, '');
    setTokenAmount(numericText);
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
    } catch (err) {
      console.log('Biometric authentication error:', err);
      return false;
    }
  };

  const handleRedeem = async () => {
    if (!canProceedToConfirm()) {
      error('Error', 'Please enter a valid amount');
      return;
    }

    if (biometricAvailable) {
      const authenticated = await authenticateWithBiometrics();
      if (!authenticated) {
        error('Authentication Failed', 'Biometric authentication is required to redeem tokens.');
        return;
      }
      await proceedWithRedemption();
    } else {
      confirm(
        'Confirm Redemption',
        `Are you sure you want to redeem ${tokenAmount} MAMA tokens for R${calculateZARValue()}?`,
        async () => {
          await proceedWithRedemption();
        }
      );
    }
  };

  const proceedWithRedemption = async () => {
    setRedeeming(true);
    try {
      const response = await redemptionsApi.redeem({
        partnerId: selectedPartner!.id,
        productId: selectedProduct?.id,
        tokenAmount: parseInt(tokenAmount),
      });

      await refreshBalance();

      const voucher = response.voucher || response;
      const voucherCode = voucher.code || voucher.voucherCode || 'N/A';
      const voucherValue = voucher.valueAmount ?? voucher.value ?? calculateZARValue();
      const voucherId = voucher.id || voucher.voucherId;

      const formattedValue = typeof voucherValue === 'number' 
        ? voucherValue.toFixed(2) 
        : parseFloat(voucherValue || '0').toFixed(2);

      alert(
        'Redemption Successful! 🎉',
        `You've redeemed ${tokenAmount} MAMA tokens.\n\nVoucher Code: ${voucherCode}\nValue: R${formattedValue}`,
        [
          {
            text: 'View Voucher',
            onPress: () => {
              if (voucherId) {
                navigation.navigate('VoucherDetail', { voucherId });
              } else {
                navigation.navigate('VoucherList');
              }
            },
          },
          {
            text: 'Done',
            onPress: () => {
              setSelectedPartner(null);
              setSelectedProduct(null);
              setTokenAmount('');
              setStep(1);
            },
          },
        ]
      );
    } catch (err: any) {
      const message = err.response?.data?.error || err.response?.data?.details || 'Redemption failed. Please try again.';
      error('Redemption Failed', message);
    } finally {
      setRedeeming(false);
    }
  };

  const renderPartnerCard = (partner: Partner) => (
    <TouchableOpacity
      key={partner.id}
      style={[styles.partnerCard, selectedPartner?.id === partner.id && styles.partnerCardSelected]}
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
        <Text style={styles.partnerDescription} numberOfLines={2}>{partner.description}</Text>
      </View>
      <Text style={styles.partnerArrow}>›</Text>
    </TouchableOpacity>
  );

  const renderProductCard = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={[styles.productCard, selectedProduct?.id === product.id && styles.productCardSelected]}
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
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading partners...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redeem Tokens</Text>
        <View style={styles.headerRight}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceValue}>{getNumericBalance().toFixed(2)} MAMA</Text>
        </View>
      </View>

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
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
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.amountLabel}>MAMA</Text>
            </View>

            <View style={styles.conversionCard}>
              <Text style={styles.conversionLabel}>You will receive</Text>
              <Text style={styles.conversionValue}>R {calculateZARValue()}</Text>
              <Text style={styles.conversionRate}>Rate: 1 MAMA = R{EXCHANGE_RATE.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.continueButton, !canProceedToConfirm() && styles.continueButtonDisabled]}
              onPress={() => setStep(3)}
              disabled={!canProceedToConfirm()}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

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

            {biometricAvailable && (
              <View style={styles.biometricInfo}>
                <Text style={styles.biometricIcon}>🔐</Text>
                <Text style={styles.biometricText}>Biometric authentication required to confirm</Text>
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
                <ActivityIndicator color={colors.white} />
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

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: colors.textSecondary, fontSize: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { padding: 8 },
  backButtonText: { fontSize: 24, color: colors.primary },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  headerRight: { alignItems: 'flex-end' },
  balanceLabel: { fontSize: 12, color: colors.textSecondary },
  balanceValue: { fontSize: 14, fontWeight: 'bold', color: colors.primary },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: colors.card,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: { backgroundColor: colors.primary },
  progressStepText: { fontSize: 14, fontWeight: 'bold', color: colors.textSecondary },
  progressStepTextActive: { color: colors.white },
  progressLine: { width: 60, height: 3, backgroundColor: colors.border, marginHorizontal: 8 },
  progressLineActive: { backgroundColor: colors.primary },
  content: { flex: 1 },
  contentContainer: { paddingBottom: 100 },
  stepContainer: { padding: 20 },
  stepTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  stepSubtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 24 },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  partnerCardSelected: { borderColor: colors.primary },
  partnerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerIconText: { fontSize: 24 },
  partnerInfo: { flex: 1, marginLeft: 16 },
  partnerName: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  partnerType: { fontSize: 12, color: colors.primary, marginTop: 2 },
  partnerDescription: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  partnerArrow: { fontSize: 24, color: colors.textSecondary },
  selectedPartnerBanner: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  selectedPartnerLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  selectedPartnerName: { fontSize: 18, fontWeight: 'bold', color: colors.white, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  productCardSelected: { 
    borderColor: colors.success, 
    backgroundColor: isDark ? '#1B5E20' : '#E8F5E9' 
  },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  productDescription: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  productCost: { alignItems: 'center' },
  productCostAmount: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  productCostLabel: { fontSize: 10, color: colors.textSecondary },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { paddingHorizontal: 16, color: colors.textSecondary, fontSize: 12 },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  amountInput: { flex: 1, fontSize: 32, fontWeight: 'bold', color: colors.text, textAlign: 'center' },
  amountLabel: { fontSize: 18, color: colors.textSecondary, marginLeft: 8 },
  conversionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  conversionLabel: { fontSize: 14, color: colors.textSecondary },
  conversionValue: { fontSize: 36, fontWeight: 'bold', color: colors.success, marginVertical: 8 },
  conversionRate: { fontSize: 12, color: colors.textSecondary },
  continueButton: { backgroundColor: colors.primary, borderRadius: 25, padding: 18, alignItems: 'center' },
  continueButtonDisabled: { opacity: 0.5 },
  continueButtonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  confirmCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, marginBottom: 16 },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  confirmLabel: { fontSize: 14, color: colors.textSecondary },
  confirmValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  confirmValueHighlight: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  confirmValueLarge: { fontSize: 24, fontWeight: 'bold', color: colors.success },
  confirmDivider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
  biometricInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#0D47A1' : '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  biometricIcon: { fontSize: 24, marginRight: 12 },
  biometricText: { flex: 1, fontSize: 14, color: isDark ? '#90CAF9' : '#1976D2' },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#4E342E' : '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  warningIcon: { fontSize: 20, marginRight: 12 },
  warningText: { flex: 1, fontSize: 13, color: isDark ? '#FFCC80' : '#E65100', lineHeight: 20 },
  redeemButton: { backgroundColor: colors.success, borderRadius: 25, padding: 18, alignItems: 'center', marginBottom: 20 },
  redeemButtonDisabled: { opacity: 0.7 },
  redeemButtonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  bottomPadding: { height: 100 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyStateText: { fontSize: 16, color: colors.textSecondary },
});
