import React from "react";
import { Link } from "react-router-dom";
import ActionButton from "./ActionButton";
import { BetterPlay } from "@/types/betTypes";
import { showFadeNotification } from "@/utils/betting-notifications";
import { getOppositeBet } from "@/utils/bet-conversion";

interface PlayCardProps {
  play: BetterPlay;
  renderWaveText: (text: string, lineIndex: number) => React.ReactNode;
  onActionClick?: () => void;
}

const PlayCard: React.FC<PlayCardProps> = ({ play, renderWaveText, onActionClick }) => {
  // Use the new utility function to get the opposite bet
  const oppositeBet = getOppositeBet(play.bet);

  // Handle the bet action with notification only
  const handleBetClick = () => {
    showFadeNotification(play.bettorName, oppositeBet);
  };
  
  return (
    <div className="rounded-xl bg-card p-6 shadow-lg border border-white/10 neon-glow">
      {/* Header */}
      <div className="mb-6 border-b border-white/10 pb-3">
        <h2 className="font-exo text-3xl font-bold text-[#AEE3F5] text-center tracking-wider uppercase">
          FADE WATCH
        </h2>
      </div>
      
      {/* Bettor Name and Bet Description */}
      <div className="mb-4 text-center">
        <h3 className="font-rajdhani text-lg font-bold text-white">
          <Link 
            to={`/bettor/${play.bettorName}`} 
            className="transition-colors"
            style={{ color: '#AEE3F5' }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#AEE3F580'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#AEE3F5'}
          >
            @{play.bettorName}
          </Link> is on {play.bet}
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
          Bet {oppositeBet}
        </ActionButton>
      </div>
    </div>
  );
};

export default PlayCard;
