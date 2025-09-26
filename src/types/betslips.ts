export interface BetSlip {
  id: string;
  user_id: string;
  sportsbook: string;
  event: string;
  bet_type: string;
  odds: string;
  units_risked: number;
  status: 'pending' | 'won' | 'lost' | 'pushed';
  created_at: string;
  settled_at?: string;
  units_won_lost?: number;
  wager_amount?: number;
  potential_payout?: number;
}

export interface BetSlipsResponse {
  betslips: BetSlip[];
  total: number;
  page: number;
  limit: number;
}