import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Location, Review, VENUE_CATEGORY_META } from '../data/types';
import { colors, radii, spacing } from '../theme/colors';
import { fonts } from '../theme/typography';
import { getOpenStatus } from '../utils/openStatus';
import { ReviewCarousel } from './ReviewCarousel';
import { StarRow } from './StarRow';

interface LocationSheetContentProps {
  location: Location;
  reviews: Review[];
  overall: number;
  onReview: () => void;
}

export function LocationSheetContent({ location, reviews, overall, onReview }: LocationSheetContentProps) {
  const meta = VENUE_CATEGORY_META[location.category];
  const status = getOpenStatus(location.openingHours);
  const reviewCount = reviews.length;

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.name} numberOfLines={2}>
          {location.name || 'Unnamed public toilet'}
        </Text>
        <View style={styles.typeChip}>
          <Text style={styles.typeChipText}>
            {meta.emoji} {meta.label}
          </Text>
        </View>
      </View>

      {reviewCount > 0 ? (
        <View style={styles.ratingRow}>
          <Text style={styles.ratingNumber}>{overall.toFixed(1)}</Text>
          <StarRow value={overall} size={16} />
          <Text style={styles.ratingCount}>({reviewCount} reviews)</Text>
        </View>
      ) : null}

      <View style={styles.chipsRow}>
        <View style={[styles.statusChip, status.isOpen ? styles.statusOpen : styles.statusClosed]}>
          <Text style={[styles.statusText, status.isOpen ? styles.statusOpenText : styles.statusClosedText]}>
            {status.label}
          </Text>
        </View>
        {location.feeKnown ? (
          <View style={styles.infoChip}>
            <Text style={styles.infoChipText}>{location.feeKnown === 'free' ? 'FREE' : 'Paid'}</Text>
          </View>
        ) : null}
        {location.accessible ? (
          <View style={styles.infoChip}>
            <Text style={styles.infoChipText}>♿</Text>
          </View>
        ) : null}
        {location.babyChange ? (
          <View style={styles.infoChip}>
            <Text style={styles.infoChipText}>🚼</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.carouselSection}>
        {reviewCount > 0 ? (
          <ReviewCarousel reviews={reviews} />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>🌫️ No reviews yet — be the first!</Text>
          </View>
        )}
      </View>

      <Pressable style={styles.reviewButton} onPress={onReview}>
        <Text style={styles.reviewButtonText}>Drop a Review 💩</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.black,
  },
  typeChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  typeChipText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  ratingNumber: {
    fontFamily: fonts.bodyBlack,
    fontSize: 22,
    color: colors.black,
  },
  ratingCount: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  statusChip: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  statusOpen: { backgroundColor: '#DCFCE7' },
  statusClosed: { backgroundColor: '#FEE2E2' },
  statusText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  statusOpenText: { color: '#15803D' },
  statusClosedText: { color: '#B91C1C' },
  infoChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  infoChipText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.text,
  },
  carouselSection: {
    marginTop: spacing.md,
    marginHorizontal: -spacing.md,
  },
  emptyState: {
    marginHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyStateText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  reviewButton: {
    marginTop: spacing.md,
    backgroundColor: colors.point,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  reviewButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.black,
  },
});
