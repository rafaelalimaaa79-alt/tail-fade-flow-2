
export interface BetterPlay {
  bettorName: string;
  bet: string;
  suggestionType: "fade" | "tail";
  stats: string;
  percentage: number;
}

export const playsOfTheDay: BetterPlay[] = [
  {
    bettorName: "NoCoverKev",
    bet: "Celtics -6.5",
    suggestionType: "fade",
    stats: "2–12 in his last 14 bets",
    percentage: 89
  },
  {
    bettorName: "MoneyMaker22",
    bet: "Rangers ML",
    suggestionType: "tail",
    stats: "+11.4u this week",
    percentage: 84
  },
  {
    bettorName: "ColdHands88",
    bet: "Yankees ML",
    suggestionType: "fade",
    stats: "Lost 6 straight MLB bets",
    percentage: 78
  },
  {
    bettorName: "SharpSniper17",
    bet: "Nuggets -4.5",
    suggestionType: "tail",
    stats: "On a 9–1 heater",
    percentage: 75
  },
  {
    bettorName: "SlumpCityJack",
    bet: "Dodgers -1.5",
    suggestionType: "fade",
    stats: "0–7 on last run line picks",
    percentage: 72
  }
];
