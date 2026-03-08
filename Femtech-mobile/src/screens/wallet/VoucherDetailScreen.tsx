import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { redemptionsApi } from '../../api';

const COLORS = {
  primary: '#E91E63',
  background: '#FFF5F8',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  card: '#FFFFFF',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
};

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  active: { bg: '#E8F5E9', text: '#4CAF50', icon: '✓' },
  used: { bg: '#E3F2FD', text: '#1976D2', icon: '✓' },
  expired: { bg: '#FFEBEE', text: '#F44336', icon: '✕' },
  cancelled: { bg: '#F5F5F5', text: '#9E9E9E', icon: '✕' },
};

interface VoucherDetail {
  id: string;
  code: string;
  barcode: string;
  qrCode: string;
  tokensBurned: number;
  value: { amount: number; currency: string };
  partner: any;
  product: any;
  status: string;
  expiresAt: string;
  usedAt: string | null;
  usedAtLocation: string | null;
  createdAt: string;
  txHash: string | null;
}

export default function VoucherDetailScreen({ route, navigation }: any) {
  const { voucherId } = route.params;
  const [voucher, setVoucher] = useState<VoucherDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVoucher();
  }, [voucherId]);

  const fetchVoucher = async () => {
    try {
      const data = await redemptionsApi.getVoucher(voucherId);
      setVoucher(data);
    } catch (error) {
      console.error('Failed to fetch voucher:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleShare = async () => {
    if (!voucher) return;
    try {
      await Share.share({
        message: `MamaTokens Voucher\nCode: ${voucher.code}\nValue: ${voucher.value.currency} ${voucher.value.amount}\nPartner: ${voucher.partner?.name || 'N/A'}\nExpires: ${formatDate(voucher.expiresAt)}`,
        title: 'MamaTokens Voucher',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading voucher...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!voucher) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorText}>Voucher not found</Text>
          <TouchableOpacity style={styles.backButtonLarge} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = STATUS_COLORS[voucher.status] || STATUS_COLORS.active;
  const daysRemaining = getDaysRemaining(voucher.expiresAt);
  const isActive = voucher.status === 'active';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voucher Details</Text>
        <TouchableOpacity onPress={handleShare}>
          <Text style={styles.shareButton}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusIcon, { color: statusStyle.text }]}>{statusStyle.icon}</Text>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {voucher.status === 'active' ? 'ACTIVE VOUCHER' : voucher.status.toUpperCase()}
          </Text>
        </View>

        {/* QR Code Card */}
        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>Scan to Redeem</Text>
          {voucher.qrCode ? (
            <Image source={{ uri: voucher.qrCode }} style={styles.qrCode} resizeMode="contain" />
          ) : (
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrPlaceholderText}>QR Code</Text>
            </View>
          )}
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>VOUCHER CODE</Text>
            <Text style={styles.codeValue}>{voucher.code}</Text>
          </View>
          {voucher.barcode && (
            <Text style={styles.barcode}>{voucher.barcode}</Text>
          )}
        </View>

        {/* Value Card */}
        <View style={styles.valueCard}>
          <Text style={styles.valueLabel}>Voucher Value</Text>
          <Text style={styles.valueAmount}>
            {voucher.value.currency} {voucher.value.amount.toFixed(2)}
          </Text>
          <Text style={styles.tokensBurned}>{voucher.tokensBurned} MAMA tokens burned</Text>
        </View>

        {/* Partner Info */}
        {voucher.partner && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Partner</Text>
            <View style={styles.partnerRow}>
              <View style={styles.partnerLogo}>
                <Text style={styles.partnerLogoText}>{voucher.partner.name?.charAt(0) || 'P'}</Text>
              </View>
              <View>
                <Text style={styles.partnerName}>{voucher.partner.name}</Text>
                <Text style={styles.partnerType}>{voucher.partner.type}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Product Info */}
        {voucher.product && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Product</Text>
            <Text style={styles.productName}>{voucher.product.name}</Text>
          </View>
        )}

        {/* Expiry Info */}
        <View style={styles.infoCard}>
          {isActive ? (
            <>
              <Text style={styles.infoTitle}>Valid Until</Text>
              <Text style={styles.expiryDate}>{formatDate(voucher.expiresAt)}</Text>
              {daysRemaining <= 7 && daysRemaining > 0 && (
                <View style={styles.expiryWarning}>
                  <Text style={styles.expiryWarningText}>⚠️ Expires in {daysRemaining} days</Text>
                </View>
              )}
            </>
          ) : voucher.status === 'used' ? (
            <>
              <Text style={styles.infoTitle}>Used On</Text>
              <Text style={styles.usedDate}>{voucher.usedAt ? formatDate(voucher.usedAt) : 'N/A'}</Text>
              {voucher.usedAtLocation && (
                <Text style={styles.usedLocation}>📍 {voucher.usedAtLocation}</Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.infoTitle}>Expired On</Text>
              <Text style={styles.expiredDate}>{formatDate(voucher.expiresAt)}</Text>
            </>
          )}
        </View>

        {/* Transaction Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Transaction Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>{formatDate(voucher.createdAt)}</Text>
          </View>
          {voucher.txHash && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Blockchain TX</Text>
              <Text style={styles.txHash} numberOfLines={1} ellipsizeMode="middle">
                {voucher.txHash}
              </Text>
            </View>
          )}
        </View>

        {/* Instructions */}
        {isActive && (
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>How to Use</Text>
            <View style={styles.instructionStep}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Show this QR code to the cashier</Text>
            </View>
            <View style={styles.instructionStep}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Or provide the voucher code: {voucher.code}</Text>
            </View>
            <View style={styles.instructionStep}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>The value will be deducted from your purchase</Text>
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: COLORS.textSecondary },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorIcon: { fontSize: 64, marginBottom: 16 },
  errorText: { fontSize: 18, color: COLORS.text, marginBottom: 24 },
  backButtonLarge: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  backButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  backButton: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  shareButton: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },

  content: { flex: 1, padding: 16 },

  statusBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, marginBottom: 16 },
  statusIcon: { fontSize: 18, fontWeight: 'bold', marginRight: 8 },
  statusText: { fontSize: 14, fontWeight: 'bold' },

  qrCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  qrTitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 16 },
  qrCode: { width: 200, height: 200, marginBottom: 16 },
  qrPlaceholder: { width: 200, height: 200, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderRadius: 12 },
  qrPlaceholderText: { color: COLORS.textSecondary },
  codeBox: { backgroundColor: '#F5F5F5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  codeLabel: { fontSize: 11, color: COLORS.textSecondary, letterSpacing: 1 },
  codeValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginTop: 4, fontFamily: 'monospace', letterSpacing: 2 },
  barcode: { fontSize: 12, color: COLORS.textSecondary, marginTop: 12, fontFamily: 'monospace' },

  valueCard: { backgroundColor: COLORS.success, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  valueLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  valueAmount: { fontSize: 36, fontWeight: 'bold', color: COLORS.white, marginTop: 4 },
  tokensBurned: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 8 },

  infoCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12 },
  infoTitle: { fontSize: 12, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  partnerRow: { flexDirection: 'row', alignItems: 'center' },
  partnerLogo: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  partnerLogoText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  partnerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  partnerType: { fontSize: 13, color: COLORS.textSecondary, textTransform: 'capitalize' },
  productName: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  expiryDate: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  expiryWarning: { backgroundColor: '#FFF3E0', padding: 10, borderRadius: 8, marginTop: 8 },
  expiryWarningText: { color: '#E65100', fontSize: 14, fontWeight: '600' },
  usedDate: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  usedLocation: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  expiredDate: { fontSize: 16, fontWeight: '600', color: COLORS.error },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  detailLabel: { fontSize: 14, color: COLORS.textSecondary },
  detailValue: { fontSize: 14, color: COLORS.text },
  txHash: { fontSize: 12, color: COLORS.primary, maxWidth: 150 },

  instructionsCard: { backgroundColor: '#E3F2FD', borderRadius: 16, padding: 16, marginBottom: 16 },
  instructionsTitle: { fontSize: 14, fontWeight: 'bold', color: '#1976D2', marginBottom: 12 },
  instructionStep: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#1976D2', color: COLORS.white, textAlign: 'center', lineHeight: 24, fontWeight: 'bold', marginRight: 12 },
  stepText: { flex: 1, fontSize: 14, color: '#1565C0' },

  bottomPadding: { height: 40 },
});
