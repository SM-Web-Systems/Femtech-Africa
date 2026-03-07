import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../store/AuthContext';
import { authApi } from '../../api';

const COLORS = {
  primary: '#E91E63',
  background: '#FFF5F8',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  border: '#E0E0E0',
};

export default function OtpVerificationScreen({ route, navigation }: any) {
  const { phone, country } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const inputs = useRef<TextInput[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
    
    if (newOtp.every(d => d) && newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''));
    }
  };

  const verifyOtp = async (otpCode: string) => {
    setLoading(true);
    setError('');

    try {
      // Call real API
      const response = await authApi.verifyOtp(phone, otpCode);
      
      if (response.token && response.user) {
        await login(response.user, response.token);
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Verification failed. Try again.';
      setError(message);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.requestOtp(phone, country || 'ZA');
      Alert.alert('OTP Sent', 'A new code has been sent to your phone.');
    } catch (err) {
      Alert.alert('Error', 'Failed to resend OTP. Try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}> Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Verify your phone</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to {phone}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { if (ref) inputs.current[index] = ref; }}
              style={[styles.otpInput, digit && styles.otpInputFilled, error && styles.otpInputError]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              editable={!loading}
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {loading && <Text style={styles.loadingText}>Verifying...</Text>}

        <View style={styles.hintBox}>
          <Text style={styles.hintText}> Test code: 123456</Text>
        </View>

        <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
          <Text style={styles.resendText}>Didn't receive a code? Resend</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: 20, paddingTop: 20 },
  backButton: { marginBottom: 20 },
  backText: { fontSize: 16, color: COLORS.primary },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 40 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  otpInput: { width: 50, height: 60, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.white, textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  otpInputFilled: { borderColor: COLORS.primary, backgroundColor: '#FFF0F5' },
  otpInputError: { borderColor: '#FF5252' },
  errorText: { textAlign: 'center', color: '#FF5252', fontSize: 14, marginBottom: 20 },
  loadingText: { textAlign: 'center', color: COLORS.primary, fontSize: 16, marginBottom: 20 },
  hintBox: { backgroundColor: '#FFF0F5', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  hintText: { color: COLORS.primary, fontSize: 14 },
  resendButton: { alignItems: 'center', padding: 10 },
  resendText: { color: COLORS.textSecondary, fontSize: 14 },
});
