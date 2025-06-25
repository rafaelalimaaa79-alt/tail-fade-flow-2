import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import TrendVisibilityWrapper from "./trend/TrendVisibilityWrapper";
import TrendItemContent from "./trend/TrendItemContent";
import TrendItemWithInlineChat from "./TrendItemWithInlineChat";
import { getOppositeBet } from "@/utils/bet-conversion";
import { showFadeNotification } from "@/utils/betting-notifications";
import { getFadeConfidence, getMatchup, getBetLine, getSportStatline } from "@/utils/trend-helpers";

type TrendItemProps = {
  id: string;
  name: string;
  betDescription: string;
  betType: string;
  reason: string;
  isTailRecommendation: boolean;
  recentBets: number[];
  unitPerformance: number;
  tailScore?: number;
  fadeScore?: number;
  userCount?: number;
  categoryBets?: number[];
  categoryName?: string;
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
  tailScore = 75,
  fadeScore = 80,
  userCount = 210,
  categoryBets,
  categoryName,
}: TrendItemProps) => {
  // Calculate win-loss record
  const wins = recentBets.filter(bet => bet === 1).length;
  const losses = recentBets.filter(bet => bet === 0).length;
  const score = isTailRecommendation ? tailScore : fadeScore;
  
  const fadeConfidence = getFadeConfidence();
  const matchup = getMatchup();
  const betLine = getBetLine(matchup.teams);
  const sportStatline = getSportStatline(matchup.sport);
  
  // Get the opponent team for the bet conversion
  const opponentTeam = matchup.teams.find(team => !betLine.includes(team));
  const oppositeBet = getOppositeBet(betLine, opponentTeam);
  
  // Handle bet button click
  const handleBetClick = () => {
    console.log("Bet button clicked for:", name, oppositeBet);
    showFadeNotification(name, oppositeBet);
  };
  
  return (
    <TrendVisibilityWrapper>
      {(isVisible, isMostVisible) => (
        <TrendItemWithInlineChat
          trendId={id}
          trendTitle={name}
          isMostVisible={isMostVisible}
        >
          <Card 
            className={cn(
              "rounded-lg bg-card shadow-md overflow-hidden min-h-[280px] flex flex-col transition-all duration-300 relative",
              isMostVisible ? "border-onetime-red" : "border-gray-500",
              !isMostVisible && "grayscale"
            )}
            style={isMostVisible ? {
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.7)"
            } : undefined}
          >
            <TrendItemContent
              matchup={matchup}
              name={name}
              betLine={betLine}
              sportStatline={sportStatline}
              fadeConfidence={fadeConfidence}
              oppositeBet={oppositeBet}
              onBetClick={handleBetClick}
              isMostVisible={isMostVisible}
            />
          </Card>
        </TrendItemWithInlineChat>
      )}
    </TrendVisibilityWrapper>
  );
};

export default TrendItem;
