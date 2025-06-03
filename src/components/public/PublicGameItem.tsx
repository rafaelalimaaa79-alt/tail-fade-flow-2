
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
  const isHeavyPublic = game.publicPercentage >= 80;
  const isTrending = game.publicPercentage >= 85;
  
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
          <div className="text-white/70 text-xs font-medium">
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
      <div className="text-white/70 text-xs font-medium">
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

  const getPercentageGlow = () => {
    if (game.publicPercentage >= 90) return 'shadow-[0_0_20px_rgba(239,68,68,0.6)]';
    if (game.publicPercentage >= 85) return 'shadow-[0_0_15px_rgba(251,146,60,0.5)]';
    if (game.publicPercentage >= 80) return 'shadow-[0_0_10px_rgba(251,191,36,0.4)]';
    return '';
  };

  const getPercentageColor = () => {
    if (game.publicPercentage >= 90) return 'text-red-400';
    if (game.publicPercentage >= 85) return 'text-orange-400';
    if (game.publicPercentage >= 80) return 'text-yellow-400';
    return 'text-blue-400';
  };

  return (
    <div className={`relative bg-gradient-to-br from-white/8 to-white/3 border border-white/20 rounded-xl p-4 hover:from-white/12 hover:to-white/6 transition-all duration-300 hover:border-white/30 hover:scale-[1.02] ${getPercentageGlow()}`}>
      {/* Header - Centered Game Matchup */}
      <div className="text-center mb-3">
        <div className="text-lg font-bold text-white mb-1">
          {game.team} vs {game.opponent}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Badge className={`${getSportColor(game.sport)} text-white text-xs px-2 py-0.5`}>
            {game.sport}
          </Badge>
          {getTimeDisplay()}
          {isTrending && (
            <Flame className="h-3 w-3 text-orange-400 animate-pulse" />
          )}
        </div>
      </div>
      
      {/* Main Content - Public Betting Info */}
      <div className="text-center space-y-2">
        {/* Large Percentage Display */}
        <div className={`text-4xl font-black ${getPercentageColor()} tracking-tight`}>
          {game.publicPercentage}%
        </div>
        
        {/* Betting Description */}
        <div className="text-white/90 text-sm font-medium">
          of the public is on
        </div>
        
        {/* Team + Spread */}
        <div className="text-xl font-bold text-white bg-white/5 rounded-lg py-2 px-3 border border-white/10">
          {game.team} {game.spread}
        </div>
        
        {/* Tags */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {isHeavyPublic && (
            <Badge variant="outline" className="border-orange-400 text-orange-400 text-xs px-2 py-0.5 bg-orange-400/10 animate-pulse">
              <TrendingUp className="h-3 w-3 mr-1" />
              HEAVY PUBLIC
            </Badge>
          )}
          <div className="text-xs text-white/50">
            {game.totalBets.toLocaleString()} bets
          </div>
        </div>
      </div>
      
      {/* Futuristic corner accent */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute bottom-2 left-2 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
    </div>
  );
};

export default PublicGameItem;
