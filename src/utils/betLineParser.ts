export interface DbBetRecord {
  id?: string;
  user_id?: string;
  slip_id?: string | null;
  bet_id?: string | null;
  event?: string | null;
  sport?: string | null;
  position?: string | null;
  line?: number | null;
  bet_type?: string;
  odds?: string;
  units_risked?: number | null;
  units_to_win?: number | null;
  units_won_lost?: number | null;
  away_team?: string | null;
  home_team?: string | null;
  event_start_time?: string | null;
  result?: string | null;
  sportsbook_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function shortenTeamName(fullName: string): string {
  if (!fullName) return "";
  
  return fullName
    .replace(/\s+(Seminoles|Cavaliers|Tigers|Bulldogs|Eagles|Lions|Bears|Panthers|Cowboys|49ers|Saints|Chiefs|Packers|Ravens|Steelers|Patriots)$/i, '')
    .trim();
}

export function calculateBetLine(bet: DbBetRecord): string {
  const { position, bet_type, line, event } = bet;
  
  // If position is missing, try to extract from event
  let teamName = position;
  if (!teamName && event) {
    // Try to extract first team from event string
    const match = event.match(/^([^@vs]+)/);
    teamName = match ? match[1].trim() : "Team";
  }
  
  if (!teamName) return "Unknown Bet";
  
  const shortPosition = shortenTeamName(teamName);
  
  switch (bet_type) {
    case "spread":
      if (line === undefined || line === null) return `${shortPosition} spread`;
      return `${shortPosition} ${line > 0 ? '+' : ''}${line}`;
    
    case "moneyline":
      return `${shortPosition} ML`;
    
    case "total":
      if (line === undefined || line === null) return "Total";
      const overUnder = line > 0 ? "Over" : "Under";
      return `${overUnder} ${Math.abs(line)}`;
    
    case "teamTotal":
      if (line === undefined || line === null) return `${shortPosition} Total`;
      const ou = line > 0 ? "Over" : "Under";
      return `${shortPosition} ${ou} ${Math.abs(line)}`;
    
    default:
      // Generic format for other bet types
      if (line !== undefined && line !== null) {
        return `${shortPosition} ${bet_type} ${line}`;
      }
      return `${shortPosition} ${bet_type || 'bet'}`;
  }
}

export function getOpponentTeam(bet: DbBetRecord): string {
  const { away_team, home_team, position, event } = bet;
  
  // If teams are available, use them
  if (away_team && home_team && position) {
    // If position matches away team, return home team
    if (away_team === position || away_team.includes(position) || position.includes(away_team)) {
      return home_team;
    }
    // Otherwise return away team
    return away_team;
  }
  
  // Fallback: Parse from event string
  if (event) {
    const teams = extractTeamsFromEvent(event);
    if (teams.length === 2) {
      // If position matches first team, return second team
      if (position && teams[0].includes(position)) {
        return teams[1];
      }
      // Otherwise return first team
      return teams[0];
    }
  }
  
  return "";
}

// Helper to extract teams from event string
function extractTeamsFromEvent(event: string): string[] {
  if (event.includes(" @ ")) {
    return event.split(" @ ").map(t => t.trim());
  } else if (event.includes(" vs ")) {
    return event.split(" vs ").map(t => t.trim());
  }
  return [];
}

/**
 * Calculate the opposite bet line (for fading)
 * @param bet - Database bet record
 * @returns Opposite bet line string
 */
export function getOppositeBetLine(bet: DbBetRecord): string {
  const { position, bet_type, line } = bet;
  
  if (!position) return "Unknown Bet";
  
  const opponentTeam = getOpponentTeam(bet);
  const shortOpponent = shortenTeamName(opponentTeam);
  const shortPosition = shortenTeamName(position);
  
  switch (bet_type) {
    case "spread":
      // Flip the spread sign and switch to opponent
      if (line === undefined || line === null) return `${shortOpponent} spread`;
      const oppositeLine = -1 * line;
      return `${shortOpponent} ${oppositeLine > 0 ? '+' : ''}${oppositeLine}`;
    
    case "moneyline":
      // Switch to opponent team
      return `${shortOpponent} ML`;
    
    case "total":
      // Flip over/under
      if (line === undefined || line === null) return "Total";
      const oppositeOU = line > 0 ? "Under" : "Over";
      return `${oppositeOU} ${Math.abs(line)}`;
    
    case "teamTotal":
      // Keep same team but flip over/under
      if (line === undefined || line === null) return `${shortPosition} Total`;
      const oppositeTeamOU = line > 0 ? "Under" : "Over";
      return `${shortPosition} ${oppositeTeamOU} ${Math.abs(line)}`;
    
    default:
      // For other bet types, just switch to opponent
      return shortOpponent ? `${shortOpponent} ${bet_type || 'bet'}` : "Opposite bet";
  }
}

/**
 * Extract teams from bet data
 */
export function extractTeams(bet: DbBetRecord): string[] {
  const { away_team, home_team, event } = bet;
  
  // Use database fields if available
  if (away_team && home_team) {
    return [away_team, home_team].filter(Boolean) as string[];
  }
  
  // Fallback: parse from event string
  if (event) {
    return extractTeamsFromEvent(event);
  }
  
  return [];
}

/**
 * Get matchup information from bet data
 */
export function getMatchupInfo(bet: DbBetRecord) {
  const { event, sport } = bet;
  
  return {
    game: event || "Unknown Game",
    teams: extractTeams(bet),
    sport: sport || "Unknown Sport"
  };
}
