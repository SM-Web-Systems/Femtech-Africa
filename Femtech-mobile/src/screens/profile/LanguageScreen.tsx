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
import { useLanguage } from '../../store/LanguageContext';
import { useAlert } from '../../hooks/useAlert';

export default function LanguageScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const { language, languages, setLanguage, t } = useLanguage();
  const { alert, error } = useAlert();

  const styles = createStyles(colors, isDark);

  const handleSelectLanguage = async (langCode: string) => {
    if (langCode === language) return;

    try {
      await setLanguage(langCode as 'en' | 'fr' | 'sw' | 'zu');
      
      const langName = languages.find(l => l.code === langCode)?.native || langCode;
      
      alert(
        t('settings.language_changed') || 'Language Changed',
        `${t('settings.language_changed_to') || 'Language changed to'} ${langName}`,
        [{ text: t('common.ok') || 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.log('Error changing language:', err);
      error(
        t('common.error') || 'Error',
        t('settings.language_change_failed') || 'Failed to change language'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.language') || 'Language'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll}>
        <Text style={styles.sectionTitle}>
          {t('settings.select_language') || 'Select Language'}
        </Text>
        
        <View style={styles.card}>
          {languages.map((lang, index) => (
            <View key={lang.code}>
              <TouchableOpacity
                style={[
                  styles.languageRow,
                  language === lang.code && styles.languageRowSelected
                ]}
                onPress={() => handleSelectLanguage(lang.code)}
                activeOpacity={0.7}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageNative}>{lang.native}</Text>
                  <Text style={styles.languageName}>{lang.name}</Text>
                </View>
                <View style={[
                  styles.radio,
                  language === lang.code && styles.radioSelected
                ]}>
                  {language === lang.code && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
              {index < languages.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            {t('settings.language_info') || 'Changing the language will update all text in the app. Some content may still appear in English if translations are not available.'}
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
    backgroundColor: colors.card,
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
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  languageRowSelected: {
    backgroundColor: isDark ? 'rgba(233, 30, 99, 0.15)' : 'rgba(233, 30, 99, 0.08)',
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageNative: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  languageName: {
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
    marginLeft: 64,
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
