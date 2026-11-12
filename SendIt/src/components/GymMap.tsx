import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { COLORS } from '@/constants/theme';
import type { Gym, Place } from '@/services/gyms';

type Props = {
  center: Place | null;
  gyms: Gym[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

// Whole continental US, shown before the first search.
const INITIAL_REGION = {
  latitude: 39.8,
  longitude: -98.6,
  latitudeDelta: 40,
  longitudeDelta: 40,
};

const EDGE_PADDING = { top: 60, right: 40, bottom: 40, left: 40 };

export default function GymMap({ center, gyms, selectedId, onSelect }: Props) {
  const mapRef = useRef<MapView>(null);

  // Zoom to fit the search area and every gym found.
  useEffect(() => {
    if (!center) return;
    const points = [center, ...gyms].map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
    }));
    if (points.length === 1) {
      mapRef.current?.animateToRegion({ ...points[0], latitudeDelta: 0.4, longitudeDelta: 0.4 });
    } else {
      mapRef.current?.fitToCoordinates(points, { edgePadding: EDGE_PADDING, animated: true });
    }
  }, [center, gyms]);

  // Fly to a gym when it's picked from the list.
  useEffect(() => {
    const gym = gyms.find((g) => g.id === selectedId);
    if (!gym) return;
    mapRef.current?.animateToRegion({
      latitude: gym.latitude,
      longitude: gym.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    });
  }, [selectedId, gyms]);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      initialRegion={INITIAL_REGION}
      userInterfaceStyle="dark"
      showsPointsOfInterests={false}
    >
      {gyms.map((gym) => (
        <Marker
          key={gym.id}
          coordinate={{ latitude: gym.latitude, longitude: gym.longitude }}
          title={gym.name}
          description={gym.address}
          pinColor={gym.id === selectedId ? COLORS.primary : COLORS.like}
          onPress={() => onSelect(gym.id)}
        />
      ))}
    </MapView>
  );
}
