
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
      <div className="rounded-lg bg-black p-6 text-center border border-white/10">
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

  // Function to get fade confidence (mock data for now)
  const getFadeConfidence = () => {
    return Math.floor(Math.random() * 30) + 70; // Random between 70-99%
  };
  
  return (
    <div className="space-y-4">
      {pendingBets.map((bet) => {
        const fadeConfidence = getFadeConfidence();
        
        return (
          <div 
            key={bet.id} 
            className="bg-black rounded-xl p-6 border border-[#AEE3F5]/30 animate-glow-pulse"
            style={{
              boxShadow: '0 0 15px rgba(174, 227, 245, 0.3)',
            }}
          >
            {/* Username */}
            <div className="text-center mb-4">
              <p className="text-lg font-medium text-[#AEE3F5]">
                @{bet.bettorName}
              </p>
            </div>
            
            {/* Bet line */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-3">
                {bet.betDescription}
              </h3>
              <div className="w-12 h-0.5 bg-[#AEE3F5] mx-auto"></div>
            </div>
            
            {/* Fade confidence */}
            <div className="text-center mb-4">
              <p className="text-lg font-semibold text-gray-300">
                Fade Confidence: <span className="text-[#AEE3F5] font-bold text-xl">{fadeConfidence}%</span>
              </p>
            </div>
            
            {/* Fade button */}
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
                  className="w-full bg-[#6C5CE7] hover:bg-[#5B4BD6] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
                  onClick={() => handleBetNow(bet.id)}
                >
                  👎 Fade
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
