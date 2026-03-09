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

export default function PrivacyPolicyScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: March 2026</Text>

          <Text style={styles.heading}>Introduction</Text>
          <Text style={styles.paragraph}>
            MamaTokens ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our mobile application.
          </Text>

          <Text style={styles.heading}>Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect the following types of information:{'\n\n'}
            • Phone number (for authentication){'\n'}
            • Name and profile information{'\n'}
            • Health milestone data{'\n'}
            • Wallet addresses and transaction history{'\n'}
            • Device information and usage data
          </Text>

          <Text style={styles.heading}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use your information to:{'\n\n'}
            • Provide and improve our services{'\n'}
            • Process token rewards and redemptions{'\n'}
            • Send notifications about appointments and milestones{'\n'}
            • Analyze usage patterns to improve the app{'\n'}
            • Comply with legal obligations
          </Text>

          <Text style={styles.heading}>Data Security</Text>
          <Text style={styles.paragraph}>
            We implement industry-standard security measures to protect your data. Your wallet secret key is encrypted and stored securely. However, no method of transmission over the internet is 100% secure.
          </Text>

          <Text style={styles.heading}>Data Sharing</Text>
          <Text style={styles.paragraph}>
            We do not sell your personal information. We may share data with:{'\n\n'}
            • Healthcare providers (with your consent){'\n'}
            • Partner merchants (for redemptions){'\n'}
            • Service providers who help operate our platform{'\n'}
            • Law enforcement when legally required
          </Text>

          <Text style={styles.heading}>Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:{'\n\n'}
            • Access your personal data{'\n'}
            • Correct inaccurate information{'\n'}
            • Delete your account and data{'\n'}
            • Opt-out of marketing communications{'\n'}
            • Export your data
          </Text>

          <Text style={styles.heading}>Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your data for as long as your account is active or as needed to provide services. Transaction records on the blockchain are permanent and cannot be deleted.
          </Text>

          <Text style={styles.heading}>Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our services are not intended for children under 18. We do not knowingly collect information from children under 18.
          </Text>

          <Text style={styles.heading}>Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this policy from time to time. We will notify you of significant changes through the app or email.
          </Text>

          <Text style={styles.heading}>Contact Us</Text>
          <Text style={styles.paragraph}>
            For privacy-related questions, contact us at:{'\n\n'}
            Email: privacy@mamatokens.com{'\n'}
            Address: Cape Town, South Africa
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
  },
  content: {
    padding: 20,
    backgroundColor: colors.card,
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bottomPadding: {
    height: 40,
  },
});
