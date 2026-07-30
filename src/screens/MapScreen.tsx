import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../data/store';
import { Location, VENUE_CATEGORY_META } from '../data/types';
import { SharedStackParamList } from '../navigation/types';
import { colors, radii, spacing } from '../theme/colors';
import { APP_NAME, APP_TAGLINE } from '../theme/copy';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<SharedStackParamList, 'Map'>;

interface Pin {
  location: Location;
  left: number;
  top: number;
}

const PADDING_PCT = 0.12;

export function MapScreen({ navigation }: Props) {
  const locations = useAppStore((s) => s.locations);
  const averageRatingsForLocation = useAppStore((s) => s.averageRatingsForLocation);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pins = useMemo<Pin[]>(() => {
    if (locations.length === 0) return [];
    const lats = locations.map((l) => l.latitude);
    const lngs = locations.map((l) => l.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;
    const span = 1 - PADDING_PCT * 2;

    return locations.map((location) => {
      const normLng = (location.longitude - minLng) / lngRange;
      const normLat = (location.latitude - minLat) / latRange;
      return {
        location,
        left: PADDING_PCT + normLng * span,
        // Screen y grows downward; higher latitude (north) should render higher up.
        top: PADDING_PCT + (1 - normLat) * span,
      };
    });
  }, [locations]);

  const selected = pins.find((p) => p.location.id === selectedId) ?? null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.tagline}>{APP_TAGLINE}</Text>
      </View>

      <View style={styles.mapCanvas}>
        <MapGrid />
        {pins.map((pin) => {
          const isSelected = pin.location.id === selectedId;
          return (
            <Pressable
              key={pin.location.id}
              style={[
                styles.pinWrap,
                { left: `${pin.left * 100}%`, top: `${pin.top * 100}%` },
              ]}
              onPress={() => setSelectedId(pin.location.id)}
              hitSlop={10}
            >
              <View style={[styles.pin, isSelected && styles.pinSelected]}>
                <Text style={styles.pinEmoji}>{VENUE_CATEGORY_META[pin.location.category].emoji}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.previewCard}>
        {selected ? (
          <>
            <View style={styles.previewHeaderRow}>
              <Text style={styles.previewName} numberOfLines={1}>
                {selected.location.name}
              </Text>
              <Text style={styles.previewMeta}>
                {averageRatingsForLocation(selected.location.id).count} reports
              </Text>
            </View>
            <Text style={styles.previewAddress} numberOfLines={1}>
              {selected.location.address}
            </Text>
            <Pressable
              style={styles.previewButton}
              onPress={() =>
                navigation.navigate('LocationDetail', { locationId: selected.location.id })
              }
            >
              <Text style={styles.previewButtonText}>View details</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.previewHint}>
            Tap a pin to preview a spot. Real map tiles are coming soon.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

function MapGrid() {
  const cols = 6;
  const rows = 9;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: cols - 1 }, (_, i) => (
        <View
          key={`c-${i}`}
          style={[styles.gridLineV, { left: `${((i + 1) / cols) * 100}%` }]}
        />
      ))}
      {Array.from({ length: rows - 1 }, (_, i) => (
        <View
          key={`r-${i}`}
          style={[styles.gridLineH, { top: `${((i + 1) / rows) * 100}%` }]}
        />
      ))}
    </View>
  );
}

const PIN_SIZE = 34;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.border,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border,
  },
  pinWrap: {
    position: 'absolute',
    width: PIN_SIZE,
    height: PIN_SIZE,
    marginLeft: -PIN_SIZE / 2,
    marginTop: -PIN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    width: PIN_SIZE,
    height: PIN_SIZE,
    borderRadius: PIN_SIZE / 2,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.black,
  },
  pinSelected: {
    backgroundColor: colors.point,
    borderColor: colors.black,
  },
  pinEmoji: {
    fontSize: 16,
  },
  previewCard: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 84,
    justifyContent: 'center',
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewName: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.black,
    flex: 1,
    marginRight: spacing.sm,
  },
  previewMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  previewAddress: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  previewButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.point,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  previewButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.black,
  },
  previewHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
