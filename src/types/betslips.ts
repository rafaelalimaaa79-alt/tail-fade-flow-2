// Event details
export interface Contestant {
  id: string;
  fullName: string;
  abbr: string;
}

export interface Event {
  id: string;
  sportsdataioId?: string | null;
  sportradarId?: string | null;
  oddsjamId?: string | null;
  theOddsApiId?: string | null;
  sport: string;
  league: string;
  name: string;
  nameSpecial?: string | null;
  startTime: string;
  startDate: string;
  seasonType?: string | null;
  sportId?: string;
  leagueId?: string;
  contestantAway: Contestant;
  contestantHome: Contestant;
  neutralVenue?: boolean | null;
}

// Bet details
interface Bet {
  id: string;
  type: string | null;
  event: Event;
  segment?: string | null;
  proposition?: string | null;
  segmentDetail?: string | null;
  position?: string | null;
  line?: number | null;
  oddsAmerican: number;
  status: string;
  outcome?: string | null;
  live?: boolean | null;
  incomplete: boolean;
  bookDescription: string;
  marketSelection?: string | null;
  autoGrade: boolean;
  segmentId?: string | null;
  positionId?: string | null;
  propDetails?: any;
}

// Book info
export interface Book {
  id: string;
  name: string;
  abbr: string;
}

// Adjusted odds/line info
export interface Adjusted {
  odds: boolean;
  line: number | null;
  atRisk: number | null;
}

// BetSlip (root object)
export interface BetSlip {
  id: string;
  bettor: string;
  book: Book;
  bettorAccount: string;
  bookRef: string;
  timePlaced: string;
  type: string;
  subtype?: string | null;
  oddsAmerican: number;
  atRisk: number;
  toWin: number;
  status: string;
  outcome?: string | null;
  refreshResponse?: string | null;
  incomplete: boolean;
  netProfit?: number | null;
  dateClosed?: string | null;
  timeClosed?: string | null;
  typeSpecial?: string | null;
  bets: Bet[];
  adjusted: Adjusted;
}
