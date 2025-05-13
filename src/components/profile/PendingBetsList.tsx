
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBetStore } from "@/utils/portfolio-state";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Clock } from "lucide-react";

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
          { label: "Medium", color: "bg-onetime-orange/20 text-onetime-orange border-onetime-orange/30" } :
          { label: "High", color: "bg-onetime-green/20 text-onetime-green border-onetime-green/30" };
        
        return (
          <div 
            key={bet.id} 
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 shadow-lg border border-white/10 transition-all duration-300 hover:border-onetime-purple/50 animate-pulse-heartbeat"
          >
            {/* Interactive blob effect in background */}
            <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-onetime-purple/20 blur-xl"></div>
            <div className="absolute bottom-0 left-6 h-20 w-20 rounded-full bg-onetime-orange/10 blur-xl"></div>
            
            {/* Bet Description as prominent header */}
            <div className="mb-4 text-center">
              <h4 className="text-xl font-extrabold text-white tracking-tight relative z-10">
                {bet.betDescription}
                <div className="h-1 w-16 bg-gradient-to-r from-onetime-purple via-onetime-purple/80 to-transparent rounded-full mx-auto mt-1"></div>
              </h4>
            </div>
            
            {/* Time in stylish badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/30 px-2 py-1 text-xs text-white/80 backdrop-blur-sm border border-white/10">
              <Clock className="h-3 w-3 text-onetime-purple" /> 
              <span>{formatTime(bet.timestamp)}</span>
            </div>
            
            {/* Middle row: Bettor info with nice styling */}
            <div className="flex flex-col items-center justify-center mb-4 relative z-10">
              <div className="flex items-center justify-center mb-1.5 gap-2">
                <span className="text-sm font-medium text-white inline-flex items-center gap-1">
                  {bet.variant === "tail" ? "Tailing" : "Fading"}
                  <span className="text-onetime-purple">@{bet.bettorName}</span>
                </span>
              </div>
              <Badge variant="outline" className={cn("border", confidence.color)}>
                {confidence.label}
              </Badge>
            </div>
            
            {/* Bottom row: Action button with enhanced styling */}
            <div className="relative z-10">
              {bet.isPlaced ? (
                <div className="relative overflow-hidden rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-onetime-green/20 to-transparent"></div>
                  <Button 
                    variant="outline"
                    className="w-full border-0 text-white bg-transparent"
                    disabled
                  >
                    Bet Placed on {bet.sportsbook || "Sportsbook"}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="default"
                  className="w-full bg-gradient-to-r from-onetime-purple to-onetime-purple/80 hover:from-onetime-purple/90 hover:to-onetime-purple/70 shadow-lg shadow-onetime-purple/20 text-white font-bold flex items-center justify-center group relative overflow-hidden"
                  onClick={() => handleBetNow(bet.id)}
                >
                  <span className="relative z-10 flex items-center">
                    Bet Now 
                    <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
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
