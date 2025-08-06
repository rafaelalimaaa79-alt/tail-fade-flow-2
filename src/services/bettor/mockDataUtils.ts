
import { BettorBet } from "@/types/bettor";

// Common sports and teams data used across mock generators
export const sports = ['NCAAFB', 'NFL'];
export const teams = [
  // NCAAFB teams
  'LSU', 'Clemson', 'Ohio State', 'Texas', 'Alabama', 'Florida State',
  'Auburn', 'Baylor', 'Tennessee', 'Syracuse', 'Notre Dame', 'Miami',
  'South Carolina', 'Virginia Tech', 'North Carolina', 'TCU',
  // NFL teams  
  'Eagles', 'Cowboys', 'Chiefs', 'Chargers', 'Bengals', 'Browns',
  'Steelers', 'Jets', '49ers', 'Seahawks', 'Dolphins', 'Bills'
];

// Real bet types based on actual upcoming games
export const ncaafbBetTypes = [
  'ML', // Moneyline
  '-1.5', '-2.5', '-3.5', '-7.5', '-8.5', '-9.5', '-12.5', // Real spreads from games
  '+1.5', '+2.5', '+3.5', '+7.5', '+8.5', '+9.5', '+12.5', // Real spreads from games
  'Over 51.5', 'Over 53.5', 'Over 56.5', // Real totals from games
  'Under 51.5', 'Under 53.5', 'Under 56.5' // Real totals from games
];

export const nflBetTypes = [
  'ML', // Moneyline
  '-1.5', '-2.5', '-3', '-5.5', '-7', // Real spreads from games
  '+1.5', '+2.5', '+3', '+5.5', '+7', // Real spreads from games
  'Over 39.5', 'Over 44.5', 'Over 45.5', 'Over 46.5', 'Over 51.5', // Real totals from games
  'Under 39.5', 'Under 44.5', 'Under 45.5', 'Under 46.5', 'Under 51.5' // Real totals from games
];

// Combined bet types for all sports
export const betTypes = [...ncaafbBetTypes, ...nflBetTypes];

// Shared utility to calculate timeframe-specific data points
export const getDataPointsForTimeframe = (timeframe: '1D' | '1W' | '1M' | '3M' | '1Y'): number => {
  return timeframe === '1D' ? 24 : 
         timeframe === '1W' ? 7 : 
         timeframe === '1M' ? 30 :
         timeframe === '3M' ? 90 : 365;
};

// Utility to generate a date based on timeframe
export const generateTimestampForTimeframe = (
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y', 
  offset: number
): Date => {
  const date = new Date();
  
  if (timeframe === '1D') {
    date.setHours(date.getHours() - offset);
  } else {
    date.setDate(date.getDate() - offset);
  }
  
  return date;
};

// Utility to sort bets by timestamp (most recent first)
export const sortBetsByTimestamp = (bets: BettorBet[]): BettorBet[] => {
  return [...bets].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};
