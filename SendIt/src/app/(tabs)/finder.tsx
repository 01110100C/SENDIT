import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import GymMap from '@/components/GymMap';
import { COLORS, FONT_SIZES, FONTS, SPACING } from '@/constants/theme';
import {
  findClimbingGyms,
  geocodeZip,
  type Gym,
  gymDataSource,
  GymSearchError,
  type Place,
  SEARCH_RADIUS_MILES,
} from '@/services/gyms';

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function Finder() {
  const [zip, setZip] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [place, setPlace] = useState<Place | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const listRef = useRef<FlatList<Gym>>(null);
  // Ignore results from an older search if the user searched again before it finished.
  const latestSearch = useRef(0);

  const search = async () => {
    Keyboard.dismiss();
    const searchId = ++latestSearch.current;
    setStatus('loading');
    setError('');
    setSelectedId(null);

    try {
      const found = await geocodeZip(zip.trim());
      const results = await findClimbingGyms(found);
      if (searchId !== latestSearch.current) return;
      setPlace(found);
      setGyms(results);
      setStatus('done');
    } catch (e) {
      if (searchId !== latestSearch.current) return;
      setError(e instanceof GymSearchError ? e.message : 'Something went wrong. Try again.');
      setStatus('error');
    }
  };

  const selectGym = (id: string) => {
    setSelectedId(id);
    const index = gyms.findIndex((g) => g.id === id);
    if (index >= 0) listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <Ionicons name="location-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Enter zip code"
            placeholderTextColor={COLORS.textMuted}
            value={zip}
            onChangeText={(t) => setZip(t.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={5}
            returnKeyType="search"
            onSubmitEditing={search}
          />
        </View>
        <Pressable
          style={[styles.searchButton, (zip.length !== 5 || status === 'loading') && styles.disabled]}
          onPress={search}
          disabled={zip.length !== 5 || status === 'loading'}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      <View style={styles.map}>
        <GymMap center={place} gyms={gyms} selectedId={selectedId} onSelect={selectGym} />
        {status === 'loading' && (
          <View style={styles.mapOverlay}>
            <ActivityIndicator color={COLORS.primary} size="large" />
          </View>
        )}
      </View>

      <FlatList
        ref={listRef}
        data={status === 'done' ? gyms : []}
        keyExtractor={(g) => g.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        onScrollToIndexFailed={() => {}}
        ListHeaderComponent={
          status === 'done' && place ? (
            <Text style={styles.resultsTitle}>
              {gyms.length} {gyms.length === 1 ? 'gym' : 'gyms'} near {place.label}
            </Text>
          ) : null
        }
        ListEmptyComponent={<EmptyState status={status} error={error} place={place} />}
        ListFooterComponent={
          status === 'done' && gymDataSource === 'OpenStreetMap' ? (
            <Text style={styles.attribution}>Gym data © OpenStreetMap contributors</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <GymRow gym={item} selected={item.id === selectedId} onPress={() => selectGym(item.id)} />
        )}
      />
    </View>
  );
}

function EmptyState({ status, error, place }: { status: Status; error: string; place: Place | null }) {
  let message = 'Enter your zip code to find climbing gyms nearby.';
  if (status === 'loading') message = 'Searching for gyms...';
  if (status === 'error') message = error;
  if (status === 'done') {
    message = `No climbing gyms found within ${SEARCH_RADIUS_MILES} miles of ${place?.label}.`;
  }

  return (
    <View style={styles.empty}>
      <Ionicons
        name={status === 'error' ? 'alert-circle-outline' : 'search-outline'}
        size={28}
        color={status === 'error' ? COLORS.like : COLORS.textMuted}
      />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

function GymRow({ gym, selected, onPress }: { gym: Gym; selected: boolean; onPress: () => void }) {
  const openDirections = () => {
    const { latitude: lat, longitude: lng } = gym;
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(gym.name)}`
        : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  return (
    <Pressable style={[styles.row, selected && styles.rowSelected]} onPress={onPress}>
      <View style={styles.rowHeader}>
        <Text style={styles.gymName} numberOfLines={2}>
          {gym.name}
        </Text>
        <Text style={styles.distance}>{gym.distanceMiles.toFixed(1)} mi</Text>
      </View>

      {!!gym.address && <Text style={styles.address}>{gym.address}</Text>}

      {gym.rating != null && (
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color={COLORS.primary} />
          <Text style={styles.rating}>
            {gym.rating.toFixed(1)}
            {gym.ratingCount != null && ` (${gym.ratingCount})`}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <ActionButton icon="navigate-outline" label="Directions" onPress={openDirections} />
        {!!gym.website && (
          <ActionButton
            icon="globe-outline"
            label="Website"
            onPress={() => Linking.openURL(gym.website!)}
          />
        )}
        {!!gym.phone && (
          <ActionButton
            icon="call-outline"
            label="Call"
            onPress={() => Linking.openURL(`tel:${gym.phone!.replace(/[^0-9+]/g, '')}`)}
          />
        )}
      </View>
    </Pressable>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.actionButton} onPress={onPress} hitSlop={4}>
      <Ionicons name={icon} size={14} color={COLORS.primary} />
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.sm + 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: SPACING.sm + 4,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: COLORS.onPrimary,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.4,
  },
  map: {
    height: 260,
    marginHorizontal: SPACING.sm + 4,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(19, 42, 31, 0.5)',
  },
  list: {
    padding: SPACING.sm + 4,
    paddingBottom: SPACING.xl,
  },
  resultsTitle: {
    fontFamily: FONTS.retro,
    fontSize: 10,
    lineHeight: 16,
    color: COLORS.primary,
    marginBottom: SPACING.sm + 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  emptyText: {
    marginTop: SPACING.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  attribution: {
    marginTop: SPACING.sm,
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  row: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    padding: SPACING.sm + 4,
    marginBottom: SPACING.sm,
  },
  rowSelected: {
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  gymName: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  distance: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  address: {
    marginTop: 2,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.xs,
  },
  rating: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
