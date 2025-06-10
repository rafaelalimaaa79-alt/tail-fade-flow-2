
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
      
      {/* Bettor Name - Larger and highlighted */}
      <div className="mb-4 text-center">
        <h3 className="font-rajdhani text-2xl font-bold text-primary">
          @{play.bettorName}
        </h3>
      </div>
      
      {/* Cold Streak Stats - Clean display without blocks */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-2xl">📉</span>
          <span className="font-rajdhani text-xl font-black text-white">
            {play.record}
          </span>
        </div>
        <p className="text-white/90 font-medium text-lg leading-relaxed max-w-xs mx-auto">
          {play.stats}
        </p>
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
          Fade {play.bet}
        </ActionButton>
      </div>
    </div>
  );
};

export default PlayCard;
