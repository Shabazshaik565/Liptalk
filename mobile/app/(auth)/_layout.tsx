import React from 'react';
import { Stack } from 'expo-router';
import { COLORS } from '../../src/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.bgDark,
        },
        headerTintColor: COLORS.textPrimary,
        contentStyle: {
          backgroundColor: COLORS.bgDark,
        },
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Sign In', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Create Account', headerShown: false }} />
      <Stack.Screen name="otp-verify" options={{ title: 'Verify OTP' }} />
    </Stack>
  );
}
