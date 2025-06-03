
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame } from "lucide-react";

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
}

interface PublicGameItemProps {
  game: PublicGame;
  rank: number;
}

const PublicGameItem = ({ game, rank }: PublicGameItemProps) => {
  const isHeavyPublic = game.publicPercentage >= 75;
  const isTrending = game.publicPercentage >= 80;
  
  const getTimeDisplay = () => {
    if (game.isLive) {
      return (
        <Badge className="bg-red-500 text-white text-xs px-2 py-1 font-bold animate-pulse">
          LIVE
        </Badge>
      );
    }
    
    const gameTime = new Date(game.gameTime);
    const now = new Date();
    const timeDiff = gameTime.getTime() - now.getTime();
    
    if (timeDiff > 0) {
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        return (
          <div className="text-white text-xs font-medium">
            {hours}h {minutes}m
          </div>
        );
      } else {
        return (
          <div className="text-orange-400 text-xs font-medium">
            {minutes}m
          </div>
        );
      }
    }
    
    return (
      <div className="text-white text-xs font-medium">
        {gameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    );
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'NBA': return 'bg-orange-500';
      case 'NFL': return 'bg-green-500';
      case 'MLB': return 'bg-blue-500';
      case 'NHL': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPercentageBarColor = () => {
    if (game.publicPercentage >= 85) return 'bg-red-400';
    if (game.publicPercentage >= 75) return 'bg-orange-400';
    return 'bg-blue-400';
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/8 transition-all duration-200 hover:border-white/20">
      <div className="flex items-center justify-between">
        {/* Left Side - Percentage with bar */}
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-white">
            {game.publicPercentage}%
          </div>
          
          {/* Compact vertical percentage bar */}
          <div className="w-0.5 h-8 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`w-full rounded-full transition-all duration-500 ${getPercentageBarColor()}`}
              style={{ height: `${game.publicPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Right Side - Tags and indicators */}
        <div className="flex items-center gap-2">
          {isTrending && (
            <Flame className="h-3 w-3 text-orange-400" />
          )}
          <Badge className={`${getSportColor(game.sport)} text-white text-xs px-2 py-0.5`}>
            {game.sport}
          </Badge>
        </div>
      </div>
      
      {/* Center Stack - Team info */}
      <div className="mt-2 mb-2">
        <div className="text-lg font-bold text-white">
          {game.team} {game.spread}
        </div>
        <div className="text-white/60 text-sm">
          vs {game.opponent}
        </div>
      </div>
      
      {/* Bottom Section - Time and tags */}
      <div className="flex items-center justify-between">
        <div>
          {getTimeDisplay()}
        </div>
        
        <div className="flex items-center gap-2">
          {isHeavyPublic && (
            <Badge variant="outline" className="border-orange-400 text-orange-400 text-xs px-2 py-0.5">
              HEAVY PUBLIC
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicGameItem;
