
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingUp } from "lucide-react";

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
  game: PublicGameItem;
  rank: number;
}

const PublicGameItem = ({ game, rank }: PublicGameItemProps) => {
  const isHeavyPublic = game.publicPercentage >= 80;
  const isTrending = game.publicPercentage >= 85;
  
  const getTimeDisplay = () => {
    if (game.isLive) {
      return (
        <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 font-bold animate-pulse">
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
          <div className="text-white/60 text-[10px] font-medium">
            {hours}h {minutes}m
          </div>
        );
      } else {
        return (
          <div className="text-orange-400 text-[10px] font-medium">
            {minutes}m
          </div>
        );
      }
    }
    
    return (
      <div className="text-white/60 text-[10px] font-medium">
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

  const getPercentageColor = () => {
    if (game.publicPercentage >= 90) return 'text-red-400';
    if (game.publicPercentage >= 85) return 'text-orange-400';
    if (game.publicPercentage >= 80) return 'text-yellow-400';
    return 'text-blue-400';
  };

  return (
    <div className="relative bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-lg p-3 hover:from-white/10 hover:to-white/15 transition-all duration-200 hover:border-white/30">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-bold text-white">
          {game.team} vs {game.opponent}
        </div>
        <div className="flex items-center gap-1">
          <Badge className={`${getSportColor(game.sport)} text-white text-[10px] px-1.5 py-0.5`}>
            {game.sport}
          </Badge>
          {getTimeDisplay()}
        </div>
      </div>
      
      {/* Main Content - Side by Side */}
      <div className="flex items-center justify-between">
        {/* Left side - Percentage */}
        <div className="flex items-center gap-2">
          <div className={`text-2xl font-black ${getPercentageColor()}`}>
            {game.publicPercentage}%
          </div>
          {isTrending && (
            <Flame className="h-4 w-4 text-orange-400 animate-pulse" />
          )}
        </div>
        
        {/* Right side - Bet Info */}
        <div className="text-right">
          <div className="text-white/70 text-xs mb-1">
            public on
          </div>
          <div className="text-sm font-bold text-white bg-white/10 rounded px-2 py-1">
            {game.team} {game.spread}
          </div>
        </div>
      </div>
      
      {/* Bottom Row */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
        <div className="text-xs text-white/50">
          {game.totalBets.toLocaleString()} bets
        </div>
        {isHeavyPublic && (
          <Badge variant="outline" className="border-orange-400 text-orange-400 text-[10px] px-2 py-0.5 bg-orange-400/10">
            <TrendingUp className="h-2.5 w-2.5 mr-1" />
            HEAVY PUBLIC
          </Badge>
        )}
      </div>
    </div>
  );
};

export default PublicGameItem;
