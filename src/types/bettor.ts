
export interface BettorProfile {
  userId: string;
  username: string;
  tailRanking: number;
  stats: {
    totalBets: number;
    roi: number;
    unitsGained: number;
    winRate: number;
    performanceByTimeframe?: {
      '1D': number;
      '1W': number;
      '1M': number;
      '3M': number;
      '1Y': number;
    };
  };
}

export interface BetHistoryPoint {
  timestamp: string;
  units: number;
}

export interface BettorGraphData {
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y';
  data: BetHistoryPoint[];
}

export interface BettorBet {
  id: string;
  timestamp: string;
  betType: string;
  teams: string;
  odds: string;
  unitsRisked: number;
  result: 'W' | 'L' | 'P'; // Win, Loss, Push
  unitsWonLost: number;
}

export interface BettorSummary {
  profile: BettorProfile;
  graphData: BettorGraphData;
  biggestWinners: BettorBet[];
  largestBets: BettorBet[];
}
