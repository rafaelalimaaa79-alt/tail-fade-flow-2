
import React, { useState } from "react";
import ActionButton from "@/components/ActionButton";
import PublicGameVisibilityWrapper from "./PublicGameVisibilityWrapper";
import { cn } from "@/lib/utils";
import { getOppositeSpread } from "@/utils/game-parser";
import { usePublicBetFadeToggle } from "@/hooks/usePublicBetFadeToggle";
import { Loader2 } from "lucide-react";

interface PublicGame {
  id: string;
  team: string;
  opponent: string;
  publicPercentage: number;
  spread: string;
  sport: string;
  event: string;
  gameTime: string;
}

interface PublicGameItemProps {
  game: PublicGame;
  rank: number;
  isInitialized?: boolean;
}

const PublicGameItem = ({ game, rank, isInitialized = false }: PublicGameItemProps) => {
  // Fade toggle and live count
  const { count: usersFading, recordFade, loading, canFadeMore } = usePublicBetFadeToggle(game.id);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBetClick = async () => {
    setIsAnimating(true);
    await recordFade();
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Format the bet display text for description
  // Format: "{team} {spread}" or just "{team}" if no spread
  const getBetDisplayText = () => {
    if (game.spread) {
      return `${game.team} ${game.spread}`;
    }
    return game.team;
  };

  // Get opposite bet for fade button
  // The button should show the opposite team + spread (fading the team_public_is_on)
  const getOppositeBetText = () => {
    if (game.spread) {
      // Has spread - show opposite team with opposite spread sign
      const oppositeSpread = getOppositeSpread(game.spread);
      return `${game.opponent} ${oppositeSpread}`;
    } else {
      // No spread (moneyline or total) - just show opposite team
      return game.opponent;
    }
  };

  const oppositeBet = getOppositeBetText();

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
                  #{rank} {game.event || `${game.team} vs ${game.opponent}`}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#AEE3F5] opacity-90"></div>
                </h3>
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
                of the public are on <span className="text-white font-semibold">{getBetDisplayText()}</span>
              </div>
              {/* Divider line */}
              <div className="flex justify-center py-1 w-full">
                <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
              </div>
              {/* Users Fading Count */}
              <div className="text-white/70 text-sm text-center font-medium">
                Fading Count: <span className="text-[#AEE3F5] font-bold">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin inline-block" />
                  ) : (
                    usersFading
                  )}
                </span>
              </div>
            </div>
            
            {/* Fade Button */}
            <div className="px-4 py-3 border-t border-white/10">
              <ActionButton
                variant="fade"
                onClick={handleBetClick}
                disabled={loading}
                className={cn(
                  "h-10 text-base border border-transparent",
                  loading && "opacity-75 cursor-not-allowed",
                  isAnimating && "animate-bounce-pop"
                )}
                glowEffect={isMostVisible && !loading}
                isMostVisible={isMostVisible && !loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2 inline-block" />}
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

