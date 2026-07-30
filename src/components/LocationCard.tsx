import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Location, VENUE_CATEGORY_META } from '../data/types';
import { colors, radii, spacing } from '../theme/colors';
import { StarRow } from './StarRow';

interface LocationCardProps {
  location: Location;
  averageOverall: number;
  reviewCount: number;
  distanceLabel?: string;
  onPress: () => void;
}

export function LocationCard({
  location,
  averageOverall,
  reviewCount,
  distanceLabel,
  onPress,
}: LocationCardProps) {
  const meta = VENUE_CATEGORY_META[location.category];

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{meta.emoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>
            {location.name}
          </Text>
          <Text style={styles.address} numberOfLines={1}>
            {location.address}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.ratingRow}>
          <StarRow value={averageOverall} size={16} />
          <Text style={styles.reviewCount}>
            {reviewCount > 0 ? `(${reviewCount})` : 'No reviews yet'}
          </Text>
        </View>
        <View style={styles.badges}>
          {location.freeToEnter && <Text style={styles.freeBadge}>Free entry</Text>}
          {distanceLabel && <Text style={styles.distance}>{distanceLabel}</Text>}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  emoji: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  address: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  freeBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  distance: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
