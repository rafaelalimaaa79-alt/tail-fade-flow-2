
import { BettorSummary, BettorBet } from "@/types/bettor";
import { TimeFrame, BettorActivity } from "./types";
import { generateMockBettorData } from "./mockBettorSummary";
import { generateMockBetHistory } from "./mockBetHistory";
import { 
  generateMockTodayBets, 
  generateMockPendingBets, 
  generateMockUpcomingBets,
  generateAllTimeBestBets
} from "./mockBettorActivity";
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
    
    // Fetch performance data grouped by timeframe
    // TODO: Implement timeframe-specific performance calculation
    
    // Fetch biggest winners and largest bets
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
    
    // Build summary from real data
    const summary: BettorSummary = {
      profile: {
        userId: bettorId,
        username: profile?.username || `Bettor${bettorId.substring(0, 4)}`,
        tailRanking: 0, // TODO: Fetch from leaderboard
        stats: {
          totalBets: stats.totalBets,
          roi: stats.winRate > 0 ? ((stats.netProfit / stats.totalBets) * 100) : 0,
          unitsGained: stats.netProfit,
          winRate: stats.winRate,
          performanceByTimeframe: {
            '1D': 0, // TODO: Calculate per timeframe
            '1W': 0,
            '1M': stats.netProfit,
            '3M': 0,
            '1Y': 0
          }
        }
      },
      graphData: {
        timeframe,
        data: [] // TODO: Generate graph data from bet history
      },
      biggestWinners: biggestWinners?.map(bet => ({
        id: bet.id,
        timestamp: bet.created_at,
        betType: bet.bet_type || 'Unknown',
        teams: bet.event || 'Unknown',
        odds: String(bet.odds),
        unitsRisked: 1, // TODO: Add to database schema
        result: bet.result === 'Win' ? 'W' : bet.result === 'Loss' ? 'L' : 'P',
        unitsWonLost: Number(bet.units_won_lost) || 0
      })) || [],
      largestBets: [] // TODO: Fetch largest bets by units risked
    };
    
    return summary;
  } catch (error) {
    console.error('Error fetching real bettor summary:', error);
    // Fallback to mock data if real data fetch fails
    const mockData = generateMockBettorData(bettorId, timeframe);
    const allTimeBets = generateAllTimeBestBets(bettorId);
    mockData.biggestWinners = allTimeBets.biggestWinners;
    mockData.largestBets = allTimeBets.largestBets;
    return mockData;
  }
};

// Fetch bettor history
export const fetchBettorHistory = async (
  bettorId: string,
  timeframe: TimeFrame = '1M'
): Promise<BettorBet[]> => {
  console.log(`Fetching bettor history for ${bettorId} with timeframe ${timeframe}`);
  
  // In a real implementation, this would call your backend API
  const history = generateMockBetHistory(bettorId, timeframe);
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return history;
};

// Fetch bettor activity
export const fetchBettorActivity = async (
  bettorId: string
): Promise<BettorActivity> => {
  console.log(`Fetching bettor activity for ${bettorId}`);
  
  // In a real implementation, this would call your backend API
  const todayBets = generateMockTodayBets(bettorId);
  const pendingBets = generateMockPendingBets(bettorId);
  const upcomingBets = generateMockUpcomingBets(bettorId);
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    todayBets,
    pendingBets,
    upcomingBets
  };
};
