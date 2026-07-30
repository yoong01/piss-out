import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BadgeChip, RankInsignia } from '../components/RankBadge';
import { StarRow } from '../components/StarRow';
import { useAppStore } from '../data/store';
import { VENUE_CATEGORY_META } from '../data/types';
import { colors, radii, spacing } from '../theme/colors';
import { fonts } from '../theme/typography';
import { computeRank } from '../utils/rankEngine';
import { timeAgo } from '../utils/time';

export function ProfileScreen() {
  const profile = useAppStore((s) => s.profile);
  const allReviews = useAppStore((s) => s.reviews);
  const locations = useAppStore((s) => s.locations);

  const myReviews = useMemo(
    () => allReviews.filter((r) => r.authorId === profile.id),
    [allReviews, profile.id]
  );

  const rank = useMemo(
    () => computeRank(myReviews, profile.passcodesShared),
    [myReviews, profile.passcodesShared]
  );

  const locationById = useMemo(() => new Map(locations.map((l) => [l.id, l])), [locations]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Profile</Text>
        <Text style={styles.pageTagline}>Your service record.</Text>

        <View style={styles.rankCard}>
          <RankInsignia title={rank.title} tier={rank.tier} />
          {rank.nextTitle && (
            <Text style={styles.nextRank}>
              {rank.reviewsToNextTier} review{rank.reviewsToNextTier === 1 ? '' : 's'} to {rank.nextTitle}
            </Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.reviewCount}</Text>
            <Text style={styles.statLabel}>Reports Filed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.passcodesShared}</Text>
            <Text style={styles.statLabel}>Codes Shared</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{rank.badges.length}</Text>
            <Text style={styles.statLabel}>Commendations</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Commendations</Text>
        {rank.badges.length === 0 ? (
          <Text style={styles.emptyState}>
            No commendations yet. File reports to earn your stripes.
          </Text>
        ) : (
          rank.badges.map((badge) => <BadgeChip key={badge.id} badge={badge} />)
        )}

        <Text style={styles.sectionTitle}>My Ratings</Text>
        {myReviews.length === 0 ? (
          <Text style={styles.emptyState}>
            You haven't filed a report yet. Your ratings will show up here.
          </Text>
        ) : (
          myReviews.map((review) => {
            const location = locationById.get(review.locationId);
            const values = Object.values(review.ratings);
            const overall = values.reduce((a, b) => a + b, 0) / values.length;
            return (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewLocationName} numberOfLines={1}>
                    {location ? `${VENUE_CATEGORY_META[location.category].emoji} ${location.name}` : 'Unknown spot'}
                  </Text>
                  <Text style={styles.reviewDate}>{timeAgo(review.createdAt)}</Text>
                </View>
                <StarRow value={overall} size={14} />
                {review.comment ? (
                  <Text style={styles.reviewComment} numberOfLines={2}>
                    {review.comment}
                  </Text>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
  pageTitle: { fontFamily: fonts.display, fontSize: 26, color: colors.black },
  pageTagline: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  rankCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  nextRank: {
    fontFamily: fonts.body,
    marginTop: spacing.sm,
    fontSize: 12,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: { fontFamily: fonts.bodyBlack, fontSize: 22, color: colors.black },
  statLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontFamily: fonts.display, fontSize: 18, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.sm },
  emptyState: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  reviewLocationName: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.text, flex: 1, marginRight: spacing.sm },
  reviewDate: { fontFamily: fonts.body, fontSize: 11, color: colors.textMuted },
  reviewComment: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
});
