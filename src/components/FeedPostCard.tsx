import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Location, Review, VENUE_CATEGORY_META } from '../data/types';
import { colors, radii, spacing } from '../theme/colors';
import { fonts, tracking } from '../theme/typography';
import { timeAgo } from '../utils/time';
import { StarRow } from './StarRow';

interface FeedPostCardProps {
  review: Review;
  location: Location;
  nickname: string;
  overall: number;
  onPress: () => void;
}

const PHOTO_SIZE = 128;
const MAX_PHOTOS_SHOWN = 3;

export function FeedPostCard({ review, location, nickname, overall, onPress }: FeedPostCardProps) {
  const meta = VENUE_CATEGORY_META[location.category];
  const photoCount = Math.min(review.photos ?? 0, MAX_PHOTOS_SHOWN);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.authorRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>{review.authorName.charAt(0).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.username}>{review.authorName}</Text>
          <Text style={styles.nickname}>{nickname}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.ratingRow}>
          <StarRow value={overall} size={16} />
          <Text style={styles.timeAgo}>{timeAgo(review.createdAt)}</Text>
        </View>

        {review.comment ? (
          <Text style={styles.comment} numberOfLines={2}>
            {review.comment}
          </Text>
        ) : null}

        <View style={styles.locationCard}>
          <View style={styles.locationThumb}>
            <Text style={styles.locationThumbEmoji}>{meta.emoji}</Text>
          </View>
          <View style={styles.locationText}>
            <Text style={styles.locationName} numberOfLines={1}>
              {location.name}
            </Text>
            <Text style={styles.areaName} numberOfLines={1}>
              {location.address}
            </Text>
          </View>
        </View>

        {photoCount > 0 && (
          <View style={styles.photoRow}>
            {Array.from({ length: photoCount }, (_, i) => (
              <View key={i} style={styles.photoTile} />
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.md,
    paddingVertical: 40,
    gap: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  body: {
    gap: spacing.sm + 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  timeAgo: {
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: tracking(13),
    color: colors.textMuted,
  },
  comment: {
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: tracking(13),
    color: colors.black,
    lineHeight: 15,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  locationThumb: {
    width: 73,
    height: 73,
    backgroundColor: colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationThumbEmoji: {
    fontSize: 28,
  },
  locationText: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingRight: spacing.sm,
  },
  locationName: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    letterSpacing: tracking(15),
    color: colors.black,
  },
  areaName: {
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: tracking(13),
    color: colors.textMuted,
    marginTop: 2,
  },
  photoRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  photoTile: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: radii.md,
    backgroundColor: colors.placeholder,
  },
});
