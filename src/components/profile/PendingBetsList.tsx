import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBetStore } from "@/utils/portfolio-state";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Star } from "lucide-react";

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
      <div className="rounded-lg bg-black/30 p-6 text-center border border-white/10">
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

  // Function to get the opposite bet that we're fading
  const getFadedBet = (betDescription: string) => {
    // Simple logic to show what bet we're fading
    // This would be more sophisticated in a real app
    if (betDescription.includes("Yankees ML")) {
      return "Red Sox ML"; // Assuming Yankees vs Red Sox
    } else if (betDescription.includes("Lakers -5.5")) {
      return "Celtics +5.5"; // Assuming Lakers vs Celtics
    } else if (betDescription.includes("Over 220")) {
      return "Under 220";
    } else if (betDescription.includes("Dodgers -1.5")) {
      return "Giants +1.5"; // Assuming Dodgers vs Giants
    } else if (betDescription.includes("-")) {
      // Generic handling for spread bets - flip the sign
      return betDescription.replace("-", "+");
    } else if (betDescription.includes("+")) {
      // Generic handling for spread bets - flip the sign
      return betDescription.replace("+", "-");
    }
    
    return "Opposite bet"; // Fallback
  };

  // Function to get responsive text size based on bet description length
  const getBetTextSize = (betDescription: string) => {
    const length = betDescription.length;
    if (length > 25) {
      return "text-lg"; // Smaller for very long text
    } else if (length > 18) {
      return "text-xl"; // Medium for moderately long text
    } else {
      return "text-2xl"; // Original size for shorter text
    }
  };
  
  return (
    <div className="space-y-2">
      {pendingBets.map((bet) => {
        const fadedBet = getFadedBet(bet.betDescription);
        const textSize = getBetTextSize(bet.betDescription);
        
        return (
          <div 
            key={bet.id} 
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-black via-black/80 to-black/60 p-2.5 shadow-lg border border-white/10 transition-all duration-300 hover:border-onetime-red/50"
          >
            {/* Interactive blob effect in background */}
            <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-onetime-red/20 blur-xl"></div>
            <div className="absolute bottom-0 left-4 h-14 w-14 rounded-full bg-onetime-orange/10 blur-xl"></div>
            
            {/* Bet Description as prominent header with responsive font size - properly centered */}
            <div className="mb-1.5 text-center">
              <h4 className={`${textSize} font-extrabold text-white tracking-tight relative z-10 font-rajdhani mx-auto`}>
                {bet.betDescription}
                <div className="h-0.5 w-12 bg-gradient-to-r from-onetime-red via-onetime-red/80 to-transparent rounded-full mx-auto mt-0.5"></div>
              </h4>
            </div>
            
            {/* Middle row: Bettor info with nice styling - showing what we're fading - centered */}
            <div className="flex flex-col items-center justify-center mb-1.5 relative z-10">
              <div className="flex items-center justify-center mb-1 gap-2">
                <span className="text-sm font-medium text-white inline-flex items-center gap-1">
                  Fading <span className="text-onetime-red">@{bet.bettorName}</span>'s {fadedBet} pick
                </span>
              </div>
            </div>
            
            {/* Bottom row: Action button with enhanced styling - centered */}
            <div className="relative z-10 flex justify-center">
              {bet.isPlaced ? (
                <div className="relative overflow-hidden rounded-lg border border-white/20 bg-black/50 w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-onetime-green/20 to-transparent"></div>
                  <Button 
                    variant="outline"
                    className="w-full border-0 text-white bg-transparent py-1.5 text-sm"
                    disabled
                  >
                    Bet Placed on {SPORTSBOOKS[bet.sportsbook as keyof typeof SPORTSBOOKS]?.name || "Hard Rock"}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="default"
                  className="w-full bg-gradient-to-r from-onetime-purple to-onetime-purple/80 hover:from-onetime-purple/90 hover:to-onetime-purple/70 shadow-lg shadow-onetime-purple/20 text-white font-bold flex items-center justify-center group relative overflow-hidden py-1.5 text-sm"
                  onClick={() => handleBetNow(bet.id)}
                >
                  <span className="relative z-10 flex items-center">
                    Bet Now on Hard Rock
                    <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
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
