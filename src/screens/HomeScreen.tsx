import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LocationCard } from '../components/LocationCard';
import { useAppStore } from '../data/store';
import { VENUE_CATEGORY_META, VenueCategory } from '../data/types';
import { colors, radii, spacing } from '../theme/colors';
import { APP_NAME, APP_TAGLINE, HOME_EMPTY_STATE } from '../theme/copy';
import { Coordinates, distanceKm, formatDistance } from '../utils/distance';
import { FindStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<FindStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const locations = useAppStore((s) => s.locations);
  const reviews = useAppStore((s) => s.reviews);
  const averageRatingsForLocation = useAppStore((s) => s.averageRatingsForLocation);

  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<VenueCategory | null>(null);
  const [query, setQuery] = useState('');

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
        // Permission denied or unavailable — fall back to unsorted list.
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = locations;
    if (categoryFilter) list = list.filter((l) => l.category === categoryFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (l) => l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q)
      );
    }
    if (userCoords) {
      return [...list].sort(
        (a, b) => distanceKm(userCoords, a) - distanceKm(userCoords, b)
      );
    }
    return list;
  }, [locations, categoryFilter, query, userCoords]);

  const categories = Object.keys(VENUE_CATEGORY_META) as VenueCategory[];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.tagline}>{APP_TAGLINE}</Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search by name or street..."
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(c) => c}
        contentContainerStyle={styles.chipRow}
        renderItem={({ item }) => {
          const meta = VENUE_CATEGORY_META[item];
          const active = categoryFilter === item;
          return (
            <Pressable
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setCategoryFilter(active ? null : item)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {meta.emoji} {meta.label}
              </Text>
            </Pressable>
          );
        }}
        style={styles.chipList}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{HOME_EMPTY_STATE}</Text>}
        renderItem={({ item }) => {
          const { overall, count } = averageRatingsForLocation(item.id);
          const distanceLabel = userCoords
            ? formatDistance(distanceKm(userCoords, item))
            : undefined;
          return (
            <LocationCard
              location={item}
              averageOverall={overall}
              reviewCount={count}
              distanceLabel={distanceLabel}
              onPress={() => navigation.navigate('LocationDetail', { locationId: item.id })}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  tagline: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  search: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  chipList: {
    flexGrow: 0,
    marginBottom: spacing.sm,
  },
  chipRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.surface,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
