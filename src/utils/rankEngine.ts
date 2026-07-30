import { Badge, PASSCODE_ACCESS_REVIEW_THRESHOLD, RankResult, Review } from '../data/types';

interface RankTier {
  tier: number;
  title: string;
  minReviews: number;
}

// Military progression, toilet-themed. Ordered ascending by minReviews.
const RANK_TIERS: RankTier[] = [
  { tier: 0, title: 'Civilian', minReviews: 0 },
  { tier: 1, title: 'Recruit', minReviews: 1 },
  { tier: 2, title: 'Private Pooper', minReviews: PASSCODE_ACCESS_REVIEW_THRESHOLD },
  { tier: 3, title: 'Corporal Commode', minReviews: 10 },
  { tier: 4, title: 'Sergeant Splash', minReviews: 20 },
  { tier: 5, title: 'Lieutenant Loo', minReviews: 35 },
  { tier: 6, title: 'Captain Cubicle', minReviews: 55 },
  { tier: 7, title: 'Major Movement', minReviews: 80 },
  { tier: 8, title: 'Colonel Crapper', minReviews: 120 },
  { tier: 9, title: 'General Number Two', minReviews: 175 },
];

function currentTierIndex(reviewCount: number): number {
  let idx = 0;
  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (reviewCount >= RANK_TIERS[i].minReviews) idx = i;
  }
  return idx;
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/**
 * Badges are earned from review *behavior*, independent of rank tier.
 * Thresholds are intentionally low so new users can unlock something quickly.
 */
function computeBadges(reviews: Review[], passcodesShared: number): Badge[] {
  const badges: Badge[] = [];

  if (passcodesShared >= 10) {
    badges.push({
      id: 'passcode-master',
      name: 'Passcode Master',
      description: 'Shared 10+ door codes with the community. A true key-keeper.',
      emoji: '🗝️',
    });
  }

  const lowPrivacyReviews = reviews.filter((r) => r.ratings.privacy <= 2).length;
  if (lowPrivacyReviews >= 5) {
    badges.push({
      id: 'exhibitionist',
      name: 'Exhibitionist',
      description: "Rated privacy low 5+ times and kept going anyway. Fearless.",
      emoji: '🎭',
    });
  }

  const longReviews = reviews.filter((r) => r.comment.trim().length >= 300).length;
  if (longReviews >= 3) {
    badges.push({
      id: 'bomber',
      name: 'Bomber',
      description: 'Dropped 3+ novel-length reviews. Nobody asked for this much detail. Everybody needed it.',
      emoji: '💣',
    });
  }

  const detailedReviews = reviews.filter((r) => r.comment.trim().length >= 80);
  const avgQualityGiven = average(
    reviews.map((r) =>
      average(Object.values(r.ratings))
    )
  );
  if (reviews.length >= 15 && detailedReviews.length / Math.max(reviews.length, 1) >= 0.5 && avgQualityGiven >= 4) {
    badges.push({
      id: 'weezard',
      name: 'Weezard',
      description: 'Conjures thorough, high-quality reviews out of thin air. A true wee-zard of the craft.',
      emoji: '🧙',
    });
  }

  const accessibilityChampion = reviews.filter((r) => r.ratings.accessibility >= 4).length;
  if (accessibilityChampion >= 5) {
    badges.push({
      id: 'plumber',
      name: 'Plumber',
      description: 'Flagged 5+ genuinely accessible spots. Fixing the system, one review at a time.',
      emoji: '🔧',
    });
  }

  const freeSpots = reviews.filter((r) => r.ratings.fee >= 4).length;
  if (freeSpots >= 10) {
    badges.push({
      id: 'freeloader',
      name: 'Freeloader',
      description: 'Found 10+ cheap or free relief spots. Wallet-friendly and proud of it.',
      emoji: '🪙',
    });
  }

  return badges;
}

/**
 * Display nickname shown next to a username — a badge earned from their
 * behavior when they have one (e.g. "Weezard"), otherwise their rank title.
 */
export function getPrimaryNickname(reviews: Review[], passcodesShared: number): string {
  const rank = computeRank(reviews, passcodesShared);
  return rank.badges[0]?.name ?? rank.title;
}

export function computeRank(reviews: Review[], passcodesShared: number): RankResult {
  const reviewCount = reviews.length;
  const tierIdx = currentTierIndex(reviewCount);
  const currentTier = RANK_TIERS[tierIdx];
  const nextTier = RANK_TIERS[tierIdx + 1] ?? null;

  return {
    title: currentTier.title,
    tier: currentTier.tier,
    nextTitle: nextTier?.title ?? null,
    reviewsToNextTier: nextTier ? nextTier.minReviews - reviewCount : null,
    badges: computeBadges(reviews, passcodesShared),
    passcodeAccessUnlocked: reviewCount >= PASSCODE_ACCESS_REVIEW_THRESHOLD,
    reviewsUntilPasscodeAccess: Math.max(0, PASSCODE_ACCESS_REVIEW_THRESHOLD - reviewCount),
  };
}
