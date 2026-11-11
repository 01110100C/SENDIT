import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from '@/components/Avatar';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/AppStore';

export default function CreatePostPrompt() {
  const router = useRouter();
  const { currentUser } = useAppStore();

  return (
    <Pressable style={styles.container} onPress={() => router.push('/create-climb')}>
      <Avatar uri={currentUser.avatarUri} name={currentUser.username} size={40} />
      <View style={styles.promptBox}>
        <Text style={styles.promptText}>Log a climb...</Text>
      </View>
      <Ionicons name="camera-outline" size={26} color={COLORS.green} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm + 4,
    margin: SPACING.sm + 4,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  promptBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.offwhite,
  },
  promptText: {
    color: COLORS.muted,
  },
});
