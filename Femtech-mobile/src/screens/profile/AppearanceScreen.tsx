import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../store/ThemeContext';

export default function AppearanceScreen({ navigation }: any) {
  const { theme, setTheme, isDark, colors } = useTheme();

  const styles = createStyles(colors, isDark);

  const themeOptions = [
    {
      id: 'light',
      label: 'Light',
      icon: '☀️',
      description: 'Always use light mode',
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: '🌙',
      description: 'Always use dark mode',
    },
    {
      id: 'system',
      label: 'System',
      icon: '📱',
      description: 'Follow system settings',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.card}>
          {themeOptions.map((option, index) => (
            <View key={option.id}>
              <TouchableOpacity
                style={[
                  styles.optionRow,
                  theme === option.id && styles.optionRowSelected
                ]}
                onPress={() => setTheme(option.id as 'light' | 'dark' | 'system')}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <View style={[styles.radio, theme === option.id && styles.radioSelected]}>
                  {theme === option.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
              {index < themeOptions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Preview */}
        <Text style={styles.sectionTitle}>Preview</Text>
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={styles.previewAvatar}>
              <Text style={styles.previewAvatarText}>MT</Text>
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewTitle}>MamaTokens</Text>
              <Text style={styles.previewSubtitle}>Current theme: {isDark ? 'Dark' : 'Light'}</Text>
            </View>
          </View>
          <View style={styles.previewBalance}>
            <Text style={styles.previewBalanceLabel}>Balance</Text>
            <Text style={styles.previewBalanceValue}>100.00 MAMA</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Dark mode reduces eye strain in low-light conditions and can help save battery on OLED screens.
          </Text>
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionRowSelected: {
    backgroundColor: isDark ? 'rgba(233, 30, 99, 0.15)' : 'rgba(233, 30, 99, 0.08)',
  },
  optionIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  optionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: isDark ? '#555555' : colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 58,
  },
  previewCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  previewSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  previewBalance: {
    backgroundColor: isDark ? colors.surface : colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  previewBalanceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  previewBalanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 4,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1A237E' : '#E3F2FD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
  bottomPadding: {
    height: 40,
  },
});
