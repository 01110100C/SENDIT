import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import type { Gym, Place } from '@/services/gyms';

type Props = {
  center: Place | null;
  gyms: Gym[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

// react-native-maps only runs on iOS and Android. On web the gym list still works.
export default function GymMap(_props: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="map-outline" size={32} color={COLORS.textMuted} />
      <Text style={styles.text}>The map is available in the iOS and Android app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceSunken,
    padding: SPACING.md,
  },
  text: {
    marginTop: SPACING.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
