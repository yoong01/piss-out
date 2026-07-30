import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '../data/types';
import { colors, radii, spacing } from '../theme/colors';

interface RankBadgeProps {
  title: string;
  tier: number;
}

export function RankInsignia({ title, tier }: RankBadgeProps) {
  const stripes = '▮'.repeat(Math.min(5, Math.max(1, tier)));
  return (
    <View style={styles.insigniaWrap}>
      <Text style={styles.stripes}>{tier === 0 ? '·' : stripes}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export function BadgeChip({ badge }: { badge: Badge }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipEmoji}>{badge.emoji}</Text>
      <View style={styles.chipTextWrap}>
        <Text style={styles.chipName}>{badge.name}</Text>
        <Text style={styles.chipDesc}>{badge.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  insigniaWrap: {
    alignItems: 'center',
  },
  stripes: {
    color: colors.gold,
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  chip: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  chipEmoji: {
    fontSize: 22,
    marginRight: spacing.sm,
  },
  chipTextWrap: {
    flex: 1,
  },
  chipName: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 14,
  },
  chipDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
});
