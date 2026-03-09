import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';

interface FloatingChatButtonProps {
  onPress: () => void;
  hasUnread?: boolean;
}

export default function FloatingChatButton({ onPress, hasUnread = false }: FloatingChatButtonProps) {
  const { colors, isDark } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (hasUnread) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [hasUnread]);

  const styles = createStyles(colors, isDark);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: floatAnim },
            { scale: pulseAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="chatbubble-ellipses" size={28} color="#FFFFFF" />
          <View style={styles.sparkle}>
            <Ionicons name="sparkles" size={14} color="#FFD700" />
          </View>
        </View>
        {hasUnread && <View style={styles.badge} />}
      </TouchableOpacity>
      <Text style={styles.label}>MamaAI</Text>
    </Animated.View>
  );
}

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 90,
      right: 20,
      alignItems: 'center',
      zIndex: 1000,
    },
    button: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
    iconContainer: {
      position: 'relative',
    },
    sparkle: {
      position: 'absolute',
      top: -8,
      right: -8,
    },
    badge: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#EF4444',
      borderWidth: 2,
      borderColor: isDark ? '#1F2937' : '#FFFFFF',
    },
    label: {
      marginTop: 4,
      fontSize: 11,
      fontWeight: '600',
      color: colors.text,
    },
  });
