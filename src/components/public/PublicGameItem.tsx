
import React from "react";
import { Separator } from "@/components/ui/separator";
import ActionButton from "@/components/ActionButton";
import { showFadeNotification } from "@/utils/betting-notifications";
import PublicGameVisibilityWrapper from "./PublicGameVisibilityWrapper";
import { cn } from "@/lib/utils";
import { getOppositeBet } from "@/utils/bet-conversion";

interface PublicGame {
  id: string;
  team: string;
  opponent: string;
  publicPercentage: number;
  totalBets: number;
  gameTime: string;
  isLive: boolean;
  spread: string;
  sport: string;
  fadeZonePercentage?: number;
}

interface PublicGameItemProps {
  game: PublicGame;
  rank: number;
  isInitialized?: boolean;
}

const PublicGameItem = ({ game, rank, isInitialized = false }: PublicGameItemProps) => {
  const getTimeInEST = () => {
    if (game.isLive) {
      return (
        <div className="flex items-center gap-1 text-red-400 text-xs font-bold">
          <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
          LIVE
        </div>
      );
    }
    
    const gameTime = new Date(game.gameTime);
    const estTime = new Date(gameTime.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    return (
      <div className="text-white/60 text-sm font-medium">
        {estTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'America/New_York'
        })} EST
      </div>
    );
  };

  const fadeZonePercentage = game.fadeZonePercentage || Math.round(Math.max(70, Math.min(95, 
    100 - game.publicPercentage + (Math.random() - 0.5) * 4
  )));

  const oppositeBet = getOppositeBet(`${game.team} ${game.spread}`, game.opponent);

  const handleFade = () => {
    const betDescription = oppositeBet;
    showFadeNotification("Public Fade", betDescription);
  };

  return (
    <PublicGameVisibilityWrapper>
      {(isVisible, isMostVisible) => (
        <div className="max-w-sm mx-auto mb-4">
          <div className={cn(
            "relative bg-black border-2 border-[#AEE3F5]/30 rounded-xl overflow-hidden transition-all duration-300",
            isInitialized && "hover:border-[#AEE3F5]/50 hover:shadow-lg hover:shadow-[#AEE3F5]/10",
            !isMostVisible && "grayscale"
          )}>
            {/* Header with Game - Trend Style */}
            <div className="flex justify-center items-center px-4 py-3 bg-black/20 border-b border-white/10">
              <div className="text-center pb-1">
                <h3 className="text-2xl font-bold text-white relative inline-block">
                  {game.team} vs {game.opponent}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#AEE3F5] opacity-90"></div>
                </h3>
              </div>
            </div>
            
            {/* Split Content with Separator */}
            <div className="flex items-stretch">
              {/* NoShot Side */}
              <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 space-y-2">
                <div className="text-[#AEE3F5] text-lg font-black uppercase tracking-wide">
                  NoShot
                </div>
                <div className={cn(
                  "text-[#AEE3F5] text-3xl font-bold",
                  isMostVisible && "animate-pulse-slow"
                )}>
                  {fadeZonePercentage}%
                </div>
                <div className="text-white/80 text-sm text-center font-medium leading-relaxed">
                  of NoShot bettors are on <span className="text-white font-semibold">{game.team} {game.spread}</span>
                </div>
              </div>
              
              {/* Vertical Separator */}
              <div className="flex items-center">
                <Separator orientation="vertical" className="h-20 bg-white/30" />
              </div>
              
              {/* Public Side */}
              <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 space-y-2">
                <div className="text-red-400 text-lg font-black uppercase tracking-wide">
                  Public
                </div>
                <div className={cn(
                  "text-red-400 text-3xl font-bold",
                  isMostVisible && "animate-pulse-slow"
                )}>
                  {game.publicPercentage}%
                </div>
                <div className="text-white/80 text-sm text-center font-medium leading-relaxed">
                  of Public bettors are on <span className="text-white font-semibold">{game.team} {game.spread}</span>
                </div>
              </div>
            </div>
            
            {/* Fade Button */}
            <div className="px-4 py-3 border-t border-white/10">
              <ActionButton 
                variant="fade" 
                onClick={handleFade}
                className="h-10 text-base"
                glowEffect={isMostVisible}
                isMostVisible={isMostVisible}
              >
                Bet {oppositeBet}
              </ActionButton>
            </div>
            
            {/* Bottom Glow Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AEE3F5]/50 to-transparent"></div>
          </div>
        </div>
      )}
    </PublicGameVisibilityWrapper>
  );
};

export default PublicGameItem;
