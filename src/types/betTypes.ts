
export interface BetterPlay {
  bettorName: string;
  bet: string;
  suggestionType: "fade";
  stats: string;
  record: string;
  percentage: number;
  userCount: number;
}

export const playsOfTheDay: BetterPlay[] = [
  {
    bettorName: "NoCoverKev",
    bet: "Clemson -2.5",
    suggestionType: "fade",
    stats: "Currently on a cold streak — high-confidence fade.",
    record: "2-12 in last 14 bets",
    percentage: 89,
    userCount: 182
  },
  {
    bettorName: "ColdHands88",
    bet: "Eagles -7", 
    suggestionType: "fade",
    stats: "Ice cold performance — perfect fade opportunity.",
    record: "1-9 in last 10 bets",
    percentage: 78,
    userCount: 156
  },
  {
    bettorName: "SlumpCityJack",
    bet: "Alabama -8.5",
    suggestionType: "fade",
    stats: "Deep slump continues — easy fade.",
    record: "3-11 in last 14 bets",
    percentage: 72,
    userCount: 143
  },
  {
    bettorName: "IcyColdTakes",
    bet: "Chiefs -2.5",
    suggestionType: "fade",
    stats: "Struggling badly — fade with confidence.",
    record: "2-13 in last 15 bets",
    percentage: 85,
    userCount: 201
  },
  {
    bettorName: "FrozenPicks",
    bet: "Notre Dame -2.5",
    suggestionType: "fade",
    stats: "Cold streak continues — time to fade.",
    record: "4-10 in last 14 bets",
    percentage: 76,
    userCount: 167
  }
];
