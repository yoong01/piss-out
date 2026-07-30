# LooQuest — Map Module

The map module for LooQuest (finding public toilets in London): a full-height
Leaflet map with tiered discovery markers, bundled + live (Overpass API)
toilet data, and a minimal demo page. This is a standalone module only —
no other screens, routing, or app shell.

## Structure

- `src/data/types.ts` — the shared `Toilet` type.
- `src/data/london_toilets_osm.json` — bundled toilet dataset (ships empty;
  the real dataset is owned by another module/teammate).
- `src/data/toiletData.ts` — `loadToilets()` (bundled, synchronous) and
  `fetchLiveToilets()` (Overpass API, 5s timeout, returns `null` on any
  failure).
- `src/components/ToiletMap.tsx` — the Leaflet map + tiered marker rendering.
- `src/components/DataStatusDot.tsx` — live/cached data indicator.
- `src/pages/MapDemo.tsx` — wires it together in a phone-sized frame; marker
  taps just `console.log` the toilet (the detail sheet is a different
  module).

## Running it

```bash
npm install
npm run dev
```

## Notes

- No API key required — OpenStreetMap tiles and the Overpass API are both
  public/unauthenticated.
- `npx tsc -b` and `npm run build` both pass clean under TypeScript strict
  mode.
