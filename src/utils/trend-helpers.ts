
// Function to get fade confidence (mock data for now)
export const getFadeConfidence = () => {
  return Math.floor(Math.random() * 30) + 70; // Random between 70-99%
};

// Function to generate matchups for different sports
export const getMatchup = (sport?: string) => {
  const nbaMatchups = [
    { game: "Lakers vs Celtics", teams: ["Lakers", "Celtics"], sport: "NBA" },
    { game: "Warriors vs Nets", teams: ["Warriors", "Nets"], sport: "NBA" }, 
    { game: "Bucks vs Heat", teams: ["Bucks", "Heat"], sport: "NBA" },
    { game: "76ers vs Nuggets", teams: ["76ers", "Nuggets"], sport: "NBA" }
  ];
  
  const ncaafbMatchups = [
    { game: "LSU vs Ole Miss", teams: ["LSU", "Ole Miss"], sport: "NCAAFB" },
    { game: "Alabama vs Georgia", teams: ["Alabama", "Georgia"], sport: "NCAAFB" },
    { game: "Ohio State vs Michigan", teams: ["Ohio State", "Michigan"], sport: "NCAAFB" },
    { game: "Clemson vs FSU", teams: ["Clemson", "FSU"], sport: "NCAAFB" }
  ];
  
  if (sport === "NCAAFB") {
    return ncaafbMatchups[Math.floor(Math.random() * ncaafbMatchups.length)];
  }
  
  return nbaMatchups[Math.floor(Math.random() * nbaMatchups.length)];
};

// Function to generate realistic bet lines for different sports
export const getBetLine = (teams: string[], sport?: string) => {
  const team = teams[Math.floor(Math.random() * teams.length)];
  
  const nbaBetTypes = [
    "Over 230.5", "Under 225.5", "-3.5", "+5.5", "Over 115.5", "Under 110.5", "ML"
  ];
  
  const ncaafbBetTypes = [
    "Over 52.5", "Under 48.5", "-7.5", "+10.5", "Over 24.5", "Under 21.5", "ML"
  ];
  
  const betTypes = sport === "NCAAFB" ? ncaafbBetTypes : nbaBetTypes;
  const betType = betTypes[Math.floor(Math.random() * betTypes.length)];
  
  // For totals, don't include team name for game totals
  if (betType.includes("Over") || betType.includes("Under")) {
    if ((sport === "NBA" && (betType.includes("230.5") || betType.includes("225.5"))) ||
        (sport === "NCAAFB" && (betType.includes("52.5") || betType.includes("48.5")))) {
      return betType; // Game total
    } else {
      return `${team} ${betType}`; // Team total
    }
  }
  
  // For spreads and ML, include team name
  return `${team} ${betType}`;
};

// Function to generate sport-specific statlines
export const getSportStatline = (sport: string) => {
  const wins = Math.floor(Math.random() * 10) + 1; // 1-10 wins
  const totalBets = wins + Math.floor(Math.random() * 15) + 3; // Add 3-17 more bets
  
  const sportStatlines = {
    "NBA": `He is ${wins} for ${totalBets} in his last ${totalBets} NBA bets`,
    "NFL": `He is ${wins} for ${totalBets} in his last ${totalBets} NFL bets`,
    "MLB": `He is ${wins} for ${totalBets} in his last ${totalBets} MLB bets`,
    "NHL": `He is ${wins} for ${totalBets} in his last ${totalBets} NHL bets`,
    "UFC": `He is ${wins} for ${totalBets} in his last ${totalBets} UFC fights`,
    "NCAAFB": `He is ${wins} for ${totalBets} in his last ${totalBets} NCAAFB bets`
  };
  
  return sportStatlines[sport as keyof typeof sportStatlines] || `He is ${wins} for ${totalBets} in his last ${totalBets} bets`;
};
