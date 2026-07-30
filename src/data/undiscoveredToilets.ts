import { DEFAULT_OPENING_HOURS_BY_CATEGORY, Location } from './types';
import rawToilets from './london_toilets_osm.json';

interface RawOsmToilet {
  id: string;
  lat: number;
  lng: number;
  name: string;
  fee: 'yes' | 'no' | 'unknown';
  accessible: 'yes' | 'no' | 'limited' | 'designated' | 'unknown';
  access: 'yes' | 'customers' | 'unknown';
  babyChange: 'yes' | 'unknown';
}

function toLocation(raw: RawOsmToilet): Location {
  const feeKnown = raw.fee === 'no' ? 'free' : raw.fee === 'yes' ? 'paid' : undefined;
  const accessible = raw.accessible === 'yes' || raw.accessible === 'designated' ? true : undefined;
  const babyChange = raw.babyChange === 'yes' ? true : undefined;

  return {
    id: raw.id,
    name: raw.name || 'Unnamed public toilet',
    category: 'publicToilet',
    address: '',
    latitude: raw.lat,
    longitude: raw.lng,
    requiresPurchase: feeKnown === 'paid',
    freeToEnter: feeKnown === 'free',
    openingHours: DEFAULT_OPENING_HOURS_BY_CATEGORY.publicToilet,
    discovered: false,
    feeKnown,
    accessible,
    babyChange,
  };
}

export const UNDISCOVERED_TOILETS: Location[] = (rawToilets as RawOsmToilet[]).map(toLocation);
