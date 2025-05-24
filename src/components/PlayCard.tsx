
import React from "react";
import ActionButton from "./ActionButton";
import { BetterPlay } from "@/types/betTypes";
import { showTailNotification, showFadeNotification } from "@/utils/betting-notifications";

interface PlayCardProps {
  play: BetterPlay;
  renderWaveText: (text: string, lineIndex: number) => React.ReactNode;
  onActionClick?: () => void;
}

const PlayCard: React.FC<PlayCardProps> = ({ play, renderWaveText, onActionClick }) => {
  const isFade = play.suggestionType === "fade";
  const actionText = isFade ? "Fade" : "Tail";
  
  // Handle the bet action with notification only
  const handleBetClick = () => {
    if (isFade) {
      showFadeNotification(play.bettorName, play.bet);
    } else {
      showTailNotification(play.bettorName, play.bet);
    }
  };
  
  return (
    <div className="rounded-xl bg-card p-6 shadow-lg border border-white/10 neon-glow">
      {/* Full-width large title */}
      <div className="mb-5 border-b border-white/10 pb-2">
        <h2 className="font-rajdhani text-3xl font-extrabold text-white text-center tracking-wider uppercase">Today's Edge</h2>
      </div>
      
      {/* Bettor info with italic usernames and highlighted stats */}
      <div className="mb-6 text-lg text-white/80 text-center">
        <span className="font-normal italic text-white/70 font-serif">@{play.bettorName}</span>
        <div className="mt-3 text-xl font-medium">
          <div className="wave-text-container">
            <div className="block mb-2">
              {renderWaveText(play.stats, 0)}
            </div>
            <div className="block">
              {renderWaveText(`${play.percentage}% ${isFade ? "fading" : "tailing"}`, 1)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Combined suggestion and action in a single card */}
      <div className="mb-6 rounded-lg bg-muted p-5 text-center border border-white/10 shadow-lg">
        <ActionButton 
          variant={isFade ? "fade" : "tail"}
          className="h-14 text-xl font-bold"
          onClick={handleBetClick}
        >
          {`${actionText}\n${play.bet}`}
        </ActionButton>
      </div>
    </div>
  );
};

export default PlayCard;
