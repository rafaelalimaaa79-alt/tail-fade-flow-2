
import { BettorSummary } from "@/types/bettor";
import { generateMockBetHistory } from "./mockBetHistory";
import { getDataPointsForTimeframe, generateTimestampForTimeframe } from "./mockDataUtils";

// Generate mock bettor summary data
export const generateMockBettorData = (
  bettorId: string,
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y'
): BettorSummary => {
  // Generate different data based on timeframe
  const dataPoints = getDataPointsForTimeframe(timeframe);
  
  // Generate graph data points
  const graphData = [];
  let currentUnits = 0;
  
  for (let i = 0; i < dataPoints; i++) {
    // Random change between -2 and +3 units per period
    const change = (Math.random() * 5) - 2;
    currentUnits += change;
    
    // Create timestamp based on timeframe
    const date = generateTimestampForTimeframe(timeframe, dataPoints - i);
    
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
