import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
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

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: '#E8F5E9', text: '#4CAF50' },
  used: { bg: '#E3F2FD', text: '#1976D2' },
  expired: { bg: '#FFEBEE', text: '#F44336' },
  cancelled: { bg: '#F5F5F5', text: '#9E9E9E' },
};

const PARTNER_ICONS: Record<string, string> = {
  retail: '🛒',
  transport: '🚗',
  healthcare: '💊',
  mobile_money: '📱',
  nutrition: '🥗',
};

interface Voucher {
  id: string;
  code: string;
  tokensBurned: number;
  value: { amount: number; currency: string };
  partner: { name: string; logoUrl: string; type: string } | null;
  product: { name: string; imageUrl: string } | null;
  status: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
}

export default function VoucherListScreen({ navigation }: any) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const lastFetchTime = useRef<number>(0);
  const hasFetchedOnce = useRef<boolean>(false);
  const MIN_FETCH_INTERVAL = 5000;

  const fetchVouchers = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && hasFetchedOnce.current && now - lastFetchTime.current < MIN_FETCH_INTERVAL) {
      setLoading(false);
      return;
    }

    lastFetchTime.current = now;
    hasFetchedOnce.current = true;

    try {
      const data = await redemptionsApi.getMyVouchers(filter || undefined);
      setVouchers(data);
    } catch (error) {
      console.error('Failed to fetch vouchers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      fetchVouchers(false);
    }, [fetchVouchers])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchVouchers(true);
  };

  const handleFilterChange = (newFilter: string | null) => {
    setFilter(newFilter);
    hasFetchedOnce.current = false;
    setLoading(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filters = [
    { key: null, label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'used', label: 'Used' },
    { key: 'expired', label: 'Expired' },
  ];

  if (loading && !hasFetchedOnce.current) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading vouchers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Vouchers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Redeem')}>
          <Text style={styles.addButton}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key || 'all'}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => handleFilterChange(f.key)}
          >
            <Text style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {vouchers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎫</Text>
            <Text style={styles.emptyTitle}>No Vouchers Yet</Text>
            <Text style={styles.emptyText}>Redeem your MAMA tokens to get vouchers</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Redeem')}
            >
              <Text style={styles.emptyButtonText}>Redeem Tokens</Text>
            </TouchableOpacity>
          </View>
        ) : (
          vouchers.map((voucher) => {
            const statusStyle = STATUS_COLORS[voucher.status] || STATUS_COLORS.active;
            const daysRemaining = getDaysRemaining(voucher.expiresAt);
            const isExpiringSoon = voucher.status === 'active' && daysRemaining <= 7 && daysRemaining > 0;

            return (
              <TouchableOpacity
                key={voucher.id}
                style={styles.voucherCard}
                onPress={() => navigation.navigate('VoucherDetail', { voucherId: voucher.id })}
              >
                <View style={styles.voucherHeader}>
                  <View style={styles.partnerInfo}>
                    <Text style={styles.partnerIcon}>
                      {PARTNER_ICONS[voucher.partner?.type || 'retail'] || '🎫'}
                    </Text>
                    <View>
                      <Text style={styles.partnerName}>{voucher.partner?.name || 'Partner'}</Text>
                      {voucher.product && (
                        <Text style={styles.productName}>{voucher.product.name}</Text>
                      )}
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {voucher.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.voucherBody}>
                  <View style={styles.valueContainer}>
                    <Text style={styles.valueLabel}>Value</Text>
                    <Text style={styles.valueAmount}>
                      {voucher.value.currency} {voucher.value.amount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>Code</Text>
                    <Text style={styles.codeValue}>{voucher.code}</Text>
                  </View>
                </View>

                <View style={styles.voucherFooter}>
                  {voucher.status === 'active' && (
                    <View style={styles.expiryInfo}>
                      {isExpiringSoon ? (
                        <Text style={styles.expiryWarning}>⚠️ Expires in {daysRemaining} days</Text>
                      ) : (
                        <Text style={styles.expiryText}>Expires: {formatDate(voucher.expiresAt)}</Text>
                      )}
                    </View>
                  )}
                  {voucher.status === 'used' && voucher.usedAt && (
                    <Text style={styles.usedText}>Used on {formatDate(voucher.usedAt)}</Text>
                  )}
                  <Text style={styles.viewButton}>View Details →</Text>
                </View>
              </TouchableOpacity>
            );
          })
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

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  backButton: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  addButton: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },

  filterScroll: { maxHeight: 50, marginBottom: 8 },
  filterContainer: { paddingHorizontal: 12 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.white, borderRadius: 20, marginHorizontal: 4 },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterChipText: { fontSize: 14, color: COLORS.textSecondary },
  filterChipTextActive: { color: COLORS.white, fontWeight: '600' },

  content: { flex: 1, padding: 16 },

  voucherCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },

  voucherHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  partnerInfo: { flexDirection: 'row', alignItems: 'center' },
  partnerIcon: { fontSize: 32, marginRight: 12 },
  partnerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  productName: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: 'bold' },

  voucherBody: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  valueContainer: { alignItems: 'flex-start' },
  valueLabel: { fontSize: 12, color: COLORS.textSecondary },
  valueAmount: { fontSize: 24, fontWeight: 'bold', color: COLORS.success, marginTop: 4 },
  codeContainer: { alignItems: 'flex-end' },
  codeLabel: { fontSize: 12, color: COLORS.textSecondary },
  codeValue: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginTop: 4, fontFamily: 'monospace' },

  voucherFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  expiryInfo: { flex: 1 },
  expiryText: { fontSize: 13, color: COLORS.textSecondary },
  expiryWarning: { fontSize: 13, color: COLORS.warning, fontWeight: '600' },
  usedText: { fontSize: 13, color: COLORS.textSecondary },
  viewButton: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },

  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8, textAlign: 'center' },
  emptyButton: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, marginTop: 24 },
  emptyButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },

  bottomPadding: { height: 20 },
});
