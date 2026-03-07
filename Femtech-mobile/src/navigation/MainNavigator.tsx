import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

import HomeScreen from '../screens/home/HomeScreen';
import MilestonesScreen from '../screens/milestones/MilestonesScreen';
import MilestoneDetailScreen from '../screens/milestones/MilestoneDetailScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import RedemptionsScreen from '../screens/redemptions/RedemptionsScreen';
import RedeemScreen from '../screens/redemptions/RedeemScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const MilestonesStack = createNativeStackNavigator();
const WalletStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

function MilestonesStackNavigator() {
  return (
    <MilestonesStack.Navigator screenOptions={{ headerShown: false }}>
      <MilestonesStack.Screen name="MilestonesList" component={MilestonesScreen} />
      <MilestonesStack.Screen name="MilestoneDetail" component={MilestoneDetailScreen} />
    </MilestonesStack.Navigator>
  );
}

function WalletStackNavigator() {
  return (
    <WalletStack.Navigator screenOptions={{ headerShown: false }}>
      <WalletStack.Screen name="WalletMain" component={WalletScreen} />
      <WalletStack.Screen name="Redemptions" component={RedemptionsScreen} />
      <WalletStack.Screen name="Redeem" component={RedeemScreen} />
    </WalletStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { paddingBottom: 5, height: 60 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Milestones') iconName = focused ? 'trophy' : 'trophy-outline';
          else if (route.name === 'Wallet') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Milestones" component={MilestonesStackNavigator} options={{ tabBarLabel: 'Milestones' }} />
      <Tab.Screen name="Wallet" component={WalletStackNavigator} options={{ tabBarLabel: 'Wallet' }} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}
