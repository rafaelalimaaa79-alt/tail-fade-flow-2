
// Define types for our challenge data
export interface Challenge {
  id: string;
  type: "tournament" | "fixed" | "custom";
  format: "1v1" | "2v2" | "multi";
  entry_fee: number;
  duration_days: number;
  min_bets_required: number;
  status: "open" | "in_progress" | "completed";
  creator_user_id: string;
  start_time: string | null;
  end_time: string | null;
  pot_total_cents: number;
  rake_cents: number;
  created_at: string;
  participants_count: number;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  team: string | null;
  units_gained: number;
  bets_placed: number;
  is_winner: boolean;
  is_eliminated: boolean;
  joined_at: string;
}
