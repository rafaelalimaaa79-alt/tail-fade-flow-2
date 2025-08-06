
// Utility function to convert a bet to its opposite side
export const getOppositeBet = (originalBet: string, opponentTeam?: string) => {
  // Handle point spreads (e.g., "Notre Dame -2.5" -> "Opponent +2.5")
  if (originalBet.includes('-') && (originalBet.includes('.5') || /[+-]\d+/.test(originalBet))) {
    const parts = originalBet.split(' ');
    const team = parts[0];
    const spread = parts[1];
    
    if (spread.startsWith('-')) {
      const spreadValue = spread.substring(1); // Remove the minus
      return opponentTeam ? `${opponentTeam} +${spreadValue}` : `+${spreadValue}`;
    } else if (spread.startsWith('+')) {
      const spreadValue = spread.substring(1); // Remove the plus
      return opponentTeam ? `${opponentTeam} -${spreadValue}` : `-${spreadValue}`;
    }
  }
  
  // Handle positive spreads without + sign (e.g., "Notre Dame 2.5" -> "Opponent -2.5")
  if (/\d+\.?\d*$/.test(originalBet) && !originalBet.includes('ML') && !originalBet.toLowerCase().includes('over') && !originalBet.toLowerCase().includes('under')) {
    const parts = originalBet.split(' ');
    const team = parts[0];
    const spread = parts[parts.length - 1];
    return opponentTeam ? `${opponentTeam} -${spread}` : `-${spread}`;
  }
  
  // Handle moneylines (ML)
  if (originalBet.includes('ML')) {
    const team = originalBet.replace(' ML', '');
    return opponentTeam ? `${opponentTeam} ML` : `${team} ML`;
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
