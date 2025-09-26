export interface BetSlip {
  id: string;
  userId: string;
  status: 'pending' | 'settled' | 'cancelled';
  placedAt: string;
  settledAt?: string;
  totalOdds: number;
  stake: number;
  potentialPayout: number;
  actualPayout?: number;
  legs: BetLeg[];
  sportsbookId?: string;
  externalId?: string;
}

export interface BetLeg {
  id: string;
  gameId: string;
  marketType: string;
  selection: string;
  odds: number;
  status: 'pending' | 'won' | 'lost' | 'void';
  game: GameInfo;
}

export interface GameInfo {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  gameTime: string;
  season?: string;
  week?: number;
}

export type BetSlipStatus = 'pending' | 'settled' | 'cancelled';
export type BetLegStatus = 'pending' | 'won' | 'lost' | 'void';