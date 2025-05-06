
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
  
  return {
    profile: {
      userId: bettorId,
      username: `Bettor${bettorId.substring(0, 4)}`,
      tailRanking: Math.floor(Math.random() * 100) + 1,
      stats: {
        totalBets,
        roi: parseFloat(roi.toFixed(1)),
        unitsGained: parseFloat(currentUnits.toFixed(1)),
        winRate: parseFloat(winRate.toFixed(1))
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
