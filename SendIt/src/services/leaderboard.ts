// Monthly leaderboard.
//
// For now scores are computed from the posts held in AppStore. Once Supabase and Redis
// are set up, replace the body of useLeaderboard() with a fetch; the screen won't change.
//
// Planned Redis design (one sorted set per month, member = user id, score = points):
//   On new post:      ZINCRBY leaderboard:2026-11 <pointsForClimb(grade)> <userId>
//   My points:        ZSCORE  leaderboard:2026-11 <userId>
//   My tier's top 25: ZRANGE  leaderboard:2026-11 <tierMax - 1> <tierMin> BYSCORE REV LIMIT 0 25
//   My position:      ZCOUNT  leaderboard:2026-11 (<myPoints> <tierMax - 1>   (+1)
//   Monthly reset:    a new key each month; EXPIRE old keys after the month ends.
// Because tiers are point ranges, a tier's leaderboard is a score range of the month's set.
// Redis credentials must stay on the server, so the app should call a Supabase Edge
// Function (or similar) that runs these commands, not Redis directly.

import { useMemo } from 'react';
import {
  LEADERBOARD_SIZE,
  nextTier,
  pointsForClimb,
  type Tier,
  tierForPoints,
} from '@/constants/ranks';
import { type User, useAppStore } from '@/store/AppStore';

/**
 * When true, the leaderboard only lists climbers in the current user's tier.
 * Turn this on once there are enough users (after the database is set up).
 */
export const LEADERBOARD_SHOWS_ONLY_MY_TIER = false;

export type LeaderboardEntry = {
  position: number;
  user: User;
  points: number;
  climbs: number;
  tier: Tier;
};

export type Leaderboard = {
  monthLabel: string; // "November 2026"
  daysUntilReset: number;
  /** Tier the list is limited to, or null when it shows every tier. */
  scopeTier: Tier | null;
  entries: LeaderboardEntry[]; // top LEADERBOARD_SIZE
  me: LeaderboardEntry & { nextTier: Tier | null; pointsToNextTier: number };
};

/** "2026-11". Months are UTC so the reset happens at the same moment for everyone. */
export function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function useLeaderboard(): Leaderboard {
  const { posts, users, currentUser } = useAppStore();

  return useMemo(() => {
    const now = new Date();
    const thisMonth = monthKey(now);

    // Total this month's points and climbs per user.
    const totals = new Map<string, { points: number; climbs: number }>();
    for (const post of posts) {
      if (monthKey(new Date(post.createdAt)) !== thisMonth) continue;
      const t = totals.get(post.userId) ?? { points: 0, climbs: 0 };
      t.points += pointsForClimb(post.grade);
      t.climbs += 1;
      totals.set(post.userId, t);
    }
    // The current user always has a standing, even with no climbs yet this month.
    if (!totals.has(currentUser.id)) totals.set(currentUser.id, { points: 0, climbs: 0 });

    const ranked = [...totals.entries()]
      .map(([userId, t]) => ({ user: users[userId], ...t, tier: tierForPoints(t.points) }))
      .filter((e) => e.user)
      .sort(
        (a, b) =>
          b.points - a.points ||
          b.climbs - a.climbs ||
          a.user.username.localeCompare(b.user.username),
      );

    const myTier = tierForPoints(totals.get(currentUser.id)!.points);
    const scopeTier = LEADERBOARD_SHOWS_ONLY_MY_TIER ? myTier : null;
    const inScope = ranked
      .filter((e) => !scopeTier || e.tier.id === scopeTier.id)
      .map((e, i) => ({ ...e, position: i + 1 }));

    const meEntry = inScope.find((e) => e.user.id === currentUser.id)!;
    const upNext = nextTier(myTier);

    const startOfNextMonth = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1);
    const daysUntilReset = Math.ceil((startOfNextMonth - now.getTime()) / 86_400_000);

    return {
      monthLabel: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
      daysUntilReset,
      scopeTier,
      entries: inScope.slice(0, LEADERBOARD_SIZE),
      me: {
        ...meEntry,
        nextTier: upNext,
        pointsToNextTier: upNext ? upNext.minPoints - meEntry.points : 0,
      },
    };
  }, [posts, users, currentUser]);
}
