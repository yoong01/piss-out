import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MOCK_LOCATIONS } from './mockLocations';
import { MOCK_REVIEWS } from './mockReviews';
import { DEFAULT_OPENING_HOURS_BY_CATEGORY, Location, RatingCategories, Review, UserProfile } from './types';
import { UNDISCOVERED_TOILETS } from './undiscoveredToilets';
import { generateId } from '../utils/id';

const DISCOVERED_VENUES: Location[] = MOCK_LOCATIONS.map((venue) => ({
  ...venue,
  discovered: true,
  openingHours: DEFAULT_OPENING_HOURS_BY_CATEGORY[venue.category],
}));

const ALL_LOCATIONS: Location[] = [...DISCOVERED_VENUES, ...UNDISCOVERED_TOILETS];

interface AppState {
  hasHydrated: boolean;
  locations: Location[];
  reviews: Review[];
  profile: UserProfile;
  setHasHydrated: (value: boolean) => void;
  addReview: (input: {
    locationId: string;
    ratings: RatingCategories;
    comment: string;
    hasPasscode: boolean;
    passcode?: string;
  }) => void;
  reviewsForLocation: (locationId: string) => Review[];
  averageRatingsForLocation: (locationId: string) => { overall: number; count: number };
  myReviews: () => Review[];
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'me',
  displayName: 'You',
  reviewCount: 0,
  passcodesShared: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      locations: ALL_LOCATIONS,
      reviews: MOCK_REVIEWS,
      profile: DEFAULT_PROFILE,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      addReview: ({ locationId, ratings, comment, hasPasscode, passcode }) => {
        const review: Review = {
          id: generateId('review'),
          locationId,
          authorId: get().profile.id,
          authorName: get().profile.displayName,
          authorAvatar: '🙋',
          createdAt: new Date().toISOString(),
          ratings,
          comment,
          hasPasscode,
          passcode: hasPasscode ? passcode : undefined,
        };
        set((state) => ({
          reviews: [review, ...state.reviews],
          profile: {
            ...state.profile,
            reviewCount: state.profile.reviewCount + 1,
            passcodesShared:
              state.profile.passcodesShared + (hasPasscode && passcode ? 1 : 0),
          },
        }));
      },
      reviewsForLocation: (locationId) =>
        get().reviews.filter((r) => r.locationId === locationId),
      averageRatingsForLocation: (locationId) => {
        const reviews = get().reviews.filter((r) => r.locationId === locationId);
        if (reviews.length === 0) return { overall: 0, count: 0 };
        const overallPerReview = reviews.map((r) => {
          const values = Object.values(r.ratings);
          return values.reduce((a, b) => a + b, 0) / values.length;
        });
        const overall =
          overallPerReview.reduce((a, b) => a + b, 0) / overallPerReview.length;
        return { overall, count: reviews.length };
      },
      myReviews: () => get().reviews.filter((r) => r.authorId === get().profile.id),
    }),
    {
      name: 'pissout-storage-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ reviews: state.reviews, profile: state.profile }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as object),
        locations: currentState.locations,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
