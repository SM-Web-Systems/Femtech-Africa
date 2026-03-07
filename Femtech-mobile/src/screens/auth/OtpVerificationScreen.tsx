import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../store/AuthContext';

const COLORS = {
  primary: '#E91E63',
  background: '#FFF5F8',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  border: '#E0E0E0',
};

export default function OtpVerificationScreen({ route, navigation }: any) {
  const { phone } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const inputs = useRef<TextInput[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
    
    if (newOtp.every(d => d) && newOtp.join('').length === 6) {
      verifyOtp();
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    
    // MOCK LOGIN - uses test user from database
    const mockUser = {
      id: 'a1000000-0000-4000-8000-000000000001',
      phone: phone,
      country: 'ZA',
    };
    const mockToken = 'mock-token-' + Date.now();
    
    await login(mockUser, mockToken);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Verify your phone</Text>
        <Text style={styles.subtitle}>Enter any 6 digits to continue</Text>
        
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { if (ref) inputs.current[index] = ref; }}
              style={[styles.otpInput, digit && styles.otpInputFilled]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              editable={!loading}
            />
          ))}
        </View>
        
        {loading && <Text style={styles.loadingText}>Logging in...</Text>}
        
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>💡 Test mode: Enter any 6 digits</Text>
        </View>
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
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  otpInput: { width: 50, height: 60, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.white, textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  otpInputFilled: { borderColor: COLORS.primary, backgroundColor: '#FFF0F5' },
  loadingText: { textAlign: 'center', color: COLORS.primary, fontSize: 16, marginBottom: 20 },
  hintBox: { backgroundColor: '#FFF0F5', padding: 16, borderRadius: 12, alignItems: 'center' },
  hintText: { color: COLORS.primary, fontSize: 14 },
});
