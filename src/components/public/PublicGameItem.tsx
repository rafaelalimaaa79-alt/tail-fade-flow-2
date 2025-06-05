
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
          <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
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

  const getAlertColor = () => {
    if (isExtremePublic) return "text-red-400 bg-red-500/10 border-red-500/30";
    if (isHeavyPublic) return "text-orange-400 bg-orange-500/10 border-orange-500/30";
    return "text-[#AEE3F5] bg-[#AEE3F5]/10 border-[#AEE3F5]/30";
  };

  const getProgressColor = () => {
    if (isExtremePublic) return "bg-red-500";
    if (isHeavyPublic) return "bg-orange-500";
    return "bg-[#AEE3F5]";
  };

  return (
    <div className="relative bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-xl p-4 hover:from-white/10 hover:to-white/15 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/5 w-full">
      {/* Rank Badge */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-[#AEE3F5] to-[#AEE3F5]/80 text-black text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
        #{rank}
      </div>
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Team Info - Left Side */}
        <div className="col-span-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-bold text-sm">{game.team}</span>
            {game.isLive && (
              <div className="px-1.5 py-0.5 bg-red-500/20 border border-red-500/40 rounded text-red-400 text-xs font-bold">
                LIVE
              </div>
            )}
          </div>
          <div className="text-white/60 text-xs">vs {game.opponent}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-1.5 py-0.5 bg-white/10 rounded text-white/70 text-xs">
              {game.sport}
            </span>
            {getTimeDisplay()}
          </div>
        </div>
        
        {/* Percentage Display - Center */}
        <div className="col-span-4 text-center">
          <div 
            className="text-3xl font-black text-red-400 mb-2 animate-pulse"
            style={{
              textShadow: '0 0 10px #f87171, 0 0 20px #f87171, 0 0 30px #f87171',
              filter: 'brightness(1.2)'
            }}
          >
            {game.publicPercentage}%
          </div>
          
          {/* Progress Bar */}
          <div className="relative mb-2">
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
                style={{ width: `${game.publicPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-white/60 text-xs mb-1">of bettors on</div>
          <div className="text-[#AEE3F5] text-lg font-black">
            {game.team} {game.spread}
          </div>
        </div>
        
        {/* Stats & Alert - Right Side */}
        <div className="col-span-4 text-right">
          <div className="mb-3">
            <div className="text-[#AEE3F5] text-lg font-bold">
              {game.totalBets.toLocaleString()}
            </div>
            <div className="text-white/50 text-xs font-medium uppercase tracking-wide">Bets</div>
          </div>
          
          {/* Alert Badge */}
          <div className={`inline-flex items-center gap-1 px-2 py-1 border rounded-full text-xs font-bold ${getAlertColor()}`}>
            {isExtremePublic ? (
              <>
                <Zap className="w-3 h-3" />
                FADE
              </>
            ) : isHeavyPublic ? (
              <>
                <TrendingUp className="w-3 h-3" />
                HEAVY
              </>
            ) : (
              <>
                <Users className="w-3 h-3" />
                MONITOR
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AEE3F5]/50 to-transparent"></div>
    </div>
  );
};

export default PublicGameItem;
