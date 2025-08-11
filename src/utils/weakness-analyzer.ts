// Enhanced weakness analyzer that identifies the strongest signal for each bet

export interface WeaknessSignal {
  type: string;
  strength: number; // 0-100, higher means stronger signal
  description: string;
}

export interface BettorWeaknesses {
  coldStreak: WeaknessSignal;
  propHitRate: WeaknessSignal;
  teamBias: WeaknessSignal;
  sportPerformance: WeaknessSignal;
  betTypeWeakness: WeaknessSignal;
  timeBasedPattern: WeaknessSignal;
  favoriteUnderdogBias: WeaknessSignal;
  totalsPerformance: WeaknessSignal;
  spreadAccuracy: WeaknessSignal;
  largeSpreadFails: WeaknessSignal;
}

// Generate comprehensive weakness analysis for a bettor
export const analyzeBettorWeaknesses = (
  bettorName: string, 
  betDescription: string,
  sport: string
): BettorWeaknesses => {
  const seed = hashString(bettorName + betDescription); // Create consistent data per bettor/bet
  
  return {
    coldStreak: generateColdStreakSignal(seed),
    propHitRate: generatePropHitRateSignal(seed, sport),
    teamBias: generateTeamBiasSignal(seed, betDescription),
    sportPerformance: generateSportPerformanceSignal(seed, sport),
    betTypeWeakness: generateBetTypeWeaknessSignal(seed, betDescription),
    timeBasedPattern: generateTimeBasedPatternSignal(seed),
    favoriteUnderdogBias: generateFavoriteUnderdogBiasSignal(seed, betDescription),
    totalsPerformance: generateTotalsPerformanceSignal(seed, betDescription),
    spreadAccuracy: generateSpreadAccuracySignal(seed, betDescription),
    largeSpreadFails: generateLargeSpreadFailsSignal(seed, betDescription)
  };
};

// Get the strongest weakness signal and return its description
export const getStrongestWeaknessDescription = (weaknesses: BettorWeaknesses): string => {
  const signals = Object.values(weaknesses);
  const strongest = signals.reduce((prev, current) => 
    current.strength > prev.strength ? current : prev
  );
  
  return strongest.description;
};

// Hash function for consistent randomization
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Seeded random function
function seededRandom(seed: number, min: number = 0, max: number = 100): number {
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return Math.floor(random * (max - min + 1)) + min;
}

// Generate different weakness signals
function generateColdStreakSignal(seed: number): WeaknessSignal {
  const wins = seededRandom(seed * 2, 1, 4);
  const losses = seededRandom(seed * 3, 8, 16);
  const total = wins + losses;
  const strength = seededRandom(seed * 4, 60, 90);
  
  return {
    type: "coldStreak",
    strength,
    description: `He is ${wins} for ${total} in his last ${total} bets`
  };
}

function generatePropHitRateSignal(seed: number, sport: string): WeaknessSignal {
  const hitRate = seededRandom(seed * 5, 15, 35);
  const propTypes = {
    "NBA": ["rebounds", "assists", "points", "three-pointers"],
    "NFL": ["receiving yards", "rushing yards", "touchdown", "completion"],
    "MLB": ["strikeouts", "hits", "runs", "home run"],
    "NHL": ["saves", "goals", "assists", "penalty minutes"]
  };
  
  const props = propTypes[sport as keyof typeof propTypes] || ["player performance"];
  const propType = props[seededRandom(seed * 6, 0, props.length - 1)];
  const strength = seededRandom(seed * 7, 70, 95);
  
  return {
    type: "propHitRate",
    strength,
    description: `He only hits ${hitRate}% of ${propType} props`
  };
}

function generateTeamBiasSignal(seed: number, betDescription: string): WeaknessSignal {
  const teams = ["Steelers", "Cowboys", "Lakers", "Patriots", "Chiefs", "49ers", "Celtics", "Yankees"];
  const team = teams[seededRandom(seed * 8, 0, teams.length - 1)];
  const wins = seededRandom(seed * 9, 2, 4);
  const losses = seededRandom(seed * 10, 7, 12);
  const strength = seededRandom(seed * 11, 75, 92);
  
  return {
    type: "teamBias",
    strength,
    description: `He is ${wins}–${losses + wins} betting on the ${team}`
  };
}

function generateSportPerformanceSignal(seed: number, sport: string): WeaknessSignal {
  const winRate = seededRandom(seed * 12, 18, 32);
  const strength = seededRandom(seed * 13, 65, 88);
  
  return {
    type: "sportPerformance",
    strength,
    description: `Only ${winRate}% win rate in ${sport} this season`
  };
}

function generateBetTypeWeaknessSignal(seed: number, betDescription: string): WeaknessSignal {
  let betType = "spread";
  if (betDescription.includes("ML") || betDescription.includes("moneyline")) {
    betType = "moneyline";
  } else if (betDescription.includes("Over") || betDescription.includes("Under")) {
    betType = "totals";
  }
  
  const wins = seededRandom(seed * 14, 1, 3);
  const total = seededRandom(seed * 15, 9, 15);
  const strength = seededRandom(seed * 16, 68, 89);
  
  return {
    type: "betTypeWeakness",
    strength,
    description: `Terrible ${wins}-${total - wins} record on ${betType} bets`
  };
}

function generateTimeBasedPatternSignal(seed: number): WeaknessSignal {
  const patterns = [
    "prime time games",
    "Monday night games", 
    "weekend games",
    "road team favorites",
    "divisional matchups"
  ];
  
  const pattern = patterns[seededRandom(seed * 17, 0, patterns.length - 1)];
  const winRate = seededRandom(seed * 18, 12, 28);
  const strength = seededRandom(seed * 19, 72, 91);
  
  return {
    type: "timeBasedPattern",
    strength,
    description: `${winRate}% win rate on ${pattern}`
  };
}

function generateFavoriteUnderdogBiasSignal(seed: number, betDescription: string): WeaknessSignal {
  const isFavorite = betDescription.includes("-");
  const type = isFavorite ? "favorites" : "underdogs";
  const wins = seededRandom(seed * 20, 2, 5);
  const total = seededRandom(seed * 21, 11, 18);
  const strength = seededRandom(seed * 22, 69, 87);
  
  return {
    type: "favoriteUnderdogBias",
    strength,
    description: `${wins}-${total - wins} when betting ${type}`
  };
}

function generateTotalsPerformanceSignal(seed: number, betDescription: string): WeaknessSignal {
  const isTotal = betDescription.includes("Over") || betDescription.includes("Under");
  if (!isTotal) {
    return { type: "totals", strength: 0, description: "" };
  }
  
  const direction = betDescription.includes("Over") ? "overs" : "unders";
  const hitRate = seededRandom(seed * 23, 16, 29);
  const strength = seededRandom(seed * 24, 73, 94);
  
  return {
    type: "totalsPerformance",
    strength,
    description: `${hitRate}% hit rate on ${direction} this month`
  };
}

function generateSpreadAccuracySignal(seed: number, betDescription: string): WeaknessSignal {
  const hasSpread = betDescription.match(/-?\d+\.?5?/);
  if (!hasSpread) {
    return { type: "spread", strength: 0, description: "" };
  }
  
  const accuracy = seededRandom(seed * 25, 19, 33);
  const strength = seededRandom(seed * 26, 66, 86);
  
  return {
    type: "spreadAccuracy",
    strength,
    description: `Covers spread only ${accuracy}% of the time`
  };
}

function generateLargeSpreadFailsSignal(seed: number, betDescription: string): WeaknessSignal {
  const spreadMatch = betDescription.match(/-?(\d+\.?5?)/);
  const spread = spreadMatch ? parseFloat(spreadMatch[1]) : 0;
  
  if (spread < 6) {
    return { type: "largeSpread", strength: 0, description: "" };
  }
  
  const wins = seededRandom(seed * 27, 0, 2);
  const total = seededRandom(seed * 28, 8, 13);
  const strength = seededRandom(seed * 29, 78, 96);
  
  return {
    type: "largeSpreadFails",
    strength,
    description: `${wins}-${total - wins} on spreads larger than 6 points`
  };
}