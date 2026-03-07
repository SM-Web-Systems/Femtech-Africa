import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#E91E63',
  background: '#FFF5F8',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
};

export default function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>
        </View>
        
        <Text style={styles.title}>MamaTokens</Text>
        <Text style={styles.subtitle}>Rewarding healthy pregnancies</Text>
        
        <View style={styles.features}>
          <Text style={styles.feature}>✓ Track your pregnancy journey</Text>
          <Text style={styles.feature}>✓ Earn MAMA tokens for milestones</Text>
          <Text style={styles.feature}>✓ Redeem for real rewards</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('PhoneEntry')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  logoContainer: { marginBottom: 30 },
  logo: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 48, fontWeight: 'bold', color: COLORS.white },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  subtitle: { fontSize: 18, color: COLORS.textSecondary, marginBottom: 40 },
  features: { marginBottom: 40 },
  feature: { fontSize: 16, color: COLORS.text, marginBottom: 12 },
  button: { backgroundColor: COLORS.primary, paddingHorizontal: 60, paddingVertical: 16, borderRadius: 30 },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});