import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../store/ThemeContext';
import { aiApi } from '../../api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  offline?: boolean;
}

const STORAGE_KEY = '@mamaai_messages';
const CONVERSATION_ID_KEY = '@mamaai_conversation_id';

export default function AIChatScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const styles = createStyles(colors, isDark);

  // Load messages from storage on mount
  useEffect(() => {
    loadMessages();
    loadSuggestions();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const storedConvId = await AsyncStorage.getItem(CONVERSATION_ID_KEY);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })));
      }
      
      if (storedConvId) {
        setConversationId(storedConvId);
      }
    } catch (error) {
      console.log('Error loading messages:', error);
    }
  };

  const saveMessages = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.log('Error saving messages:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await aiApi.getSuggestions();
      setSuggestions(response.suggestions || []);
      setIsOffline(false);
    } catch (error) {
      console.log('Error loading suggestions:', error);
      setIsOffline(true);
      setSuggestions([
        'How do I earn MAMA tokens?',
        'What are pregnancy warning signs?',
        'How do I redeem vouchers?',
        'What should I eat during pregnancy?',
      ]);
    }
  };

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const sendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

    Keyboard.dismiss();
    setInputText('');

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setIsLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await aiApi.chat(messageText, conversationId || undefined);
      
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        offline: response.offline,
      };

      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
        await AsyncStorage.setItem(CONVERSATION_ID_KEY, response.conversationId);
      }

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
      setIsOffline(false);
    } catch (error) {
      console.log('Error sending message:', error);
      setIsOffline(true);
      
      // Generate offline response
      const offlineResponse = getOfflineResponse(messageText);
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: offlineResponse,
        timestamp: new Date(),
        offline: true,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const getOfflineResponse = (message: string): string => {
    const lower = message.toLowerCase();
    
    if (lower.includes('bleeding') || lower.includes('blood')) {
      return '⚠️ If you are experiencing vaginal bleeding during pregnancy, please seek medical attention immediately. Contact your healthcare provider or go to the nearest hospital.';
    }
    
    if (lower.includes('pain') && (lower.includes('severe') || lower.includes('bad'))) {
      return '⚠️ Severe pain during pregnancy should be evaluated by a healthcare provider. Please contact your doctor or go to the nearest clinic as soon as possible.';
    }
    
    if (lower.includes('not moving') || lower.includes('no movement')) {
      return '⚠️ If you notice reduced fetal movement after 28 weeks, please contact your healthcare provider immediately. Try lying on your left side and counting movements.';
    }
    
    if (lower.includes('token') || lower.includes('earn')) {
      return '💜 You can earn MAMA tokens by:\n\n• Completing educational quizzes\n• Achieving pregnancy milestones\n• Attending antenatal appointments\n• Logging healthy activities\n\nGo to the Quiz section to start earning!';
    }
    
    if (lower.includes('voucher') || lower.includes('redeem')) {
      return '🎁 To redeem vouchers:\n\n1. Go to the Wallet tab\n2. Tap "Redeem"\n3. Choose a voucher\n4. Use your MAMA tokens to claim it\n\nVouchers can be used for baby supplies and healthcare products!';
    }
    
    return '📴 I\'m currently offline and can\'t process your full request. Please check your internet connection and try again.\n\nIf this is urgent, please contact your healthcare provider directly.';
  };

  const clearChat = async () => {
    try {
      if (conversationId) {
        await aiApi.clearConversation(conversationId);
      }
    } catch (error) {
      console.log('Error clearing conversation on server:', error);
    }
    
    setMessages([]);
    setConversationId(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(CONVERSATION_ID_KEY);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.role === 'user';
    
    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
            </View>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
              {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {item.offline && (
              <View style={styles.offlineBadge}>
                <Ionicons name="cloud-offline-outline" size={12} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderSuggestion = (suggestion: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.suggestionChip}
      onPress={() => sendMessage(suggestion)}
    >
      <Text style={styles.suggestionText} numberOfLines={2}>
        {suggestion}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="chatbubble-ellipses-outline" size={48} color={colors.primary} />
        <View style={styles.emptySparkle}>
          <Ionicons name="sparkles" size={24} color="#FFD700" />
        </View>
      </View>
      <Text style={styles.emptyTitle}>Hi, I'm MamaAI! 👋</Text>
      <Text style={styles.emptySubtitle}>
        Your personal pregnancy assistant. Ask me anything about your pregnancy, the app, or maternal health.
      </Text>
      
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Try asking:</Text>
          <View style={styles.suggestionsGrid}>
            {suggestions.map((s, i) => renderSuggestion(s, i))}
          </View>
        </View>
      )}
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.assistantMessageContainer]}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="sparkles" size={16} color="#FFFFFF" />
        </View>
      </View>
      <View style={[styles.messageBubble, styles.assistantBubble, styles.typingBubble]}>
        <View style={styles.typingDots}>
          <TypingDot delay={0} colors={colors} />
          <TypingDot delay={150} colors={colors} />
          <TypingDot delay={300} colors={colors} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>MamaAI</Text>
              {isOffline && (
                <View style={styles.offlineIndicator}>
                  <Ionicons name="cloud-offline" size={14} color="#F59E0B" />
                </View>
              )}
            </View>
            <Text style={styles.headerSubtitle}>Your pregnancy assistant</Text>
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messagesList,
            messages.length === 0 && styles.emptyList,
          ]}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={isLoading ? renderTypingIndicator : null}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
        />

        {/* Quick Suggestions (when there are messages) */}
        {messages.length > 0 && suggestions.length > 0 && !isLoading && (
          <View style={styles.quickSuggestions}>
            <FlatList
              horizontal
              data={suggestions.slice(0, 4)}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.quickSuggestionChip}
                  onPress={() => sendMessage(item)}
                >
                  <Text style={styles.quickSuggestionText} numberOfLines={1}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickSuggestionsList}
            />
          </View>
        )}

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Ask MamaAI anything..."
                placeholderTextColor={colors.textSecondary}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={1000}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={() => sendMessage()}
                disabled={!inputText.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.disclaimer}>
              MamaAI provides general guidance only. Always consult your healthcare provider for medical advice.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}

// Typing animation dot
function TypingDot({ delay, colors }: { delay: number; colors: any }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        marginHorizontal: 2,
        opacity,
      }}
    />
  );
}

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    headerCenter: {
      flex: 1,
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    offlineIndicator: {
      marginLeft: 8,
      padding: 4,
    },
    headerSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    clearButton: {
      padding: 8,
    },
    messagesList: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    emptyList: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    messageContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    userMessageContainer: {
      justifyContent: 'flex-end',
    },
    assistantMessageContainer: {
      justifyContent: 'flex-start',
    },
    avatarContainer: {
      marginRight: 8,
      alignSelf: 'flex-end',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: 12,
      borderRadius: 16,
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: 4,
    },
    assistantBubble: {
      backgroundColor: isDark ? '#2D2D2D' : '#F3F4F6',
      borderBottomLeftRadius: 4,
    },
    typingBubble: {
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    typingDots: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    messageText: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
    },
    userMessageText: {
      color: '#FFFFFF',
    },
    messageFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
    },
    timestamp: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    userTimestamp: {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    offlineBadge: {
      marginLeft: 6,
    },
    emptyState: {
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyIconContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    emptySparkle: {
      position: 'absolute',
      top: -8,
      right: -12,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
    },
    suggestionsContainer: {
      width: '100%',
    },
    suggestionsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    suggestionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    suggestionChip: {
      backgroundColor: isDark ? '#2D2D2D' : '#F3F4F6',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      maxWidth: '48%',
    },
    suggestionText: {
      fontSize: 13,
      color: colors.text,
      lineHeight: 18,
    },
    quickSuggestions: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    quickSuggestionsList: {
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    quickSuggestionChip: {
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      marginRight: 8,
      maxWidth: 200,
    },
    quickSuggestionText: {
      fontSize: 13,
      color: colors.text,
    },
    inputContainer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: isDark ? '#2D2D2D' : '#F3F4F6',
      borderRadius: 24,
      paddingLeft: 16,
      paddingRight: 4,
      paddingVertical: 4,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      maxHeight: 100,
      paddingVertical: 10,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: isDark ? '#4B5563' : '#D1D5DB',
    },
    disclaimer: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },
  });
