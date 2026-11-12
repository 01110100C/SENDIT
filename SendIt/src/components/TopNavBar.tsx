import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

/** Navigation bar shown at the top of the tab screens: logo on the left, tabs on the right. */
export default function TopNavBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.xs }]}>
      <Text style={styles.logo}>SendIt</Text>

      <View style={styles.tabs}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused ? COLORS.primary : COLORS.textMuted;
          const label = options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              hitSlop={4}
            >
              {options.tabBarIcon?.({ focused, color, size: 20 })}
              <Text style={[styles.label, { color }]} numberOfLines={1}>
                {label}
              </Text>
              <View style={[styles.indicator, focused && styles.indicatorActive]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 4,
    backgroundColor: COLORS.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  logo: {
    fontFamily: FONTS.logo,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  tabs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: SPACING.xs,
  },
  label: {
    fontFamily: FONTS.retro,
    fontSize: 7,
    lineHeight: 12,
    marginTop: 4,
  },
  indicator: {
    marginTop: SPACING.xs,
    height: 2,
    width: '70%',
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: COLORS.primary,
  },
});
