import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PasscodeGate } from '../components/PasscodeGate';
import { StarRow } from '../components/StarRow';
import { useAppStore } from '../data/store';
import { RATING_CATEGORY_META, RATING_CATEGORY_ORDER, VENUE_CATEGORY_META } from '../data/types';
import { computeRank } from '../utils/rankEngine';
import { colors, radii, spacing } from '../theme/colors';
import { fonts } from '../theme/typography';
import { SharedStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<SharedStackParamList, 'LocationDetail'>;

const BREAKDOWN_DISPLAY_ORDER = RATING_CATEGORY_ORDER.filter(
  (key) => key !== 'privacy' && key !== 'logistics' && key !== 'fee' && key !== 'passcodeExperience'
);

export function LocationDetailScreen({ route, navigation }: Props) {
  const { locationId } = route.params;
  const location = useAppStore((s) => s.locations.find((l) => l.id === locationId));
  const profile = useAppStore((s) => s.profile);
  const allReviews = useAppStore((s) => s.reviews);

  const reviews = useMemo(
    () => allReviews.filter((r) => r.locationId === locationId),
    [allReviews, locationId]
  );

  const myReviews = useMemo(
    () => allReviews.filter((r) => r.authorId === profile.id),
    [allReviews, profile.id]
  );

  const rank = useMemo(
    () => computeRank(myReviews, profile.passcodesShared),
    [myReviews, profile.passcodesShared]
  );

  const categoryAverages = useMemo(() => {
    const result: Record<string, number> = {};
    for (const key of RATING_CATEGORY_ORDER) {
      const values = reviews.map((r) => r.ratings[key]);
      result[key] = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    }
    return result;
  }, [reviews]);

  const sharedPasscodes = reviews.filter((r) => r.hasPasscode && r.passcode);

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.missing}>This throne has vanished. It may have been decommissioned.</Text>
      </SafeAreaView>
    );
  }

  const meta = VENUE_CATEGORY_META[location.category];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.name}>
          {meta.emoji} {location.name}
        </Text>
        <Text style={styles.address}>{location.address}</Text>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>{location.freeToEnter ? 'Free entry' : 'Purchase may be expected'}</Text>
        </View>

        <Pressable
          style={styles.addReviewButton}
          onPress={() => navigation.navigate('AddReview', { locationId })}
        >
          <Text style={styles.addReviewText}>File a Report</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        <View style={styles.breakdown}>
          {BREAKDOWN_DISPLAY_ORDER.map((key) => {
            const catMeta = RATING_CATEGORY_META[key];
            return (
              <View key={key} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  {catMeta.emoji} {catMeta.label}
                </Text>
                <StarRow value={categoryAverages[key]} size={14} />
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Door Codes</Text>
        <PasscodeGate
          unlocked={rank.passcodeAccessUnlocked}
          reviewsUntilUnlock={rank.reviewsUntilPasscodeAccess}
        >
          {sharedPasscodes.length === 0 ? (
            <Text style={styles.noCodes}>No codes reported yet. Ask staff, or be the hero who logs it.</Text>
          ) : (
            sharedPasscodes.map((r) => (
              <View key={r.id} style={styles.codeRow}>
                <Text style={styles.codeValue}>{r.passcode}</Text>
                <Text style={styles.codeMeta}>reported by {r.authorName}</Text>
              </View>
            ))
          )}
        </PasscodeGate>

        <Text style={styles.sectionTitle}>Reports ({reviews.length})</Text>
        {reviews.length === 0 && (
          <Text style={styles.noCodes}>No reports filed yet. Be the first scout.</Text>
        )}
        {reviews.map((r) => (
          <View key={r.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewAuthor}>{r.authorName}</Text>
              <Text style={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString()}</Text>
            </View>
            {r.comment ? <Text style={styles.reviewComment}>{r.comment}</Text> : null}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
  missing: { padding: spacing.lg, textAlign: 'center', color: colors.textMuted, fontFamily: fonts.body },
  name: { fontFamily: fonts.display, fontSize: 24, color: colors.text },
  address: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  tagRow: { flexDirection: 'row', marginTop: spacing.sm },
  tag: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.black,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.black,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  addReviewButton: {
    backgroundColor: colors.point,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  addReviewText: { fontFamily: fonts.bodyBold, color: colors.black, fontSize: 15 },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  breakdown: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  breakdownLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.text },
  noCodes: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  codeValue: { fontFamily: fonts.bodyBlack, fontSize: 16, letterSpacing: 2, color: colors.black },
  codeMeta: { fontFamily: fonts.body, fontSize: 11, color: colors.textMuted },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewAuthor: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.text },
  reviewDate: { fontFamily: fonts.body, fontSize: 11, color: colors.textMuted },
  reviewComment: { fontFamily: fonts.body, fontSize: 13, color: colors.text, marginTop: spacing.xs, lineHeight: 18 },
});
