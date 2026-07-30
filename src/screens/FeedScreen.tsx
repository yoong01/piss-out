import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedPostCard } from '../components/FeedPostCard';
import { WeeklyLeaderboard } from '../components/WeeklyLeaderboard';
import { useAppStore } from '../data/store';
import { Review } from '../data/types';
import { SharedStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';
import { fonts, tracking } from '../theme/typography';
import { getPrimaryNickname } from '../utils/rankEngine';

type Props = NativeStackScreenProps<SharedStackParamList, 'Feed'>;

function reviewOverall(review: Review): number {
  const values = Object.values(review.ratings);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function FeedScreen({ navigation }: Props) {
  const reviews = useAppStore((s) => s.reviews);
  const locations = useAppStore((s) => s.locations);

  const locationById = useMemo(() => new Map(locations.map((l) => [l.id, l])), [locations]);

  const reviewsByAuthor = useMemo(() => {
    const map = new Map<string, Review[]>();
    for (const review of reviews) {
      const list = map.get(review.authorId) ?? [];
      list.push(review);
      map.set(review.authorId, list);
    }
    return map;
  }, [reviews]);

  const nicknameByAuthor = useMemo(() => {
    const map = new Map<string, string>();
    for (const [authorId, authorReviews] of reviewsByAuthor) {
      map.set(authorId, getPrimaryNickname(authorReviews, 0));
    }
    return map;
  }, [reviewsByAuthor]);

  // "Top picks": highest-rated reports first, breaking ties by recency.
  const topPicks = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const ratingDiff = reviewOverall(b) - reviewOverall(a);
      if (ratingDiff !== 0) return ratingDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [reviews]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={topPicks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <WeeklyLeaderboard reviews={reviews} />
            <Text style={styles.title}>Top picks</Text>
          </>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No reports yet. Be the first to file one.</Text>
        }
        renderItem={({ item }) => {
          const location = locationById.get(item.locationId);
          if (!location) return null;
          return (
            <FeedPostCard
              review={item}
              location={location}
              nickname={nicknameByAuthor.get(item.authorId) ?? 'Recruit'}
              overall={reviewOverall(item)}
              onPress={() => navigation.navigate('LocationDetail', { locationId: location.id })}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: tracking(28),
    color: colors.black,
    paddingHorizontal: spacing.md,
    paddingTop: 40,
  },
  separator: {
    marginHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dashedBorder,
    borderStyle: 'dashed',
  },
  empty: {
    fontFamily: fonts.body,
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
});
