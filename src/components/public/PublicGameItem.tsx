
import React from "react";
import { Clock, Zap } from "lucide-react";

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

  return (
    <div className="relative bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-xl p-4 hover:from-white/10 hover:to-white/15 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/5 max-w-md mx-auto">
      {/* Rank Badge */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-[#AEE3F5] to-[#AEE3F5]/80 text-black text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
        #{rank}
      </div>
      
      {/* Header with Game and Time */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
        <div>
          <div className="text-white font-bold text-sm">{game.team} vs {game.opponent}</div>
          <div className="text-white/60 text-xs">{game.sport}</div>
        </div>
        <div>
          {getTimeDisplay()}
        </div>
      </div>
      
      {/* Main Content - Percentage */}
      <div className="text-center mb-4">
        <div 
          className="text-4xl font-black text-red-400 mb-2 animate-pulse"
          style={{
            textShadow: '0 0 10px #f87171, 0 0 20px #f87171, 0 0 30px #f87171',
            filter: 'brightness(1.2)'
          }}
        >
          {game.publicPercentage}%
        </div>
        
        <div className="text-white/60 text-sm mb-1">of bettors on</div>
        <div className="text-[#AEE3F5] text-xl font-black">
          {game.team} {game.spread}
        </div>
      </div>
      
      {/* Alert Badge - Only for extreme public */}
      {isExtremePublic && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 border border-red-500/30 rounded-full text-xs font-bold text-red-400 bg-red-500/10">
            <Zap className="w-3 h-3" />
            FADE
          </div>
        </div>
      )}
      
      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AEE3F5]/50 to-transparent"></div>
    </div>
  );
};

export default PublicGameItem;
