import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Avatar from '@/components/Avatar';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { timeAgo, useAppStore, type Post } from '@/store/AppStore';

type Props = {
  post: Post;
  /** Show every comment and keep the comment box open (used on the post detail screen). */
  expanded?: boolean;
};

const PREVIEW_COMMENTS = 2;

export default function PostCard({ post, expanded = false }: Props) {
  const { currentUser, getUser, toggleLike, addComment } = useAppStore();
  const [showAllComments, setShowAllComments] = useState(expanded);
  const [commenting, setCommenting] = useState(expanded);
  const [draft, setDraft] = useState('');

  const author = getUser(post.userId);
  const liked = post.likedBy.includes(currentUser.id);
  const likeCount = post.likedBy.length;
  const visibleComments = showAllComments
    ? post.comments
    : post.comments.slice(-PREVIEW_COMMENTS);

  // Feed shows a small square thumbnail beside the details; the post detail
  // screen shows the full-size photo.
  const imageStyle = expanded ? styles.imageFull : styles.imageCompact;
  const photo = post.imageUri ? (
    <Image source={{ uri: post.imageUri }} style={imageStyle} contentFit="cover" />
  ) : (
    <View style={[imageStyle, styles.imagePlaceholder]}>
      <Ionicons name="image-outline" size={expanded ? 40 : 28} color={COLORS.moss} />
    </View>
  );

  const climbInfo = (
    <View style={styles.titleRow}>
      <Text style={styles.title}>{post.title}</Text>
      {!!post.grade && (
        <View style={styles.gradeBadge}>
          <Text style={styles.gradeText}>{post.grade}</Text>
        </View>
      )}
    </View>
  );

  const notes = !!post.notes && (
    <Text style={styles.notes} numberOfLines={expanded ? undefined : 3}>
      {post.notes}
    </Text>
  );

  const submitComment = () => {
    const text = draft.trim();
    if (!text) return;
    addComment(post.id, text);
    setDraft('');
    setShowAllComments(true);
  };

  return (
    <View style={[styles.card, !expanded && styles.cardCompact]}>
      <View style={styles.header}>
        <Avatar uri={author?.avatarUri ?? null} name={author?.username ?? '?'} />
        <View style={styles.headerText}>
          <Text style={styles.username}>{author?.username ?? 'unknown'}</Text>
          {!!post.location && (
            <Text style={styles.location} numberOfLines={1}>
              {post.location}
            </Text>
          )}
        </View>
        <Text style={styles.time}>{timeAgo(post.createdAt)}</Text>
      </View>

      <View style={styles.inset}>{climbInfo}</View>
      {expanded ? photo : <View style={styles.inset}>{photo}</View>}
      {notes && <View style={[styles.inset, styles.notesWrapper]}>{notes}</View>}

      <View style={styles.actions}>
        <Pressable onPress={() => toggleLike(post.id)} hitSlop={8} style={styles.actionButton}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={26}
            color={liked ? COLORS.clay : COLORS.forest}
          />
        </Pressable>
        <Pressable onPress={() => setCommenting((c) => !c)} hitSlop={8} style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color={COLORS.forest} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.likes}>
          {likeCount} {likeCount === 1 ? 'like' : 'likes'}
        </Text>


        {!showAllComments && post.comments.length > PREVIEW_COMMENTS && (
          <Pressable onPress={() => setShowAllComments(true)}>
            <Text style={styles.viewAll}>View all {post.comments.length} comments</Text>
          </Pressable>
        )}

        {visibleComments.map((comment) => (
          <Text key={comment.id} style={styles.comment}>
            <Text style={styles.username}>{getUser(comment.userId)?.username} </Text>
            {comment.text}
          </Text>
        ))}

        {commenting && (
          <View style={styles.commentInputRow}>
            <Avatar uri={currentUser.avatarUri} name={currentUser.username} size={28} />
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor={COLORS.muted}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={submitComment}
              returnKeyType="send"
              autoFocus={!expanded}
            />
            <Pressable onPress={submitComment} disabled={!draft.trim()} hitSlop={8}>
              <Text style={[styles.postButton, !draft.trim() && styles.postButtonDisabled]}>
                Post
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    marginBottom: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  // Feed cards: narrower, centered, and rounded so they hug the compact post.
  cardCompact: {
    alignSelf: 'center',
    width: '82%',
    maxWidth: 360,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.sm,
  },
  headerText: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  username: {
    fontWeight: '600',
    color: COLORS.forest,
  },
  location: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.muted,
  },
  time: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.muted,
  },
  inset: {
    paddingHorizontal: SPACING.sm + 4,
    alignItems: 'center',
  },
  notesWrapper: {
    marginTop: SPACING.sm,
  },
  imageCompact: {
    width: 130,
    height: 130,
    borderRadius: 8,
  },
  imageFull: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  imagePlaceholder: {
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
    marginRight: SPACING.xs,
  },
  body: {
    paddingHorizontal: SPACING.sm + 4,
    paddingBottom: SPACING.sm + 4,
  },
  likes: {
    textAlign: 'center',
    fontWeight: '600',
    color: COLORS.forest,
    marginBottom: SPACING.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.forest,
    flexShrink: 1,
  },
  gradeBadge: {
    backgroundColor: COLORS.gold,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: SPACING.sm,
  },
  gradeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.forest,
  },
  notes: {
    textAlign: 'center',
    color: COLORS.forest,
    marginBottom: SPACING.xs,
  },
  viewAll: {
    color: COLORS.muted,
    marginBottom: SPACING.xs,
  },
  comment: {
    color: COLORS.forest,
    marginBottom: 2,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  commentInput: {
    flex: 1,
    marginHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    color: COLORS.forest,
  },
  postButton: {
    color: COLORS.green,
    fontWeight: '700',
  },
  postButtonDisabled: {
    opacity: 0.4,
  },
});
