export type RatingCategoryKey =
  | 'smell'
  | 'logistics'
  | 'accessibility'
  | 'signal'
  | 'fee'
  | 'passcodeExperience'
  | 'toiletPaper'
  | 'ambience'
  | 'privacy'
  | 'aftercare';

export type RatingCategories = Record<RatingCategoryKey, number>;

export type VenueCategory =
  | 'restaurant'
  | 'museum'
  | 'tubeStation'
  | 'pub'
  | 'cafe'
  | 'publicToilet'
  | 'shop'
  | 'other';

export interface Review {
  id: string;
  locationId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  ratings: RatingCategories;
  comment: string;
  hasPasscode: boolean;
  passcode?: string;
}

export interface OpeningHours {
  open: string;
  close: string;
}

export interface Location {
  id: string;
  name: string;
  category: VenueCategory;
  address: string;
  latitude: number;
  longitude: number;
  requiresPurchase: boolean;
  freeToEnter: boolean;
  openingHours: OpeningHours;
  discovered: boolean;
  feeKnown?: 'free' | 'paid';
  accessible?: boolean;
  babyChange?: boolean;
}

export const DEFAULT_OPENING_HOURS_BY_CATEGORY: Record<VenueCategory, OpeningHours> = {
  restaurant: { open: '12:00', close: '22:30' },
  museum: { open: '10:00', close: '18:00' },
  tubeStation: { open: '05:00', close: '00:30' },
  pub: { open: '11:00', close: '23:00' },
  cafe: { open: '07:00', close: '19:00' },
  publicToilet: { open: '08:00', close: '20:00' },
  shop: { open: '09:00', close: '20:00' },
  other: { open: '09:00', close: '18:00' },
};

export interface UserProfile {
  id: string;
  displayName: string;
  reviewCount: number;
  passcodesShared: number;
}

export interface RankResult {
  title: string;
  tier: number;
  nextTitle: string | null;
  reviewsToNextTier: number | null;
  badges: Badge[];
  passcodeAccessUnlocked: boolean;
  reviewsUntilPasscodeAccess: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export const RATING_CATEGORY_META: Record<
  RatingCategoryKey,
  { label: string; emoji: string; description: string }
> = {
  smell: { label: 'Smell', emoji: '👃', description: 'Does it smell like victory or defeat?' },
  logistics: { label: 'Logistics', emoji: '🧭', description: 'How easy was it to find and get to?' },
  accessibility: { label: 'Accessibility', emoji: '♿', description: 'Wheelchair / mobility friendliness.' },
  signal: { label: 'Phone Signal', emoji: '📶', description: 'Can you doomscroll in peace?' },
  fee: { label: 'Fee', emoji: '💰', description: 'How painless was it on your wallet?' },
  passcodeExperience: { label: 'Passcode', emoji: '🔐', description: 'How easy was the code to get/use?' },
  toiletPaper: { label: 'Toilet Paper', emoji: '🧻', description: 'Quality and stock of the good stuff.' },
  ambience: { label: 'Ambience', emoji: '🎵', description: 'Music, vibe, general atmosphere.' },
  privacy: { label: 'Privacy', emoji: '🚪', description: 'Door gaps, lock quality, peace of mind.' },
  aftercare: { label: 'Aftercare', emoji: '🧼', description: 'Handwash, soap, drying, cleanliness after.' },
};

export const RATING_CATEGORY_ORDER: RatingCategoryKey[] = [
  'smell',
  'logistics',
  'accessibility',
  'signal',
  'fee',
  'passcodeExperience',
  'toiletPaper',
  'ambience',
  'privacy',
  'aftercare',
];

export const VENUE_CATEGORY_META: Record<VenueCategory, { label: string; emoji: string }> = {
  restaurant: { label: 'Restaurant', emoji: '🍽️' },
  museum: { label: 'Museum', emoji: '🏛️' },
  tubeStation: { label: 'Tube Station', emoji: '🚇' },
  pub: { label: 'Pub', emoji: '🍺' },
  cafe: { label: 'Cafe', emoji: '☕' },
  publicToilet: { label: 'Public Toilet', emoji: '🚻' },
  shop: { label: 'Shop', emoji: '🛍️' },
  other: { label: 'Other', emoji: '📍' },
};

export const PASSCODE_ACCESS_REVIEW_THRESHOLD = 5;
