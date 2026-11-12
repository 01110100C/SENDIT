import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import TopNavBar from '@/components/TopNavBar';

type IconName = ComponentProps<typeof Ionicons>['name'];

const tabIcon =
  (name: IconName) =>
  ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} size={size} color={color as string} />
  );

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TopNavBar {...props} />}
      screenOptions={{ headerShown: false, tabBarPosition: 'top' }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('person') }} />
      <Tabs.Screen name="train" options={{ title: 'Train', tabBarIcon: tabIcon('barbell') }} />
      <Tabs.Screen name="finder" options={{ title: 'Finder', tabBarIcon: tabIcon('map') }} />
      <Tabs.Screen name="ranked" options={{ title: 'Rank', tabBarIcon: tabIcon('trophy') }} />
    </Tabs>
  );
}
