
import React from "react";
import { Users, Clock, Zap, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

  const getPercentageColor = () => {
    if (game.publicPercentage >= 90) return 'text-red-400';
    if (game.publicPercentage >= 85) return 'text-orange-400';
    if (game.publicPercentage >= 80) return 'text-[#AEE3F5]';
    return 'text-[#AEE3F5]';
  };

  const getProgressColor = () => {
    if (game.publicPercentage >= 90) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (game.publicPercentage >= 85) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    if (game.publicPercentage >= 80) return 'bg-gradient-to-r from-[#AEE3F5] to-[#AEE3F5]/80';
    return 'bg-gradient-to-r from-[#AEE3F5]/60 to-[#AEE3F5]/40';
  };

  return (
    <div className="relative bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-lg p-4 hover:from-white/10 hover:to-white/15 transition-all duration-200 hover:border-white/30">
      {/* Rank Badge */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#AEE3F5] text-black text-xs font-bold rounded-full flex items-center justify-center">
        #{rank}
      </div>
      
      {/* Game Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white">
              {game.team} vs {game.opponent}
            </h3>
            {game.isLive && (
              <div className="px-2 py-1 bg-red-500/20 border border-red-500/40 rounded text-red-400 text-xs font-bold">
                LIVE
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="px-2 py-1 bg-white/10 rounded text-white/70 text-xs font-medium">
              {game.sport}
            </span>
            {!game.isLive && getTimeDisplay()}
          </div>
        </div>
      </div>
      
      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        {/* Left Column - Public Betting */}
        <div className="space-y-3">
          <div className="text-center">
            <div className={`text-3xl font-black mb-1 ${getPercentageColor()}`}>
              {game.publicPercentage}%
            </div>
            <div className="text-white/50 text-xs font-medium uppercase tracking-wide">Public on {game.team}</div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="relative">
              <Progress 
                value={game.publicPercentage} 
                className="h-2 bg-white/10"
              />
              <div 
                className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
                style={{ width: `${game.publicPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        
        {/* Right Column - Betting Info */}
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#AEE3F5] mb-1">
              {game.spread}
            </div>
            <div className="text-white/50 text-xs font-medium uppercase tracking-wide">Spread</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-white mb-1">
              {game.totalBets.toLocaleString()}
            </div>
            <div className="text-white/50 text-xs font-medium uppercase tracking-wide">Total Bets</div>
          </div>
        </div>
      </div>
      
      {/* Bottom Alert Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          {isExtremePublic ? (
            <div className="flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
              <Zap className="w-3 h-3 text-red-400" />
              <span className="text-red-400 text-xs font-bold">EXTREME PUBLIC</span>
            </div>
          ) : isHeavyPublic ? (
            <div className="flex items-center gap-1 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full">
              <TrendingUp className="w-3 h-3 text-orange-400" />
              <span className="text-orange-400 text-xs font-bold">HEAVY PUBLIC</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 bg-[#AEE3F5]/20 border border-[#AEE3F5]/30 rounded-full">
              <Users className="w-3 h-3 text-[#AEE3F5]" />
              <span className="text-[#AEE3F5] text-xs font-bold">PUBLIC FAVORITE</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-[#AEE3F5]/60 text-xs">
          <span className="font-medium">FADE OPPORTUNITY</span>
        </div>
      </div>
    </div>
  );
};

export default PublicGameItem;
