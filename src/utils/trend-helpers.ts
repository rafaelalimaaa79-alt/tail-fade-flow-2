
import { getRandomGame, realGames } from "@/data/realGamesData";

// Function to generate matchups for different sports
export const getMatchup = (sport?: string) => {
  const game = getRandomGame(sport);
  
  return {
    game: game.matchup,
    teams: game.teams,
    sport: game.sport
  };
};

// Function to generate realistic bet lines for different sports
export const getBetLine = (teams: string[], sport?: string) => {
  // Find a game that matches one of the teams
  const matchingGame = realGames.find((game: any) => 
    game.teams.some((gameTeam: string) => teams.includes(gameTeam))
  );
  
  if (matchingGame) {
    const team = teams[Math.floor(Math.random() * teams.length)];
    
    // Array of possible bet types for this game
    const availableBets = [];
    
    // Add spread bets
    if (matchingGame.spread) {
      // Extract spread value and apply to either team
      const spreadMatch = matchingGame.spread.match(/([-+]?\d+\.?\d*)/);
      if (spreadMatch) {
        const spreadValue = parseFloat(spreadMatch[1]);
        availableBets.push(`${team} ${spreadValue > 0 ? '+' : ''}${Math.abs(spreadValue)}`);
        availableBets.push(`${team} ${spreadValue > 0 ? '' : '+'}${-spreadValue}`);
      }
    }
    
    // Add moneyline
    availableBets.push(`${team} ML`);
    
    // Add totals
    if (matchingGame.total) {
      const totalMatch = matchingGame.total.match(/(\d+\.?\d*)/);
      if (totalMatch) {
        const totalValue = totalMatch[1];
        availableBets.push(`Over ${totalValue}`);
        availableBets.push(`Under ${totalValue}`);
      }
    }
    
    return availableBets[Math.floor(Math.random() * availableBets.length)];
  }
  
  // Fallback to random team with ML if no matching game found
  const team = teams[Math.floor(Math.random() * teams.length)];
  return `${team} ML`;
};

