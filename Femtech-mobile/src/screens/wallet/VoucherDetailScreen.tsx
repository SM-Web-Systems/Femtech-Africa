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
import { useTheme } from '../../store/ThemeContext';

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  active: { bg: '#E8F5E9', text: '#4CAF50', icon: '✓' },
  used: { bg: '#E3F2FD', text: '#1976D2', icon: '✓' },
  expired: { bg: '#FFEBEE', text: '#F44336', icon: '✕' },
  cancelled: { bg: '#F5F5F5', text: '#9E9E9E', icon: '✕' },
};

const STATUS_COLORS_DARK: Record<string, { bg: string; text: string; icon: string }> = {
  active: { bg: '#1B5E20', text: '#81C784', icon: '✓' },
  used: { bg: '#0D47A1', text: '#64B5F6', icon: '✓' },
  expired: { bg: '#B71C1C', text: '#EF9A9A', icon: '✕' },
  cancelled: { bg: '#424242', text: '#9E9E9E', icon: '✕' },
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
  const { colors, isDark } = useTheme();
  const [voucher, setVoucher] = useState<VoucherDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const styles = createStyles(colors, isDark);
  const statusColorMap = isDark ? STATUS_COLORS_DARK : STATUS_COLORS;

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
          <ActivityIndicator size="large" color={colors.primary} />
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
            <Text style={styles.backButtonLargeText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = statusColorMap[voucher.status] || statusColorMap.active;
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
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <Text style={styles.stepText}>Show this QR code to the cashier</Text>
            </View>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <Text style={styles.stepText}>Or provide the voucher code: {voucher.code}</Text>
            </View>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <Text style={styles.stepText}>The value will be deducted from your purchase</Text>
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 24,
  },
  backButtonLarge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonLargeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  shareButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },

  content: {
    flex: 1,
    padding: 16,
  },

  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  qrCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.4 : 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  qrTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: isDark ? colors.surface : '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 12,
  },
  qrPlaceholderText: {
    color: colors.textSecondary,
  },
  codeBox: {
    backgroundColor: isDark ? colors.surface : '#F5F5F5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  codeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 4,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  barcode: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 12,
    fontFamily: 'monospace',
  },

  valueCard: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  valueLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  valueAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  tokensBurned: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },

  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  partnerLogoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  partnerType: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  expiryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  expiryWarning: {
    backgroundColor: isDark ? '#4E342E' : '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  expiryWarningText: {
    color: isDark ? '#FFCC80' : '#E65100',
    fontSize: 14,
    fontWeight: '600',
  },
  usedDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  usedLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  expiredDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
  },
  txHash: {
    fontSize: 12,
    color: colors.primary,
    maxWidth: 150,
  },

  instructionsCard: {
    backgroundColor: isDark ? '#0D47A1' : '#E3F2FD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: isDark ? '#90CAF9' : '#1976D2',
    marginBottom: 12,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: isDark ? '#1565C0' : '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: isDark ? '#BBDEFB' : '#1565C0',
  },

  bottomPadding: {
    height: 40,
  },
});
