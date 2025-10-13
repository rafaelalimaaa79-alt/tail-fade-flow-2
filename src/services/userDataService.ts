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
  statline: string;
  worst_bet_id: string | null;
  last_calculated: string;
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

