
// Mock data for the leaders page
export const hottestBettors = Array.from({ length: 50 }, (_, i) => ({
  id: `hot-${i + 1}`,
  name: `HotBettor${i + 1}`,
  profit: Math.round(50 - i * 0.08),
  winRate: Math.round(75 - i * 0.06),
  streak: Math.min(15, 10 - Math.floor(i / 5)),
}));

export const coldestBettors = Array.from({ length: 50 }, (_, i) => ({
  id: `cold-${i + 1}`,
  name: `ColdBettor${i + 1}`,
  profit: Math.round(-(45 - i * 0.08)),
  winRate: Math.round(30 + i * 0.5),
  streak: -Math.min(12, 8 - Math.floor(i / 6)),
}));
