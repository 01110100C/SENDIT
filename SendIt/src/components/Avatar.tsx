import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';

type Props = {
  uri: string | null;
  name: string;
  size?: number;
};

export default function Avatar({ uri, name, size = 36 }: Props) {
  const dimensions = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={[styles.base, dimensions]} contentFit="cover" />;
  }

  return (
    <View style={[styles.base, styles.fallback, dimensions]}>
      <Text style={[styles.initial, { fontSize: size * 0.42 }]}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.moss,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: COLORS.offwhite,
    fontWeight: '700',
  },
});
