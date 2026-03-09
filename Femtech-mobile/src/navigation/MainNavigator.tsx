import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../store/ThemeContext';

// Screen imports
import HomeScreen from '../screens/home/HomeScreen';
import MilestonesScreen from '../screens/milestones/MilestonesScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import RedeemScreen from '../screens/wallet/RedeemScreen';
import VoucherListScreen from '../screens/wallet/VoucherListScreen';
import VoucherDetailScreen from '../screens/wallet/VoucherDetailScreen';
import { QuizListScreen, QuizDetailScreen } from '../screens/quiz';
import { RiskAssessmentScreen, SymptomCheckerScreen } from '../screens/health';
import {
  ProfileScreen,
  EditProfileScreen,
  NotificationsScreen,
  HelpCenterScreen,
  TermsScreen,
  PrivacyPolicyScreen,
  ContactUsScreen,
  SecurityScreen,
  AppearanceScreen,
  LanguageScreen,
} from '../screens/profile';
import AIChatScreen from '../screens/ai/AIChatScreen';
import FloatingChatButton from '../components/FloatingChatButton';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const LearnStack = createNativeStackNavigator();
const WalletStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Home Stack Navigator
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="QuizList" component={QuizListScreen} />
      <HomeStack.Screen name="QuizDetail" component={QuizDetailScreen} />
      <HomeStack.Screen name="RiskAssessment" component={RiskAssessmentScreen} />
      <HomeStack.Screen name="SymptomChecker" component={SymptomCheckerScreen} />
    </HomeStack.Navigator>
  );
}

// Learn Stack Navigator
function LearnStackNavigator() {
  return (
    <LearnStack.Navigator screenOptions={{ headerShown: false }}>
      <LearnStack.Screen name="QuizListMain" component={QuizListScreen} />
      <LearnStack.Screen name="QuizDetail" component={QuizDetailScreen} />
    </LearnStack.Navigator>
  );
}

// Wallet Stack Navigator
function WalletStackNavigator() {
  return (
    <WalletStack.Navigator screenOptions={{ headerShown: false }}>
      <WalletStack.Screen name="WalletMain" component={WalletScreen} />
      <WalletStack.Screen name="Redeem" component={RedeemScreen} />
      <WalletStack.Screen name="VoucherList" component={VoucherListScreen} />
      <WalletStack.Screen name="VoucherDetail" component={VoucherDetailScreen} />
    </WalletStack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="Notifications" component={NotificationsScreen} />
      <ProfileStack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <ProfileStack.Screen name="Terms" component={TermsScreen} />
      <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <ProfileStack.Screen name="ContactUs" component={ContactUsScreen} />
      <ProfileStack.Screen name="Security" component={SecurityScreen} />
      <ProfileStack.Screen name="Appearance" component={AppearanceScreen} />
      <ProfileStack.Screen name="Language" component={LanguageScreen} />
    </ProfileStack.Navigator>
  );
}

// Tab Icon Component
function TabIcon({ icon, focused, color }: { icon: string; focused: boolean; color: string }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <Text style={[styles.icon, focused && styles.iconFocusedText]}>{icon}</Text>
    </View>
  );
}

// Tab Navigator with Global Floating Button
function TabNavigator() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();

  const openAIChat = () => {
    navigation.navigate('AIChat');
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon icon="🏠" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Learn"
          component={LearnStackNavigator}
          options={{
            tabBarLabel: 'Learn',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon icon="📚" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Milestones"
          component={MilestonesScreen}
          options={{
            tabBarLabel: 'Milestones',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon icon="🎯" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Wallet"
          component={WalletStackNavigator}
          options={{
            tabBarLabel: 'Wallet',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon icon="💰" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStackNavigator}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon icon="⚙️" focused={focused} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      
      {/* Global Floating Chat Button - visible on all tabs */}
      <FloatingChatButton onPress={openAIChat} />
    </View>
  );
}

// Main Navigator with Root Stack (for modals like AI Chat)
export default function MainNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Tabs" component={TabNavigator} />
      <RootStack.Screen 
        name="AIChat" 
        component={AIChatScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFocused: {
    transform: [{ scale: 1.1 }],
  },
  icon: {
    fontSize: 22,
  },
  iconFocusedText: {
    fontSize: 24,
  },
});
