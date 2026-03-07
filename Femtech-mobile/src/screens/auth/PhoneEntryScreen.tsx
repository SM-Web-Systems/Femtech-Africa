import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#E91E63',
  background: '#FFF5F8',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  border: '#E0E0E0',
};

export default function PhoneEntryScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (phone.length < 9) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    
    // MOCK: Skip real OTP, just navigate
    navigation.navigate('OtpVerification', { phone: '+27' + phone });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Enter your phone</Text>
        <Text style={styles.subtitle}>Enter any phone number for testing</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.prefix}>+27</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 30 },
  prefix: { paddingHorizontal: 16, fontSize: 18, color: COLORS.text, borderRightWidth: 1, borderRightColor: COLORS.border, paddingVertical: 16 },
  input: { flex: 1, paddingVertical: 16, paddingHorizontal: 16, fontSize: 18, color: COLORS.text },
  button: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});
