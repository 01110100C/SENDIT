import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import CreatePostPrompt from '@/components/CreatePostPrompt';
import PostCard from '@/components/PostCard';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/AppStore';

export default function Home() {
  const { posts } = useAppStore();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
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
});
