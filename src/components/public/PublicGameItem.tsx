
import React from "react";
import ActionButton from "@/components/ActionButton";
import PublicGameVisibilityWrapper from "./PublicGameVisibilityWrapper";
import { cn } from "@/lib/utils";
import { getOppositeBet } from "@/utils/bet-conversion";
import { useBetFadeToggle } from "@/hooks/useBetFadeToggle";

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
  event: string;
  marketType: 'spread' | 'moneyline' | 'total';
  line: string;
  betType: string;
}

interface PublicGameItemProps {
  game: PublicGame;
  rank: number;
  isInitialized?: boolean;
  betId?: string;
}

const PublicGameItem = ({ game, rank, isInitialized = false, betId }: PublicGameItemProps) => {
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

  // Get market type label
  const getMarketTypeLabel = () => {
    switch (game.marketType) {
      case 'spread':
        return 'Spread';
      case 'moneyline':
        return 'Moneyline';
      case 'total':
        return 'Total';
      default:
        return 'Spread';
    }
  };

  // Format the bet display text
  const getBetDisplayText = () => {
    if (game.marketType === 'total') {
      // For totals, team is "Over" or "Under"
      return `${game.team} ${game.line || ''}`;
    } else {
      // For spread/moneyline, show team with line if available
      return game.line ? `${game.team} ${game.line}` : game.team;
    }
  };

  // Get opposite bet for fade button
  const getOppositeBetText = () => {
    if (game.marketType === 'total') {
      // For totals, flip Over/Under
      const opposite = game.team === 'Over' ? 'Under' : 'Over';
      return `${opposite} ${game.line || ''}`;
    } else {
      // For spread/moneyline, show opposite team
      return getOppositeBet(getBetDisplayText(), game.opponent);
    }
  };

  const oppositeBet = getOppositeBetText();
  const { count: usersFading, recordFade, loading, canFadeMore } = useBetFadeToggle(betId);

  const handleFade = async () => {
    await recordFade();
  };

  return (
    <PublicGameVisibilityWrapper>
      {(isVisible, isMostVisible) => (
        <div className="max-w-sm mx-auto mb-4">
          <div
            className={cn(
              "relative bg-black border-2 border-[#AEE3F5]/30 rounded-xl overflow-hidden transition-all duration-300",
              isInitialized && "hover:border-[#AEE3F5]/50 hover:shadow-lg hover:shadow-[#AEE3F5]/10"
            )}
            style={{
              opacity: isMostVisible ? 1 : 0.6
            }}
          >
            {/* Header with Game - Trend Style */}
            <div className="flex justify-center items-center px-4 py-3 bg-black/20 border-b border-white/10">
              <div className="text-center pb-1">
                <h3 className="text-2xl font-bold text-white relative inline-block">
                  {game.event || `${game.team} vs ${game.opponent}`}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#AEE3F5] opacity-90"></div>
                </h3>
                <div className="text-[#AEE3F5] text-xs font-semibold mt-1 uppercase tracking-wide">
                  {getMarketTypeLabel()}
                </div>
              </div>
            </div>
            
            {/* Public Side - Single Block */}
            <div className="flex flex-col items-center justify-center px-4 py-6 space-y-3">
              <div className="text-red-400 text-lg font-black uppercase tracking-wide">
                Public
              </div>
              <div className={cn(
                "text-red-400 text-4xl font-bold",
                isMostVisible && "animate-pulse-slow"
              )}>
                {game.publicPercentage}%
              </div>
              <div className="text-white/80 text-sm text-center font-medium leading-relaxed">
                of Public bettors are on <span className="text-white font-semibold">{getBetDisplayText()}</span>
              </div>
            </div>
            
            {/* Fade Button */}
            <div className="px-4 py-3 border-t border-white/10">
              <ActionButton
                variant="fade"
                onClick={loading || !canFadeMore ? undefined : handleFade}
                className={cn(
                  "h-10 text-base border border-transparent",
                  (loading || !canFadeMore) && "opacity-75 cursor-not-allowed"
                )}
                glowEffect={isMostVisible && !loading && canFadeMore}
                isMostVisible={isMostVisible && !loading && canFadeMore}
              >
                {loading ? "Loading..." : !canFadeMore ? "Max Fades Reached" : `Bet ${oppositeBet}`}
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
