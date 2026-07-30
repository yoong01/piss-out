import bundledToilets from './london_toilets_osm.json';
import type { Toilet } from './types';

interface BundledToiletEntry {
  id: string | number;
  lat: number;
  lng: number;
  name?: string;
  fee?: 'yes' | 'no' | string;
  accessible?: 'yes' | 'no' | string;
  access?: string;
  babyChange?: 'yes' | 'no' | string;
}

function feeToAmount(fee: string | undefined): number {
  if (fee === 'no') return 0;
  if (fee === 'yes') return 20;
  return 0;
}

function fromBundledEntry(entry: BundledToiletEntry): Toilet {
  return {
    id: String(entry.id),
    name: entry.name ?? 'Public Toilet',
    lat: entry.lat,
    lng: entry.lng,
    venueType: 'public',
    discovered: false,
    tier: null,
    tierLabel: null,
    hasPasscode: false,
    passcode: null,
    fee: feeToAmount(entry.fee),
    accessible: entry.accessible === 'yes',
    babyChange: entry.babyChange === 'yes',
    ratings: null,
    lastConfirmed: null,
    reviews: [],
  };
}

export function loadToilets(): Toilet[] {
  return (bundledToilets as BundledToiletEntry[]).map(fromBundledEntry);
}

interface OverpassElement {
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const OVERPASS_QUERY =
  '[out:json][timeout:25];node["amenity"="toilets"](51.46,-0.22,51.56,-0.05);out;';
const FETCH_TIMEOUT_MS = 5000;

function fromOverpassElement(el: OverpassElement): Toilet {
  const tags = el.tags ?? {};
  return {
    id: String(el.id),
    name: tags.name ?? 'Public Toilet',
    lat: el.lat,
    lng: el.lon,
    venueType: 'public',
    discovered: false,
    tier: null,
    tierLabel: null,
    hasPasscode: false,
    passcode: null,
    fee: feeToAmount(tags.fee),
    accessible: tags.wheelchair === 'yes',
    babyChange: tags.changing_table === 'yes',
    ratings: null,
    lastConfirmed: null,
    reviews: [],
  };
}

export async function fetchLiveToilets(): Promise<Toilet[] | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(OVERPASS_QUERY)}`,
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = (await response.json()) as OverpassResponse;
    return data.elements.map(fromOverpassElement);
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
