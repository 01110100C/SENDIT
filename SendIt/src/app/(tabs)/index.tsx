import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet } from 'react-native';
import CreatePostPrompt from '@/components/CreatePostPrompt';
import PostCard from '@/components/PostCard';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/AppStore';

export default function Home() {
  const router = useRouter();
  const { posts } = useAppStore();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen
        options={{
          title: 'SendIt',
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/create-climb')}
              hitSlop={8}
              style={styles.headerButton}
            >
              <Ionicons name="add-circle-outline" size={28} color={COLORS.text} />
            </Pressable>
          ),
        }}
      />
      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={CreatePostPrompt}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    paddingBottom: SPACING.lg,
  },
  headerButton: {
    marginRight: SPACING.md,
  },
});
