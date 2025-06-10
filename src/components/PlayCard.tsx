
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

  // Function to get fade confidence (mock data for now)
  const getFadeConfidence = () => {
    return Math.floor(Math.random() * 30) + 70; // Random between 70-99%
  };

  const fadeConfidence = getFadeConfidence();
  
  return (
    <div className="rounded-xl bg-card p-5 shadow-lg border border-white/10 neon-glow">
      {/* Header */}
      <div className="mb-4 border-b border-white/10 pb-2">
        <h2 className="font-exo text-2xl font-bold text-[#AEE3F5] text-center tracking-wider uppercase">
          FADE WATCH
        </h2>
      </div>
      
      {/* Bettor's pick */}
      <div className="text-center mb-3">
        <p className="text-lg font-bold">
          <span className="text-[#AEE3F5]">@{play.bettorName}</span>
          <span className="text-white"> is on {play.bet}</span>
        </p>
      </div>
      
      {/* Record statline */}
      <div className="text-center mb-3">
        <p className="text-base font-medium text-gray-400 italic">
          He is {play.record}
        </p>
      </div>
      
      {/* Fade confidence */}
      <div className="text-center mb-4">
        <p className="text-base font-semibold text-gray-300">
          Fade Confidence: <span className="text-[#AEE3F5] font-bold">{fadeConfidence}%</span>
        </p>
      </div>
      
      {/* Fading Users Count - Clean display without blocks */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-white/70 font-medium text-sm">Fading Users:</span>
          <span className="text-white font-bold text-lg text-primary">
            {play.userCount}
          </span>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="rounded-lg bg-muted p-3 text-center border border-white/10 shadow-lg">
        <ActionButton 
          variant="fade"
          className="h-11 text-base font-bold"
          onClick={handleBetClick}
        >
          Bet {oppositeBet}
        </ActionButton>
      </div>
    </div>
  );
};

export default PlayCard;
