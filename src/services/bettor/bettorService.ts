
import { BettorSummary, BettorBet, BetHistoryPoint } from "@/types/bettor";
import { TimeFrame, BettorActivity } from "./types";
import { calculateBettorStats } from "@/utils/bettorStatsCalculator";
import { supabase } from "@/integrations/supabase/client";

// Helper to convert timeframe to days limit
const getTimeframeDays = (timeframe: TimeFrame): number => {
  switch (timeframe) {
    case '1D': return 1;
    case '1W': return 7;
    case '1M': return 30;
    case '3M': return 90;
    case '1Y': return 365;
    default: return 30;
  }
};

// Helper to generate graph data (cumulative units over time)
const generateGraphData = async (
  bettorId: string,
  timeframe: TimeFrame
): Promise<BetHistoryPoint[]> => {
  try {
    // Calculate date range based on timeframe
    const days = getTimeframeDays(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Query bets ordered by created_at to calculate cumulative performance
    const { data: bets, error } = await supabase
      .from('bets')
      .select('created_at, units_won_lost, result')
      .eq('user_id', bettorId)
      .in('result', ['Win', 'Loss', 'Push'])
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching bets for graph:', error);
      return [];
    }
    
    if (!bets || bets.length === 0) {
      return [];
    }
    
    // Calculate cumulative units
    let cumulativeUnits = 0;
    const graphData: BetHistoryPoint[] = bets.map(bet => {
      cumulativeUnits += Number(bet.units_won_lost) || 0;
      return {
        timestamp: bet.created_at,
        units: parseFloat(cumulativeUnits.toFixed(2))
      };
    });
    
    return graphData;
  } catch (error) {
    console.error('Error generating graph data:', error);
    return [];
  }
};

// Helper to calculate performance by timeframe
const calculatePerformanceByTimeframe = async (
  bettorId: string
): Promise<Record<'1D' | '1W' | '1M' | '3M' | '1Y', number>> => {
  try {
    const timeframes: Array<'1D' | '1W' | '1M' | '3M' | '1Y'> = ['1D', '1W', '1M', '3M', '1Y'];
    const performance: Record<'1D' | '1W' | '1M' | '3M' | '1Y', number> = {
      '1D': 0,
      '1W': 0,
      '1M': 0,
      '3M': 0,
      '1Y': 0
    };
    
    // Calculate performance for each timeframe
    for (const tf of timeframes) {
      const days = getTimeframeDays(tf);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data: bets, error } = await supabase
        .from('bets')
        .select('units_won_lost')
        .eq('user_id', bettorId)
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
      
      performance[tf] = parseFloat(totalUnits.toFixed(2));
    }
    
    return performance;
  } catch (error) {
    console.error('Error calculating performance by timeframe:', error);
    return {
      '1D': 0,
      '1W': 0,
      '1M': 0,
      '3M': 0,
      '1Y': 0
    };
  }
};

// Fetch bettor summary with real data
export const fetchBettorSummary = async (
  bettorId: string,
  timeframe: TimeFrame = '1M'
): Promise<BettorSummary> => {
  console.log(`Fetching bettor summary for ${bettorId} with timeframe ${timeframe}`);
  
  try {
    // Calculate real statistics for the bettor
    const limit = getTimeframeDays(timeframe) * 5; // Approximate bet limit per timeframe
    const stats = await calculateBettorStats(bettorId, undefined, undefined, limit);
    
    // Fetch profile info from database
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('id', bettorId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
    }
    
    // Calculate performance by timeframe
    const performanceByTimeframe = await calculatePerformanceByTimeframe(bettorId);
    
    // Generate graph data for the selected timeframe
    const graphData = await generateGraphData(bettorId, timeframe);
    
    // Fetch biggest winners
    const { data: biggestWinners, error: winnersError } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', bettorId)
      .eq('result', 'Win')
      .order('units_won_lost', { ascending: false })
      .limit(5);
    
    if (winnersError) {
      console.error('Error fetching biggest winners:', winnersError);
    }
    
    // Fetch largest bets by units risked
    const { data: largestBetsData, error: largestBetsError } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', bettorId)
      .order('units_risked', { ascending: false })
      .limit(10);
    
    if (largestBetsError) {
      console.error('Error fetching largest bets:', largestBetsError);
    }
    
    // Build summary from real data
    const summary: BettorSummary = {
      profile: {
        userId: bettorId,
        username: profile?.username || `Bettor${bettorId.substring(0, 4)}`,
        tailRanking: 0, // TODO: Fetch from leaderboard system (Phase 2)
        stats: {
          totalBets: stats.totalBets,
          roi: stats.winRate > 0 ? ((stats.netProfit / stats.totalBets) * 100) : 0,
          unitsGained: stats.netProfit,
          winRate: stats.winRate,
          performanceByTimeframe
        }
      },
      graphData: {
        timeframe,
        data: graphData
      },
      biggestWinners: biggestWinners?.map(bet => ({
        id: bet.id,
        timestamp: bet.created_at,
        betType: bet.bet_type || 'Unknown',
        teams: bet.event || 'Unknown',
        odds: String(bet.odds),
        unitsRisked: Number(bet.units_risked) || 0,
        result: bet.result === 'Win' ? 'W' : bet.result === 'Loss' ? 'L' : 'P',
        unitsWonLost: Number(bet.units_won_lost) || 0
      })) || [],
      largestBets: largestBetsData?.map(bet => ({
        id: bet.id,
        timestamp: bet.created_at,
        betType: bet.bet_type || 'Unknown',
        teams: bet.event || 'Unknown',
        odds: String(bet.odds),
        unitsRisked: Number(bet.units_risked) || 0,
        result: bet.result === 'Win' ? 'W' : bet.result === 'Loss' ? 'L' : 'P',
        unitsWonLost: Number(bet.units_won_lost) || 0
      })) || []
    };
    
    console.log(`Successfully fetched real bettor summary for ${bettorId}`);
    return summary;
  } catch (error) {
    console.error('Error fetching real bettor summary:', error);
    // Return partial real data or throw error instead of falling back to mock
    throw error;
  }
};

// Fetch bettor history with real data
export const fetchBettorHistory = async (
  bettorId: string,
  timeframe: TimeFrame = '1M'
): Promise<BettorBet[]> => {
  console.log(`Fetching bettor history for ${bettorId} with timeframe ${timeframe}`);
  
  try {
    // Calculate date range based on timeframe
    const days = getTimeframeDays(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Query real bets from database
    const { data: bets, error } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', bettorId)
      .in('result', ['Win', 'Loss', 'Push'])
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching bet history:', error);
      throw error;
    }
    
    // Transform database records to BettorBet format
    const history: BettorBet[] = (bets || []).map(bet => ({
      id: bet.id,
      timestamp: bet.created_at,
      betType: bet.bet_type || 'Unknown',
      teams: bet.event || 'Unknown Event',
      odds: String(bet.odds || 0),
      unitsRisked: Number(bet.units_risked) || 0,
      result: bet.result === 'Win' ? 'W' : bet.result === 'Loss' ? 'L' : 'P',
      unitsWonLost: Number(bet.units_won_lost) || 0
    }));
    
    console.log(`Fetched ${history.length} historical bets for ${bettorId}`);
    return history;
    
  } catch (error) {
    console.error('Error in fetchBettorHistory:', error);
    return [];
  }
};

// Fetch bettor activity with real data
export const fetchBettorActivity = async (
  bettorId: string
): Promise<BettorActivity> => {
  console.log(`Fetching bettor activity for ${bettorId}`);
  
  try {
    // Get today's date range
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    
    // Query today's bets (events that started today)
    const { data: todayBetsData, error: todayError } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', bettorId)
      .gte('event_start_time', todayStart.toISOString())
      .lt('event_start_time', todayEnd.toISOString());
    
    if (todayError) {
      console.error('Error fetching today bets:', todayError);
    }
    
    // Query pending bets (not yet graded)
    const { data: pendingBetsData, error: pendingError } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', bettorId)
      .eq('result', 'Pending')
      .order('event_start_time', { ascending: true });
    
    if (pendingError) {
      console.error('Error fetching pending bets:', pendingError);
    }
    
    // Query upcoming bets (future events only)
    const { data: upcomingBetsData, error: upcomingError } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', bettorId)
      .eq('result', 'Pending')
      .gt('event_start_time', now.toISOString())
      .order('event_start_time', { ascending: true })
      .limit(10); // Limit to next 10 upcoming bets
    
    if (upcomingError) {
      console.error('Error fetching upcoming bets:', upcomingError);
    }
    
    // Transform database records to BettorBet format
    const transformBet = (bet: any): BettorBet => ({
      id: bet.id,
      timestamp: bet.created_at,
      betType: bet.bet_type || 'Unknown',
      teams: bet.event || 'Unknown Event',
      odds: String(bet.odds || 0),
      unitsRisked: Number(bet.units_risked) || 0,
      result: bet.result === 'Win' ? 'W' : bet.result === 'Loss' ? 'L' : 'P',
      unitsWonLost: Number(bet.units_won_lost) || 0
    });
    
    const todayBets = (todayBetsData || []).map(transformBet);
    const pendingBets = (pendingBetsData || []).map(transformBet);
    const upcomingBets = (upcomingBetsData || []).map(transformBet);
    
    console.log(`Fetched activity for ${bettorId}: ${todayBets.length} today, ${pendingBets.length} pending, ${upcomingBets.length} upcoming`);
    
    return {
      todayBets,
      pendingBets,
      upcomingBets
    };
    
  } catch (error) {
    console.error('Error in fetchBettorActivity:', error);
    // Return empty arrays instead of throwing to prevent UI crashes
    return {
      todayBets: [],
      pendingBets: [],
      upcomingBets: []
    };
  }
};
