
// Mock data for the leaders page
const funnyUsernames = [
  "HughGRection",
  "SeymourButz", 
  "MikeRotchBurns",
  "DrewPeacock_",
  "HughJanus",
  "BenDover27",
  "PhilMcCraken",
  "BarryMcKockiner",
  "IvanaTinkle",
  "WillieBMunchin"
];

// Generate additional names for positions 11-50
const generateExtraNames = () => {
  const extraNames = [];
  const suffixes = ["69", "420", "666", "1337", "88", "99", "01", "777", "21", "13"];
  const prefixes = ["xX", "YoMama", "BigDaddy", "SlimShady", "NotYo", "Lil", "BigMike", "TinyTim", "FatTony", "SkinnyPete"];
  
  for (let i = 0; i < 40; i++) {
    const prefix = prefixes[i % prefixes.length];
    const suffix = suffixes[i % suffixes.length];
    extraNames.push(`${prefix}${suffix}`);
  }
  
  return extraNames;
};

const allUsernames = [...funnyUsernames, ...generateExtraNames()];

export const hottestBettors = Array.from({ length: 50 }, (_, i) => ({
  id: `hot-${i + 1}`,
  name: allUsernames[i],
  profit: Math.round(50 - i * 0.08),
  winRate: Math.round(75 - i * 0.06),
  streak: Math.min(15, 10 - Math.floor(i / 5)),
}));

// Fixed coldestBettors to show worst performers (most units down) at the top
export const coldestBettors = Array.from({ length: 50 }, (_, i) => ({
  id: `cold-${i + 1}`,
  name: allUsernames[i],
  profit: -(Math.round(50 - i * 0.8)), // Most negative at top, getting better as we go down
  winRate: Math.round(25 + i * 0.4), // Worst win rate at top, getting better
  streak: -(Math.min(15, 12 - Math.floor(i / 4))), // Worst streak at top
}));
