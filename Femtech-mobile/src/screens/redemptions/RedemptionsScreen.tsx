import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Card, Header, Button } from '../../components/common';
import { COLORS, SPACING, FONTS, STELLAR_CONFIG } from '../../constants';
import { redemptionsApi, Redemption } from '../../api';

export default function RedemptionsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['userRedemptions'],
    queryFn: () => redemptionsApi.getUserRedemptions(),
  });

  const redemptions = data?.data || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Redemption History" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {redemptions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="gift-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No redemptions yet</Text>
            <Text style={styles.emptySubtext}>Redeem your tokens for rewards</Text>
            <Button
              title="Browse Rewards"
              onPress={() => navigation.navigate('Redeem')}
              style={styles.browseButton}
            />
          </Card>
        ) : (
          redemptions.map((redemption) => (
            <RedemptionCard key={redemption.id} redemption={redemption} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function RedemptionCard({ redemption }: { redemption: Redemption }) {
  const getStatusColor = () => {
    switch (redemption.status) {
      case 'completed': return COLORS.success;
      case 'pending': case 'processing': return COLORS.warning;
      case 'failed': case 'cancelled': return COLORS.error;
      default: return COLORS.textLight;
    }
  };

  const openTx = () => {
    if (redemption.burn_tx_hash) {
      Linking.openURL(`${STELLAR_CONFIG.EXPLORER_URL}/tx/${redemption.burn_tx_hash}`);
    }
  };

  return (
    <Card style={styles.redemptionCard}>
      <View style={styles.cardHeader}>
        <View style={styles.partnerInfo}>
          <Text style={styles.partnerName}>{redemption.partners?.name || 'Partner'}</Text>
          <Text style={styles.redemptionDate}>
            {new Date(redemption.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {redemption.status}
          </Text>
        </View>
      </View>

      <View style={styles.itemsList}>
        {redemption.items?.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.product?.name}</Text>
            <Text style={styles.itemCost}>{item.tokenCost} MAMA</Text>
          </View>
        ))}
      </View>

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{redemption.totalTokens} MAMA</Text>
        </View>
        {redemption.burn_tx_hash && (
          <Button
            title="View TX"
            variant="outline"
            size="small"
            onPress={openTx}
          />
        )}
      </View>

      {redemption.items?.some(item => item.voucherCode) && (
        <View style={styles.voucherSection}>
          <Text style={styles.voucherLabel}>Voucher Codes:</Text>
          {redemption.items.filter(item => item.voucherCode).map((item) => (
            <View key={item.id} style={styles.voucherRow}>
              <Text style={styles.voucherCode}>{item.voucherCode}</Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  browseButton: {
    marginTop: SPACING.lg,
  },
  redemptionCard: {
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  redemptionDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  itemsList: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.sm,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  itemName: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  itemCost: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  totalLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  totalAmount: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  voucherSection: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.success + '10',
    borderRadius: 8,
  },
  voucherLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.success,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  voucherRow: {
    marginTop: SPACING.xs,
  },
  voucherCode: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'monospace',
  },
});
