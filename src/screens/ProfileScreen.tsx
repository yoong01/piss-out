import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BadgeChip, RankInsignia } from '../components/RankBadge';
import { useAppStore } from '../data/store';
import { colors, radii, spacing } from '../theme/colors';
import { computeRank } from '../utils/rankEngine';

export function ProfileScreen() {
  const profile = useAppStore((s) => s.profile);
  const reviews = useAppStore((s) => s.reviews);

  const rank = useMemo(
    () => computeRank(reviews, profile.passcodesShared),
    [reviews, profile.passcodesShared]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
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
          <Text style={styles.emptyBadges}>
            No commendations yet. File reports to earn your stripes.
          </Text>
        ) : (
          rank.badges.map((badge) => <BadgeChip key={badge.id} badge={badge} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
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
  statValue: { fontSize: 22, fontWeight: '900', color: colors.primaryDark },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  emptyBadges: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic' },
});
