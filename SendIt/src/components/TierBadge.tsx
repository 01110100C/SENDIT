import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { FONTS } from '@/constants/theme';
import type { Tier } from '@/constants/ranks';

type Props = {
  tier: Tier;
  size?: number;
  /** Show the tier name next to the gem. */
  showName?: boolean;
};

export default function TierBadge({ tier, size = 16, showName = false }: Props) {
  // Bedrock is the only tier that isn't a gem or metal, so it gets a plain rock icon.
  const icon = tier.id === 'bedrock' ? 'cube' : 'diamond';

  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={size} color={tier.color} />
      {showName && (
        <Text style={[styles.name, { color: tier.color, fontSize: size * 0.55 }]}>
          {tier.name.toUpperCase()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontFamily: FONTS.retro,
  },
});
