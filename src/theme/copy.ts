export const APP_NAME = 'PissOut';
export const APP_TAGLINE = 'Find your throne. Fast.';

export const HOME_EMPTY_STATE = "No relief in sight yet. Be the first to scout this area.";

export const LOADING_LINES = [
  'Scouting the perimeter...',
  'Checking for enemy queues...',
  'Locating nearest throne...',
  'Sniffing out the good stuff...',
];

export const REVIEW_SUBMIT_SUCCESS_LINES = [
  'Mission accomplished. Flushed with pride.',
  'Debrief logged. The squad thanks you.',
  'Intel filed. Someone out there needed this.',
  'Deployment complete. Area secured.',
];

export const PASSCODE_LOCKED_WARNING =
  'Passcode intel is classified until you reach Private Pooper rank (5+ reviews). Codes change often and may be outdated — use at your own risk, soldier.';

export const PASSCODE_UNLOCKED_NOTE =
  'Codes are community-submitted and can go stale. Verify with staff if it fails twice.';

export function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
