
import { BettorSummary, BettorBet } from "@/types/bettor";
import { TimeFrame, BettorActivity } from "./types";
import { generateMockBettorData } from "./mockBettorSummary";
import { generateMockBetHistory } from "./mockBetHistory";
import { 
  generateMockTodayBets, 
  generateMockPendingBets, 
  generateMockUpcomingBets 
} from "./mockBettorActivity";

// Fetch bettor summary
export const fetchBettorSummary = async (
  bettorId: string,
  timeframe: TimeFrame = '1M'
): Promise<BettorSummary> => {
  console.log(`Fetching bettor summary for ${bettorId} with timeframe ${timeframe}`);
  
  // In a real implementation, this would call your backend API
  const mockData = generateMockBettorData(bettorId, timeframe);
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockData;
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
