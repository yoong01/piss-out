import { RatingCategories } from '../data/types';

export function reviewOverall(ratings: RatingCategories): number {
  const values = Object.values(ratings);
  return values.reduce((a, b) => a + b, 0) / values.length;
}
