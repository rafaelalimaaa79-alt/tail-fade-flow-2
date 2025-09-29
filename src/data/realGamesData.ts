// Real upcoming games data
export const realGames = [
  // NCAAFB Games
  {
    id: "1",
    matchup: "LSU vs Clemson",
    teams: ["LSU", "Clemson"],
    sport: "NCAAFB",
    spread: "Clemson −2.5",
    moneyline: { favorite: "Clemson −137", underdog: "LSU +114" },
    total: "O/U 56.5"
  },
  {
    id: "2", 
    matchup: "Ohio State vs Texas",
    teams: ["Ohio State", "Texas"],
    sport: "NCAAFB",
    spread: "OSU −3.5",
    moneyline: null,
    total: null
  },
  {
    id: "3",
    matchup: "Alabama vs Florida State",
    teams: ["Alabama", "Florida State"],
    sport: "NCAAFB", 
    spread: "Alabama −8.5",
    moneyline: { favorite: "Alabama −350", underdog: "FSU +260" },
    total: "O/U 51.5"
  },
  {
    id: "4",
    matchup: "Auburn vs Baylor", 
    teams: ["Auburn", "Baylor"],
    sport: "NCAAFB",
    spread: "Auburn −2.5",
    moneyline: null,
    total: null
  },
  {
    id: "5",
    matchup: "Tennessee vs Syracuse",
    teams: ["Tennessee", "Syracuse"], 
    sport: "NCAAFB",
    spread: "Tennessee −12.5",
    moneyline: null,
    total: null
  },
  {
    id: "6",
    matchup: "Notre Dame vs Miami",
    teams: ["Notre Dame", "Miami"],
    sport: "NCAAFB",
    spread: "ND −2.5", 
    moneyline: { favorite: "ND −128", underdog: "Miami +106" },
    total: "O/U 53.5"
  },
  {
    id: "7",
    matchup: "South Carolina vs Virginia Tech",
    teams: ["South Carolina", "Virginia Tech"],
    sport: "NCAAFB",
    spread: "SC −9.5",
    moneyline: null,
    total: null
  },
  {
    id: "8", 
    matchup: "North Carolina vs TCU",
    teams: ["North Carolina", "TCU"],
    sport: "NCAAFB",
    spread: "TCU −1.5",
    moneyline: null,
    total: null
  },
  // NFL Games
  {
    id: "10",
    matchup: "Eagles vs Cowboys",
    teams: ["Eagles", "Cowboys"],
    sport: "NFL",
    spread: "Eagles −7",
    moneyline: { favorite: "Eagles −330", underdog: "Cowboys +265" },
    total: "O/U 46.5"
  },
  {
    id: "11", 
    matchup: "Chiefs vs Chargers",
    teams: ["Chiefs", "Chargers"],
    sport: "NFL",
    spread: "Chiefs −2.5",
    moneyline: { favorite: "Chiefs −142", underdog: "Chargers +120" },
    total: "O/U 44.5"
  },
  {
    id: "12",
    matchup: "Bengals vs Browns",
    teams: ["Bengals", "Browns"],
    sport: "NFL", 
    spread: "Bengals −5.5",
    moneyline: { favorite: "Bengals −240", underdog: "Browns +198" },
    total: "O/U 45.5"
  },
  {
    id: "13",
    matchup: "Steelers vs Jets",
    teams: ["Steelers", "Jets"],
    sport: "NFL",
    spread: "Steelers −3",
    moneyline: { favorite: "Steelers −156", underdog: "Jets +132" },
    total: "O/U 39.5"
  },
  {
    id: "14",
    matchup: "49ers vs Seahawks", 
    teams: ["49ers", "Seahawks"],
    sport: "NFL",
    spread: "49ers −1.5",
    moneyline: null,
    total: "O/U 45.5"
  },
  {
    id: "15",
    matchup: "Dolphins vs Bills",
    teams: ["Dolphins", "Bills"],
    sport: "NFL",
    spread: "Bills −1.5",
    moneyline: null,
    total: "O/U 51.5"
  }
];

// Helper function to get random game
export const getRandomGame = (sport?: string) => {
  const filteredGames = sport ? realGames.filter(game => game.sport === sport) : realGames;
  if (filteredGames.length === 0) {
    // Fallback to a random game from all games if no sport-specific games found
    return realGames[Math.floor(Math.random() * realGames.length)];
  }
  return filteredGames[Math.floor(Math.random() * filteredGames.length)];
};

// Helper function to get all teams
export const getAllTeams = () => {
  const teams = new Set<string>();
  realGames.forEach(game => {
    game.teams.forEach(team => teams.add(team));
  });
  return Array.from(teams);
};