import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { COLORS, FONTS } from '@/constants/theme';
import { AppStoreProvider } from '@/store/AppStore';

// Keep the splash screen up until the fonts are ready, so text never flashes in the default font.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ PressStart2P_400Regular });
  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <AppStoreProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.text,
          headerTitleStyle: { fontFamily: FONTS.retro, fontSize: 13 },
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
