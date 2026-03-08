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
  const { user, logout, eraseProfile, biometricType, biometricAvailable } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'You will need to use biometrics to login again.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout },
      ]
    );
  };

  const handleEraseProfile = () => {
    Alert.alert(
      'Erase Profile',
      'This will permanently delete your profile from this device. You will need to register again with OTP. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Erase', 
          style: 'destructive', 
          onPress: eraseProfile 
        },
      ]
    );
  };

  const menuItems = [
    { icon: '👤', label: 'Edit Profile', onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon!') },
    { icon: '🔔', label: 'Notifications', onPress: () => {} },
    { icon: '❓', label: 'Help Center', onPress: () => {} },
    { icon: '📄', label: 'Terms of Service', onPress: () => Linking.openURL('https://mamatokens.com/terms') },
    { icon: '🔏', label: 'Privacy Policy', onPress: () => Linking.openURL('https://mamatokens.com/privacy') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.phone ? user.phone.slice(-2) : 'M'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.phone}>{user?.phone || 'No phone'}</Text>
            <Text style={styles.country}>{user?.country || 'ZA'}</Text>
          </View>
        </View>

        {/* Security Info */}
        <View style={styles.securityCard}>
          <Text style={styles.securityIcon}>
            {biometricType === 'Face ID' ? '👤' : '👆'}
          </Text>
          <View style={styles.securityInfo}>
            <Text style={styles.securityTitle}>{biometricType} Protected</Text>
            <Text style={styles.securitySubtitle}>
              Your account is secured with {biometricType}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
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

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Erase Profile Button */}
        <TouchableOpacity style={styles.eraseButton} onPress={handleEraseProfile}>
          <Text style={styles.eraseText}>Erase Profile</Text>
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
  
  profileCard: { 
    backgroundColor: COLORS.card, 
    borderRadius: 16, 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  profileInfo: { flex: 1 },
  phone: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  country: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  
  securityCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  securityIcon: { fontSize: 28, marginRight: 16 },
  securityInfo: { flex: 1 },
  securityTitle: { fontSize: 16, fontWeight: '600', color: '#2E7D32' },
  securitySubtitle: { fontSize: 13, color: '#558B2F', marginTop: 2 },
  
  menuCard: { 
    backgroundColor: COLORS.card, 
    borderRadius: 16, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuIcon: { fontSize: 20, marginRight: 16, width: 28 },
  menuLabel: { flex: 1, fontSize: 16, color: COLORS.text },
  menuArrow: { fontSize: 20, color: COLORS.textSecondary },
  
  logoutButton: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  
  eraseButton: { 
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.error, 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center' 
  },
  eraseText: { color: COLORS.error, fontSize: 16, fontWeight: 'bold' },
  
  version: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 20, marginBottom: 40, fontSize: 14 },
});
