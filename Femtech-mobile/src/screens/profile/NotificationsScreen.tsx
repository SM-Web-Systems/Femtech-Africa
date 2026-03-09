import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../store/ThemeContext';

export default function NotificationsScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors, isDark);

  const [settings, setSettings] = useState({
    pushEnabled: true,
    appointments: true,
    milestones: true,
    rewards: true,
    promotions: false,
    smsEnabled: true,
    emailEnabled: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
    // TODO: Save to API
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll}>
        {/* Push Notifications */}
        <Text style={styles.sectionTitle}>Push Notifications</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Push Notifications</Text>
              <Text style={styles.settingSubtitle}>Receive notifications on your device</Text>
            </View>
            <Switch
              value={settings.pushEnabled}
              onValueChange={() => toggleSetting('pushEnabled')}
              trackColor={{ false: isDark ? '#555555' : '#E0E0E0', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {settings.pushEnabled && (
            <>
              <View style={styles.divider} />
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Appointment Reminders</Text>
                  <Text style={styles.settingSubtitle}>Get reminded about upcoming appointments</Text>
                </View>
                <Switch
                  value={settings.appointments}
                  onValueChange={() => toggleSetting('appointments')}
                  trackColor={{ false: isDark ? '#555555' : '#E0E0E0', true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.divider} />
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Milestone Updates</Text>
                  <Text style={styles.settingSubtitle}>Notifications about your health milestones</Text>
                </View>
                <Switch
                  value={settings.milestones}
                  onValueChange={() => toggleSetting('milestones')}
                  trackColor={{ false: isDark ? '#555555' : '#E0E0E0', true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.divider} />
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Rewards & Tokens</Text>
                  <Text style={styles.settingSubtitle}>Get notified when you earn tokens</Text>
                </View>
                <Switch
                  value={settings.rewards}
                  onValueChange={() => toggleSetting('rewards')}
                  trackColor={{ false: isDark ? '#555555' : '#E0E0E0', true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.divider} />
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Promotions & Offers</Text>
                  <Text style={styles.settingSubtitle}>Special offers from our partners</Text>
                </View>
                <Switch
                  value={settings.promotions}
                  onValueChange={() => toggleSetting('promotions')}
                  trackColor={{ false: isDark ? '#555555' : '#E0E0E0', true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </>
          )}
        </View>

        {/* Other Notifications */}
        <Text style={styles.sectionTitle}>Other Channels</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>SMS Notifications</Text>
              <Text style={styles.settingSubtitle}>Receive important updates via SMS</Text>
            </View>
            <Switch
              value={settings.smsEnabled}
              onValueChange={() => toggleSetting('smsEnabled')}
              trackColor={{ false: isDark ? '#555555' : '#E0E0E0', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Email Notifications</Text>
              <Text style={styles.settingSubtitle}>Receive updates via email</Text>
            </View>
            <Switch
              value={settings.emailEnabled}
              onValueChange={() => toggleSetting('emailEnabled')}
              trackColor={{ false: isDark ? '#555555' : '#E0E0E0', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  scroll: {
    flex: 1,
    padding: 20,
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
