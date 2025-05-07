
import { BettorSummary, BettorBet } from "@/types/bettor";

export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y';

export type BettorActivity = {
  todayBets: BettorBet[];
  pendingBets: BettorBet[];
  upcomingBets: BettorBet[];
};
