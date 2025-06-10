
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBetStore } from "@/utils/portfolio-state";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

  // Function to generate NBA matchups
  const getMatchup = () => {
    const teams = [
      "Lakers vs Celtics",
      "Warriors vs Nets", 
      "Bucks vs Heat",
      "76ers vs Nuggets",
      "Suns vs Mavericks"
    ];
    return teams[Math.floor(Math.random() * teams.length)];
  };

  // Function to generate bet lines
  const getBetLine = () => {
    const lines = [
      "Over 220.5",
      "Under 48.5",
      "-3.5",
      "+7.5",
      "Over 112.5"
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  };
  
  return (
    <div className="space-y-6">
      {pendingBets.map((bet, index) => {
        const fadeConfidence = getFadeConfidence();
        const matchup = getMatchup();
        const betLine = getBetLine();
        
        return (
          <div key={bet.id}>
            <div 
              className="bg-black rounded-xl p-4 border border-[#AEE3F5]/30 animate-glow-pulse space-y-3"
              style={{
                boxShadow: '0 0 15px rgba(174, 227, 245, 0.3)',
              }}
            >
              {/* Game header with solid icy blue underline */}
              <div className="text-center pb-2">
                <h3 className="text-lg font-bold text-white relative inline-block">
                  {matchup}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#AEE3F5] opacity-90"></div>
                </h3>
              </div>
              
              {/* Bettor's pick */}
              <div className="text-center">
                <p className="text-lg font-bold">
                  <span className="text-[#AEE3F5]">@{bet.bettorName}</span>
                  <span className="text-white"> is on {betLine}</span>
                </p>
              </div>
              
              {/* Divider line */}
              <div className="flex justify-center py-2">
                <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
              </div>
              
              {/* Fade confidence */}
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-300">
                  Fade Confidence: <span className="text-[#AEE3F5] font-bold">{fadeConfidence}%</span>
                </p>
              </div>
              
              {/* Fade button */}
              <div className="w-full pt-2">
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
                    className="w-full bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-bold py-3 rounded-xl"
                    onClick={() => handleBetNow(bet.id)}
                  >
                    Fade {betLine}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Separator line between cards (not after the last one) */}
            {index < pendingBets.length - 1 && (
              <div className="flex justify-center py-4">
                <div className="w-3/4 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/50 to-transparent"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PendingBetsList;
