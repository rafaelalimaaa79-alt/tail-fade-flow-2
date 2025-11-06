
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
      return `${game.team} ${game.line || game.spread || ''}`;
    } else if (game.marketType === 'spread') {
      // For spread, show team with line including +/- sign
      const lineValue = game.line || game.spread || '';
      return lineValue ? `${game.team} ${lineValue}` : game.team;
    } else {
      // For moneyline, show team with line if available
      const lineValue = game.line || game.spread || '';
      return lineValue ? `${game.team} ${lineValue}` : game.team;
    }
  };

  // Get opposite bet for fade button - team name with opposite line
  const getOppositeBetText = () => {
    if (game.marketType === 'total') {
      // For totals, flip Over/Under with line
      const opposite = game.team === 'Over' ? 'Under' : 'Over';
      const lineValue = game.line || game.spread || '';
      return lineValue ? `${opposite} ${lineValue}` : opposite;
    } else if (game.marketType === 'spread') {
      // For spread, show opposite team with flipped line
      const lineValue = game.line || game.spread || '';
      if (lineValue) {
        // Flip the sign of the line
        const flippedLine = lineValue.startsWith('+') 
          ? lineValue.replace('+', '-') 
          : lineValue.startsWith('-')
          ? lineValue.replace('-', '+')
          : `-${lineValue}`;
        return `${game.opponent} ${flippedLine}`;
      }
      return game.opponent;
    } else {
      // For moneyline, show just the opposite team with line
      const lineValue = game.line || game.spread || '';
      return lineValue ? `${game.opponent} ${lineValue}` : game.opponent;
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
              "bg-black rounded-xl p-3 border border-[#AEE3F5]/30 transition-all duration-300 flex flex-col",
              isInitialized && "hover:border-[#AEE3F5]/50"
            )}
            style={{
              opacity: isMostVisible ? 1 : 0.6,
              boxShadow: isMostVisible ? '0 0 15px rgba(174, 227, 245, 0.3)' : 'none',
            }}
          >
            {/* Header with Game */}
            <div className="flex justify-center items-center px-4 py-3 border-b border-white/10">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white relative inline-block">
                  {game.event || `${game.team} vs ${game.opponent}`}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#AEE3F5] opacity-90"></div>
                </h3>
              </div>
            </div>
            
            {/* Public Percentage Data */}
            <div className="flex flex-col items-center justify-center px-4 py-4 space-y-2">
              <div className="text-red-400 text-lg font-black uppercase tracking-wide">
                Public
              </div>
              <div className={cn(
                "text-red-400 text-5xl font-bold",
                isMostVisible && "animate-pulse-slow"
              )}>
                {game.publicPercentage}%
              </div>
              <div className="text-white/80 text-sm text-center font-medium leading-relaxed">
                of Public bettors are on <span className="text-white font-semibold">{getBetDisplayText()}</span>
              </div>
            </div>
            
            {/* Divider line */}
            <div className="flex justify-center py-1">
              <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
            </div>
            
            {/* Users Fading Count */}
            <div className="flex items-center justify-center px-4 py-2">
              <p className="text-lg font-semibold text-gray-300 inline-flex items-center gap-1">
                <span>Users Fading:&nbsp;</span>
                <span className="text-[#AEE3F5] font-bold">
                  {loading ? "..." : usersFading}
                </span>
              </p>
            </div>

            {/* Spacer to push button to bottom */}
            <div className="flex-grow"></div>
            
            {/* Fade Button */}
            <div className="w-full pt-1">
              <ActionButton
                variant="fade"
                onClick={loading || !canFadeMore ? undefined : handleFade}
                className={cn(
                  "w-full py-4 rounded-xl text-lg font-bold border border-transparent",
                  (loading || !canFadeMore) && "opacity-75 cursor-not-allowed"
                )}
                glowEffect={isMostVisible && !loading && canFadeMore}
                isMostVisible={isMostVisible && !loading && canFadeMore}
              >
                {loading ? "Loading..." : !canFadeMore ? "Max Fades Reached" : `NoShot Pick: ${oppositeBet}`}
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </PublicGameVisibilityWrapper>
  );
};

export default PublicGameItem;
