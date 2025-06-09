
export interface BetterPlay {
  bettorName: string;
  bet: string;
  suggestionType: "fade";
  stats: string;
  percentage: number;
  userCount: number;
}

export const playsOfTheDay: BetterPlay[] = [
  {
    bettorName: "NoCoverKev",
    bet: "Celtics -6.5",
    suggestionType: "fade",
    stats: "@NoCoverKev is getting hammered — consider fading.",
    percentage: 89,
    userCount: 182
  },
  {
    bettorName: "ColdHands88",
    bet: "Yankees ML", 
    suggestionType: "fade",
    stats: "@ColdHands88 is ice cold — perfect fade opportunity.",
    percentage: 78,
    userCount: 156
  },
  {
    bettorName: "SlumpCityJack",
    bet: "Dodgers -1.5",
    suggestionType: "fade",
    stats: "@SlumpCityJack can't buy a win — easy fade.",
    percentage: 72,
    userCount: 143
  },
  {
    bettorName: "IcyColdTakes",
    bet: "Lakers +3",
    suggestionType: "fade",
    stats: "@IcyColdTakes is struggling badly — fade with confidence.",
    percentage: 85,
    userCount: 201
  },
  {
    bettorName: "FrozenPicks",
    bet: "Warriors ML",
    suggestionType: "fade",
    stats: "@FrozenPicks is on a cold streak — time to fade.",
    percentage: 76,
    userCount: 167
  }
];
