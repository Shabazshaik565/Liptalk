import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Compass, Users, Briefcase, MessagesSquare, User as UserIcon, Handshake } from 'lucide-react-native';
import { COLORS } from '../../src/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bgDark,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textDim,
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '800',
          letterSpacing: 0.2,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Compass size={focused ? 22 : 20} color={color as string} strokeWidth={focused ? 2.6 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="opportunities"
        options={{
          title: 'Demands',
          tabBarIcon: ({ color, focused }) => (
            <Briefcase size={focused ? 22 : 20} color={color as string} strokeWidth={focused ? 2.6 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: 'Network',
          tabBarIcon: ({ color, focused }) => (
            <Users size={focused ? 22 : 20} color={color as string} strokeWidth={focused ? 2.6 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: 'Guilds',
          tabBarIcon: ({ color, focused }) => (
            <MessagesSquare size={focused ? 22 : 20} color={color as string} strokeWidth={focused ? 2.6 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <UserIcon size={focused ? 22 : 20} color={color as string} strokeWidth={focused ? 2.6 : 2} />
          ),
        }}
      />
      {/* Retain Partners tab route access without duplicate bottom tab slot */}
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
