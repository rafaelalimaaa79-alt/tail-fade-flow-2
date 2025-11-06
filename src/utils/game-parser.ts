/**
 * Utility functions for parsing game names and extracting team information
 */

/**
 * Parse game name to extract teams
 * Supports formats: "Team A @ Team B", "Team A vs Team B", "Team A v Team B"
 * @param gameName - Full game name string
 * @returns Object with awayTeam and homeTeam, or null if parsing fails
 */
export function parseGameName(gameName: string): { awayTeam: string; homeTeam: string } | null {
  if (!gameName) return null;

  // Try "@" format first (most common: "Away Team @ Home Team")
  if (gameName.includes('@')) {
    const parts = gameName.split('@').map(s => s.trim());
    if (parts.length === 2) {
      return {
        awayTeam: parts[0],
        homeTeam: parts[1]
      };
    }
  }

  // Try "vs" format
  if (gameName.toLowerCase().includes(' vs ')) {
    const parts = gameName.split(/ vs /i).map(s => s.trim());
    if (parts.length === 2) {
      return {
        awayTeam: parts[0],
        homeTeam: parts[1]
      };
    }
  }

  // Try "v" format (without 's')
  if (gameName.toLowerCase().includes(' v ')) {
    const parts = gameName.split(/ v /i).map(s => s.trim());
    if (parts.length === 2) {
      return {
        awayTeam: parts[0],
        homeTeam: parts[1]
      };
    }
  }

  return null;
}

/**
 * Get the opponent team from game name and the team that public is on
 * @param gameName - Full game name string
 * @param teamPublicIsOn - Team name that public is betting on
 * @returns Opponent team name, or null if cannot be determined
 */
export function getOpponentTeam(gameName: string, teamPublicIsOn: string): string | null {
  if (!gameName || !teamPublicIsOn) return null;

  const teams = parseGameName(gameName);
  if (!teams) return null;

  const teamPublicLower = teamPublicIsOn.toLowerCase().trim();
  const awayTeamLower = teams.awayTeam.toLowerCase().trim();
  const homeTeamLower = teams.homeTeam.toLowerCase().trim();

  // Exact match first
  if (awayTeamLower === teamPublicLower) {
    return teams.homeTeam;
  } else if (homeTeamLower === teamPublicLower) {
    return teams.awayTeam;
  }

  // Try partial matching - check if team name is contained in game team name
  if (awayTeamLower.includes(teamPublicLower) || teamPublicLower.includes(awayTeamLower)) {
    return teams.homeTeam;
  } else if (homeTeamLower.includes(teamPublicLower) || teamPublicLower.includes(homeTeamLower)) {
    return teams.awayTeam;
  }

  // Try word-by-word matching (for cases like "Las Vegas Raiders" vs "Raiders")
  const teamPublicWords = teamPublicLower.split(/\s+/);
  const awayTeamWords = awayTeamLower.split(/\s+/);
  const homeTeamWords = homeTeamLower.split(/\s+/);

  // Check if any significant word from teamPublicIsOn matches awayTeam
  const awayTeamMatch = teamPublicWords.some(word => 
    word.length > 2 && awayTeamWords.some(awayWord => awayWord.includes(word) || word.includes(awayWord))
  );
  
  // Check if any significant word from teamPublicIsOn matches homeTeam
  const homeTeamMatch = teamPublicWords.some(word => 
    word.length > 2 && homeTeamWords.some(homeWord => homeWord.includes(word) || word.includes(homeWord))
  );

  if (awayTeamMatch && !homeTeamMatch) {
    return teams.homeTeam;
  } else if (homeTeamMatch && !awayTeamMatch) {
    return teams.awayTeam;
  }

  return null;
}

/**
 * Calculate opposite spread (flip the sign)
 * @param spread - Spread string (e.g., "-3.5", "+7", "3.5")
 * @returns Opposite spread string
 */
export function getOppositeSpread(spread: string | null): string {
  if (!spread) return '';

  // Extract sign and value
  const match = spread.match(/([+-]?)(\d+(?:\.\d+)?)/);
  if (match) {
    const sign = match[1] || '-';
    const value = match[2];
    const oppositeSign = sign === '-' ? '+' : '-';
    return `${oppositeSign}${value}`;
  }

  // If no match, try to parse as number
  const numValue = parseFloat(spread);
  if (!isNaN(numValue)) {
    return numValue > 0 ? `-${numValue}` : `+${Math.abs(numValue)}`;
  }

  return '';
}

