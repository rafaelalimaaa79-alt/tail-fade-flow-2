
import React, { useState } from "react";
import { BettorBet, BettorProfile } from "@/types/bettor";
import { analyzeBettorWeaknesses, getStrongestWeaknessDescription } from "@/utils/weakness-analyzer";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { showFadeNotification } from "@/utils/betting-notifications";
import ActionButton from "@/components/ActionButton";
import { ThumbsUp, ThumbsDown, Clock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type PendingBetsProps = {
  pendingBets: BettorBet[];
  profile: BettorProfile;
  className?: string;
};

const PendingBets: React.FC<PendingBetsProps> = ({ pendingBets, profile, className }) => {
  const [showAll, setShowAll] = useState(false);
  
  const handleFade = (bet: BettorBet) => {
    showFadeNotification("Bettor", bet.betType);
  };

  // Function to get fade confidence (mock data for now)
  const getFadeConfidence = () => {
    return Math.floor(Math.random() * 30) + 70; // Random between 70-99%
  };

  // Function to generate NBA matchups
  const getMatchup = () => {
    const matchups = [
      { game: "Lakers vs Celtics", teams: ["Lakers", "Celtics"], sport: "NBA" },
      { game: "Warriors vs Nets", teams: ["Warriors", "Nets"], sport: "NBA" }, 
      { game: "Bucks vs Heat", teams: ["Bucks", "Heat"], sport: "NBA" },
      { game: "76ers vs Nuggets", teams: ["76ers", "Nuggets"], sport: "NBA" },
      { game: "Suns vs Mavericks", teams: ["Suns", "Mavericks"], sport: "NBA" }
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
    
    // For totals, don't include team name
    if (betType.includes("Over") || betType.includes("Under")) {
      if (betType.includes("230.5") || betType.includes("225.5")) {
        return betType; // Game total
      } else {
        return `${team} ${betType}`; // Team total
      }
    }
    
    // For spreads and ML, include team name
    return `${team} ${betType}`;
  };

  // Function to generate sport-specific statlines using weakness analysis
  const getSportStatline = (sport: string, bettorName: string, betDescription: string) => {
    const weaknesses = analyzeBettorWeaknesses(bettorName, betDescription, sport);
    return getStrongestWeaknessDescription(weaknesses);
  };

  // Create bets with fade confidence and sort by highest confidence
  const betsWithConfidence = pendingBets.map(bet => ({
    ...bet,
    fadeConfidence: getFadeConfidence(),
    matchup: getMatchup(),
    betLine: (() => {
      const matchup = getMatchup();
      return getBetLine(matchup.teams);
    })(),
    sportStatline: (() => {
      const matchup = getMatchup();
      return getSportStatline(matchup.sport, profile.username, bet.teams);
    })()
  })).sort((a, b) => b.fadeConfidence - a.fadeConfidence);

  // Determine which bets to show
  const betsToShow = showAll ? betsWithConfidence : betsWithConfidence.slice(0, 3);
  const hasMoreBets = pendingBets.length > 3;

  return (
    <div className={cn("rounded-xl bg-black p-6 shadow-2xl relative overflow-hidden border border-white/10", className)}>
      <h3 className="mb-6 text-3xl font-bold text-[#AEE3F5] text-center relative z-10 drop-shadow-[0_0_8px_rgba(174,227,245,0.7)] font-rajdhani uppercase tracking-wide">
        Pending Bets
      </h3>
      
      {pendingBets.length > 0 ? (
        <div className="space-y-6 relative z-10">
          {betsToShow.map((bet, index) => {
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
                    <h3 className="text-2xl font-bold text-white relative inline-block">
                      {bet.matchup.game}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#AEE3F5] opacity-90"></div>
                    </h3>
                  </div>
                  
                  {/* Bettor's pick */}
                  <div className="text-center py-1">
                    <p className="text-lg font-bold">
                      <span className="text-[#AEE3F5]">@{profile.username}</span>
                      <span className="text-white"> is on {bet.betLine}</span>
                    </p>
                  </div>
                  
                  {/* Sport-specific statline */}
                  <div className="text-center py-1">
                    <p className="text-base font-medium text-gray-400 italic">
                      {bet.sportStatline}
                    </p>
                  </div>
                  
                  {/* Divider line */}
                  <div className="flex justify-center py-1">
                    <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
                  </div>
                  
                  {/* Fade confidence */}
                  <div className="text-center py-1">
                    <p className="text-lg font-semibold text-gray-300">
                      Fade Confidence: <span className="text-[#AEE3F5] font-bold">{bet.fadeConfidence}%</span>
                    </p>
                  </div>
                  
                  {/* Fade button */}
                  <div className="w-full pt-1">
                    <Button 
                      className="w-full bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-bold py-3 rounded-xl"
                      onClick={() => handleFade(bet)}
                    >
                      Fade {bet.betLine}
                    </Button>
                  </div>
                </div>
                
                {/* Separator line between cards (not after the last one) */}
                {index < betsToShow.length - 1 && (
                  <div className="flex justify-center py-4">
                    <div className="w-3/4 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/50 to-transparent"></div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* View All / Show Less Button - More Prominent */}
          {hasMoreBets && (
            <div className="flex justify-center pt-6">
              <Button
                onClick={() => setShowAll(!showAll)}
                className="bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-bold py-3 px-8 text-lg rounded-xl shadow-lg"
                style={{
                  boxShadow: "0 0 20px rgba(174, 227, 245, 0.6), 0 0 40px rgba(174, 227, 245, 0.3)"
                }}
              >
                {showAll ? `Show Top 3 Bets` : `View All ${pendingBets.length} Pending Bets`}
                {!showAll && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg bg-black p-6 text-center border border-white/10">
          <p className="text-gray-400">@{profile.username} has no active bets right now</p>
        </div>
      )}
    </div>
  );
};

export default PendingBets;
