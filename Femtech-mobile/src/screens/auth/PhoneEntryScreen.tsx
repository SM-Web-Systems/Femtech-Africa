import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Header } from '../../components/common';
import { COLORS, SPACING, FONTS } from '../../constants';
import { authApi } from '../../api';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'PhoneEntry'>;

const COUNTRIES = [
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
];

export default function PhoneEntryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [loading, setLoading] = useState(false);
  const [showCountries, setShowCountries] = useState(false);

  const handleRequestOtp = async () => {
    if (phone.length < 9) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `${selectedCountry.dial}${phone.replace(/^0/, '')}`;
      await authApi.requestOtp({ phone: fullPhone, country: selectedCountry.code });
      navigation.navigate('OtpVerification', { phone: fullPhone, country: selectedCountry.code });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Header title="Enter Phone" showBack onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Text style={styles.title}>What's your phone number?</Text>
        <Text style={styles.subtitle}>We'll send you a verification code</Text>

        <TouchableOpacity style={styles.countrySelector} onPress={() => setShowCountries(!showCountries)}>
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.countryName}>{selectedCountry.name}</Text>
          <Text style={styles.dialCode}>{selectedCountry.dial}</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {showCountries && (
          <View style={styles.countryList}>
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={styles.countryItem}
                onPress={() => {
                  setSelectedCountry(country);
                  setShowCountries(false);
                }}
              >
                <Text style={styles.flag}>{country.flag}</Text>
                <Text style={styles.countryItemName}>{country.name}</Text>
                <Text style={styles.dialCode}>{country.dial}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Input
          placeholder="Phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          leftIcon="call-outline"
        />

        <Button
          title="Continue"
          onPress={handleRequestOtp}
          loading={loading}
          disabled={phone.length < 9}
          size="large"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  flag: {
    fontSize: 24,
  },
  countryName: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  dialCode: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  countryList: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  countryItemName: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  button: {
    marginTop: SPACING.lg,
  },
});
