// D:\SM-WEB\FEMTECH-AFRICA\Femtech-mobile\src\screens\profile\ProfileScreen.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { useLanguage } from '../../store/LanguageContext';
import { useAlert } from '../../hooks/useAlert';
import { profileApi } from '../../api';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { colors, isDark } = useTheme();
  const { getCurrentLanguage, t } = useLanguage();
  const { confirm } = useAlert();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const styles = createStyles(colors, isDark);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await profileApi.getProfile();
      setProfile(data);
    } catch (error) {
      console.log('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const handleLogout = () => {
    confirm(
      t('auth.logout'),
      t('auth.logoutConfirm'),
      async () => {
        await logout();
      }
    );
  };

  const menuItems = [
    {
      title: t('settings.account'),
      items: [
        {
          icon: '👤',
          label: t('settings.editProfile'),
          subtitle: t('settings.editProfileSubtitle'),
          onPress: () => navigation.navigate('EditProfile'),
        },
        {
          icon: '🔐',
          label: t('settings.security'),
          subtitle: t('settings.securitySubtitle'),
          onPress: () => navigation.navigate('Security'),
        },
        {
          icon: '🔔',
          label: t('settings.notifications'),
          subtitle: t('settings.notificationsSubtitle'),
          onPress: () => navigation.navigate('Notifications'),
        },
      ],
    },
    {
      title: t('settings.preferences'),
      items: [
        {
          icon: isDark ? '🌙' : '☀️',
          label: t('settings.appearance'),
          subtitle: isDark ? t('settings.darkMode') : t('settings.lightMode'),
          onPress: () => navigation.navigate('Appearance'),
        },
        {
          icon: '🌐',
          label: t('settings.language'),
          subtitle: getCurrentLanguage()?.native || 'English',
          onPress: () => navigation.navigate('Language'),
        },
      ],
    },
    {
      title: t('settings.support'),
      items: [
        {
          icon: '❓',
          label: t('settings.helpCenter'),
          subtitle: t('settings.helpCenterSubtitle'),
          onPress: () => navigation.navigate('HelpCenter'),
        },
        {
          icon: '💬',
          label: t('settings.contactUs'),
          subtitle: t('settings.contactUsSubtitle'),
          onPress: () => navigation.navigate('ContactUs'),
        },
      ],
    },
    {
      title: t('settings.legal'),
      items: [
        {
          icon: '📄',
          label: t('settings.terms'),
          subtitle: t('settings.termsSubtitle'),
          onPress: () => navigation.navigate('Terms'),
        },
        {
          icon: '🔒',
          label: t('settings.privacyPolicy'),
          subtitle: t('settings.privacySubtitle'),
          onPress: () => navigation.navigate('PrivacyPolicy'),
        },
      ],
    },
  ];

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('settings.title')}</Text>

        {/* Profile Header */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {getInitials(profile?.name || user?.name || '')}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profile?.name || user?.name || t('settings.setupProfile')}
            </Text>
            <Text style={styles.profilePhone}>{profile?.phone || user?.phone || ''}</Text>
            {profile?.email && (
              <Text style={styles.profileEmail}>{profile.email}</Text>
            )}
          </View>
          <Text style={styles.profileArrow}>›</Text>
        </TouchableOpacity>

        {/* Menu Sections */}
        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                    <View style={styles.menuContent}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    </View>
                    <Text style={styles.menuArrow}>›</Text>
                  </TouchableOpacity>
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.menuDivider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>{t('auth.logout')}</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>MamaTokens v1.0.0</Text>

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
  scroll: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  profilePhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileArrow: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  menuSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 54,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  bottomPadding: {
    height: 40,
  },
});
