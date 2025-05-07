
import { BettorSummary, BettorBet } from "@/types/bettor";

// This would eventually be replaced with actual API calls
export const fetchBettorSummary = async (
  bettorId: string,
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y' = '1M'
): Promise<BettorSummary> => {
  console.log(`Fetching bettor summary for ${bettorId} with timeframe ${timeframe}`);
  
  // In a real implementation, this would call your backend API
  // For now, we'll use mock data with timeframe-specific variations
  const mockData = generateMockBettorData(bettorId, timeframe);
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockData;
};

export const fetchBettorHistory = async (
  bettorId: string,
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y' = '1M'
): Promise<BettorBet[]> => {
  console.log(`Fetching bettor history for ${bettorId} with timeframe ${timeframe}`);
  
  // In a real implementation, this would call your backend API
  // For now, we'll generate different amounts of history based on timeframe
  const history = generateMockBetHistory(bettorId, timeframe);
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return history;
};

export const fetchBettorActivity = async (
  bettorId: string
): Promise<{
  todayBets: BettorBet[];
  pendingBets: BettorBet[];
  upcomingBets: BettorBet[];
}> => {
  console.log(`Fetching bettor activity for ${bettorId}`);
  
  // In a real implementation, this would call your backend API
  // Generate mock data for demonstration
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

// Helper to generate mock data
const generateMockBettorData = (
  bettorId: string,
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y'
): BettorSummary => {
  // Generate different data based on timeframe
  const dataPoints = timeframe === '1D' ? 24 : 
                    timeframe === '1W' ? 7 : 
                    timeframe === '1M' ? 30 :
                    timeframe === '3M' ? 90 : 365;
  
  // Generate graph data points
  const graphData = [];
  let currentUnits = 0;
  
  for (let i = 0; i < dataPoints; i++) {
    // Random change between -2 and +3 units per period
    const change = (Math.random() * 5) - 2;
    currentUnits += change;
    
    // Create timestamp based on timeframe
    const date = new Date();
    if (timeframe === '1D') {
      date.setHours(date.getHours() - (dataPoints - i));
    } else {
      date.setDate(date.getDate() - (dataPoints - i));
    }
    
    graphData.push({
      timestamp: date.toISOString(),
      units: parseFloat(currentUnits.toFixed(2))
    });
  }
  
  // Generate mock bets
  const allBets = generateMockBetHistory(bettorId, timeframe);
  
  // Sort by units won/lost for biggest winners
  const biggestWinners = [...allBets]
    .filter(bet => bet.result === 'W')
    .sort((a, b) => b.unitsWonLost - a.unitsWonLost)
    .slice(0, 7);
  
  // Sort by units risked for largest bets
  const largestBets = [...allBets]
    .sort((a, b) => b.unitsRisked - a.unitsRisked)
    .slice(0, 10);
  
  // Calculate stats based on all bets
  const wins = allBets.filter(bet => bet.result === 'W').length;
  const totalBets = allBets.length;
  const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;
  
  const totalUnitsRisked = allBets.reduce((sum, bet) => sum + bet.unitsRisked, 0);
  const totalUnitsWon = allBets.reduce((sum, bet) => sum + bet.unitsWonLost, 0);
  const roi = totalUnitsRisked > 0 ? (totalUnitsWon / totalUnitsRisked) * 100 : 0;
  
  // Generate mock performance by timeframe
  const performanceByTimeframe = {
    '1D': parseFloat((Math.random() * 10 - 5).toFixed(1)),
    '1W': parseFloat((Math.random() * 20 - 8).toFixed(1)),
    '1M': parseFloat((Math.random() * 30 - 10).toFixed(1)),
    '3M': parseFloat((Math.random() * 40 - 15).toFixed(1)),
    '1Y': parseFloat(currentUnits.toFixed(1))
  };
  
  return {
    profile: {
      userId: bettorId,
      username: `Bettor${bettorId.substring(0, 4)}`,
      tailRanking: Math.floor(Math.random() * 100) + 1,
      stats: {
        totalBets,
        roi: parseFloat(roi.toFixed(1)),
        unitsGained: parseFloat(currentUnits.toFixed(1)),
        winRate: parseFloat(winRate.toFixed(1)),
        performanceByTimeframe
      }
    },
    graphData: {
      timeframe,
      data: graphData
    },
    biggestWinners,
    largestBets
  };
};

// Helper to generate mock bet history
const generateMockBetHistory = (
  bettorId: string,
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y'
): BettorBet[] => {
  const bets = [];
  const count = timeframe === '1D' ? 5 : 
              timeframe === '1W' ? 15 : 
              timeframe === '1M' ? 40 :
              timeframe === '3M' ? 100 : 300;
  
  const sports = ['NBA', 'NFL', 'MLB', 'NHL', 'UFC'];
  const teams = [
    'Lakers', 'Warriors', 'Celtics', 'Heat', 'Bucks',
    'Chiefs', 'Eagles', 'Cowboys', 'Bills', '49ers',
    'Yankees', 'Dodgers', 'Red Sox', 'Astros', 'Braves',
    'Maple Leafs', 'Bruins', 'Lightning', 'Avalanche', 'Oilers'
  ];
  const betTypes = ['ML', '-1.5', '+2.5', '-3.5', 'Over 220.5', 'Under 48.5'];
  
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
    const date = new Date();
    const maxDays = timeframe === '1D' ? 1 : 
                  timeframe === '1W' ? 7 : 
                  timeframe === '1M' ? 30 :
                  timeframe === '3M' ? 90 : 365;
                  
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
  return bets.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Helper to generate mock today's bets
const generateMockTodayBets = (bettorId: string): BettorBet[] => {
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

// Helper to generate mock pending bets
const generateMockPendingBets = (bettorId: string): BettorBet[] => {
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

// Helper to generate mock upcoming bets
const generateMockUpcomingBets = (bettorId: string): BettorBet[] => {
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
