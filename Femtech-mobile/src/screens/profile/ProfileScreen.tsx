import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header } from '../../components/common';
import { COLORS, SPACING, FONTS, APP_CONFIG } from '../../constants';
import { useAuth, useWalletStore } from '../../store';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { balance } = useWalletStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Header title="Profile" />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Card */}
        <Card style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={COLORS.textOnPrimary} />
          </View>
          <Text style={styles.phone}>{user?.phone}</Text>
          <Text style={styles.country}>{user?.country}</Text>
          
          {balance?.walletAddress && (
            <View style={styles.walletInfo}>
              <Ionicons name="wallet-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.walletAddress} numberOfLines={1}>
                {balance.walletAddress.slice(0, 12)}...{balance.walletAddress.slice(-8)}
              </Text>
            </View>
          )}
        </Card>

        {/* Menu Sections */}
        <Text style={styles.sectionTitle}>Account</Text>
        <Card style={styles.menuCard}>
          <MenuItem icon="person-outline" label="Edit Profile" onPress={() => {}} />
          <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
          <MenuItem icon="shield-checkmark-outline" label="Privacy & Security" onPress={() => {}} />
        </Card>

        <Text style={styles.sectionTitle}>Pregnancy</Text>
        <Card style={styles.menuCard}>
          <MenuItem icon="calendar-outline" label="My Pregnancies" onPress={() => {}} />
          <MenuItem icon="medkit-outline" label="Medical History" onPress={() => {}} />
          <MenuItem icon="people-outline" label="Emergency Contacts" onPress={() => {}} />
        </Card>

        <Text style={styles.sectionTitle}>Support</Text>
        <Card style={styles.menuCard}>
          <MenuItem icon="help-circle-outline" label="Help Center" onPress={() => {}} />
          <MenuItem 
            icon="document-text-outline" 
            label="Terms of Service" 
            onPress={() => Linking.openURL(APP_CONFIG.TERMS_URL)} 
          />
          <MenuItem 
            icon="lock-closed-outline" 
            label="Privacy Policy" 
            onPress={() => Linking.openURL(APP_CONFIG.PRIVACY_URL)} 
          />
          <MenuItem 
            icon="mail-outline" 
            label="Contact Us" 
            onPress={() => Linking.openURL(`mailto:${APP_CONFIG.SUPPORT_EMAIL}`)} 
          />
        </Card>

        <Text style={styles.sectionTitle}>App</Text>
        <Card style={styles.menuCard}>
          <MenuItem icon="information-circle-outline" label={`Version ${APP_CONFIG.VERSION}`} disabled />
        </Card>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function MenuItem({ 
  icon, 
  label, 
  onPress,
  disabled 
}: { 
  icon: keyof typeof Ionicons.glyphMap; 
  label: string; 
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={icon} size={22} color={COLORS.textSecondary} />
      <Text style={styles.menuLabel}>{label}</Text>
      {!disabled && <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />}
    </TouchableOpacity>
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
  userCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  phone: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.text,
  },
  country: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 20,
  },
  walletAddress: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    gap: SPACING.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xl,
    padding: SPACING.md,
  },
  logoutText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.error,
  },
});
