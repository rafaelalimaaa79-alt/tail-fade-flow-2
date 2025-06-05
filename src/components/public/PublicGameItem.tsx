
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
      <div className="text-white/60 text-sm">
        {estTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'America/New_York'
        })} EST
      </div>
    );
  };

  // Mock FadeZone percentage - in production this would come from your API
  const fadeZonePercentage = Math.max(30, 100 - game.publicPercentage + (Math.random() - 0.5) * 20);

  return (
    <div className="relative bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-xl p-4 hover:from-white/10 hover:to-white/15 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/5 max-w-xs mx-auto">
      {/* Header with Game and Time */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
        <div className="text-center flex-1">
          <div className="text-white font-bold text-lg">{game.team} vs {game.opponent}</div>
        </div>
        <div>
          {getTimeInEST()}
        </div>
      </div>
      
      {/* Split Content with Separator */}
      <div className="flex items-stretch h-28">
        {/* FadeZone Side */}
        <div className="flex-1 flex flex-col pr-3">
          <div className="text-[#AEE3F5] text-xl font-black text-center mb-2">
            FadeZone
          </div>
          <div className="text-[#AEE3F5] text-2xl font-bold text-center mb-1">
            {Math.round(fadeZonePercentage)}%
          </div>
          <div className="text-white/80 text-sm text-center font-medium">
            are on {game.team} {game.spread}
          </div>
        </div>
        
        {/* Vertical Separator */}
        <div className="relative">
          <Separator orientation="vertical" className="h-full bg-white/20" />
        </div>
        
        {/* Public Side */}
        <div className="flex-1 flex flex-col pl-3">
          <div className="text-red-400 text-xl font-black text-center mb-2">
            Public
          </div>
          <div className="text-red-400 text-2xl font-bold text-center mb-1">
            {game.publicPercentage}%
          </div>
          <div className="text-white/80 text-sm text-center font-medium">
            is on {game.team} {game.spread}
          </div>
        </div>
      </div>
      
      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AEE3F5]/50 to-transparent"></div>
    </div>
  );
};

export default PublicGameItem;
