
// Utility function to convert a bet to its opposite side
export const getOppositeBet = (originalBet: string, opponentTeam?: string) => {
  // Handle point spreads (e.g., "Dodgers -2" -> "Padres +2")
  if (originalBet.includes('-') && (originalBet.includes('.5') || /[+-]\d+/.test(originalBet))) {
    const parts = originalBet.split(' ');
    const team = parts[0];
    const spread = parts[1];
    
    if (spread.startsWith('-')) {
      const newSpread = '+' + spread.substring(1);
      return opponentTeam ? `${opponentTeam} ${newSpread}` : `+${spread.substring(1)}`;
    } else if (spread.startsWith('+')) {
      const newSpread = '-' + spread.substring(1);
      return opponentTeam ? `${opponentTeam} ${newSpread}` : `-${spread.substring(1)}`;
    }
  }
  
  // Handle moneylines (ML)
  if (originalBet.includes('ML')) {
    const team = originalBet.replace(' ML', '');
    return opponentTeam ? `${opponentTeam} ML` : 'Opposite ML';
  }
  
  // Handle over/under totals
  if (originalBet.toLowerCase().includes('over')) {
    return originalBet.replace(/over/i, 'Under');
  }
  if (originalBet.toLowerCase().includes('under')) {
    return originalBet.replace(/under/i, 'Over');
  }
  
  // Default case - return the original bet with opponent team if available
  return opponentTeam ? `${opponentTeam} ${originalBet}` : originalBet;
};
