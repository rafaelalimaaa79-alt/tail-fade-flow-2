
// Utility function to convert a bet to its opposite side
export const getOppositeBet = (originalBet: string, opponentTeam?: string) => {
  console.log("getOppositeBet called with:", originalBet, "opponent:", opponentTeam);
  
  // Handle point spreads - check for any number with decimal or whole numbers
  const spreadMatch = originalBet.match(/([+-])(\d+(?:\.\d+)?)/);
  if (spreadMatch) {
    const sign = spreadMatch[1];
    const value = spreadMatch[2];
    const oppositeSign = sign === '-' ? '+' : '-';
    return opponentTeam ? `${opponentTeam} ${oppositeSign}${value}` : `${oppositeSign}${value}`;
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
