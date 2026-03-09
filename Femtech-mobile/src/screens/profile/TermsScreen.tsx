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

export default function TermsScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: March 2026</Text>

          <Text style={styles.heading}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using the MamaTokens application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </Text>

          <Text style={styles.heading}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            MamaTokens is a maternal health incentive platform that rewards users with digital tokens for completing health milestones during pregnancy. These tokens can be redeemed for goods and services from our partner network.
          </Text>

          <Text style={styles.heading}>3. User Eligibility</Text>
          <Text style={styles.paragraph}>
            To use MamaTokens, you must be at least 18 years old and a resident of a country where our services are available. You must provide accurate and complete information during registration.
          </Text>

          <Text style={styles.heading}>4. Account Responsibilities</Text>
          <Text style={styles.paragraph}>
            You are responsible for maintaining the confidentiality of your account credentials, including your wallet secret key. You are responsible for all activities that occur under your account.
          </Text>

          <Text style={styles.heading}>5. Token Usage</Text>
          <Text style={styles.paragraph}>
            MAMA tokens are digital rewards with no cash value. They can only be redeemed through the MamaTokens platform at participating partners. Tokens cannot be transferred, sold, or exchanged for cash.
          </Text>

          <Text style={styles.heading}>6. Wallet Security</Text>
          <Text style={styles.paragraph}>
            Your Stellar wallet secret key is provided once during wallet creation. MamaTokens does not store your secret key and cannot recover it if lost. You are solely responsible for backing up your secret key.
          </Text>

          <Text style={styles.heading}>7. Prohibited Activities</Text>
          <Text style={styles.paragraph}>
            Users may not: create fake accounts, manipulate milestone completions, attempt to defraud the system, share accounts, or engage in any activity that violates applicable laws.
          </Text>

          <Text style={styles.heading}>8. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            MamaTokens is provided "as is" without warranties. We are not liable for any loss of tokens, wallet access issues, or damages arising from the use of our services.
          </Text>

          <Text style={styles.heading}>9. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
          </Text>

          <Text style={styles.heading}>10. Contact</Text>
          <Text style={styles.paragraph}>
            For questions about these terms, contact us at legal@mamatokens.com.
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
