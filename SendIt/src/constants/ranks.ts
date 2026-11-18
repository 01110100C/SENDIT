// Monthly ranking rules: how climbs earn points and which tier a point total lands in.
// Points reset at the start of every month (UTC), so everyone starts the month in Bedrock.

export const POINTS_PER_POST = 5;
export const POINTS_PER_GRADE = 10; // V1 = 10, V2 = 20, ...

export const LEADERBOARD_SIZE = 25;

export type TierId = 'bedrock' | 'silver' | 'granite' | 'quartz' | 'ruby' | 'diamond' | 'emerald';

export type Tier = {
  id: TierId;
  name: string;
  minPoints: number; // monthly points needed to reach this tier
  color: string;
};

// Lowest to highest. Adjust minPoints to tune how hard each tier is to reach.
export const TIERS: Tier[] = [
  { id: 'bedrock', name: 'Bedrock', minPoints: 0, color: '#7D7468' },
  { id: 'silver', name: 'Silver', minPoints: 150, color: '#C9CCD1' },
  { id: 'granite', name: 'Granite', minPoints: 400, color: '#B49A8C' },
  { id: 'quartz', name: 'Quartz', minPoints: 800, color: '#F2E6EC' },
  { id: 'ruby', name: 'Ruby', minPoints: 1500, color: '#E0475F' },
  { id: 'diamond', name: 'Diamond', minPoints: 2500, color: '#A8E6F5' },
  { id: 'emerald', name: 'Emerald', minPoints: 4000, color: '#3FD18A' },
];

export function tierForPoints(points: number): Tier {
  return [...TIERS].reverse().find((t) => points >= t.minPoints) ?? TIERS[0];
}

/** The next tier up, or null at the top tier. Also the upper score bound of `tier`. */
export function nextTier(tier: Tier): Tier | null {
  return TIERS[TIERS.findIndex((t) => t.id === tier.id) + 1] ?? null;
}

// Rope grades score by their approximate V-scale equivalent.
const ROUTE_TO_V: Record<string, number> = {
  '5.11a': 1, '5.11b': 1, '5.11c': 2, '5.11d': 2,
  '5.12a': 3, '5.12b': 4, '5.12c': 4, '5.12d': 5,
  '5.13a': 6, '5.13b': 7, '5.13c': 7, '5.13d': 8,
  '5.14a': 9, '5.14b': 10, '5.14c': 11, '5.14d': 12,
  '5.15a': 14, '5.15b': 15, '5.15c': 16, '5.15d': 17,
};

/** V-scale level of a grade: "V4" -> 4, "5.12d" -> 5. Easier route grades (5.6-5.10d) are 0. */
export function gradeLevel(grade: string): number {
  const boulder = /^V(\d+)$/i.exec(grade);
  if (boulder) return Number(boulder[1]);
  return ROUTE_TO_V[grade] ?? 0;
}

/** Points a single posted climb earns: 5 for posting + 10 per grade. */
export function pointsForClimb(grade: string): number {
  return POINTS_PER_POST + POINTS_PER_GRADE * gradeLevel(grade);
}
