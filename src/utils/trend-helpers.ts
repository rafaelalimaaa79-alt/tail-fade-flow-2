
// Function to get fade confidence (mock data for now)
export const getFadeConfidence = () => {
  return Math.floor(Math.random() * 30) + 70; // Random between 70-99%
};

// Function to generate NBA matchups
export const getMatchup = () => {
  const matchups = [
    { game: "Lakers vs Celtics", teams: ["Lakers", "Celtics"], sport: "NBA" },
    { game: "Warriors vs Nets", teams: ["Warriors", "Nets"], sport: "NBA" }, 
    { game: "Bucks vs Heat", teams: ["Bucks", "Heat"], sport: "NBA" },
    { game: "76ers vs Nuggets", teams: ["76ers", "Nuggets"], sport: "NBA" },
    { game: "Suns vs Mavericks", teams: ["Suns", "Mavericks"], sport: "NBA" }
  ];
  return matchups[Math.floor(Math.random() * matchups.length)];
};

// Function to generate realistic NBA bet lines
export const getBetLine = (teams: string[]) => {
  const team = teams[Math.floor(Math.random() * teams.length)];
  const betTypes = [
    "Over 230.5", // Total points
    "Under 225.5", // Total points
    "-3.5", // Point spread
    "+5.5", // Point spread
    "Over 115.5", // Team total
    "Under 110.5", // Team total
    "ML" // Moneyline
  ];
  const betType = betTypes[Math.floor(Math.random() * betTypes.length)];
  
  // For totals, don't include team name
  if (betType.includes("Over") || betType.includes("Under")) {
    if (betType.includes("230.5") || betType.includes("225.5")) {
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
    "UFC": `He is ${wins} for ${totalBets} in his last ${totalBets} UFC fights`
  };
  
  return sportStatlines[sport as keyof typeof sportStatlines] || `He is ${wins} for ${totalBets} in his last ${totalBets} bets`;
};
