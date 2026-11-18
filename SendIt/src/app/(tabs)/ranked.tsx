import { FlatList, StyleSheet, Text, View } from 'react-native';
import Avatar from '@/components/Avatar';
import TierBadge from '@/components/TierBadge';
import { LEADERBOARD_SIZE, POINTS_PER_GRADE, POINTS_PER_POST, TIERS } from '@/constants/ranks';
import { COLORS, FONT_SIZES, FONTS, SPACING } from '@/constants/theme';
import { type LeaderboardEntry, useLeaderboard } from '@/services/leaderboard';

// Gold, silver, bronze for the top three positions.
const PODIUM_COLORS = ['#E3C04B', '#C9CCD1', '#C58A5A'];

export default function Ranked() {
  const board = useLeaderboard();
  const { me } = board;

  const title = board.scopeTier ? `${board.scopeTier.name} Top ${LEADERBOARD_SIZE}` : `Top ${LEADERBOARD_SIZE} Climbers`;

  const header = (
    <View>
      <View style={styles.monthRow}>
        <Text style={styles.month}>{board.monthLabel.toUpperCase()}</Text>
        <Text style={styles.reset}>
          Resets in {board.daysUntilReset} {board.daysUntilReset === 1 ? 'day' : 'days'}
        </Text>
      </View>

      {/* Current user's standing */}
      <View style={[styles.myCard, { borderColor: me.tier.color }]}>
        <View style={styles.myTop}>
          <TierBadge tier={me.tier} size={30} showName />
          <View style={styles.myStats}>
            <Text style={styles.myPoints}>{me.points}</Text>
            <Text style={styles.myPointsLabel}>pts this month</Text>
          </View>
        </View>

        <Text style={styles.myPosition}>
          #{me.position} {board.scopeTier ? `in ${board.scopeTier.name}` : 'overall'} ·{' '}
          {me.climbs} {me.climbs === 1 ? 'climb' : 'climbs'}
        </Text>

        {me.nextTier ? (
          <>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: me.nextTier.color,
                    width: `${Math.min(
                      100,
                      ((me.points - me.tier.minPoints) /
                        (me.nextTier.minPoints - me.tier.minPoints)) *
                        100,
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {me.pointsToNextTier} pts to {me.nextTier.name}
            </Text>
          </>
        ) : (
          <Text style={[styles.progressText, { color: me.tier.color }]}>Top tier reached!</Text>
        )}
      </View>

      {/* Tier ladder, lowest to highest */}
      <View style={styles.ladder}>
        {TIERS.map((tier) => {
          const current = tier.id === me.tier.id;
          return (
            <View key={tier.id} style={[styles.ladderStep, !current && styles.ladderDim]}>
              <TierBadge tier={tier} size={current ? 22 : 16} />
              <Text style={[styles.ladderName, current && { color: tier.color }]} numberOfLines={1}>
                {tier.name}
              </Text>
              <Text style={styles.ladderPoints}>{tier.minPoints}+</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={board.entries}
      keyExtractor={(e) => e.user.id}
      ListHeaderComponent={header}
      renderItem={({ item }) => <LeaderboardRow entry={item} isMe={item.user.id === me.user.id} />}
      ListEmptyComponent={<Text style={styles.empty}>No climbs posted this month yet.</Text>}
      ListFooterComponent={
        <Text style={styles.howItWorks}>
          +{POINTS_PER_POST} pts for every climb you post, plus {POINTS_PER_GRADE} pts per grade (V1 ={' '}
          {POINTS_PER_GRADE}, V2 = {POINTS_PER_GRADE * 2}...). Routes count as their V-scale equivalent.
        </Text>
      }
    />
  );
}

function LeaderboardRow({ entry, isMe }: { entry: LeaderboardEntry; isMe: boolean }) {
  const podiumColor = PODIUM_COLORS[entry.position - 1];

  return (
    <View style={[styles.row, isMe && styles.rowMe]}>
      <Text style={[styles.position, podiumColor && { color: podiumColor }]}>{entry.position}</Text>
      <Avatar uri={entry.user.avatarUri} name={entry.user.username} size={34} />
      <View style={styles.rowInfo}>
        <Text style={styles.username} numberOfLines={1}>
          {entry.user.username}
          {isMe && <Text style={styles.youTag}> (you)</Text>}
        </Text>
        <Text style={styles.rowClimbs}>
          {entry.climbs} {entry.climbs === 1 ? 'climb' : 'climbs'}
        </Text>
      </View>
      <TierBadge tier={entry.tier} size={16} />
      <Text style={styles.rowPoints}>{entry.points}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.sm + 4,
    paddingBottom: SPACING.xl,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm + 4,
  },
  month: {
    fontFamily: FONTS.retro,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.primary,
  },
  reset: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  myCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: SPACING.md,
  },
  myTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  myStats: {
    alignItems: 'flex-end',
  },
  myPoints: {
    fontFamily: FONTS.retro,
    fontSize: 20,
    lineHeight: 28,
    color: COLORS.text,
  },
  myPointsLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  myPosition: {
    marginTop: SPACING.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  progressTrack: {
    marginTop: SPACING.sm + 4,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceSunken,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    marginTop: SPACING.xs + 2,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  ladder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    backgroundColor: COLORS.surfaceSunken,
    borderRadius: 12,
  },
  ladderStep: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  ladderDim: {
    opacity: 0.55,
  },
  ladderName: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  ladderPoints: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
  sectionTitle: {
    fontFamily: FONTS.retro,
    fontSize: 10,
    lineHeight: 16,
    color: COLORS.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm + 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm + 4,
    marginBottom: SPACING.sm,
  },
  rowMe: {
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  position: {
    width: 28,
    textAlign: 'center',
    fontFamily: FONTS.retro,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  rowInfo: {
    flex: 1,
  },
  username: {
    fontWeight: '700',
    color: COLORS.text,
  },
  youTag: {
    fontWeight: '400',
    color: COLORS.textMuted,
  },
  rowClimbs: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  rowPoints: {
    minWidth: 44,
    textAlign: 'right',
    fontFamily: FONTS.retro,
    fontSize: 11,
    color: COLORS.text,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  howItWorks: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.xs,
    lineHeight: 18,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
