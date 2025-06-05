
import React from "react";
import { Users, Clock, Zap } from "lucide-react";

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
        <div className="flex items-center gap-1 text-red-400 text-xs font-bold">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
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
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <Clock className="w-3 h-3" />
            {hours}h {minutes}m
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-1 text-orange-400 text-xs">
            <Clock className="w-3 h-3" />
            {minutes}m
          </div>
        );
      }
    }
    
    return (
      <div className="flex items-center gap-1 text-white/60 text-xs">
        <Clock className="w-3 h-3" />
        {gameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    );
  };

  const getPercentageColor = () => {
    if (game.publicPercentage >= 90) return 'text-red-400';
    if (game.publicPercentage >= 85) return 'text-orange-400';
    if (game.publicPercentage >= 80) return 'text-[#AEE3F5]';
    return 'text-[#AEE3F5]';
  };

  const getPercentageGlow = () => {
    if (game.publicPercentage >= 90) return 'drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]';
    if (game.publicPercentage >= 85) return 'drop-shadow-[0_0_8px_rgba(251,146,60,0.7)]';
    if (game.publicPercentage >= 80) return 'drop-shadow-[0_0_8px_rgba(174,227,245,0.7)]';
    return 'drop-shadow-[0_0_8px_rgba(174,227,245,0.5)]';
  };

  return (
    <div className="relative bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-lg p-4 hover:from-white/10 hover:to-white/15 transition-all duration-200 hover:border-white/30">
      {/* Rank Badge */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#AEE3F5] text-black text-xs font-bold rounded-full flex items-center justify-center">
        #{rank}
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="text-lg font-bold text-white mb-1">
            {game.team} vs {game.opponent}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="px-2 py-1 bg-white/10 rounded text-white/70 text-xs font-medium">
              {game.sport}
            </span>
            {getTimeDisplay()}
          </div>
        </div>
      </div>
      
      {/* Main Stats Row */}
      <div className="flex items-center justify-between mb-3">
        {/* Public Percentage - Left */}
        <div className="text-center">
          <div className={`text-2xl font-black ${getPercentageColor()} ${getPercentageGlow()}`}>
            {game.publicPercentage}%
          </div>
          <div className="text-white/50 text-xs font-medium">PUBLIC ON</div>
        </div>
        
        {/* Team + Spread - Center */}
        <div className="flex-1 text-center mx-4">
          <div className="text-lg font-bold text-white">
            {game.team}
          </div>
          <div className="text-[#AEE3F5] font-bold text-sm">
            {game.spread}
          </div>
        </div>
        
        {/* Bet Count - Right */}
        <div className="text-center">
          <div className="text-white text-lg font-bold">
            {game.totalBets.toLocaleString()}
          </div>
          <div className="text-white/50 text-xs font-medium">BETS</div>
        </div>
      </div>
      
      {/* Bottom Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isHeavyPublic && (
            <div className="flex items-center gap-1 px-2 py-1 bg-[#AEE3F5]/20 border border-[#AEE3F5]/30 rounded-full">
              <Zap className="w-3 h-3 text-[#AEE3F5]" />
              <span className="text-[#AEE3F5] text-xs font-bold">HEAVY PUBLIC</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-white/40 text-xs">
          <Users className="w-3 h-3" />
          <span>Fade Alert</span>
        </div>
      </div>
    </div>
  );
};

export default PublicGameItem;
