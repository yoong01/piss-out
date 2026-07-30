import React from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Review } from '../data/types';
import { colors, radii, spacing } from '../theme/colors';
import { fonts } from '../theme/typography';
import { avatarColorFor } from '../utils/avatarColor';
import { reviewOverall } from '../utils/reviewRating';
import { timeAgo } from '../utils/time';
import { StarRow } from './StarRow';

interface ReviewCarouselProps {
  reviews: Review[];
}

const CARD_WIDTH_RATIO = 0.8;
const GAP = spacing.sm;

export function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth * CARD_WIDTH_RATIO;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={cardWidth + GAP}
      decelerationRate="fast"
      snapToAlignment="start"
      contentContainerStyle={styles.row}
    >
      {reviews.map((review) => {
        const overall = reviewOverall(review.ratings);
        return (
          <View key={review.id} style={[styles.card, { width: cardWidth }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.avatar, { backgroundColor: avatarColorFor(review.authorId) }]}>
                <Text style={styles.avatarEmoji}>{review.authorAvatar}</Text>
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.username} numberOfLines={1}>
                  {review.authorName}
                </Text>
                <Text style={styles.timeAgo}>{timeAgo(review.createdAt)}</Text>
              </View>
            </View>
            <StarRow value={overall} size={13} />
            <Text style={styles.comment} numberOfLines={1}>
              {review.comment}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const AVATAR_SIZE = 36;

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.md,
    gap: GAP,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarEmoji: {
    fontSize: 17,
  },
  cardHeaderText: {
    flex: 1,
  },
  username: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.text,
  },
  timeAgo: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
  },
  comment: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.text,
    marginTop: 6,
  },
});
