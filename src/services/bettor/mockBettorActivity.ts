
import { BettorBet } from "@/types/bettor";
import { generateMockBetHistory } from "./mockBetHistory";
import { sortBetsByTimestamp } from "./mockDataUtils";

// Generate mock today's bets
export const generateMockTodayBets = (bettorId: string): BettorBet[] => {
  // Generate a smaller set of bets for today
  const todayCount = Math.floor(Math.random() * 3) + 1; // 1-3 bets
  const bets = [];
  
  // Create today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Mock data similar to bet history
  for (let i = 0; i < todayCount; i++) {
    // Copy logic from mockBetHistory but with today's date
    const bet = generateMockBetHistory(bettorId, '1D')[i];
    if (bet) {
      // Override timestamp to be today
      const date = new Date();
      // Set to random hour today
      date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0);
      bet.timestamp = date.toISOString();
      bets.push(bet);
    }
  }
  
  return sortBetsByTimestamp(bets);
};

// Generate mock pending bets
export const generateMockPendingBets = (bettorId: string): BettorBet[] => {
  const pendingCount = Math.floor(Math.random() * 3); // 0-2 pending bets
  const bets = [];
  
  for (let i = 0; i < pendingCount; i++) {
    const bet = generateMockBetHistory(bettorId, '1D')[i];
    if (bet) {
      // Set to pending status
      bet.result = 'P';
      // Set timestamp to a few hours from now
      const date = new Date();
      date.setHours(date.getHours() + Math.floor(Math.random() * 6) + 1);
      bet.timestamp = date.toISOString();
      bets.push(bet);
    }
  }
  
  return sortBetsByTimestamp(bets);
};

// Generate mock upcoming bets
export const generateMockUpcomingBets = (bettorId: string): BettorBet[] => {
  const upcomingCount = Math.floor(Math.random() * 4); // 0-3 upcoming bets
  const bets = [];
  
  for (let i = 0; i < upcomingCount; i++) {
    const bet = generateMockBetHistory(bettorId, '1D')[i];
    if (bet) {
      // Set to pending status
      bet.result = 'P';
      // Set timestamp to tomorrow or later
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 3) + 1);
      date.setHours(Math.floor(Math.random() * 12) + 8);
      bet.timestamp = date.toISOString();
      bets.push(bet);
    }
  }
  
  return sortBetsByTimestamp(bets);
};

// Generate all-time best bets
export const generateAllTimeBestBets = (bettorId: string) => {
  // Get a very large set of historical bets (like 1Y worth)
  const allBets = generateMockBetHistory(bettorId, '1Y');
  
  // Sort by units won (descending) to find biggest winners
  const biggestWinners = [...allBets]
    .filter(bet => bet.result === 'W')
    .sort((a, b) => b.unitsWonLost - a.unitsWonLost)
    .slice(0, 7);
  
  // Sort by units risked for largest bets
  const largestBets = [...allBets]
    .sort((a, b) => b.unitsRisked - a.unitsRisked)
    .slice(0, 10);
  
  return {
    biggestWinners,
    largestBets
  };
};
