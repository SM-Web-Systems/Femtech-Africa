import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../store/ThemeContext';

export default function ContactUsScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors, isDark);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSending(true);
    // TODO: Send to API
    setTimeout(() => {
      setSending(false);
      Alert.alert(
        'Message Sent',
        'Thank you for contacting us. We\'ll get back to you within 24 hours.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  const contactMethods = [
    {
      icon: '📧',
      label: 'Email',
      value: 'support@mamatokens.com',
      onPress: () => Linking.openURL('mailto:support@mamatokens.com'),
    },
    {
      icon: '💬',
      label: 'WhatsApp',
      value: '+27 66 244 5880',
      onPress: () => Linking.openURL('https://wa.me/27662445880'),
    },
    {
      icon: '📞',
      label: 'Phone',
      value: '+27 66 244 5880',
      onPress: () => Linking.openURL('tel:+27662445880'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll}>
        {/* Contact Methods */}
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        <View style={styles.card}>
          {contactMethods.map((method, index) => (
            <View key={index}>
              <TouchableOpacity style={styles.contactRow} onPress={method.onPress}>
                <Text style={styles.contactIcon}>{method.icon}</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>{method.label}</Text>
                  <Text style={styles.contactValue}>{method.value}</Text>
                </View>
                <Text style={styles.contactArrow}>›</Text>
              </TouchableOpacity>
              {index < contactMethods.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Contact Form */}
        <Text style={styles.sectionTitle}>Send a Message</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="What's this about?"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholder="Tell us how we can help..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={5}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, sending && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={sending}
          >
            {sending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Send Message</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Office Info */}
        <Text style={styles.sectionTitle}>Our Office</Text>
        <View style={styles.card}>
          <View style={styles.officeInfo}>
            <Text style={styles.officeName}>MamaTokens HQ</Text>
            <Text style={styles.officeAddress}>Cape Town, South Africa</Text>
            <Text style={styles.officeHours}>Mon - Fri: 9:00 AM - 5:00 PM SAST</Text>
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginTop: 2,
  },
  contactArrow: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 38,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: isDark ? colors.surface : colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  officeInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  officeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  officeAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  officeHours: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
