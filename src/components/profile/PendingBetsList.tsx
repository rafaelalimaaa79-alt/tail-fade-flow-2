
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
  
  const handleBetNow = (id: string, sportsbook = DEFAULT_SPORTSBOOK) => {
    // Mark the bet as placed with the selected sportsbook
    markBetAsPlaced(id, sportsbook);
    
    // Open the sportsbook in a new tab
    window.open(SPORTSBOOKS[sportsbook as keyof typeof SPORTSBOOKS]?.appUrl || SPORTSBOOKS[DEFAULT_SPORTSBOOK].appUrl, '_blank');
  };

  // Function to get the opposite bet that we're fading
  const getFadedBet = (betDescription: string) => {
    // Simple logic to show what bet we're fading
    if (betDescription.includes("Yankees ML")) {
      return "Red Sox ML";
    } else if (betDescription.includes("Lakers -5.5")) {
      return "Celtics +5.5";
    } else if (betDescription.includes("Over 220")) {
      return "Under 220";
    } else if (betDescription.includes("Dodgers -1.5")) {
      return "Giants +1.5";
    } else if (betDescription.includes("-")) {
      return betDescription.replace("-", "+");
    } else if (betDescription.includes("+")) {
      return betDescription.replace("+", "-");
    }
    
    return "Opposite bet";
  };
  
  return (
    <div className="space-y-4">
      {pendingBets.map((bet) => {
        const fadedBet = getFadedBet(bet.betDescription);
        
        return (
          <div 
            key={bet.id} 
            className="rounded-2xl bg-gray-800 p-6 border border-gray-600"
          >
            {/* Bet Description as main header */}
            <div className="mb-4 text-center">
              <h3 className="text-3xl font-bold text-white mb-2">
                {bet.betDescription}
              </h3>
              <div className="h-0.5 w-16 bg-cyan-400 mx-auto"></div>
            </div>
            
            {/* Fading info */}
            <div className="mb-6 text-center">
              <p className="text-lg text-gray-300">
                Fading <span className="text-cyan-400">@{bet.bettorName}</span>'s {fadedBet} pick
              </p>
            </div>
            
            {/* Action button */}
            <div className="flex justify-center">
              {bet.isPlaced ? (
                <div className="w-full">
                  <Button 
                    variant="outline"
                    className="w-full bg-gray-700 border-gray-600 text-gray-400 py-3 text-lg rounded-xl"
                    disabled
                  >
                    Bet Placed on Hard Rock
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 text-lg rounded-xl flex items-center justify-center gap-2"
                    onClick={() => handleBetNow(bet.id)}
                  >
                    Bet Now on Hard Rock
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PendingBetsList;
