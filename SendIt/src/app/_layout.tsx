import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '@/constants/theme';
import { AppStoreProvider } from '@/store/AppStore';

export default function RootLayout() {
  return (
    <AppStoreProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.text,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="create-climb"
          options={{ presentation: 'modal', title: 'Log a Climb' }}
        />
        <Stack.Screen name="post/[id]" options={{ title: 'Climb' }} />
      </Stack>
    </AppStoreProvider>
  );
}
