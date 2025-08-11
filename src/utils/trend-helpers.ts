
import { getRandomGame, realGames } from "@/data/realGamesData";
import { analyzeBettorWeaknesses, getStrongestWeaknessDescription } from "./weakness-analyzer";

// Function to get fade confidence (mock data for now)
export const getFadeConfidence = () => {
  return Math.floor(Math.random() * 30) + 70; // Random between 70-99%
};

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

// Function to generate sport-specific statlines using weakness analysis
export const getSportStatline = (sport: string, bettorName?: string, betDescription?: string) => {
  // If we have enough info, use the weakness analyzer
  if (bettorName && betDescription) {
    const weaknesses = analyzeBettorWeaknesses(bettorName, betDescription, sport);
    return getStrongestWeaknessDescription(weaknesses);
  }
  
  // Fallback to old method if not enough info
  const wins = Math.floor(Math.random() * 10) + 1;
  const totalBets = wins + Math.floor(Math.random() * 15) + 3;
  
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
