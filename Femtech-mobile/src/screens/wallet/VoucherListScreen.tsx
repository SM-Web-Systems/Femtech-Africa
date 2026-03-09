import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { redemptionsApi } from '../../api';
import { useTheme } from '../../store/ThemeContext';

interface Voucher {
  id: string;
  code: string;
  partner?: {
    id: string;
    name: string;
    category?: string;
  };
  product?: {
    id: string;
    name: string;
  };
  tokenAmount?: number;
  valueAmount?: number;
  value?: {
    amount: number;
    currency: string;
  };
  status: 'active' | 'redeemed' | 'expired' | string;
  expiresAt?: string;
  createdAt?: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: '#4CAF50',
  redeemed: '#9E9E9E',
  expired: '#F44336',
};

const PARTNER_ICONS: { [key: string]: string } = {
  'Shoprite': '🛒',
  'Checkers': '🛍️',
  'Clicks': '💊',
  'Dis-Chem': '💉',
  'Woolworths': '🏪',
  'Pick n Pay': '🛒',
  'Spar': '🏬',
  'default': '🎁',
};

export default function VoucherListScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'redeemed' | 'expired'>('all');
  const [lastFetch, setLastFetch] = useState(0);

  const styles = createStyles(colors, isDark);

  const getStatusColor = (status: string | undefined): string => {
    if (!status) return '#9E9E9E';
    return STATUS_COLORS[status] || '#9E9E9E';
  };

  const fetchVouchers = async (isRefresh = false) => {
    const now = Date.now();
    if (!isRefresh && now - lastFetch < 5000 && vouchers.length > 0) {
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (vouchers.length === 0) {
        setLoading(true);
      }

      const response = await redemptionsApi.getMyVouchers();
      setVouchers(response.vouchers || response || []);
      setLastFetch(now);
    } catch (error) {
      console.log('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVouchers();
    }, [])
  );

  const onRefresh = () => {
    fetchVouchers(true);
  };

  const getFilteredVouchers = () => {
    if (filter === 'all') return vouchers;
    return vouchers.filter(v => v.status === filter);
  };

  const getPartnerIcon = (partnerName: string) => {
    return PARTNER_ICONS[partnerName] || PARTNER_ICONS['default'];
  };

  const isExpiringSoon = (expiresAt: string | undefined) => {
  if (!expiresAt) return false;
  try {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  } catch {
    return false;
  }
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

  const renderVoucherItem = ({ item }: { item: Voucher }) => {
    // Safely get the value amount
    const getValueAmount = () => {
      if (item.valueAmount !== undefined && item.valueAmount !== null) {
        return typeof item.valueAmount === 'number' 
          ? item.valueAmount.toFixed(2) 
          : parseFloat(item.valueAmount).toFixed(2);
      }
      if (item.value?.amount !== undefined) {
        return typeof item.value.amount === 'number'
          ? item.value.amount.toFixed(2)
          : parseFloat(item.value.amount).toFixed(2);
      }
      // Fallback: calculate from token amount
      if (item.tokenAmount) {
        return (item.tokenAmount * 0.10).toFixed(2);
      }
      return '0.00';
    };

    return (
      <TouchableOpacity
        style={styles.voucherCard}
        onPress={() => navigation.navigate('VoucherDetail', { voucherId: item.id })}
      >
        <View style={styles.voucherHeader}>
          <View style={styles.partnerInfo}>
            <Text style={styles.partnerIcon}>{getPartnerIcon(item.partner?.name || '')}</Text>
            <View>
              <Text style={styles.partnerName}>{item.partner?.name || 'Unknown Partner'}</Text>
              <Text style={styles.productName}>
                {item.product?.name || item.partner?.category || 'Voucher'}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
            <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
              {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Unknown'}
            </Text>
          </View>
        </View>

        <View style={styles.voucherBody}>
          <View style={styles.valueContainer}>
            <Text style={styles.valueLabel}>Value</Text>
            <Text style={styles.valueAmount}>R{getValueAmount()}</Text>
          </View>
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Code</Text>
            <Text style={styles.codeValue}>{item.code || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.voucherFooter}>
          <Text style={styles.tokenInfo}>{item.tokenAmount || 0} MAMA tokens</Text>
          {item.status === 'active' && item.expiresAt && (
            <View style={styles.expiryContainer}>
              {isExpiringSoon(item.expiresAt) && (
                <Text style={styles.expiringSoon}>⚠️ </Text>
              )}
              <Text style={[
                styles.expiryText,
                isExpiringSoon(item.expiresAt) && styles.expiryWarning
              ]}>
                Expires {formatDate(item.expiresAt)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      {(['all', 'active', 'redeemed', 'expired'] as const).map((filterOption) => (
        <TouchableOpacity
          key={filterOption}
          style={[
            styles.filterTab,
            filter === filterOption && styles.filterTabActive,
          ]}
          onPress={() => setFilter(filterOption)}
        >
          <Text style={[
            styles.filterTabText,
            filter === filterOption && styles.filterTabTextActive,
          ]}>
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎫</Text>
      <Text style={styles.emptyTitle}>No vouchers yet</Text>
      <Text style={styles.emptySubtitle}>
        Redeem your MAMA tokens for vouchers from our partner stores
      </Text>
      <TouchableOpacity
        style={styles.redeemButton}
        onPress={() => navigation.navigate('Redeem')}
      >
        <Text style={styles.redeemButtonText}>Redeem Tokens</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Vouchers</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Vouchers</Text>
        <View style={{ width: 40 }} />
      </View>

      {renderFilterTabs()}

      <FlatList
        data={getFilteredVouchers()}
        renderItem={renderVoucherItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? colors.card : '#F0F0F0',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  voucherCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partnerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  productName: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  voucherBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  valueContainer: {
    flex: 1,
  },
  valueLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  valueAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  codeContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  codeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'monospace',
  },
  voucherFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  tokenInfo: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  expiryWarning: {
    color: '#FF9800',
    fontWeight: '500',
  },
  expiringSoon: {
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  redeemButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  redeemButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
