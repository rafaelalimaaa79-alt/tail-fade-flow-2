
import { BettorBet } from "@/types/bettor";

// Common sports and teams data used across mock generators
export const sports = ['NBA', 'NFL', 'MLB', 'NHL', 'UFC'];
export const teams = [
  'Lakers', 'Warriors', 'Celtics', 'Heat', 'Bucks',
  'Chiefs', 'Eagles', 'Cowboys', 'Bills', '49ers',
  'Yankees', 'Dodgers', 'Red Sox', 'Astros', 'Braves',
  'Maple Leafs', 'Bruins', 'Lightning', 'Avalanche', 'Oilers'
];

// NBA-specific bet types that make sense
export const nbaBetTypes = [
  'ML', // Moneyline
  '-1.5', '-2.5', '-3.5', '-4.5', '-5.5', '-6.5', '-7.5', // Point spreads
  '+1.5', '+2.5', '+3.5', '+4.5', '+5.5', '+6.5', '+7.5', // Point spreads
  'Over 220.5', 'Over 225.5', 'Over 230.5', 'Over 235.5', // Total points
  'Under 220.5', 'Under 225.5', 'Under 230.5', 'Under 235.5', // Total points
  'Over 110.5', 'Over 115.5', 'Over 120.5', // Team totals
  'Under 110.5', 'Under 115.5', 'Under 120.5' // Team totals
];

// Original bet types for other sports
export const betTypes = ['ML', '-1.5', '+2.5', '-3.5', 'Over 220.5', 'Under 48.5'];

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
