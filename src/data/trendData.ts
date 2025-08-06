
// Mock data for the trends page
export const trendData = [
  {
    id: "1",
    name: "WinMaster",
    betDescription: "Alabama -8.5",
    betType: "NCAAFB",
    isTailRecommendation: true,
    reason: "8-2 in last 10 bets with consistent NCAAFB picks",
    recentBets: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1], // 1 = win, 0 = loss
    unitPerformance: 8.5,
    tailScore: 85,
    userCount: 342,
    categoryBets: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1], // 10 bets for NCAAFB Spread
    categoryName: "NCAAFB Spread",
  },
  {
    id: "2",
    name: "BetKing",
    betDescription: "Chiefs -2.5",
    betType: "NFL",
    isTailRecommendation: true,
    reason: "7-3 record on NFL favorites",
    recentBets: [1, 1, 0, 1, 1, 1, 1, 0, 1, 0],
    unitPerformance: 6.7,
    tailScore: 78,
    userCount: 215,
    categoryBets: [1, 1, 0, 0, 1, 1, 0], // Only 7 bets for NFL Spread
    categoryName: "NFL Spread",
  },
  {
    id: "3",
    name: "ProPicker",
    betDescription: "LSU ML",
    betType: "NCAAFB",
    isTailRecommendation: false,
    reason: "4-20 record on college football bets",
    recentBets: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    unitPerformance: -7.2,
    fadeScore: 98,
    userCount: 176,
    categoryBets: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0], // 4 wins out of 20 bets for NCAAFB ML
    categoryName: "NCAAFB ML",
  },
  {
    id: "4",
    name: "BettingGuru",
    betDescription: "Eagles -7",
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
    betDescription: "Under 39.5",
    betType: "NFL",
    isTailRecommendation: false,
    reason: "Only 2-6 in NFL totals picks",
    recentBets: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    unitPerformance: -8.3,
    fadeScore: 84,
    userCount: 138,
    categoryBets: [0, 0, 1, 0, 0, 0], // 6 bets for NFL Totals
    categoryName: "NFL Totals",
  },
  {
    id: "6",
    name: "OddsShark",
    betDescription: "Steelers -3",
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
