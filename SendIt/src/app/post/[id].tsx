import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import PostCard from '@/components/PostCard';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/AppStore';

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts } = useAppStore();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return <Text style={styles.missing}>This climb no longer exists.</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <PostCard post={post} expanded />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
  },
  missing: {
    padding: SPACING.lg,
    textAlign: 'center',
    color: COLORS.muted,
  },
});
