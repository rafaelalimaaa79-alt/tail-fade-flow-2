
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ActionButton from "./ActionButton";
import { BetterPlay } from "@/types/betTypes";

interface PlayCardProps {
  play: BetterPlay;
  renderWaveText: (text: string, lineIndex: number) => React.ReactNode;
}

const PlayCard: React.FC<PlayCardProps> = ({ play, renderWaveText }) => {
  const isFade = play.suggestionType === "fade";
  const actionText = isFade ? "Fade" : "Tail";
  
  return (
    <div className="rounded-xl bg-card p-6 shadow-lg border border-white/10 neon-glow">
      {/* Full-width large title */}
      <div className="mb-5 border-b border-white/10 pb-2">
        <h2 className="font-rajdhani text-3xl font-extrabold text-white text-center tracking-wider uppercase">Today's Edge</h2>
      </div>
      
      {/* Bettor info with italic usernames and highlighted stats */}
      <div className="mb-6 text-lg text-white/80 text-center">
        <span className="font-normal italic text-white/70 font-serif">{play.bettorName}</span>
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
        <p className="text-2xl font-extrabold text-white mb-4 flex items-center justify-center gap-2">
          <span className={isFade ? "text-onetime-red font-black" : "text-onetime-green font-black"}>{actionText}</span> 
          <span>{play.bet}</span>
        </p>
        
        <ActionButton 
          variant={isFade ? "fade" : "tail"}
          className="h-14 text-base font-bold"
        >
          {isFade ? "🔥 Fade This Bet" : "🔥 Tail This Bet"}
        </ActionButton>
      </div>
      
      {/* Secondary action link */}
      <Link to="/trends" className="mt-5 flex items-center justify-center text-sm font-medium text-primary">
        👀 View All Top Trends
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
};

export default PlayCard;
