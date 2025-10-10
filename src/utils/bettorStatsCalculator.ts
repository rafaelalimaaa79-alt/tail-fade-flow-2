import { supabase } from "@/integrations/supabase/client";

export interface BettorStats {
  wins: number;
  losses: number;
  pushes: number;
  totalBets: number;
  winRate: number;
  fadeConfidence: number;
  netProfit: number;
  avgOdds: number;
  recentForm: number[]; // Array of 1s (wins) and 0s (losses) for last N bets
}

export async function calculateBettorStats(
  userId: string,
  sport?: string,
  betType?: string,
  limit: number = 20
): Promise<BettorStats> {
  try {
    // Build query for historical bets
    let query = supabase
      .from("bets")
      .select("result, units_won_lost, odds, sport, bet_type, created_at")
      .eq("user_id", userId)
      .in("result", ["Win", "Loss", "Push"])
      .order("created_at", { ascending: false })
      .limit(limit);

    // Apply filters if provided
    if (sport) {
      query = query.eq("sport", sport);
    }
    if (betType) {
      query = query.eq("bet_type", betType);
    }

    const { data: bets, error } = await query;

    if (error) throw error;
    if (!bets || bets.length === 0) {
      return getEmptyStats();
    }

    // Calculate statistics
    const wins = bets.filter(bet => bet.result === "Win").length;
    const losses = bets.filter(bet => bet.result === "Loss").length;
    const pushes = bets.filter(bet => bet.result === "Push").length;
    const totalBets = wins + losses; // Exclude pushes from win rate calculation

    const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;
    
    // Fade confidence is inverse of win rate
    // If bettor wins 30% → 70% fade confidence
    // If bettor wins 20% → 80% fade confidence
    // Capped between 50-99
    const fadeConfidence = Math.max(50, Math.min(99, 100 - winRate));

    // Calculate net profit
    const netProfit = bets.reduce((sum, bet) => 
      sum + (parseFloat(String(bet.units_won_lost)) || 0), 0
    );

    // Calculate average odds
    const validOdds = bets
      .map(bet => parseInt(String(bet.odds)) || 0)
      .filter(odds => odds !== 0);
    const avgOdds = validOdds.length > 0
      ? validOdds.reduce((sum, odds) => sum + Math.abs(odds), 0) / validOdds.length
      : 0;

    // Generate recent form array (1 = win, 0 = loss, skip pushes)
    const recentForm = bets
      .filter(bet => bet.result !== "Push")
      .slice(0, 10) // Last 10 graded bets
      .map(bet => bet.result === "Win" ? 1 : 0);

    return {
      wins,
      losses,
      pushes,
      totalBets,
      winRate: parseFloat(winRate.toFixed(1)),
      fadeConfidence: Math.round(fadeConfidence),
      netProfit: parseFloat(netProfit.toFixed(2)),
      avgOdds: Math.round(avgOdds),
      recentForm
    };

  } catch (error) {
    console.error("Error calculating bettor stats:", error);
    return getEmptyStats();
  }
}

export function generateStatline(stats: BettorStats, sport?: string, betType?: string): string {
  if (stats.totalBets === 0) {
    return sport ? `No ${sport} betting history` : "No betting history";
  }

  const descriptor = [sport, betType].filter(Boolean).join(" ");
  const suffix = descriptor ? ` ${descriptor} bets` : " bets";

  return `${stats.wins}-${stats.losses} (${stats.winRate}%) in last ${stats.totalBets}${suffix}`;
}

/**
 * Returns empty stats object
 */
function getEmptyStats(): BettorStats {
  return {
    wins: 0,
    losses: 0,
    pushes: 0,
    totalBets: 0,
    winRate: 0,
    fadeConfidence: 50,
    netProfit: 0,
    avgOdds: 0,
    recentForm: []
  };
}

/**
 * Calculate stats from an array of bet objects (for frontend use)
 */
export function calculateStatsFromArray(
  bets: Array<{ 
    result: string; 
    units_won_lost: number | string; 
    odds: number | string;
  }>
): BettorStats {
  if (!bets || bets.length === 0) {
    return getEmptyStats();
  }

  const wins = bets.filter(bet => bet.result === "Win").length;
  const losses = bets.filter(bet => bet.result === "Loss").length;
  const pushes = bets.filter(bet => bet.result === "Push").length;
  const totalBets = wins + losses;

  const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;
  const fadeConfidence = Math.max(50, Math.min(99, 100 - winRate));

  const netProfit = bets.reduce((sum, bet) => 
    sum + (parseFloat(String(bet.units_won_lost)) || 0), 0
  );

  const validOdds = bets
    .map(bet => parseInt(String(bet.odds)) || 0)
    .filter(odds => odds !== 0);
  const avgOdds = validOdds.length > 0
    ? validOdds.reduce((sum, odds) => sum + Math.abs(odds), 0) / validOdds.length
    : 0;

  const recentForm = bets
    .filter(bet => bet.result !== "Push")
    .slice(0, 10)
    .map(bet => bet.result === "Win" ? 1 : 0);

  return {
    wins,
    losses,
    pushes,
    totalBets,
    winRate: parseFloat(winRate.toFixed(1)),
    fadeConfidence: Math.round(fadeConfidence),
    netProfit: parseFloat(netProfit.toFixed(2)),
    avgOdds: Math.round(avgOdds),
    recentForm
  };
}
