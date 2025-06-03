
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

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
  const isHeavyPublic = game.publicPercentage >= 75;
  
  const getTimeDisplay = () => {
    if (game.isLive) {
      return (
        <Badge variant="destructive" className="bg-red-500 text-white">
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
          <div className="flex items-center gap-1 text-white/70 text-sm">
            <Clock className="h-3 w-3" />
            <span>{hours}h {minutes}m</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-1 text-orange-400 text-sm">
            <Clock className="h-3 w-3" />
            <span>{minutes}m</span>
          </div>
        );
      }
    }
    
    return (
      <div className="text-white/50 text-sm">
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

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full text-white/70 text-sm font-bold">
            {rank}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${getSportColor(game.sport)} text-white text-xs px-2 py-1`}>
                {game.sport}
              </Badge>
              {isHeavyPublic && (
                <Badge variant="outline" className="border-orange-400 text-orange-400 text-xs">
                  HEAVY PUBLIC
                </Badge>
              )}
            </div>
            
            <div className="text-white font-semibold">
              {game.team} {game.spread}
            </div>
            <div className="text-white/70 text-sm">
              vs {game.opponent}
            </div>
          </div>
        </div>
        
        <div className="text-right space-y-1">
          <div className="text-2xl font-bold text-white">
            {game.publicPercentage}%
          </div>
          <div className="flex items-center gap-1 text-white/60 text-sm">
            <Users className="h-3 w-3" />
            <span>{game.totalBets.toLocaleString()}</span>
          </div>
          {getTimeDisplay()}
        </div>
      </div>
      
      {/* Progress bar showing public percentage */}
      <div className="mt-3">
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isHeavyPublic ? 'bg-orange-400' : 'bg-blue-400'
            }`}
            style={{ width: `${game.publicPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PublicGameItem;
