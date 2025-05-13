
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBetStore } from "@/utils/portfolio-state";
import { useNavigate } from "react-router-dom";

const SPORTSBOOKS = {
  "hardrock": {
    name: "Hard Rock",
    appUrl: "https://hardrock.betmgm.com/"
  },
  "fanduel": {
    name: "FanDuel",
    appUrl: "https://sportsbook.fanduel.com/"
  },
  "draftkings": {
    name: "DraftKings",
    appUrl: "https://sportsbook.draftkings.com/"
  }
};

const DEFAULT_SPORTSBOOK = "hardrock";

const PendingBetsList = () => {
  const { pendingBets, markBetAsPlaced } = useBetStore();
  const navigate = useNavigate();
  
  if (pendingBets.length === 0) {
    return (
      <div className="rounded-lg bg-white/5 p-6 text-center border border-white/10">
        <p className="text-white/70">You don't have any pending bets yet</p>
      </div>
    );
  }
  
  const formatTime = (isoString: string) => {
    return format(new Date(isoString), "h:mm a");
  };
  
  const handleBetNow = (id: string, sportsbook = DEFAULT_SPORTSBOOK) => {
    // Mark the bet as placed with the selected sportsbook
    markBetAsPlaced(id, sportsbook);
    
    // Open the sportsbook in a new tab
    window.open(SPORTSBOOKS[sportsbook as keyof typeof SPORTSBOOKS]?.appUrl || SPORTSBOOKS[DEFAULT_SPORTSBOOK].appUrl, '_blank');
  };
  
  return (
    <div className="space-y-4">
      {pendingBets.map((bet) => {
        const confidence = Math.random() < 0.5 ? 
          { label: "Medium", score: 65, color: "bg-onetime-orange/20 text-onetime-orange border-onetime-orange/30" } :
          { label: "High", score: 85, color: "bg-onetime-green/20 text-onetime-green border-onetime-green/30" };
        
        return (
          <div 
            key={bet.id} 
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-white/10 to-white/5 p-4 shadow-lg border border-white/10"
          >
            {/* Accent light effect */}
            <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-onetime-purple/30 blur-xl"></div>
            
            {/* Top row: Bet Type as header & Time */}
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-white tracking-tight text-center w-full">{bet.betDescription}</h4>
              <span className="text-xs text-white/60 absolute top-4 right-4">
                {formatTime(bet.timestamp)}
              </span>
            </div>
            
            {/* Middle row: Bettor and confidence */}
            <div className="flex flex-wrap items-center justify-center mb-3">
              <div className="text-sm text-white/80 text-center">
                <span className="font-medium">
                  {bet.variant === "tail" ? "Tailing" : "Fading"} @{bet.bettorName}
                </span>
              </div>
              <Badge variant="outline" className={cn("border ml-2", confidence.color)}>
                {confidence.score}%
              </Badge>
            </div>
            
            {/* Bottom row: Action button */}
            <div className="mt-3">
              {bet.isPlaced ? (
                <Button 
                  variant="outline"
                  className="w-full border-white/20 text-white/70"
                  disabled
                >
                  Bet Placed on {bet.sportsbook || "Sportsbook"}
                </Button>
              ) : (
                <Button 
                  variant="default"
                  className="w-full bg-onetime-purple hover:bg-onetime-purple/80"
                  onClick={() => handleBetNow(bet.id)}
                >
                  Bet Now
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PendingBetsList;
