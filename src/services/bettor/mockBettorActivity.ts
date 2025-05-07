
import { BettorBet } from "@/types/bettor";
import { sports, teams, betTypes } from "./mockDataUtils";

// Generate mock today's bets
export const generateMockTodayBets = (bettorId: string): BettorBet[] => {
  const bets = [];
  const count = Math.floor(Math.random() * 3) + 1; // 1-3 bets
  
  for (let i = 0; i < count; i++) {
    const now = new Date();
    now.setHours(now.getHours() - Math.floor(Math.random() * 8)); // Random time in the past 8 hours
    
    bets.push({
      id: `today-bet-${bettorId}-${i}`,
      timestamp: now.toISOString(),
      betType: Math.random() > 0.5 ? 'ML' : Math.random() > 0.5 ? '-1.5' : '+3.5',
      teams: Math.random() > 0.5 ? 'Lakers vs Warriors' : 'Chiefs vs Eagles',
      odds: Math.random() > 0.5 ? '-110' : '+120',
      unitsRisked: Math.floor(Math.random() * 3) + 1,
      result: Math.random() > 0.3 ? (Math.random() > 0.5 ? 'W' : 'L') : 'P',
      unitsWonLost: Math.random() > 0.5 ? 2.5 : -1.5
    });
  }
  
  return bets;
};

// Generate mock pending bets
export const generateMockPendingBets = (bettorId: string): BettorBet[] => {
  const bets = [];
  const count = Math.floor(Math.random() * 2) + 0; // 0-2 bets
  
  for (let i = 0; i < count; i++) {
    const now = new Date();
    
    bets.push({
      id: `pending-bet-${bettorId}-${i}`,
      timestamp: now.toISOString(),
      betType: Math.random() > 0.5 ? 'Over 218.5' : 'Under 47.5',
      teams: Math.random() > 0.5 ? 'Celtics vs Heat' : 'Ravens vs Browns',
      odds: Math.random() > 0.5 ? '-115' : '+105',
      unitsRisked: Math.floor(Math.random() * 3) + 1,
      result: 'P', // Pending
      unitsWonLost: 0
    });
  }
  
  return bets;
};

// Generate mock upcoming bets
export const generateMockUpcomingBets = (bettorId: string): BettorBet[] => {
  const bets = [];
  const count = Math.floor(Math.random() * 3); // 0-2 bets
  
  for (let i = 0; i < count; i++) {
    const now = new Date();
    now.setHours(now.getHours() + Math.floor(Math.random() * 12) + 1); // Random time in the next 12 hours
    
    bets.push({
      id: `upcoming-bet-${bettorId}-${i}`,
      timestamp: now.toISOString(),
      betType: Math.random() > 0.5 ? 'ML' : Math.random() > 0.5 ? '-2.5' : '+4.5',
      teams: Math.random() > 0.5 ? 'Bucks vs Suns' : '49ers vs Cowboys',
      odds: Math.random() > 0.5 ? '-125' : '+135',
      unitsRisked: Math.floor(Math.random() * 3) + 1,
      result: 'P', // Pending
      unitsWonLost: 0
    });
  }
  
  return bets;
};
