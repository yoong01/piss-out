import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '../data/types';
import { colors, radii, spacing } from '../theme/colors';
import { fonts } from '../theme/typography';

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
      <View style={styles.chipEmojiWrap}>
        <Text style={styles.chipEmoji}>{badge.emoji}</Text>
      </View>
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
    color: colors.black,
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.black,
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
  chipEmojiWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.point,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  chipEmoji: {
    fontSize: 20,
  },
  chipTextWrap: {
    flex: 1,
  },
  chipName: {
    fontFamily: fonts.bodyBold,
    color: colors.text,
    fontSize: 14,
  },
  chipDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
});
