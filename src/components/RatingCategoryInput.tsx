import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RATING_CATEGORY_META, RatingCategoryKey } from '../data/types';
import { colors, spacing } from '../theme/colors';
import { fonts } from '../theme/typography';
import { StarRow } from './StarRow';

interface RatingCategoryInputProps {
  category: RatingCategoryKey;
  value: number;
  onChange: (value: number) => void;
}

export function RatingCategoryInput({ category, value, onChange }: RatingCategoryInputProps) {
  const meta = RATING_CATEGORY_META[category];

  return (
    <View style={styles.row}>
      <View style={styles.labelWrap}>
        <Text style={styles.label}>
          {meta.emoji} {meta.label}
        </Text>
        <Text style={styles.description}>{meta.description}</Text>
      </View>
      <StarRow value={value} onChange={onChange} size={24} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  labelWrap: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.text,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
