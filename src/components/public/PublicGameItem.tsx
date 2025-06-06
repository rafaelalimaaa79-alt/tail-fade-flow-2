
import React from "react";
import { Separator } from "@/components/ui/separator";

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
  const getTimeInEST = () => {
    if (game.isLive) {
      return (
        <div className="flex items-center gap-1 text-red-400 text-xs font-bold">
          <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
          LIVE
        </div>
      );
    }
    
    const gameTime = new Date(game.gameTime);
    // Convert to EST (UTC-5) or EDT (UTC-4) depending on daylight savings
    const estTime = new Date(gameTime.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    return (
      <div className="text-white/60 text-sm font-medium">
        {estTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'America/New_York'
        })} EST
      </div>
    );
  };

  // FadeZone percentage - keeping it within 70-95% range
  const fadeZonePercentage = Math.max(70, Math.min(95, 
    100 - game.publicPercentage + (Math.random() - 0.5) * 8
  ));

  return (
    <div className="relative bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-xl overflow-hidden hover:from-white/10 hover:to-white/15 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/5 max-w-xs mx-auto">
      {/* Header with Game and Time */}
      <div className="flex justify-between items-center px-4 py-3 bg-black/20 border-b border-white/10">
        <div className="text-white font-bold text-lg">
          {game.team} vs {game.opponent}
        </div>
        <div>
          {getTimeInEST()}
        </div>
      </div>
      
      {/* Split Content with Separator */}
      <div className="flex items-stretch">
        {/* FadeZone Side */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-3 space-y-2">
          <div className="text-[#AEE3F5] text-lg font-black uppercase tracking-wide">
            FadeZone
          </div>
          <div className="text-[#AEE3F5] text-3xl font-bold">
            {Math.round(fadeZonePercentage)}%
          </div>
          <div className="text-white/80 text-sm text-center font-medium leading-relaxed">
            of FadeZone bettors are on <span className="text-white font-semibold">{game.team} {game.spread}</span>
          </div>
        </div>
        
        {/* Vertical Separator */}
        <div className="flex items-center">
          <Separator orientation="vertical" className="h-20 bg-white/30" />
        </div>
        
        {/* Public Side */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-3 space-y-2">
          <div className="text-red-400 text-lg font-black uppercase tracking-wide">
            Public
          </div>
          <div className="text-red-400 text-3xl font-bold">
            {game.publicPercentage}%
          </div>
          <div className="text-white/80 text-sm text-center font-medium leading-relaxed">
            of Public bettors are on <span className="text-white font-semibold">{game.team} {game.spread}</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AEE3F5]/50 to-transparent"></div>
    </div>
  );
};

export default PublicGameItem;
