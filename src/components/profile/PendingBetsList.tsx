
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
      <div className="rounded-lg bg-gray-900/50 p-6 text-center border border-gray-700/50">
        <p className="text-gray-400">You don't have any pending bets yet</p>
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
    <div className="space-y-3">
      {pendingBets.map((bet) => {
        const fadedBet = getFadedBet(bet.betDescription);
        
        return (
          <div 
            key={bet.id} 
            className="bg-gray-800/90 rounded-2xl p-4 border border-gray-700/30"
          >
            {/* Bet title */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                {bet.betDescription}
              </h3>
              <div className="w-12 h-0.5 bg-cyan-400 mx-auto"></div>
            </div>
            
            {/* Fading info */}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-400">
                Fading <span className="text-cyan-400">@{bet.bettorName}</span>'s {fadedBet} pick
              </p>
            </div>
            
            {/* Button */}
            <div className="w-full">
              {bet.isPlaced ? (
                <Button 
                  variant="outline"
                  className="w-full bg-gray-700/50 border-gray-600 text-gray-400 py-3 rounded-xl cursor-not-allowed"
                  disabled
                >
                  Bet Placed on Hard Rock
                </Button>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
                  onClick={() => handleBetNow(bet.id)}
                >
                  Bet Now on Hard Rock
                  <ArrowRight className="w-4 h-4" />
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
