import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../../store/WalletContext';
import { redemptionsApi } from '../../api';

const COLORS = {
  primary: '#E91E63',
  background: '#FFF5F8',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  card: '#FFFFFF',
  success: '#4CAF50',
  error: '#F44336',
  border: '#E0E0E0',
};

interface Partner {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  type: string;
  country: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tokenCost: number;
  stockQuantity: number;
  category: string;
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
  const [step, setStep] = useState(1); // 1: Select Partner, 2: Select Amount/Product, 3: Confirm

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const data = await redemptionsApi.getPartners();
      setPartners(data);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
      Alert.alert('Error', 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (partnerId: string) => {
    try {
      const data = await redemptionsApi.getPartnerProducts(partnerId);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handlePartnerSelect = async (partner: Partner) => {
    setSelectedPartner(partner);
    setLoading(true);
    await fetchProducts(partner.id);
    setLoading(false);
    setStep(2);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setTokenAmount(product.tokenCost.toString());
  };

  const handleContinue = () => {
    if (!tokenAmount || parseFloat(tokenAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid token amount');
      return;
    }
    if (parseFloat(tokenAmount) > parseFloat(balance?.mamaBalance || '0')) {
      Alert.alert('Error', 'Insufficient MAMA balance');
      return;
    }
    setStep(3);
  };

  const handleRedeem = async () => {
    if (!selectedPartner) return;

    setRedeeming(true);
    try {
      const result = await redemptionsApi.redeem(
        selectedPartner.id,
        parseFloat(tokenAmount),
        selectedProduct?.id
      );

      await refreshBalance();

      Alert.alert(
        'Success! 🎉',
        `Your voucher is ready!\nCode: ${result.voucher.code}\nValue: ${result.voucher.value.currency} ${result.voucher.value.amount}`,
        [
          {
            text: 'View Voucher',
            onPress: () => navigation.navigate('VoucherDetail', { voucherId: result.voucher.id }),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Redemption failed');
    } finally {
      setRedeeming(false);
    }
  };

  const exchangeRate = 0.10;
  const estimatedValue = parseFloat(tokenAmount || '0') * exchangeRate;

  if (loading && step === 1) {
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
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redeem Tokens</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>
          {parseFloat(balance?.mamaBalance || '0').toFixed(2)} MAMA
        </Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={styles.stepRow}>
            <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
              <Text style={[styles.stepNumber, step >= s && styles.stepNumberActive]}>{s}</Text>
            </View>
            {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Step 1: Select Partner */}
        {step === 1 && (
          <View>
            <Text style={styles.sectionTitle}>Select Partner</Text>
            {partners.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No partners available</Text>
              </View>
            ) : (
              partners.map((partner) => (
                <TouchableOpacity
                  key={partner.id}
                  style={styles.partnerCard}
                  onPress={() => handlePartnerSelect(partner)}
                >
                  <View style={styles.partnerLogo}>
                    <Text style={styles.partnerLogoText}>{partner.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.partnerInfo}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <Text style={styles.partnerDescription} numberOfLines={2}>
                      {partner.description || `Redeem tokens at ${partner.name}`}
                    </Text>
                    <View style={styles.partnerBadge}>
                      <Text style={styles.partnerBadgeText}>{partner.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.partnerArrow}>→</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Step 2: Select Amount/Product */}
        {step === 2 && selectedPartner && (
          <View>
            <View style={styles.selectedPartnerBanner}>
              <Text style={styles.selectedPartnerName}>{selectedPartner.name}</Text>
            </View>

            {products.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Select Product (Optional)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                  {products.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={[
                        styles.productCard,
                        selectedProduct?.id === product.id && styles.productCardSelected,
                      ]}
                      onPress={() => handleProductSelect(product)}
                    >
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productCost}>{product.tokenCost} MAMA</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <Text style={styles.sectionTitle}>Token Amount</Text>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                value={tokenAmount}
                onChangeText={setTokenAmount}
                keyboardType="numeric"
                placeholder="Enter amount"
                placeholderTextColor={COLORS.textSecondary}
              />
              <Text style={styles.amountSuffix}>MAMA</Text>
            </View>

            <View style={styles.estimateCard}>
              <Text style={styles.estimateLabel}>Estimated Value</Text>
              <Text style={styles.estimateValue}>ZAR {estimatedValue.toFixed(2)}</Text>
              <Text style={styles.estimateRate}>1 MAMA = ZAR 0.10</Text>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedPartner && (
          <View>
            <Text style={styles.sectionTitle}>Confirm Redemption</Text>

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
                <Text style={styles.confirmValue}>{tokenAmount} MAMA</Text>
              </View>
              <View style={[styles.confirmRow, styles.confirmRowHighlight]}>
                <Text style={styles.confirmLabel}>Voucher Value</Text>
                <Text style={styles.confirmValueHighlight}>ZAR {estimatedValue.toFixed(2)}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Expires</Text>
                <Text style={styles.confirmValue}>30 days</Text>
              </View>
            </View>

            <View style={styles.warningCard}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningText}>
                This action is irreversible. Your MAMA tokens will be burned and converted to a voucher.
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
                <Text style={styles.redeemButtonText}>Confirm & Redeem</Text>
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
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: COLORS.textSecondary },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  backButton: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },

  balanceCard: { backgroundColor: COLORS.primary, margin: 16, padding: 20, borderRadius: 16, alignItems: 'center' },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  balanceAmount: { color: COLORS.white, fontSize: 32, fontWeight: 'bold', marginTop: 4 },

  stepIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  stepCircleActive: { backgroundColor: COLORS.primary },
  stepNumber: { fontSize: 14, fontWeight: 'bold', color: COLORS.textSecondary },
  stepNumberActive: { color: COLORS.white },
  stepLine: { width: 40, height: 2, backgroundColor: COLORS.border, marginHorizontal: 8 },
  stepLineActive: { backgroundColor: COLORS.primary },

  content: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },

  partnerCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  partnerLogo: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  partnerLogoText: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  partnerInfo: { flex: 1, marginLeft: 12 },
  partnerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  partnerDescription: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  partnerBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginTop: 8 },
  partnerBadgeText: { fontSize: 11, color: '#1976D2', fontWeight: '600', textTransform: 'capitalize' },
  partnerArrow: { fontSize: 20, color: COLORS.primary },

  selectedPartnerBanner: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 12, marginBottom: 16, alignItems: 'center' },
  selectedPartnerName: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },

  productsScroll: { marginBottom: 20 },
  productCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginRight: 12, width: 140, borderWidth: 2, borderColor: 'transparent' },
  productCardSelected: { borderColor: COLORS.primary },
  productName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  productCost: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginTop: 8 },

  amountInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 16, marginBottom: 16 },
  amountInput: { flex: 1, fontSize: 24, fontWeight: 'bold', color: COLORS.text, paddingVertical: 16 },
  amountSuffix: { fontSize: 18, color: COLORS.textSecondary, fontWeight: '600' },

  estimateCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20 },
  estimateLabel: { fontSize: 14, color: COLORS.textSecondary },
  estimateValue: { fontSize: 28, fontWeight: 'bold', color: COLORS.success, marginTop: 4 },
  estimateRate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },

  continueButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 25, alignItems: 'center' },
  continueButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },

  confirmCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16 },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  confirmRowHighlight: { backgroundColor: '#E8F5E9', marginHorizontal: -20, paddingHorizontal: 20, borderBottomWidth: 0 },
  confirmLabel: { fontSize: 14, color: COLORS.textSecondary },
  confirmValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  confirmValueHighlight: { fontSize: 18, fontWeight: 'bold', color: COLORS.success },

  warningCard: { flexDirection: 'row', backgroundColor: '#FFF3E0', borderRadius: 12, padding: 16, marginBottom: 20, alignItems: 'center' },
  warningIcon: { fontSize: 24, marginRight: 12 },
  warningText: { flex: 1, fontSize: 13, color: '#E65100', lineHeight: 18 },

  redeemButton: {backgroundColor: COLORS.success,  padding: 18,  borderRadius: 25,  alignItems: 'center', marginBottom: 20,},
  redeemButtonDisabled: { opacity: 0.7 },
  redeemButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' }, bottomPadding: { height: 100 },

  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary, fontSize: 16 },
});