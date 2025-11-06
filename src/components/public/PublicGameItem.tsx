
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
        <div className="block mb-4">
          <div
            className={cn(
              "relative transition-all duration-300",
              isInitialized && "hover:shadow-lg hover:shadow-[#AEE3F5]/10"
            )}
            style={{
              opacity: isMostVisible ? 1 : 0.6
            }}
          >
            {/* Public Side - Single Block */}
            <div className="bg-black rounded-xl p-3 border border-[#AEE3F5]/30 space-y-2 flex flex-col">
              {/* Header with Game */}
              <div className="text-center pb-1">
                <h3 className="text-2xl font-bold text-white relative inline-block">
                  {game.event || `${game.team} vs ${game.opponent}`}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#AEE3F5] opacity-90"></div>
                </h3>
              </div>
              
              {/* Public Label */}
              <div className="text-red-400 text-lg font-black uppercase tracking-wide text-center">
                Public
              </div>
              
              {/* Public Percentage - Larger */}
              <div className={cn(
                "text-red-400 text-6xl font-bold text-center",
                isMostVisible && "animate-pulse-slow"
              )}>
                {game.publicPercentage}%
              </div>
              
              {/* Description */}
              <div className="text-white/80 text-lg text-center font-medium leading-relaxed">
                of the public are on <span className="text-white font-semibold">{getBetDisplayText()}</span>
              </div>
              
              {/* Divider line */}
              <div className="flex justify-center py-1">
                <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
              </div>
              
              {/* Fade Count */}
              <div className="text-white/70 text-lg text-center font-medium">
                Fade Count: <span className="text-[#AEE3F5] font-bold">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin inline-block" />
                  ) : (
                    usersFading
                  )}
                </span>
              </div>
              
              {/* Spacer */}
              <div className="flex-grow"></div>
              
              {/* Fade Button */}
              <div className="w-full pt-1">
                <Button
                  type="button"
                  onClick={handleBetClick}
                  disabled={loading}
                  className={cn(
                    "w-full py-4 rounded-xl text-lg font-bold border flex items-center justify-center gap-2 bg-[#AEE3F5] text-black border-transparent hover:bg-[#AEE3F5]/90 shadow-[0_0_16px_rgba(174,227,245,0.45)]",
                    loading && "opacity-75 cursor-not-allowed",
                    isAnimating && "animate-bounce-pop"
                  )}
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {`NoShot Pick: ${oppositeBet}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PublicGameVisibilityWrapper>
  );
};

export default PublicGameItem;

