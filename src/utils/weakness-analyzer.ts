// Enhanced weakness analyzer that identifies the strongest signal for each bet

export interface WeaknessSignal {
  type: string;
  strength: number; // 0-100, higher means stronger signal
  description: string;
}

export interface BettorWeaknesses {
  recentForm: WeaknessSignal;
  sportWinRateLifetime: WeaknessSignal;
  sportWinRateCurrentSeason: WeaknessSignal;
  timeSlotRecord: WeaknessSignal;
  marketTypeRecord: WeaknessSignal;
  bigBetRecord: WeaknessSignal;
  teamSpecificRecord: WeaknessSignal;
  chasingLossesPerformance: WeaknessSignal;
  marketTypeByBetSize: WeaknessSignal;
}

// Generate comprehensive weakness analysis for a bettor
export const analyzeBettorWeaknesses = (
  bettorName: string, 
  betDescription: string,
  sport: string
): BettorWeaknesses => {
  const seed = hashString(bettorName + betDescription); // Create consistent data per bettor/bet
  
  return {
    recentForm: generateRecentFormSignal(seed),
    sportWinRateLifetime: generateSportWinRateLifetimeSignal(seed, sport),
    sportWinRateCurrentSeason: generateSportWinRateCurrentSeasonSignal(seed, sport),
    timeSlotRecord: generateTimeSlotRecordSignal(seed),
    marketTypeRecord: generateMarketTypeRecordSignal(seed, betDescription),
    bigBetRecord: generateBigBetRecordSignal(seed),
    teamSpecificRecord: generateTeamSpecificRecordSignal(seed, betDescription),
    chasingLossesPerformance: generateChasingLossesPerformanceSignal(seed),
    marketTypeByBetSize: generateMarketTypeByBetSizeSignal(seed, betDescription)
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

// Generate fade confidence algorithm weakness signals

// 1. Recent Form (last 10 bets)
function generateRecentFormSignal(seed: number): WeaknessSignal {
  const wins = seededRandom(seed * 2, 1, 3);
  const total = 10;
  const strength = seededRandom(seed * 3, 70, 95);
  
  return {
    type: "recentForm",
    strength,
    description: `He's ${wins}–${total - wins} in his last ${total} bets`
  };
}

// 2. Sport Win Rate (lifetime)
function generateSportWinRateLifetimeSignal(seed: number, sport: string): WeaknessSignal {
  const winRate = seededRandom(seed * 4, 25, 40);
  const strength = seededRandom(seed * 5, 65, 88);
  
  return {
    type: "sportWinRateLifetime",
    strength,
    description: `${winRate}% lifetime win rate in ${sport}`
  };
}

// 3. Sport Win Rate (current season)
function generateSportWinRateCurrentSeasonSignal(seed: number, sport: string): WeaknessSignal {
  const wins = seededRandom(seed * 6, 2, 6);
  const total = seededRandom(seed * 7, 15, 25);
  const strength = seededRandom(seed * 8, 75, 92);
  
  return {
    type: "sportWinRateCurrentSeason",
    strength,
    description: `He's ${wins}–${total - wins} in ${sport} this season`
  };
}

// 4. Time Slot Record
function generateTimeSlotRecordSignal(seed: number): WeaknessSignal {
  const timeSlots = [
    "prime time games",
    "Monday night games", 
    "weekend games",
    "afternoon games",
    "late games"
  ];
  
  const timeSlot = timeSlots[seededRandom(seed * 9, 0, timeSlots.length - 1)];
  const wins = seededRandom(seed * 10, 1, 4);
  const total = seededRandom(seed * 11, 12, 20);
  const strength = seededRandom(seed * 12, 68, 89);
  
  return {
    type: "timeSlotRecord",
    strength,
    description: `He's ${wins}–${total - wins} on ${timeSlot}`
  };
}

// 5. Market Type Record (moneyline, spread, totals)
function generateMarketTypeRecordSignal(seed: number, betDescription: string): WeaknessSignal {
  let marketType = "spread";
  if (betDescription.includes("ML") || betDescription.includes("moneyline")) {
    marketType = "moneyline";
  } else if (betDescription.includes("Over") || betDescription.includes("Under")) {
    marketType = "totals";
  }
  
  const wins = seededRandom(seed * 13, 2, 5);
  const total = seededRandom(seed * 14, 14, 22);
  const strength = seededRandom(seed * 15, 72, 90);
  
  return {
    type: "marketTypeRecord",
    strength,
    description: `He's ${wins}–${total - wins} on ${marketType} bets`
  };
}

// 6. Big Bet Record (>2 units)
function generateBigBetRecordSignal(seed: number): WeaknessSignal {
  const lossRate = seededRandom(seed * 16, 65, 85);
  const strength = seededRandom(seed * 17, 78, 95);
  
  return {
    type: "bigBetRecord",
    strength,
    description: `He loses ${lossRate}% of bets over 2 units`
  };
}

// 7. Team-Specific Record
function generateTeamSpecificRecordSignal(seed: number, betDescription: string): WeaknessSignal {
  const teams = ["Steelers", "Cowboys", "Lakers", "Patriots", "Chiefs", "49ers", "Celtics", "Yankees", "Rams", "Dodgers"];
  const team = teams[seededRandom(seed * 18, 0, teams.length - 1)];
  const wins = seededRandom(seed * 19, 1, 4);
  const total = seededRandom(seed * 20, 11, 18);
  const strength = seededRandom(seed * 21, 80, 96);
  
  return {
    type: "teamSpecificRecord",
    strength,
    description: `He's ${wins}–${total - wins} betting on the ${team}`
  };
}

// 8. Chasing Losses Performance
function generateChasingLossesPerformanceSignal(seed: number): WeaknessSignal {
  const wins = seededRandom(seed * 22, 1, 3);
  const total = seededRandom(seed * 23, 10, 16);
  const strength = seededRandom(seed * 24, 73, 91);
  
  return {
    type: "chasingLossesPerformance",
    strength,
    description: `He's ${wins}–${total - wins} when chasing losses`
  };
}

// 9. Market Type by Bet Size
function generateMarketTypeByBetSizeSignal(seed: number, betDescription: string): WeaknessSignal {
  let marketType = "spread";
  if (betDescription.includes("ML") || betDescription.includes("moneyline")) {
    marketType = "moneyline";
  } else if (betDescription.includes("Over") || betDescription.includes("Under")) {
    marketType = "totals";
  }
  
  const winRate = seededRandom(seed * 25, 18, 32);
  const strength = seededRandom(seed * 26, 70, 87);
  
  return {
    type: "marketTypeByBetSize",
    strength,
    description: `${winRate}% win rate on large ${marketType} bets`
  };
}