import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../store/ThemeContext';
import { useAlert } from '../../hooks/useAlert';

export default function NotificationsScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const { success, alert } = useAlert();
  const styles = createStyles(colors, isDark);

  const [appointments, setAppointments] = useState(true);
  const [milestones, setMilestones] = useState(true);
  const [healthTips, setHealthTips] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const savePreferences = () => {
    // TODO: Save to backend
    success('Saved', 'Your notification preferences have been updated');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Push notifications require a development build. Local notifications work in Expo Go.
          </Text>
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Appointment Reminders</Text>
              <Text style={styles.settingDesc}>Get reminded about upcoming appointments</Text>
            </View>
            <Switch 
              value={appointments} 
              onValueChange={setAppointments} 
              trackColor={{ true: colors.primary, false: isDark ? '#555' : '#ccc' }} 
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Milestone Alerts</Text>
              <Text style={styles.settingDesc}>Celebrate your pregnancy milestones</Text>
            </View>
            <Switch 
              value={milestones} 
              onValueChange={setMilestones} 
              trackColor={{ true: colors.primary, false: isDark ? '#555' : '#ccc' }} 
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Health Tips</Text>
              <Text style={styles.settingDesc}>Daily tips for a healthy pregnancy</Text>
            </View>
            <Switch 
              value={healthTips} 
              onValueChange={setHealthTips} 
              trackColor={{ true: colors.primary, false: isDark ? '#555' : '#ccc' }} 
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Promotions</Text>
              <Text style={styles.settingDesc}>Partner offers and discounts</Text>
            </View>
            <Switch 
              value={promotions} 
              onValueChange={setPromotions} 
              trackColor={{ true: colors.primary, false: isDark ? '#555' : '#ccc' }} 
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { 
    padding: 8 
  },
  backButtonText: { 
    fontSize: 24, 
    color: colors.primary 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.text 
  },
  scroll: { 
    flex: 1, 
    padding: 20 
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1A237E' : '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: isDark ? '#90CAF9' : '#1565C0',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: colors.text 
  },
  settingDesc: { 
    fontSize: 13, 
    color: colors.textSecondary, 
    marginTop: 4 
  },
  divider: { 
    height: 1, 
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
