import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarRow } from '../components/StarRow';
import { useAppStore } from '../data/store';
import { Review, VENUE_CATEGORY_META } from '../data/types';
import { SharedStackParamList } from '../navigation/types';
import { colors, radii, spacing } from '../theme/colors';
import { fonts } from '../theme/typography';
import { Coordinates, distanceKm, formatDistance } from '../utils/distance';
import { timeAgo } from '../utils/time';

type Props = NativeStackScreenProps<SharedStackParamList, 'Feed'>;

type SortMode = 'recent' | 'trending' | 'nearby';

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'recent', label: 'Recent' },
  { key: 'trending', label: 'Trending' },
  { key: 'nearby', label: 'Nearby' },
];

function reviewOverall(review: Review): number {
  const values = Object.values(review.ratings);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function FeedScreen({ navigation }: Props) {
  const reviews = useAppStore((s) => s.reviews);
  const locations = useAppStore((s) => s.locations);
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const position = await Location.getCurrentPositionAsync({});
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch {
        // No location available — nearby sort falls back to recent order.
      }
    })();
  }, []);

  const locationById = useMemo(() => {
    const map = new Map(locations.map((l) => [l.id, l]));
    return map;
  }, [locations]);

  const sorted = useMemo(() => {
    const list = [...reviews];
    if (sortMode === 'trending') {
      return list.sort((a, b) => reviewOverall(b) - reviewOverall(a));
    }
    if (sortMode === 'nearby' && userCoords) {
      return list.sort((a, b) => {
        const locA = locationById.get(a.locationId);
        const locB = locationById.get(b.locationId);
        const distA = locA ? distanceKm(userCoords, locA) : Infinity;
        const distB = locB ? distanceKm(userCoords, locB) : Infinity;
        return distA - distB;
      });
    }
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reviews, sortMode, userCoords, locationById]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Feed</Text>
        <Text style={styles.tagline}>What the squad found out there.</Text>
      </View>

      <View style={styles.sortRow}>
        {SORT_OPTIONS.map((opt) => {
          const active = sortMode === opt.key;
          return (
            <Pressable
              key={opt.key}
              style={[styles.sortChip, active && styles.sortChipActive]}
              onPress={() => setSortMode(opt.key)}
            >
              <Text style={[styles.sortChipText, active && styles.sortChipTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No reports yet. Be the first to file one.</Text>
        }
        renderItem={({ item }) => {
          const location = locationById.get(item.locationId);
          if (!location) return null;
          const meta = VENUE_CATEGORY_META[location.category];
          const distanceLabel =
            sortMode === 'nearby' && userCoords
              ? formatDistance(distanceKm(userCoords, location))
              : null;
          return (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('LocationDetail', { locationId: location.id })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}>{meta.emoji}</Text>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardLocationName} numberOfLines={1}>
                    {location.name}
                  </Text>
                  <Text style={styles.cardMeta}>
                    {item.authorName} · {timeAgo(item.createdAt)}
                    {distanceLabel ? ` · ${distanceLabel}` : ''}
                  </Text>
                </View>
                <StarRow value={reviewOverall(item)} size={14} />
              </View>
              {item.comment ? (
                <Text style={styles.cardComment} numberOfLines={3}>
                  {item.comment}
                </Text>
              ) : null}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.black,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  sortRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sortChip: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
  sortChipActive: {
    backgroundColor: colors.point,
  },
  sortChipText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.black,
  },
  sortChipTextActive: {
    color: colors.black,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  cardHeaderText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cardLocationName: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.black,
  },
  cardMeta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  cardComment: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.text,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  empty: {
    fontFamily: fonts.body,
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
