import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PendingBetWithStatline } from "@/hooks/usePendingBets";
import { AllUsersPendingBet } from "@/hooks/useAllUsersPendingBets";
import { useBetFadeToggle } from "@/hooks/useBetFadeToggle";

interface FadeWatchCardProps {
  bet: PendingBetWithStatline | AllUsersPendingBet;
  renderWaveText: (text: string, lineIndex: number) => React.ReactNode;
}

const FadeWatchCard: React.FC<FadeWatchCardProps> = ({ bet, renderWaveText }) => {
  // Get the bettor name - handle both PendingBetWithStatline and AllUsersPendingBet
  const bettorName = 'name' in bet ? bet.name : bet.username;

  const { count: usersFading, isFaded, toggleFade, loading } = useBetFadeToggle(bet.id);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBetClick = async () => {
    setIsAnimating(true);
    await toggleFade();
    setTimeout(() => setIsAnimating(false), 300);
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
        
        {/* Fade confidence and Users Fading */}
        <div className="flex items-center justify-between px-4 py-1">
          <p className="text-lg font-semibold text-gray-300">
            Fade Confidence: <span className="text-[#AEE3F5] font-bold">{bet.fadeConfidence.toFixed(2)}%</span>
          </p>
          <p className="text-lg font-semibold text-gray-300 inline-flex items-center gap-1">
            <span>Users Fading:&nbsp;</span>
            <span className="text-[#AEE3F5] font-bold">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                usersFading
              )}
            </span>
          </p>
        </div>
        
        {/* Spacer */}
        <div className="flex-grow"></div>
        
        {/* Bet button */}
        <div className="w-full pt-1">
          <Button
            type="button"
            className={`w-full py-4 rounded-xl text-lg font-bold transition-all duration-200 border flex items-center justify-center gap-2 ${
              loading && "opacity-75 cursor-not-allowed"
            } ${
              isFaded
                ? "bg-black text-[#AEE3F5] border-[#AEE3F5]/60 hover:bg-black/95 shadow-[0_0_12px_rgba(174,227,245,0.25)]"
                : "bg-[#AEE3F5] text-black border-transparent hover:bg-[#AEE3F5]/90 shadow-[0_0_16px_rgba(174,227,245,0.45)]"
            } ${isAnimating && "animate-bounce-pop"}`}
            onClick={handleBetClick}
            disabled={loading}
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            NoShot Pick: {bet.oppositeBet}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FadeWatchCard;

