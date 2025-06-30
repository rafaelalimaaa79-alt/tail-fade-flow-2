
import React, { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBetStore } from "@/utils/portfolio-state";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getOppositeBet } from "@/utils/bet-conversion";

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
  const [showAll, setShowAll] = useState(false);
  
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
    const matchups = [
      { game: "Lakers vs Celtics", teams: ["Lakers", "Celtics"] },
      { game: "Warriors vs Nets", teams: ["Warriors", "Nets"] }, 
      { game: "Bucks vs Heat", teams: ["Bucks", "Heat"] },
      { game: "76ers vs Nuggets", teams: ["76ers", "Nuggets"] },
      { game: "Suns vs Mavericks", teams: ["Suns", "Mavericks"] }
    ];
    return matchups[Math.floor(Math.random() * matchups.length)];
  };

  // Function to generate realistic NBA bet lines
  const getBetLine = (teams: string[]) => {
    const team = teams[Math.floor(Math.random() * teams.length)];
    const betTypes = [
      "Over 230.5", // Total points
      "Under 225.5", // Total points
      "-3.5", // Point spread
      "+5.5", // Point spread
      "Over 115.5", // Team total
      "Under 110.5", // Team total
      "ML" // Moneyline
    ];
    const betType = betTypes[Math.floor(Math.random() * betTypes.length)];
    
    // For totals, don't include team name for game totals
    if (betType.includes("Over") || betType.includes("Under")) {
      if (betType.includes("230.5") || betType.includes("225.5")) {
        return { team: null, betType }; // Game total
      } else {
        return { team, betType }; // Team total
      }
    }
    
    // For spreads and ML, include team name
    return { team, betType };
  };

  // Determine which bets to show
  const betsToShow = showAll ? pendingBets : pendingBets.slice(0, 3);
  const hasMoreBets = pendingBets.length > 3;
  
  return (
    <div className="space-y-4">
      {betsToShow.map((bet, index) => {
        const fadeConfidence = getFadeConfidence();
        const matchup = getMatchup();
        const betData = getBetLine(matchup.teams);
        const betLine = betData.team ? `${betData.team} ${betData.betType}` : betData.betType;
        
        // Get the opposite team for the fade bet
        const opponentTeam = matchup.teams.find(team => team !== betData.team);
        const oppositeBet = getOppositeBet(betLine, opponentTeam);
        
        return (
          <div key={bet.id}>
            <div 
              className="bg-black rounded-xl p-3 border border-[#AEE3F5]/30 animate-glow-pulse space-y-2"
              style={{
                boxShadow: '0 0 15px rgba(174, 227, 245, 0.3)',
              }}
            >
              {/* Game header with solid icy blue underline */}
              <div className="text-center pb-1">
                <h3 className="text-base font-bold text-white relative inline-block">
                  {matchup.game}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#AEE3F5] opacity-90"></div>
                </h3>
              </div>
              
              {/* Fading description for own profile */}
              <div className="text-center">
                <p className="text-base font-bold">
                  <span className="text-white">Fading </span>
                  <span className="text-[#AEE3F5]">@{bet.bettorName}'s</span>
                  <span className="text-white"> {betLine}</span>
                </p>
              </div>
              
              {/* Divider line */}
              <div className="flex justify-center py-1">
                <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
              </div>
              
              {/* Fade confidence */}
              <div className="text-center">
                <p className="text-base font-semibold text-gray-300">
                  Fade Confidence: <span className="text-[#AEE3F5] font-bold">{fadeConfidence}%</span>
                </p>
              </div>
              
              {/* Your Bet section */}
              <div className="text-center">
                <p className="text-base font-semibold text-gray-300">
                  Your Bet: <span className="text-[#AEE3F5] font-bold">{oppositeBet}</span>
                </p>
              </div>
              
              {/* Fade button */}
              <div className="w-full pt-1">
                {bet.isPlaced ? (
                  <Button 
                    variant="outline"
                    className="w-full bg-gray-700/50 border-gray-600 text-gray-400 py-2 rounded-xl cursor-not-allowed"
                    disabled
                  >
                    Bet Placed on Hard Rock
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-xl"
                    onClick={() => handleBetNow(bet.id)}
                    style={{
                      boxShadow: "0 0 20px rgba(108, 92, 231, 0.8), 0 0 40px rgba(108, 92, 231, 0.4)"
                    }}
                  >
                    Bet Now on Hard Rock
                  </Button>
                )}
              </div>
            </div>
            
            {/* Separator line between cards (not after the last one) */}
            {index < betsToShow.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-3/4 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/50 to-transparent"></div>
              </div>
            )}
          </div>
        );
      })}
      
      {/* View All / Show Less Button */}
      {hasMoreBets && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="border-[#AEE3F5]/30 text-[#AEE3F5] hover:bg-[#AEE3F5]/10 hover:border-[#AEE3F5]/50"
          >
            {showAll ? `Show Less` : `View All ${pendingBets.length} Pending Bets`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PendingBetsList;
