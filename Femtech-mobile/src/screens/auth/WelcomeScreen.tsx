import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';

export default function WelcomeScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors, isDark);

  const { 
    hasAccount,
    biometricAvailable, 
    biometricType, 
    storedPhone,
    loginWithBiometric,
    eraseProfile,
  } = useAuth();
  
  const [authenticating, setAuthenticating] = useState(false);
  const [autoTriggered, setAutoTriggered] = useState(false);

  // Auto-trigger biometric when account exists
  useEffect(() => {
    if (hasAccount && biometricAvailable && !autoTriggered) {
      setAutoTriggered(true);
      handleBiometricLogin();
    }
  }, [hasAccount, biometricAvailable]);

  const handleBiometricLogin = async () => {
    setAuthenticating(true);
    try {
      const success = await loginWithBiometric();
      if (!success) {
        // Failed - stay on screen, user can retry
      }
    } catch (error) {
      console.error('Biometric error:', error);
    } finally {
      setAuthenticating(false);
    }
  };

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 6) return phone || '';
    return phone.slice(0, 4) + '****' + phone.slice(-3);
  };

  // Account exists - show biometric login
  if (hasAccount) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>M</Text>
            </View>
          </View>

          <Text style={styles.title}>MamaTokens</Text>
          
          {authenticating ? (
            <>
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
              <Text style={styles.authenticatingText}>Authenticating...</Text>
            </>
          ) : (
            <View style={styles.buttonSection}>
              <Text style={styles.welcomeBack}>Welcome back!</Text>
              {storedPhone && (
                <Text style={styles.savedPhone}>{maskPhone(storedPhone)}</Text>
              )}

              {biometricAvailable ? (
                <TouchableOpacity
                  style={styles.biometricButton}
                  onPress={handleBiometricLogin}
                >
                  <Text style={styles.biometricIcon}>
                    {biometricType === 'Face ID' ? '👤' : '👆'}
                  </Text>
                  <Text style={styles.buttonText}>Login with {biometricType}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleBiometricLogin}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.eraseButton}
                onPress={eraseProfile}
              >
                <Text style={styles.eraseText}>Erase profile & start fresh</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // No account - show Get Started
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

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('PhoneEntry')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.4 : 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  features: {
    marginBottom: 40,
  },
  feature: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  authenticatingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  
  buttonSection: {
    width: '100%',
    alignItems: 'center',
  },
  welcomeBack: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  savedPhone: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  
  button: { 
    backgroundColor: colors.primary, 
    paddingHorizontal: 60, 
    paddingVertical: 16, 
    borderRadius: 30, 
    width: '100%', 
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  biometricButton: { 
    backgroundColor: colors.primary, 
    paddingHorizontal: 40, 
    paddingVertical: 16, 
    borderRadius: 30, 
    width: '100%', 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  biometricIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  eraseButton: {
    marginTop: 40,
  },
  eraseText: {
    color: colors.textSecondary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
