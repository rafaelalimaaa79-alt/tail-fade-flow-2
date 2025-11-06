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
  const teams = parseGameName(gameName);
  if (!teams) return null;

  // Find the opponent
  if (teams.awayTeam.toLowerCase() === teamPublicIsOn.toLowerCase()) {
    return teams.homeTeam;
  } else if (teams.homeTeam.toLowerCase() === teamPublicIsOn.toLowerCase()) {
    return teams.awayTeam;
  }

  // If exact match fails, try partial matching
  if (teams.awayTeam.toLowerCase().includes(teamPublicIsOn.toLowerCase()) ||
      teamPublicIsOn.toLowerCase().includes(teams.awayTeam.toLowerCase())) {
    return teams.homeTeam;
  } else if (teams.homeTeam.toLowerCase().includes(teamPublicIsOn.toLowerCase()) ||
             teamPublicIsOn.toLowerCase().includes(teams.homeTeam.toLowerCase())) {
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

