
import React from "react";
import { Users, Clock, Zap, TrendingUp } from "lucide-react";

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
  const isExtremePublic = game.publicPercentage >= 90;
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

  return (
    <div className="relative bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-lg p-4 hover:from-white/10 hover:to-white/15 transition-all duration-200 hover:border-white/30">
      {/* Rank Badge */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#AEE3F5] text-black text-xs font-bold rounded-full flex items-center justify-center">
        #{rank}
      </div>
      
      {/* Game Header */}
      <div className="text-center mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-white">
            {game.team} vs {game.opponent}
          </h3>
          {game.isLive && (
            <div className="px-2 py-1 bg-red-500/20 border border-red-500/40 rounded text-red-400 text-xs font-bold">
              LIVE
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="px-2 py-1 bg-white/10 rounded text-white/70 text-xs font-medium">
            {game.sport}
          </span>
          {getTimeDisplay()}
        </div>
      </div>
      
      {/* Main Content - Pulsing Percentage */}
      <div className="text-center mb-6">
        <div 
          className="text-6xl font-black text-red-400 mb-3 animate-pulse"
          style={{
            textShadow: '0 0 10px #f87171, 0 0 20px #f87171, 0 0 30px #f87171',
            filter: 'brightness(1.2)'
          }}
        >
          {game.publicPercentage}%
        </div>
        
        {/* Betting Description */}
        <div className="text-white/80 text-base leading-relaxed">
          <span className="text-white/60">{game.publicPercentage}% of bettors on</span>
          <div className="mt-1">
            <span className="text-[#AEE3F5] text-2xl font-black">
              {game.team} {game.spread}
            </span>
          </div>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="flex justify-center items-center gap-6 mb-4 text-center">
        <div>
          <div className="text-[#AEE3F5] text-lg font-bold">
            {game.totalBets.toLocaleString()}
          </div>
          <div className="text-white/50 text-xs font-medium uppercase tracking-wide">Total Bets</div>
        </div>
      </div>
      
      {/* Bottom Alert */}
      <div className="text-center pt-3 border-t border-white/10">
        {isExtremePublic ? (
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-bold">EXTREME PUBLIC - FADE ALERT</span>
          </div>
        ) : isHeavyPublic ? (
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-bold">HEAVY PUBLIC - FADE OPPORTUNITY</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#AEE3F5]/20 border border-[#AEE3F5]/30 rounded-full">
            <Users className="w-4 h-4 text-[#AEE3F5]" />
            <span className="text-[#AEE3F5] text-sm font-bold">PUBLIC FAVORITE - MONITOR</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicGameItem;
