export interface Toilet {
  id: string;
  name: string;
  lat: number;
  lng: number;
  venueType: 'public' | 'station' | 'cafe' | 'pub' | 'fastfood' | 'museum' | 'park';
  discovered: boolean;
  tier: 'S' | 'A' | 'B' | 'C' | 'D' | null;
  tierLabel: string | null;
  hasPasscode: boolean;
  passcode: string | null;
  fee: number;
  accessible: boolean;
  babyChange: boolean;
  ratings: { cleanliness: number; smell: number; supplies: number; queue: number } | null;
  lastConfirmed: string | null;
  reviews: any[];
}
