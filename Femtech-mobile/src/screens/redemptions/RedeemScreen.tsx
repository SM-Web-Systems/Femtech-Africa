import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, Header, Button } from '../../components/common';
import { COLORS, SPACING, FONTS } from '../../constants';
import { redemptionsApi, Partner, Product } from '../../api';
import { useWalletStore } from '../../store';

export default function RedeemScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { balance, getSecretKey, fetchBalance } = useWalletStore();
  
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [cart, setCart] = useState<Map<string, number>>(new Map());

  const { data: partnersData } = useQuery({
    queryKey: ['partners'],
    queryFn: () => redemptionsApi.getPartners(),
  });

  const { data: productsData } = useQuery({
    queryKey: ['products', selectedPartner?.id],
    queryFn: () => redemptionsApi.getProducts(selectedPartner?.id),
    enabled: !!selectedPartner,
  });

  const redeemMutation = useMutation({
    mutationFn: async (params: any) => {
      const secretKey = await getSecretKey();
      if (!secretKey) throw new Error('Wallet secret key not found');
      return redemptionsApi.createRedemption({ ...params, userSecretKey: secretKey });
    },
    onSuccess: (data) => {
      Alert.alert(
        'Redemption Successful!',
        `Your voucher codes:\n${data.data.items.map((i: any) => i.voucherCode).join('\n')}`,
        [{ text: 'OK', onPress: () => {
          fetchBalance();
          navigation.navigate('Redemptions');
        }}]
      );
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message);
    },
  });

  const partners = partnersData?.data || [];
  const products = productsData?.data || [];
  const mamaBalance = parseFloat(balance?.mamaBalance || '0');

  const cartTotal = Array.from(cart.entries()).reduce((sum, [productId, qty]) => {
    const product = products.find(p => p.id === productId);
    return sum + (product?.tokenCost || 0) * qty;
  }, 0);

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentQty = cart.get(productId) || 0;
    const newTotal = cartTotal + product.tokenCost;
    
    if (newTotal > mamaBalance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough MAMA tokens');
      return;
    }
    
    setCart(new Map(cart.set(productId, currentQty + 1)));
  };

  const removeFromCart = (productId: string) => {
    const currentQty = cart.get(productId) || 0;
    if (currentQty <= 1) {
      cart.delete(productId);
      setCart(new Map(cart));
    } else {
      setCart(new Map(cart.set(productId, currentQty - 1)));
    }
  };

  const handleRedeem = () => {
    if (cart.size === 0) {
      Alert.alert('Empty Cart', 'Please select products to redeem');
      return;
    }

    const products = Array.from(cart.entries()).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

    Alert.alert(
      'Confirm Redemption',
      `You are about to spend ${cartTotal} MAMA tokens. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => redeemMutation.mutate({
            partnerId: selectedPartner!.id,
            products,
            recipientPhone: '', // Will use user's phone
          })
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Header title="Redeem Tokens" showBack onBack={() => navigation.goBack()} />
      
      {/* Balance Bar */}
      <View style={styles.balanceBar}>
        <Text style={styles.balanceLabel}>Available:</Text>
        <Text style={styles.balanceValue}>{mamaBalance.toFixed(0)} MAMA</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!selectedPartner ? (
          <>
            <Text style={styles.sectionTitle}>Select Partner</Text>
            {partners.map((partner) => (
              <TouchableOpacity
                key={partner.id}
                onPress={() => setSelectedPartner(partner)}
              >
                <Card style={styles.partnerCard}>
                  <View style={styles.partnerIcon}>
                    <Ionicons name="business" size={32} color={COLORS.primary} />
                  </View>
                  <View style={styles.partnerInfo}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <Text style={styles.partnerType}>{partner.type.replace('_', ' ')}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
                </Card>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.backToPartners} onPress={() => {
              setSelectedPartner(null);
              setCart(new Map());
            }}>
              <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
              <Text style={styles.backText}>Change Partner</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>{selectedPartner.name} Products</Text>
            
            {products.filter(p => p.is_available).map((product) => {
              const qty = cart.get(product.id) || 0;
              const canAfford = product.tokenCost <= (mamaBalance - cartTotal + (qty * product.tokenCost));
              
              return (
                <Card key={product.id} style={[styles.productCard, !canAfford && qty === 0 && styles.productDisabled]}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productDescription} numberOfLines={2}>
                      {product.description}
                    </Text>
                    <Text style={styles.productCost}>{product.tokenCost} MAMA</Text>
                  </View>
                  
                  <View style={styles.qtyControls}>
                    {qty > 0 ? (
                      <>
                        <TouchableOpacity 
                          style={styles.qtyButton} 
                          onPress={() => removeFromCart(product.id)}
                        >
                          <Ionicons name="remove" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{qty}</Text>
                        <TouchableOpacity 
                          style={styles.qtyButton} 
                          onPress={() => addToCart(product.id)}
                        >
                          <Ionicons name="add" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity 
                        style={[styles.addButton, !canAfford && styles.addButtonDisabled]} 
                        onPress={() => addToCart(product.id)}
                        disabled={!canAfford}
                      >
                        <Text style={styles.addButtonText}>Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Card>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Cart Footer */}
      {cart.size > 0 && (
        <View style={styles.cartFooter}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartLabel}>Total</Text>
            <Text style={styles.cartTotal}>{cartTotal} MAMA</Text>
          </View>
          <Button
            title="Redeem Now"
            onPress={handleRedeem}
            loading={redeemMutation.isPending}
            style={styles.redeemButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  balanceBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    gap: SPACING.xs,
  },
  balanceLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
  },
  balanceValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  partnerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  partnerName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  partnerType: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  backToPartners: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  backText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '500',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  productDisabled: {
    opacity: 0.5,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  productDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  productCost: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    minWidth: 24,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  addButtonText: {
    color: COLORS.textOnPrimary,
    fontWeight: '600',
  },
  cartFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cartInfo: {
    flex: 1,
  },
  cartLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  cartTotal: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  redeemButton: {
    minWidth: 140,
  },
});
