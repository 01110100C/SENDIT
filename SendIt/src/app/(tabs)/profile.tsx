import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Avatar from '@/components/Avatar';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/AppStore';
import { pickImage } from '@/utils/pickImage';

const GRID_COLUMNS = 3;
const GRID_GAP = 2;
const EARLIEST_YEAR = 1900;

export default function Profile() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { currentUser, posts, updateProfile } = useAppStore();

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [year, setYear] = useState(String(currentUser.climbingSince));

  const myPosts = posts.filter((p) => p.userId === currentUser.id);
  const tileSize = (width - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

  const changeAvatar = async () => {
    const uri = await pickImage([1, 1]);
    if (uri) updateProfile({ avatarUri: uri });
  };

  const startEditing = () => {
    setUsername(currentUser.username);
    setBio(currentUser.bio);
    setYear(String(currentUser.climbingSince));
    setEditing(true);
  };

  const save = () => {
    const parsedYear = Number(year);
    const thisYear = new Date().getFullYear();
    if (!Number.isInteger(parsedYear) || parsedYear < EARLIEST_YEAR || parsedYear > thisYear) {
      Alert.alert('Invalid year', `Enter a year between ${EARLIEST_YEAR} and ${thisYear}.`);
      return;
    }
    if (!username.trim()) {
      Alert.alert('Username required', 'Your username cannot be empty.');
      return;
    }
    updateProfile({ username: username.trim(), bio: bio.trim(), climbingSince: parsedYear });
    setEditing(false);
  };

  const header = (
    <View style={styles.header}>
      <Pressable onPress={changeAvatar} style={styles.avatarWrapper}>
        <Avatar uri={currentUser.avatarUri} name={currentUser.username} size={96} />
        <View style={styles.avatarBadge}>
          <Ionicons name="camera" size={14} color={COLORS.offwhite} />
        </View>
      </Pressable>

      {editing ? (
        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={30}
          />
          <Text style={styles.label}>Climbing since</Text>
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={(t) => setYear(t.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={4}
          />
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell people about your climbing..."
            placeholderTextColor={COLORS.muted}
            multiline
            maxLength={300}
            textAlignVertical="top"
          />
          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.buttonSecondary]} onPress={() => setEditing(false)}>
              <Text style={styles.buttonSecondaryText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={save}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.username}>{currentUser.username}</Text>
          <Text style={styles.since}>Climbing since {currentUser.climbingSince}</Text>
          {currentUser.bio ? (
            <Text style={styles.bio}>{currentUser.bio}</Text>
          ) : (
            <Text style={[styles.bio, styles.bioEmpty]}>No bio yet.</Text>
          )}

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{myPosts.length}</Text>
              <Text style={styles.statLabel}>Climbs</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {new Date().getFullYear() - currentUser.climbingSince}
              </Text>
              <Text style={styles.statLabel}>Years</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.buttonSecondary]} onPress={startEditing}>
              <Text style={styles.buttonSecondaryText}>Edit Profile</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => router.push('/create-climb')}>
              <Text style={styles.buttonText}>Log a Climb</Text>
            </Pressable>
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>My Climbs</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={myPosts}
      keyExtractor={(p) => p.id}
      numColumns={GRID_COLUMNS}
      columnWrapperStyle={{ gap: GRID_GAP }}
      contentContainerStyle={{ gap: GRID_GAP, paddingBottom: SPACING.lg }}
      ListHeaderComponent={header}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <Text style={styles.empty}>You haven't posted any climbs yet.</Text>
      }
      renderItem={({ item }) => (
        <Pressable
          style={{ width: tileSize, height: tileSize }}
          onPress={() => router.push({ pathname: '/post/[id]', params: { id: item.id } })}
        >
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.tileImage} contentFit="cover" />
          ) : (
            <View style={[styles.tileImage, styles.tilePlaceholder]}>
              <Text style={styles.tileTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          )}
          <View style={styles.tileGrade}>
            <Text style={styles.tileGradeText}>{item.grade}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
  },
  avatarWrapper: {
    marginBottom: SPACING.sm + 4,
  },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.green,
    borderWidth: 2,
    borderColor: COLORS.offwhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.forest,
  },
  since: {
    marginTop: 2,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.clay,
  },
  bio: {
    marginTop: SPACING.sm + 4,
    paddingHorizontal: SPACING.lg,
    textAlign: 'center',
    color: COLORS.forest,
  },
  bioEmpty: {
    color: COLORS.muted,
    fontStyle: 'italic',
  },
  stats: {
    flexDirection: 'row',
    gap: SPACING.xl,
    marginTop: SPACING.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.forest,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.muted,
  },
  form: {
    alignSelf: 'stretch',
    paddingHorizontal: SPACING.md,
  },
  label: {
    marginTop: SPACING.sm + 4,
    marginBottom: SPACING.xs,
    fontWeight: '600',
    color: COLORS.forest,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: 10,
    fontSize: FONT_SIZES.md,
    color: COLORS.forest,
  },
  bioInput: {
    minHeight: 90,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    alignSelf: 'stretch',
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.green,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.offwhite,
    fontWeight: '700',
  },
  buttonSecondary: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonSecondaryText: {
    color: COLORS.forest,
    fontWeight: '700',
  },
  sectionTitle: {
    alignSelf: 'stretch',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.forest,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: SPACING.lg,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tilePlaceholder: {
    backgroundColor: COLORS.moss,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
  },
  tileTitle: {
    color: COLORS.offwhite,
    fontWeight: '700',
    textAlign: 'center',
  },
  tileGrade: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: COLORS.gold,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  tileGradeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.forest,
  },
});
