import React from "react";
import { Button } from "@/components/ui/button";
import { PendingBetWithStatline } from "@/hooks/usePendingBets";
import { AllUsersPendingBet } from "@/hooks/useAllUsersPendingBets";
import { showFadeNotification } from "@/utils/betting-notifications";

interface FadeWatchCardProps {
  bet: PendingBetWithStatline | AllUsersPendingBet;
  renderWaveText: (text: string, lineIndex: number) => React.ReactNode;
}

const FadeWatchCard: React.FC<FadeWatchCardProps> = ({ bet, renderWaveText }) => {
  // Get the bettor name - handle both PendingBetWithStatline and AllUsersPendingBet
  const bettorName = 'name' in bet ? bet.name : bet.username;

  const handleBetClick = () => {
    showFadeNotification(bettorName, bet.oppositeBet);
  };

  return (
    <div className="block mb-4">
      {/* FADE WATCH Header with wave animation */}
      <div className="mb-4 text-center">
        <h2 className="font-exo text-4xl font-bold tracking-wider uppercase">
          {renderWaveText("FADE WATCH", 0)}
        </h2>
      </div>
      
      <div className="bg-black rounded-xl p-3 border border-[#AEE3F5]/30 animate-glow-pulse space-y-2 flex-grow flex flex-col min-h-[280px]">
        {/* Game header */}
        <div className="text-center pb-1">
          <h3 className="text-2xl font-bold text-white relative inline-block">
            {bet.matchup.game}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#AEE3F5] opacity-90"></div>
          </h3>
        </div>
        
        {/* Bettor's pick */}
        <div className="text-center py-1">
          <p className="text-lg font-bold">
            <span className="text-[#AEE3F5]">@{bettorName}</span>
            <span className="text-white"> is on {bet.betLine}</span>
          </p>
        </div>
        
        {/* Statline */}
        <div className="text-center py-1">
          <p className="text-lg font-medium text-gray-400 italic">
            {bet.statline}
          </p>
        </div>
        
        {/* Divider */}
        <div className="flex justify-center py-1">
          <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
        </div>
        
        {/* Fade confidence */}
        <div className="text-center py-1">
          <p className="text-lg font-semibold text-gray-300">
            Fade Confidence: <span className="text-[#AEE3F5] font-bold">{Math.round(bet.fadeConfidence)}%</span>
          </p>
        </div>
        
        {/* Spacer */}
        <div className="flex-grow"></div>
        
        {/* Bet button */}
        <div className="w-full pt-1">
          <Button 
            className="w-full py-4 rounded-xl text-lg font-bold bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black transition-all duration-200 hover:shadow-[0_0_20px_rgba(174,227,245,0.5)]"
            onClick={handleBetClick}
          >
            Bet {bet.oppositeBet}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FadeWatchCard;

