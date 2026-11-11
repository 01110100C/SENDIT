import { Stack } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { AppStoreProvider } from '@/store/AppStore';

export default function RootLayout() {
  return (
    <AppStoreProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.offwhite },
          headerTintColor: COLORS.forest,
          contentStyle: { backgroundColor: COLORS.offwhite },
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
