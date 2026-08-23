import React from 'react';
import { Stack } from 'expo-router';
import { COLORS } from '../../src/constants/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.bgDark,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: COLORS.bgDark,
        },
      }}
    >
      <Stack.Screen name="select-role" options={{ title: 'Select Profile Type', headerShown: false }} />
      <Stack.Screen name="profile-setup" options={{ title: 'Profile Setup' }} />
      <Stack.Screen name="needs-offers-setup" options={{ title: 'Needs & Offers' }} />
    </Stack>
  );
}
