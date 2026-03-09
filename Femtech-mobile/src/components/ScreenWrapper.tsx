import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FloatingChatButton from './FloatingChatButton';

interface ScreenWrapperProps {
  children: React.ReactNode;
  showChatButton?: boolean;
}

export default function ScreenWrapper({ children, showChatButton = true }: ScreenWrapperProps) {
  const navigation = useNavigation<any>();

  const openAIChat = () => {
    navigation.navigate('AIChat');
  };

  return (
    <View style={styles.container}>
      {children}
      {showChatButton && <FloatingChatButton onPress={openAIChat} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
