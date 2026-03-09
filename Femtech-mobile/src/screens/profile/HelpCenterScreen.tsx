import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../store/ThemeContext';

const faqs = [
  {
    question: 'How do I earn MAMA tokens?',
    answer: 'You earn MAMA tokens by completing health milestones such as attending prenatal appointments, completing health quizzes, and achieving pregnancy milestones. Each completed milestone rewards you with tokens.',
  },
  {
    question: 'How can I redeem my tokens?',
    answer: 'Go to the Wallet tab and tap "Redeem Tokens". Select a partner, enter the amount you want to redeem, and confirm. You\'ll receive a digital voucher that you can use at partner stores.',
  },
  {
    question: 'What is a Stellar wallet?',
    answer: 'MAMA tokens are built on the Stellar blockchain. Your Stellar wallet stores your tokens securely. When you create a wallet, you receive a secret key - keep this safe as it\'s the only way to recover your wallet.',
  },
  {
    question: 'How do I backup my wallet?',
    answer: 'When you create your wallet, you\'ll be shown a secret key. Write this down and store it in a safe place. Never share this key with anyone. If you lose access to the app, you can import your wallet using this key.',
  },
  {
    question: 'Can I transfer tokens to someone else?',
    answer: 'Currently, tokens can only be redeemed for vouchers at partner stores. Peer-to-peer transfers may be available in future updates.',
  },
  {
    question: 'How long are vouchers valid?',
    answer: 'Vouchers are valid for 30 days from the date of creation. You can view the expiry date on each voucher in the "My Vouchers" section.',
  },
];

export default function HelpCenterScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors, isDark);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@mamatokens.com');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/27662445880');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={handleContactSupport}>
            <Text style={styles.quickActionIcon}>📧</Text>
            <Text style={styles.quickActionText}>Email Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleWhatsApp}>
            <Text style={styles.quickActionIcon}>💬</Text>
            <Text style={styles.quickActionText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <View key={index}>
              <TouchableOpacity
                style={[
                  styles.faqItem,
                  expandedIndex === index && styles.faqItemExpanded
                ]}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqArrow}>
                  {expandedIndex === index ? '−' : '+'}
                </Text>
              </TouchableOpacity>
              {expandedIndex === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
              {index < faqs.length - 1 && <View style={styles.faqDivider} />}
            </View>
          ))}
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
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
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
  faqContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  faqItemExpanded: {
    backgroundColor: isDark ? 'rgba(233, 30, 99, 0.1)' : 'rgba(233, 30, 99, 0.05)',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 22,
  },
  faqArrow: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '300',
    marginLeft: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: isDark ? 'rgba(233, 30, 99, 0.05)' : 'rgba(233, 30, 99, 0.03)',
  },
  faqAnswerText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  faqDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
