
// Mock data for the trends page
export const trendData = [
  {
    id: "1",
    name: "WinMaster",
    betDescription: "Lakers -5.5",
    betType: "NBA",
    isTailRecommendation: true,
    reason: "8-2 in last 10 bets with consistent NBA picks",
    recentBets: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1], // 1 = win, 0 = loss
    unitPerformance: 8.5,
    tailScore: 85,
    userCount: 342,
    categoryBets: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1], // 10 bets for NBA Spread
    categoryName: "NBA Spread",
  },
  {
    id: "2",
    name: "BetKing",
    betDescription: "Chiefs ML",
    betType: "NFL",
    isTailRecommendation: true,
    reason: "7-3 record on NFL favorites",
    recentBets: [1, 1, 0, 1, 1, 1, 1, 0, 1, 0],
    unitPerformance: 6.7,
    tailScore: 78,
    userCount: 215,
    categoryBets: [1, 1, 0, 0, 1, 1, 0], // Only 7 bets for NFL ML
    categoryName: "NFL ML",
  },
  {
    id: "3",
    name: "ProPicker",
    betDescription: "Celtics vs Heat Over 220",
    betType: "NBA",
    isTailRecommendation: false,
    reason: "2-6 record on over/under bets",
    recentBets: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    unitPerformance: -7.2,
    fadeScore: 88,
    userCount: 176,
    categoryBets: [0, 0, 0, 0, 1, 0], // Only 6 bets for NBA O/U
    categoryName: "NBA O/U",
  },
  {
    id: "4",
    name: "BettingGuru",
    betDescription: "Cowboys -3",
    betType: "NFL",
    isTailRecommendation: true,
    reason: "Solid 7-3 record with NFL spreads",
    recentBets: [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    unitPerformance: 5.9,
    tailScore: 72,
    userCount: 295,
    categoryBets: [1, 0, 1, 1, 0, 1, 1, 0, 1], // 9 bets for NFL Spread
    categoryName: "NFL Spread",
  },
  {
    id: "5",
    name: "SportsTipper",
    betDescription: "Yankees ML",
    betType: "MLB",
    isTailRecommendation: false,
    reason: "Only 2-4 in MLB moneyline picks",
    recentBets: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    unitPerformance: -8.3,
    fadeScore: 84,
    userCount: 138,
    categoryBets: [0, 0, 1, 0, 0, 0], // 6 bets for MLB ML
    categoryName: "MLB ML",
  },
  {
    id: "6",
    name: "OddsShark",
    betDescription: "Steelers +3.5",
    betType: "NFL",
    isTailRecommendation: true,
    reason: "7-2 on NFL underdogs",
    recentBets: [1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
    unitPerformance: 7.1,
    tailScore: 76,
    userCount: 254,
    categoryBets: [1, 1, 0, 1, 0, 1, 1, 1, 0], // 9 bets for NFL Spread
    categoryName: "NFL Spread",
  }
];
