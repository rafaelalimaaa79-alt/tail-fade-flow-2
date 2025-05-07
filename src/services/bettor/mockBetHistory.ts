
import { BettorBet } from "@/types/bettor";
import { 
  sports, 
  teams, 
  betTypes, 
  getDataPointsForTimeframe, 
  generateTimestampForTimeframe, 
  sortBetsByTimestamp 
} from "./mockDataUtils";

// Generate mock bet history based on bettor ID and timeframe
export const generateMockBetHistory = (
  bettorId: string,
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y'
): BettorBet[] => {
  const bets = [];
  const count = timeframe === '1D' ? 5 : 
              timeframe === '1W' ? 15 : 
              timeframe === '1M' ? 40 :
              timeframe === '3M' ? 100 : 300;
  
  for (let i = 0; i < count; i++) {
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const team1 = teams[Math.floor(Math.random() * teams.length)];
    let team2;
    do {
      team2 = teams[Math.floor(Math.random() * teams.length)];
    } while (team2 === team1);
    
    const betType = betTypes[Math.floor(Math.random() * betTypes.length)];
    const result = Math.random() > 0.45 ? 'W' : 'L';
    const unitsRisked = parseFloat((Math.random() * 4 + 1).toFixed(1));
    const odds = Math.random() > 0.5 ? `+${Math.floor(Math.random() * 150 + 100)}` : `-${Math.floor(Math.random() * 150 + 100)}`;
    
    // Create timestamp based on timeframe
    const maxDays = getDataPointsForTimeframe(timeframe);
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * maxDays));
    
    // For 1D timeframe, also adjust the hours
    if (timeframe === '1D') {
      date.setHours(date.getHours() - Math.floor(Math.random() * 24));
    }
    
    bets.push({
      id: `bet-${bettorId}-${i}`,
      timestamp: date.toISOString(),
      betType: `${team1} ${betType}`,
      teams: `${team1} vs ${team2}`,
      odds,
      unitsRisked,
      result,
      unitsWonLost: result === 'W' ? 
        parseFloat((unitsRisked * (odds.startsWith('+') ? 
          parseInt(odds.substring(1))/100 : 100/parseInt(odds.substring(1)))).toFixed(1)) : 
        -unitsRisked
    });
  }
  
  // Sort by timestamp, most recent first
  return sortBetsByTimestamp(bets);
};
