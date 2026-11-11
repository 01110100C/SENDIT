import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { COLORS } from '@/constants/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const tabIcon =
  (name: IconName) =>
  ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} size={size} color={color as string} />
  );

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.offwhite },
        headerTintColor: COLORS.forest,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: { backgroundColor: COLORS.offwhite, borderTopColor: COLORS.border },
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.muted,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('person') }} />
      <Tabs.Screen name="train" options={{ title: 'Train', tabBarIcon: tabIcon('barbell') }} />
      <Tabs.Screen name="finder" options={{ title: 'Finder', tabBarIcon: tabIcon('map') }} />
      <Tabs.Screen name="ranked" options={{ title: 'Rank', tabBarIcon: tabIcon('trophy') }} />
    </Tabs>
  );
}
