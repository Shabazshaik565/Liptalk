import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../src/constants/theme';
import { useAuthStore } from '../src/store/auth.store';
import { CURRENT_USER } from '../src/api/mockData';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 3, // 3 minutes cache
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { user, isHydrated, restoreSession, setAuth } = useAuthStore();

  useEffect(() => {
    async function initAuth() {
      const restored = await restoreSession();
      if (!restored && !user) {
        // Hydrate demo session for zero-friction interactive preview
        await setAuth(CURRENT_USER, 'demo_token_alex_morgan');
      }
    }
    initAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: COLORS.bgDark,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="chat/index" options={{ headerShown: false }} />
          <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="leads/index" options={{ headerShown: false }} />
          <Stack.Screen name="leads/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="opportunities/create" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="opportunities/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="communities/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="communities/create" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="events/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="marketplace/index" options={{ headerShown: false }} />
          <Stack.Screen name="marketplace/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="marketplace/create" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="rewards/index" options={{ headerShown: false }} />
          <Stack.Screen name="saved/index" options={{ headerShown: false }} />
          <Stack.Screen name="search/index" options={{ headerShown: false }} />
          <Stack.Screen name="profile/intelligence" options={{ headerShown: false }} />
          <Stack.Screen name="call/incoming" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="call/active" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="live/index" options={{ headerShown: false }} />
          <Stack.Screen name="live/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="live/create" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="creator/index" options={{ headerShown: false }} />
          <Stack.Screen name="creator/publish" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="creator/analytics" options={{ headerShown: false }} />
          <Stack.Screen name="enterprise/index" options={{ headerShown: false }} />
          <Stack.Screen name="enterprise/members" options={{ headerShown: false }} />
          <Stack.Screen name="trust/index" options={{ headerShown: false }} />
          <Stack.Screen name="privacy/index" options={{ headerShown: false }} />
          <Stack.Screen name="admin/index" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
