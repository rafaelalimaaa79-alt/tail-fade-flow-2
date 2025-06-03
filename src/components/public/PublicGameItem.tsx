
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, TrendingUp } from "lucide-react";

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
  const isFastMoving = game.publicPercentage >= 80; // For flame/trending icon
  
  const getTimeDisplay = () => {
    if (game.isLive) {
      return (
        <Badge className="bg-red-500 text-white animate-pulse">
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
          <div className="flex items-center gap-1 text-white/70 text-sm">
            <Clock className="h-3 w-3" />
            <span>{hours}h {minutes}m</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-1 text-orange-400 text-sm">
            <Clock className="h-3 w-3" />
            <span>{minutes}m</span>
          </div>
        );
      }
    }
    
    return (
      <div className="text-white/60 text-sm">
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
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-all duration-200 hover:shadow-lg hover:border-white/20">
      {/* Top Section - Main Visual Stack */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full text-white/70 text-sm font-bold">
            {rank}
          </div>
          
          {/* Big Bold Percentage with Vertical Bar */}
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold text-white">
              {game.publicPercentage}%
            </div>
            
            {/* Vertical percentage bar */}
            <div className="w-1 h-12 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`w-full rounded-full transition-all duration-500 ${getPercentageBarColor()}`}
                style={{ height: `${game.publicPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Sport tag and trending icon */}
        <div className="flex items-center gap-2">
          <Badge className={`${getSportColor(game.sport)} text-white text-xs px-3 py-1`}>
            {game.sport}
          </Badge>
          {isFastMoving && (
            <div className="text-orange-400">
              <Flame className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
      
      {/* Middle Section - Team and Line */}
      <div className="mb-3">
        <div className="text-xl font-bold text-white mb-1">
          {game.team} {game.spread}
        </div>
        <div className="text-white/70 text-sm">
          vs {game.opponent}
        </div>
      </div>
      
      {/* Game Status */}
      <div className="mb-4">
        {getTimeDisplay()}
      </div>
      
      {/* Bottom Section - Additional Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isHeavyPublic && (
            <Badge variant="outline" className="border-orange-400 text-orange-400 text-xs">
              HEAVY PUBLIC
            </Badge>
          )}
        </div>
        
        {/* Bet count */}
        <div className="text-white/50 text-xs">
          {game.totalBets.toLocaleString()} bets
        </div>
      </div>
      
      {/* Optional: Mini sparkline placeholder */}
      {isFastMoving && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <TrendingUp className="h-3 w-3" />
            <span>Trending up today</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicGameItem;
