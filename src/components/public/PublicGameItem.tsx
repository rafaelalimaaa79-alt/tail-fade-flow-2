
import React from "react";
import { Users } from "lucide-react";

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
  
  const getTimeDisplay = () => {
    if (game.isLive) {
      return (
        <div className="text-red-400 text-xs font-bold animate-pulse">
          LIVE
        </div>
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
          <div className="text-white/60 text-xs font-medium">
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
      <div className="text-white/60 text-xs font-medium">
        {gameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    );
  };

  const getPercentageColor = () => {
    if (game.publicPercentage >= 90) return 'text-red-400';
    if (game.publicPercentage >= 85) return 'text-orange-400';
    if (game.publicPercentage >= 80) return 'text-blue-400'; // Updated to cooler tone
    return 'text-blue-400';
  };

  return (
    <div className="relative bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-lg p-4 hover:from-white/10 hover:to-white/15 transition-all duration-200 hover:border-white/30">
      {/* Game Header - Centered */}
      <div className="text-center mb-3">
        <div className="text-lg font-bold text-white">
          {game.team} vs {game.opponent}
        </div>
        <div className="flex items-center justify-center gap-4 mt-1">
          <span className="text-white/60 text-sm">{game.sport}</span>
          {getTimeDisplay()}
        </div>
      </div>
      
      {/* Main Content - Public Percentage Info */}
      <div className="text-center mb-3">
        <div className={`text-3xl font-black ${getPercentageColor()} mb-1`}>
          {game.publicPercentage}%
        </div>
        <div className="text-white/70 text-sm">
          of the public is on
        </div>
        <div className="text-lg font-bold text-white mt-1">
          {game.team} {game.spread}
        </div>
      </div>
      
      {/* Bottom Info */}
      <div className="flex items-center justify-between text-xs text-white/50">
        <div>
          {game.totalBets.toLocaleString()} bets
        </div>
        <div className="flex items-center gap-1">
          {isHeavyPublic && (
            <div className="flex items-center gap-1 text-blue-400">
              <Users className="h-3 w-3" />
              <span className="font-bold">HEAVY PUBLIC</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicGameItem;
