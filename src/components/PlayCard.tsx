
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
  // Handle the bet action with notification only
  const handleBetClick = () => {
    showFadeNotification(play.bettorName, play.bet);
  };
  
  return (
    <div className="rounded-xl bg-card p-6 shadow-lg border border-white/10 neon-glow">
      {/* Header */}
      <div className="mb-6 border-b border-white/10 pb-3">
        <h2 className="font-rajdhani text-2xl font-bold text-white text-center tracking-wider uppercase">
          TODAY'S EDGE
        </h2>
      </div>
      
      {/* Bettor Name */}
      <div className="mb-4 text-center">
        <h3 className="font-rajdhani text-xl font-bold text-white">
          @{play.bettorName}
        </h3>
      </div>
      
      {/* Cold Streak Stats */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-lg">📉</span>
          <span className="font-rajdhani text-lg font-semibold text-white">
            {play.record}
          </span>
        </div>
        <p className="text-white/80 font-medium text-base leading-relaxed">
          {play.stats}
        </p>
      </div>
      
      {/* Fading Users Count */}
      <div className="mb-6 text-center">
        <p className="text-white/70 font-medium text-sm tracking-wide">
          Fading Users: <span className="text-white font-semibold">{play.userCount}</span>
        </p>
      </div>
      
      {/* Recommended Play Section */}
      <div className="mb-4">
        <h4 className="font-rajdhani text-sm font-bold text-white/60 uppercase tracking-wider mb-3 text-center">
          Recommended Play:
        </h4>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-white/80">➡</span>
          <span className="font-rajdhani text-lg font-semibold text-white">
            Fade {play.bet}
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
          Fade {play.bet}
        </ActionButton>
      </div>
    </div>
  );
};

export default PlayCard;
