
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import TrendHeader from "./trend/TrendHeader";
import TrendReason from "./trend/TrendReason";
import TrendStats from "./trend/TrendStats";
import TrendAction from "./trend/TrendAction";
import TrendBetHistory from "./trend/TrendBetHistory";
import TrendVisibilityWrapper from "./trend/TrendVisibilityWrapper";
import { Button } from "@/components/ui/button";

type TrendItemProps = {
  id: string;
  name: string;
  betDescription: string;
  betType: string;
  reason: string;
  isTailRecommendation: boolean;
  recentBets: number[]; // 1 = win, 0 = loss
  unitPerformance: number;
  tailScore?: number; // Optional score for tail recommendation
  fadeScore?: number; // Optional score for fade recommendation
  userCount?: number; // Number of users tailing or fading
  categoryBets?: number[]; // Added: category-specific bet history
  categoryName?: string; // Added: specific category name (e.g., "NBA O/U")
};

const TrendItem = ({
  id,
  name,
  betDescription,
  betType,
  reason,
  isTailRecommendation,
  recentBets,
  unitPerformance,
  tailScore = 75, // Default value
  fadeScore = 80, // Default value
  userCount = 210, // Default value
  categoryBets, // New prop
  categoryName, // New prop
}: TrendItemProps) => {
  // Calculate win-loss record
  const wins = recentBets.filter(bet => bet === 1).length;
  const losses = recentBets.filter(bet => bet === 0).length;
  const score = isTailRecommendation ? tailScore : fadeScore;
  
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

  // Function to generate sport-specific statlines
  const getSportStatline = (sport: string) => {
    const wins = Math.floor(Math.random() * 10) + 1; // 1-10 wins
    const totalBets = wins + Math.floor(Math.random() * 15) + 3; // Add 3-17 more bets
    
    const sportStatlines = {
      "NBA": `He is ${wins} for ${totalBets} in his last ${totalBets} NBA bets`,
      "NFL": `He is ${wins} for ${totalBets} in his last ${totalBets} NFL bets`,
      "MLB": `He is ${wins} for ${totalBets} in his last ${totalBets} MLB bets`,
      "NHL": `He is ${wins} for ${totalBets} in his last ${totalBets} NHL bets`,
      "UFC": `He is ${wins} for ${totalBets} in his last ${totalBets} UFC fights`
    };
    
    return sportStatlines[sport as keyof typeof sportStatlines] || `He is ${wins} for ${totalBets} in his last ${totalBets} bets`;
  };

  const fadeConfidence = getFadeConfidence();
  const matchup = getMatchup();
  const betLine = getBetLine(matchup.teams);
  const sportStatline = getSportStatline(matchup.sport);
  
  return (
    <div className="block mb-4">
      <TrendVisibilityWrapper>
        {(isVisible, isMostVisible) => (
          <Card 
            className={cn(
              "rounded-lg bg-card shadow-md overflow-hidden min-h-[280px] flex flex-col transition-all duration-300",
              isMostVisible ? "border-onetime-red" : "border-gray-500",
              !isMostVisible && "grayscale"
            )}
            style={isMostVisible ? {
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.7)"
            } : undefined}
          >
            <div 
              className="bg-black rounded-xl p-3 border border-[#AEE3F5]/30 animate-glow-pulse space-y-2 flex-grow flex flex-col"
              style={{
                boxShadow: isMostVisible ? '0 0 15px rgba(174, 227, 245, 0.3)' : 'none',
              }}
            >
              {/* Game header with solid icy blue underline */}
              <div className="text-center pb-1">
                <h3 className="text-2xl font-bold text-white relative inline-block">
                  {matchup.game}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#AEE3F5] opacity-90"></div>
                </h3>
              </div>
              
              {/* Bettor's pick */}
              <div className="text-center py-1">
                <p className="text-lg font-bold">
                  <span className="text-[#AEE3F5]">@{name}</span>
                  <span className="text-white"> is on {betLine}</span>
                </p>
              </div>
              
              {/* Sport-specific statline */}
              <div className="text-center py-1">
                <p className="text-lg font-medium text-gray-400 italic">
                  {sportStatline}
                </p>
              </div>
              
              {/* Divider line */}
              <div className="flex justify-center py-1">
                <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
              </div>
              
              {/* Fade confidence */}
              <div className="text-center py-1">
                <p className="text-lg font-semibold text-gray-300">
                  Fade Confidence: <span className="text-[#AEE3F5] font-bold">{fadeConfidence}%</span>
                </p>
              </div>
              
              {/* Spacer to push button to bottom */}
              <div className="flex-grow"></div>
              
              {/* Fade button */}
              <div className="w-full pt-1">
                <Button 
                  className={cn(
                    "w-full font-bold py-3 rounded-xl transition-all duration-300",
                    isMostVisible 
                      ? "bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black"
                      : "bg-gray-600 hover:bg-gray-500 text-gray-300"
                  )}
                >
                  Fade {betLine}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </TrendVisibilityWrapper>
    </div>
  );
};

export default TrendItem;
