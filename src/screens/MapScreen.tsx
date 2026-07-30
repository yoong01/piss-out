import { NativeStackScreenProps } from '@react-navigation/native-stack';
import L from 'leaflet';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleMarker, MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { BottomSheet } from '../components/BottomSheet';
import { LocationSheetContent } from '../components/LocationSheetContent';
import { useAppStore } from '../data/store';
import { Location, VENUE_CATEGORY_META } from '../data/types';
import { SharedStackParamList } from '../navigation/types';
import { colors, radii, spacing } from '../theme/colors';
import { APP_NAME, APP_TAGLINE } from '../theme/copy';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<SharedStackParamList, 'Map'>;

const LONDON_CENTER: [number, number] = [51.5074, -0.1278];
const DEFAULT_ZOOM = 13;
const PIN_SIZE = 34;
const UNDISCOVERED_RADIUS = 7;

function buildPinIcon(emoji: string, isSelected: boolean) {
  const bg = isSelected ? colors.point : colors.black;
  const html = `
    <div style="
      width: ${PIN_SIZE}px;
      height: ${PIN_SIZE}px;
      border-radius: ${PIN_SIZE / 2}px;
      background: ${bg};
      border: 2px solid ${colors.black};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.35);
    ">${emoji}</div>
  `;
  return L.divIcon({
    html,
    className: 'pissout-pin',
    iconSize: [PIN_SIZE, PIN_SIZE],
    iconAnchor: [PIN_SIZE / 2, PIN_SIZE / 2],
  });
}

function InvalidateSizeOnMount() {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 0);
    return () => clearTimeout(id);
  }, [map]);
  return null;
}

export function MapScreen({ navigation }: Props) {
  const locations = useAppStore((s) => s.locations);
  const reviewsForLocation = useAppStore((s) => s.reviewsForLocation);
  const averageRatingsForLocation = useAppStore((s) => s.averageRatingsForLocation);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canvasRenderer = useMemo(() => L.canvas({ padding: 0.5 }), []);

  const discoveredLocations = useMemo(() => locations.filter((l) => l.discovered), [locations]);
  const undiscoveredLocations = useMemo(() => locations.filter((l) => !l.discovered), [locations]);

  const selected = useMemo<Location | null>(
    () => locations.find((l) => l.id === selectedId) ?? null,
    [locations, selectedId]
  );

  const selectedReviews = selected ? reviewsForLocation(selected.id) : [];
  const selectedOverall = selected ? averageRatingsForLocation(selected.id).overall : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.tagline}>{APP_TAGLINE}</Text>
      </View>

      <View style={styles.mapCanvas}>
        <MapContainer
          center={LONDON_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <InvalidateSizeOnMount />

          {undiscoveredLocations.map((location) => (
            <CircleMarker
              key={location.id}
              center={[location.latitude, location.longitude]}
              radius={UNDISCOVERED_RADIUS}
              renderer={canvasRenderer}
              pathOptions={{
                color: '#9CA3AF',
                weight: 1,
                fillColor: '#9CA3AF',
                fillOpacity: 0.35,
              }}
              eventHandlers={{ click: () => setSelectedId(location.id) }}
            >
              <Tooltip
                permanent
                direction="center"
                opacity={0.6}
                pane="overlayPane"
                className="pissout-toilet-tooltip"
              >
                🚽
              </Tooltip>
            </CircleMarker>
          ))}

          {discoveredLocations.map((location) => {
            const isSelected = location.id === selectedId;
            return (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
                icon={buildPinIcon(VENUE_CATEGORY_META[location.category].emoji, isSelected)}
                eventHandlers={{ click: () => setSelectedId(location.id) }}
              />
            );
          })}
        </MapContainer>
      </View>

      <BottomSheet visible={!!selected} openToken={selectedId} onClose={() => setSelectedId(null)}>
        {selected ? (
          <LocationSheetContent
            location={selected}
            reviews={selectedReviews}
            overall={selectedOverall}
            onReview={() => navigation.navigate('AddReview', { locationId: selected.id })}
          />
        ) : null}
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, position: 'relative' },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.black,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
  mapCanvas: {
    flex: 1,
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
});
