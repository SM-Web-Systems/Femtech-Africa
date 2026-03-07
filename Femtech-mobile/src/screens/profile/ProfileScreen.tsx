import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../store/AuthContext';

const COLORS = {
  primary: '#E91E63',
  background: '#FFF5F8',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  card: '#FFFFFF',
  error: '#F44336',
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();

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

  const menuItems = [
    { icon: '👤', label: 'Edit Profile', onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon!') },
    { icon: '🔔', label: 'Notifications', onPress: () => {} },
    { icon: '🔒', label: 'Privacy & Security', onPress: () => {} },
    { icon: '❓', label: 'Help Center', onPress: () => {} },
    { icon: '📄', label: 'Terms of Service', onPress: () => Linking.openURL('https://mamatokens.com/terms') },
    { icon: '🔐', label: 'Privacy Policy', onPress: () => Linking.openURL('https://mamatokens.com/privacy') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Profile</Text>
        
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.phone}>{user?.phone || 'No phone'}</Text>
            <Text style={styles.country}>{user?.country || 'ZA'}</Text>
          </View>
        </View>
        
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={item.onPress}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <Text style={styles.version}>MamaTokens v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  profileCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  profileInfo: { flex: 1 },
  phone: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  country: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  menuCard: { backgroundColor: COLORS.card, borderRadius: 16, marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuIcon: { fontSize: 20, marginRight: 16 },
  menuLabel: { flex: 1, fontSize: 16, color: COLORS.text },
  menuArrow: { fontSize: 20, color: COLORS.textSecondary },
  logoutButton: { backgroundColor: COLORS.error, borderRadius: 12, padding: 16, alignItems: 'center' },
  logoutText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  version: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 20, fontSize: 14 },
});
