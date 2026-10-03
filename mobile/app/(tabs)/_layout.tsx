import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home as HomeIcon,
  Compass,
  Briefcase,
  Users,
  User as UserIcon,
  MessagesSquare,
} from 'lucide-react-native';
import { COLORS } from '../../src/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  // Safe clearance for Android 3-button navigation bar (Back/Home/Recents is ~48dp) & iOS Home indicator (~34dp)
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 44 : 32);
  const tabHeight = 60 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bgDark,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomInset,
          paddingTop: 6,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.45,
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          height: 50,
          paddingBottom: 0,
          paddingTop: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textDim,
        tabBarLabelStyle: {
          fontSize: 9.5,
          fontWeight: '800',
          letterSpacing: 0.1,
          marginTop: 2,
          flexShrink: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon size={focused ? 21 : 19} color={color as string} strokeWidth={focused ? 2.6 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Compass size={focused ? 21 : 19} color={color as string} strokeWidth={focused ? 2.6 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="opportunities"
        options={{
          title: 'Demands',
          tabBarIcon: ({ color, focused }) => (
            <Briefcase size={focused ? 21 : 19} color={color as string} strokeWidth={focused ? 2.6 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: 'Guilds',
          tabBarIcon: ({ color, focused }) => (
            <MessagesSquare size={focused ? 21 : 19} color={color as string} strokeWidth={focused ? 2.6 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: 'Network',
          tabBarIcon: ({ color, focused }) => (
            <Users size={focused ? 21 : 19} color={color as string} strokeWidth={focused ? 2.6 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <UserIcon size={focused ? 21 : 19} color={color as string} strokeWidth={focused ? 2.6 : 2} />
          ),
        }}
      />
      {/* Retain Partners route */}
      <Tabs.Screen
        name="partners"
        options={{
          href: null,
          title: 'Partners',
        }}
      />
    </Tabs>
  );
}
