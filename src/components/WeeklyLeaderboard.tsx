import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Review } from '../data/types';
import { colors, radii, spacing } from '../theme/colors';
import { fonts, tracking } from '../theme/typography';
import { getPrimaryNickname } from '../utils/rankEngine';

interface WeeklyLeaderboardProps {
  reviews: Review[];
}

interface LeaderboardEntry {
  authorId: string;
  authorName: string;
  nickname: string;
  loosVisited: number;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 10;
const LIST_MAX_HEIGHT = 320;

function computeWeeklyLeaderboard(reviews: Review[]): LeaderboardEntry[] {
  const cutoff = Date.now() - WEEK_MS;
  const recent = reviews.filter((r) => new Date(r.createdAt).getTime() >= cutoff);

  const byAuthor = new Map<string, { authorName: string; locationIds: Set<string>; reviews: Review[] }>();
  for (const review of recent) {
    let entry = byAuthor.get(review.authorId);
    if (!entry) {
      entry = { authorName: review.authorName, locationIds: new Set(), reviews: [] };
      byAuthor.set(review.authorId, entry);
    }
    entry.locationIds.add(review.locationId);
    entry.reviews.push(review);
  }

  return Array.from(byAuthor.entries())
    .map(([authorId, v]) => ({
      authorId,
      authorName: v.authorName,
      nickname: getPrimaryNickname(v.reviews, 0),
      loosVisited: v.locationIds.size,
    }))
    .sort((a, b) => b.loosVisited - a.loosVisited)
    .slice(0, MAX_ENTRIES);
}

export function WeeklyLeaderboard({ reviews }: WeeklyLeaderboardProps) {
  const entries = useMemo(() => computeWeeklyLeaderboard(reviews), [reviews]);

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Weekly leaderboard</Text>
      {entries.length === 0 ? (
        <Text style={styles.empty}>No reports filed this week yet.</Text>
      ) : (
        <ScrollView style={styles.list} nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {entries.map((entry, index) => (
            <View key={entry.authorId} style={styles.row}>
              <View style={[styles.rankBadge, index === 0 && styles.rankBadgeFirst]}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>{entry.authorName.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.username} numberOfLines={1}>
                  {entry.authorName}
                </Text>
                <Text style={styles.nickname} numberOfLines={1}>
                  {entry.nickname}
                </Text>
              </View>
              <Text style={styles.count}>{entry.loosVisited} loos</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: 40,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dashedBorder,
    borderStyle: 'dashed',
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: tracking(28),
    color: colors.black,
    marginBottom: spacing.md,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: tracking(13),
    color: colors.textMuted,
  },
  list: {
    maxHeight: LIST_MAX_HEIGHT,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.black,
  },
  rankBadgeFirst: {
    backgroundColor: colors.point,
  },
  rankNumber: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.black,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.black,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: tracking(13),
    color: colors.black,
  },
  nickname: {
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: tracking(13),
    color: colors.textMuted,
  },
  count: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: tracking(13),
    color: colors.black,
  },
});
