import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from '../store/NetworkContext';
import { useTheme } from '../store/ThemeContext';

export default function OfflineBanner() {
  const { isOnline, pendingActionsCount, syncPending } = useNetwork();
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOnline ? -60 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOnline]);

  if (isOnline && pendingActionsCount === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isOnline ? colors.primary : '#F59E0B',
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={isOnline ? 'cloud-done' : 'cloud-offline'}
          size={18}
          color="#FFFFFF"
        />
        <Text style={styles.text}>
          {isOnline
            ? `Back online! ${pendingActionsCount} actions to sync`
            : 'You\'re offline. Changes will sync when connected.'}
        </Text>
      </View>
      {isOnline && pendingActionsCount > 0 && (
        <TouchableOpacity onPress={syncPending} style={styles.syncButton}>
          <Text style={styles.syncText}>Sync Now</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  syncButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  syncText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
