const PALETTE = ['#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#8338EC', '#FB5607', '#3A86FF', '#F72585'];

export function avatarColorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
