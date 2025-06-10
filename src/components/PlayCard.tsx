
import React from "react";
import ActionButton from "./ActionButton";
import { BetterPlay } from "@/types/betTypes";
import { showFadeNotification } from "@/utils/betting-notifications";

interface PlayCardProps {
  play: BetterPlay;
  renderWaveText: (text: string, lineIndex: number) => React.ReactNode;
  onActionClick?: () => void;
}

const PlayCard: React.FC<PlayCardProps> = ({ play, renderWaveText, onActionClick }) => {
  // Function to get the opposite bet for fading
  const getOppositeBet = (originalBet: string) => {
    // Handle point spreads
    if (originalBet.includes('-') && (originalBet.includes('.5') || /[+-]\d+/.test(originalBet))) {
      const team = originalBet.split(' ')[0];
      const spread = originalBet.split(' ')[1];
      if (spread.startsWith('-')) {
        return `${team} +${spread.substring(1)}`;
      } else if (spread.startsWith('+')) {
        return `${team} -${spread.substring(1)}`;
      }
    }
    
    // Handle moneylines (ML)
    if (originalBet.includes('ML')) {
      const team = originalBet.replace(' ML', '');
      // For ML, the opposite would be the other team, but we'll just say "Opposite ML"
      return `Fade ${team} ML`;
    }
    
    // Handle over/under totals
    if (originalBet.toLowerCase().includes('over')) {
      return originalBet.replace(/over/i, 'Under');
    }
    if (originalBet.toLowerCase().includes('under')) {
      return originalBet.replace(/under/i, 'Over');
    }
    
    // Default case - just add "Fade" prefix
    return `Fade ${originalBet}`;
  };

  // Handle the bet action with notification only
  const handleBetClick = () => {
    const oppositeBet = getOppositeBet(play.bet);
    showFadeNotification(play.bettorName, oppositeBet);
  };
  
  return (
    <div className="rounded-xl bg-card p-6 shadow-lg border border-white/10 neon-glow">
      {/* Header */}
      <div className="mb-6 border-b border-white/10 pb-3">
        <h2 className="font-rajdhani text-2xl font-bold text-white text-center tracking-wider uppercase">
          TODAY'S EDGE
        </h2>
      </div>
      
      {/* Bettor Name and Bet Description */}
      <div className="mb-4 text-center">
        <h3 className="font-rajdhani text-lg font-bold text-white">
          <span className="text-primary">@</span>{play.bettorName}'s is on {play.bet}
        </h3>
      </div>
      
      {/* Cold Streak Stats - Centered text only */}
      <div className="mb-4 text-center">
        <span className="font-rajdhani text-2xl font-black" style={{ color: '#AEE3F5' }}>
          {play.record}
        </span>
      </div>
      
      {/* Fading Users Count - Clean display without blocks */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-white/70 font-medium text-sm">Fading Users:</span>
          <span className="text-white font-bold text-lg text-primary">
            {play.userCount}
          </span>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="rounded-lg bg-muted p-4 text-center border border-white/10 shadow-lg">
        <ActionButton 
          variant="fade"
          className="h-12 text-lg font-bold"
          onClick={handleBetClick}
        >
          {getOppositeBet(play.bet)}
        </ActionButton>
      </div>
    </div>
  );
};

export default PlayCard;
