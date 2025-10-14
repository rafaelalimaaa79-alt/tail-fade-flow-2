import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  username: string | null;
  total_bets: number;
  win_rate: number;
  roi: number;
  units_gained: number;
  created_at: string;
  updated_at: string;
}

export interface ConfidenceScore {
  user_id: string;
  score: number;
  statline: string | null; // Now nullable - calculated per-bet
  worst_bet_id: string | null;
  last_calculated: string;
}

export interface BetStatline {
  statline: string;
  fadeConfidence: number;
  metric: string;
}

export interface BetRecord {
  id: string;
  user_id: string;
  slip_id: string | null;
  bet_id: string | null;
  event: string | null;
  sport: string | null;
  position: string | null;
  line: number | null;
  bet_type: string;
  odds: string;
  units_risked: number | null;
  units_to_win: number | null;
  units_won_lost: number | null;
  away_team: string | null;
  home_team: string | null;
  event_start_time: string | null;
  result: string | null;
  sportsbook_name: string | null;
  is_processed: boolean;
  timestamp: string | null;
  created_at: string;
  updated_at: string;
}

export interface BetsQueryOptions {
  result?: 'Win' | 'Loss' | 'Push' | 'Pending' | string;
  isProcessed?: boolean;
  sport?: string;
  betType?: string;
  limit?: number;
  orderBy?: 'created_at' | 'event_start_time' | 'timestamp';
  ascending?: boolean;
}

/**
 * Get the current authenticated user
 * @returns Current user or null if not authenticated
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  return user;
}

/**
 * Get the current user's ID
 * @returns User ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
}

/**
 * Get user profile data for any user
 * @param userId - User ID to fetch profile for
 * @returns User profile or null if not found
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - user profile doesn't exist yet
        console.log(`No profile found for user ${userId}`);
        return null;
      }
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

/**
 * Get current user's profile data
 * @returns Current user's profile or null
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  
  return getUserProfile(userId);
}

/**
 * Get confidence score for any user
 * @param userId - User ID to fetch confidence score for
 * @returns Confidence score data or null if not found
 */
export async function getConfidenceScore(userId: string): Promise<ConfidenceScore | null> {
  try {
    const { data, error } = await supabase
      .from('confidence_scores')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - confidence score not calculated yet
        console.log(`No confidence score found for user ${userId}`);
        return null;
      }
      console.error('Error fetching confidence score:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getConfidenceScore:', error);
    return null;
  }
}

/**
 * Get current user's confidence score
 * @returns Current user's confidence score or null
 */
export async function getCurrentUserConfidenceScore(): Promise<ConfidenceScore | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  
  return getConfidenceScore(userId);
}

/**
 * Get bets for any user with optional filters
 * @param userId - User ID to fetch bets for
 * @param options - Query options for filtering and sorting
 * @returns Array of bet records
 */
export async function getUserBets(
  userId: string,
  options: BetsQueryOptions = {}
): Promise<BetRecord[]> {
  try {
    let query = supabase
      .from('bets')
      .select('*')
      .eq('user_id', userId);

    // Apply filters
    if (options.result !== undefined) {
      query = query.eq('result', options.result);
    }

    if (options.isProcessed !== undefined) {
      query = query.eq('is_processed', options.isProcessed);
    }

    if (options.sport) {
      query = query.eq('sport', options.sport);
    }

    if (options.betType) {
      query = query.eq('bet_type', options.betType);
    }

    // Apply ordering
    const orderBy = options.orderBy || 'created_at';
    const ascending = options.ascending ?? false;
    query = query.order(orderBy, { ascending });

    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user bets:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserBets:', error);
    return [];
  }
}

/**
 * Get current user's bets with optional filters
 * @param options - Query options for filtering and sorting
 * @returns Array of bet records
 */
export async function getCurrentUserBets(
  options: BetsQueryOptions = {}
): Promise<BetRecord[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  
  return getUserBets(userId, options);
}

/**
 * Get pending bets for any user
 * @param userId - User ID to fetch pending bets for
 * @returns Array of pending bet records
 */
export async function getPendingBets(userId: string): Promise<BetRecord[]> {
  return getUserBets(userId, {
    result: 'Pending',
    orderBy: 'event_start_time',
    ascending: true
  });
}

/**
 * Get current user's pending bets
 * @returns Array of pending bet records
 */
export async function getCurrentUserPendingBets(): Promise<BetRecord[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  
  return getPendingBets(userId);
}

/**
 * Get historical (processed) bets for any user
 * @param userId - User ID to fetch historical bets for
 * @param limit - Optional limit on number of bets to return
 * @returns Array of historical bet records
 */
export async function getHistoricalBets(
  userId: string,
  limit?: number
): Promise<BetRecord[]> {
  return getUserBets(userId, {
    isProcessed: true,
    orderBy: 'timestamp',
    ascending: false,
    limit
  });
}

/**
 * Get current user's historical bets
 * @param limit - Optional limit on number of bets to return
 * @returns Array of historical bet records
 */
export async function getCurrentUserHistoricalBets(
  limit?: number
): Promise<BetRecord[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  return getHistoricalBets(userId, limit);
}

/**
 * Get recent bet streak for any user
 * @param userId - User ID to fetch streak for
 * @param limit - Number of recent bets to check (default: 5)
 * @returns Array of results: 1 = Win, 0 = Loss/Push
 */
export async function getRecentStreak(
  userId: string,
  limit: number = 5
): Promise<number[]> {
  try {
    const recentBets = await getUserBets(userId, {
      isProcessed: true,
      orderBy: 'timestamp',
      ascending: false,
      limit
    });

    return recentBets.map(bet => {
      if (bet.result === 'Win') return 1;
      if (bet.result === 'Loss') return 0;
      return 0; // Push counts as 0 for streak display
    });
  } catch (error) {
    console.error('Error in getRecentStreak:', error);
    return [];
  }
}

/**
 * Get current user's recent bet streak
 * @param limit - Number of recent bets to check (default: 5)
 * @returns Array of results: 1 = Win, 0 = Loss/Push
 */
export async function getCurrentUserRecentStreak(
  limit: number = 5
): Promise<number[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  return getRecentStreak(userId, limit);
}

/**
 * Calculate performance by timeframe for any user
 * @param userId - User ID to calculate performance for
 * @returns Performance object with units gained per timeframe
 */
export async function getPerformanceByTimeframe(
  userId: string
): Promise<Record<'1D' | '1W' | '1M' | '3M' | '1Y', number>> {
  try {
    const timeframes: Array<'1D' | '1W' | '1M' | '3M' | '1Y'> = ['1D', '1W', '1M', '3M', '1Y'];
    const performance: Record<'1D' | '1W' | '1M' | '3M' | '1Y', number> = {
      '1D': 0,
      '1W': 0,
      '1M': 0,
      '3M': 0,
      '1Y': 0
    };

    // Helper to get days for each timeframe
    const getTimeframeDays = (tf: '1D' | '1W' | '1M' | '3M' | '1Y'): number => {
      switch (tf) {
        case '1D': return 1;
        case '1W': return 7;
        case '1M': return 30;
        case '3M': return 90;
        case '1Y': return 365;
      }
    };

    // Calculate performance for each timeframe
    for (const tf of timeframes) {
      const days = getTimeframeDays(tf);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: bets, error } = await supabase
        .from('bets')
        .select('units_won_lost')
        .eq('user_id', userId)
        .in('result', ['Win', 'Loss', 'Push'])
        .gte('created_at', startDate.toISOString());

      if (error) {
        console.error(`Error calculating ${tf} performance:`, error);
        continue;
      }

      // Sum all units won/lost for this timeframe
      const totalUnits = (bets || []).reduce((sum, bet) => {
        return sum + (Number(bet.units_won_lost) || 0);
      }, 0);

      // Convert cents to dollars and round to 2 decimals
      performance[tf] = parseFloat((totalUnits / 100).toFixed(2));
    }

    return performance;
  } catch (error) {
    console.error('Error in getPerformanceByTimeframe:', error);
    return {
      '1D': 0,
      '1W': 0,
      '1M': 0,
      '3M': 0,
      '1Y': 0
    };
  }
}

/**
 * Get current user's performance by timeframe
 * @returns Performance object with units gained per timeframe
 */
export async function getCurrentUserPerformanceByTimeframe(): Promise<
  Record<'1D' | '1W' | '1M' | '3M' | '1Y', number>
> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return {
      '1D': 0,
      '1W': 0,
      '1M': 0,
      '3M': 0,
      '1Y': 0
    };
  }

  return getPerformanceByTimeframe(userId);
}

/**
 * Get leaderboard data (all users with confidence scores)
 * @param currentUserId - Current user ID to highlight in results
 * @param limit - Optional limit on number of users to return
 * @returns Array of users with profile and confidence data
 */
export async function getLeaderboardData(
  currentUserId?: string,
  limit?: number
) {
  try {
    // Start from confidence_scores to include ALL users with scores
    // (even if they don't have a user_profile yet)
    let query = supabase
      .from('confidence_scores')
      .select(`
        user_id,
        score,
        statline,
        user_profiles (
          username,
          total_bets,
          win_rate,
          roi,
          units_gained
        )
      `)
      .order('score', { ascending: false }); // Order by confidence score DESC

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching leaderboard data:', error);
      return [];
    }

    if (!data) return [];

    // Transform data to match expected format
    return data.map((item: any) => {
      const profile = item.user_profiles;

      return {
        id: item.user_id,
        username: profile?.username || null,
        totalBets: profile?.total_bets ?? 0,
        winRate: profile?.win_rate ?? 0,
        roi: profile?.roi ?? 0,
        unitsGained: profile?.units_gained ?? 0,
        confidenceScore: Number(item.score) ?? null,
        statline: item.statline ?? null,
        isCurrentUser: currentUserId ? item.user_id === currentUserId : false
      };
    });
  } catch (error) {
    console.error('Error in getLeaderboardData:', error);
    return [];
  }
}

/**
 * Get top hottest bettors (most profitable)
 * @param limit - Number of hottest bettors to return (default: 5)
 * @param currentUserId - Current user ID to exclude from results
 * @returns Array of hottest bettors with their stats
 */
export async function getHottestBettors(
  limit: number = 5,
  currentUserId?: string
) {
  try {
    // Query user_profiles for most profitable users
    let query = supabase
      .from('user_profiles')
      .select('id, username, units_gained, win_rate, total_bets')
      .gt('units_gained', 0) // Only profitable users
      .order('units_gained', { ascending: false })
      .limit(limit);

    // Exclude current user if provided
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    const { data: profiles, error } = await query;

    if (error) {
      console.error('Error fetching hottest bettors:', error);
      return [];
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    // Fetch recent streak for each bettor using existing service function
    const bettorsWithStreaks = await Promise.all(
      profiles.map(async (profile) => {
        const streak = await getRecentStreak(profile.id, 5);

        return {
          id: profile.id,
          name: profile.username || 'Unknown',
          profit: Math.round(profile.units_gained / 100), // Convert cents to dollars
          streak: streak.length > 0 ? streak : [0, 0, 0, 0, 0]
        };
      })
    );

    return bettorsWithStreaks;
  } catch (error) {
    console.error('Error in getHottestBettors:', error);
    return [];
  }
}

/**
 * Get top coldest bettors (most negative units)
 * @param limit - Number of coldest bettors to return (default: 10)
 * @param currentUserId - Current user ID to exclude from results
 * @returns Array of coldest bettors with their stats
 */
export async function getColdestBettors(
  limit: number = 10,
  currentUserId?: string
) {
  try {
    // Query user_profiles for most unprofitable users
    let query = supabase
      .from('user_profiles')
      .select('id, username, units_gained, win_rate, total_bets')
      .lt('units_gained', 0) // Only unprofitable users
      .order('units_gained', { ascending: true }) // Most negative first
      .limit(limit);

    // Exclude current user if provided
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    const { data: profiles, error } = await query;

    if (error) {
      console.error('Error fetching coldest bettors:', error);
      return [];
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    // Fetch recent streak for each bettor using existing service function
    const bettorsWithStreaks = await Promise.all(
      profiles.map(async (profile) => {
        const streak = await getRecentStreak(profile.id, 5);

        return {
          id: profile.id,
          name: profile.username || 'Unknown',
          profit: Math.round(profile.units_gained / 100), // Convert cents to dollars
          streak: streak.length > 0 ? streak : [0, 0, 0, 0, 0]
        };
      })
    );

    return bettorsWithStreaks;
  } catch (error) {
    console.error('Error in getColdestBettors:', error);
    return [];
  }
}

/**
 * Get top coldest bettors with their pending bets
 * @param limit - Number of coldest bettors to return (default: 5)
 * @param currentUserId - Current user ID to exclude from results
 * @returns Array of coldest bettors with their pending bets
 */
export async function getColdestBettorsWithPendingBets(
  limit: number = 5,
  currentUserId?: string
) {
  try {
    // Start from confidence_scores to include ALL users with scores
    let query = supabase
      .from('confidence_scores')
      .select(`
        user_id,
        score,
        statline,
        user_profiles (
          username,
          units_gained
        )
      `)
      .order('score', { ascending: false }); // Highest confidence first

    // Exclude current user if provided
    if (currentUserId) {
      query = query.neq('user_id', currentUserId);
    }

    query = query.limit(limit);

    const { data: coldBettors, error } = await query;

    if (error) {
      console.error('Error fetching coldest bettors:', error);
      return [];
    }

    if (!coldBettors || coldBettors.length === 0) return [];

    // For each bettor, get ALL their pending bets and recent streak
    const bettorsWithBets = await Promise.all(
      coldBettors.map(async (bettor: any) => {
        const profile = bettor.user_profiles;

        // Get pending bets
        const pendingBets = await getPendingBets(bettor.user_id);

        // Get recent streak
        const streak = await getRecentStreak(bettor.user_id, 5);

        return {
          id: bettor.user_id,
          name: profile?.username || `User${bettor.user_id.substring(0, 4)}`,
          profit: Math.round((profile?.units_gained ?? 0) / 100), // Convert cents to dollars
          confidenceScore: Number(bettor.score) ?? 0,
          statline: bettor.statline ?? null,
          pendingBets: pendingBets,
          streak: streak.length > 0 ? streak : [0, 0, 0, 0, 0]
        };
      })
    );

    return bettorsWithBets;
  } catch (error) {
    console.error('Error in getColdestBettorsWithPendingBets:', error);
    return [];
  }
}

/**
 * Calculate bet-specific statline for a given bet
 * @param userId - User ID who placed the bet
 * @param betSlipId - Bet slip ID to calculate statline for
 * @returns Bet statline data with fade confidence
 */
export async function calculateBetStatline(
  userId: string,
  betSlipId: string
): Promise<BetStatline | null> {
  try {
    const { data, error } = await supabase.functions.invoke('calculate-bet-statline', {
      body: { userId, betSlipId }
    });

    if (error) {
      console.error('Error calling calculate-bet-statline function:', error);
      return null;
    }

    if (!data) {
      console.log('No data returned from calculate-bet-statline');
      return null;
    }

    return data as BetStatline;
  } catch (error) {
    console.error('Error in calculateBetStatline:', error);
    return null;
  }
}
