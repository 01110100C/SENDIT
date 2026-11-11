import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BOULDER_GRADES, COLORS, FONT_SIZES, ROUTE_GRADES, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/AppStore';
import { pickImage } from '@/utils/pickImage';

type ClimbType = 'boulder' | 'route';

export default function CreateClimb() {
  const router = useRouter();
  const { createPost } = useAppStore();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [climbType, setClimbType] = useState<ClimbType>('boulder');
  const [grade, setGrade] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const grades = climbType === 'boulder' ? BOULDER_GRADES : ROUTE_GRADES;
  const canSubmit = title.trim().length > 0 && grade.length > 0;

  const choosePhoto = async () => {
    const uri = await pickImage([4, 5]);
    if (uri) setImageUri(uri);
  };

  const switchType = (type: ClimbType) => {
    setClimbType(type);
    setGrade('');
  };

  const submit = () => {
    if (!canSubmit) return;
    createPost({
      imageUri,
      title: title.trim(),
      grade,
      location: location.trim(),
      notes: notes.trim(),
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable style={styles.photo} onPress={choosePhoto}>
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
              <View style={styles.changePhoto}>
                <Text style={styles.changePhotoText}>Change</Text>
              </View>
            </>
          ) : (
            <View style={styles.photoEmpty}>
              <Ionicons name="camera-outline" size={28} color={COLORS.accent} />
              <Text style={styles.photoEmptyText}>Add photo</Text>
            </View>
          )}
        </Pressable>

        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Midnight Lightning"
          placeholderTextColor={COLORS.textMuted}
          value={title}
          onChangeText={setTitle}
          maxLength={80}
        />

        <Text style={styles.label}>Grade *</Text>
        <View style={styles.segmented}>
          {(['boulder', 'route'] as const).map((type) => (
            <Pressable
              key={type}
              style={[styles.segment, climbType === type && styles.segmentActive]}
              onPress={() => switchType(type)}
            >
              <Text style={[styles.segmentText, climbType === type && styles.segmentTextActive]}>
                {type === 'boulder' ? 'Boulder' : 'Route'}
              </Text>
            </Pressable>
          ))}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gradeList}
        >
          {grades.map((g) => (
            <Pressable
              key={g}
              style={[styles.gradeChip, grade === g && styles.gradeChipActive]}
              onPress={() => setGrade(g)}
            >
              <Text style={[styles.gradeChipText, grade === g && styles.gradeChipTextActive]}>
                {g}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Crag, gym, or area"
          placeholderTextColor={COLORS.textMuted}
          value={location}
          onChangeText={setLocation}
          maxLength={100}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Beta, conditions, how it felt..."
          placeholderTextColor={COLORS.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
          maxLength={1000}
          textAlignVertical="top"
        />

        <Pressable
          style={[styles.submit, !canSubmit && styles.submitDisabled]}
          onPress={submit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitText}>Post Climb</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  // Same small square as photos in the community feed.
  photo: {
    alignSelf: 'center',
    width: 130,
    height: 130,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  photoEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoEmptyText: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  changePhoto: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(19, 42, 31, 0.75)',
    paddingVertical: 4,
  },
  changePhotoText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontWeight: '600',
  },
  label: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    fontWeight: '600',
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: 10,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  notesInput: {
    minHeight: 110,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 3,
    marginBottom: SPACING.sm,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    fontWeight: '600',
    color: COLORS.text,
  },
  segmentTextActive: {
    color: COLORS.onPrimary,
  },
  gradeList: {
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  gradeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  gradeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  gradeChipText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  gradeChipTextActive: {
    color: COLORS.onPrimary,
  },
  submit: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.4,
  },
  submitText: {
    color: COLORS.onPrimary,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
});
