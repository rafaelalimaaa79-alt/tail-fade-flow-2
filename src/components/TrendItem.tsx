import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import TrendVisibilityWrapper from "./trend/TrendVisibilityWrapper";
import TrendItemContent from "./trend/TrendItemContent";
import { getOppositeBet } from "@/utils/bet-conversion";
import { showFadeNotification } from "@/utils/betting-notifications";
import { DbBetRecord, calculateBetLine, getOppositeBetLine, getMatchupInfo } from "@/utils/betLineParser";
import { BettorStats, generateStatline } from "@/utils/bettorStatsCalculator";

type TrendItemProps = {
  id: string;
  name: string;
  bet: DbBetRecord;
  stats?: BettorStats;
  fadeConfidence?: number;
  sportStatline?: string;
  unitPerformance?: number;
};

const TrendItem = ({
  id,
  name,
  bet,
  stats,
  fadeConfidence,
  sportStatline = "Loading...",
  unitPerformance = 0,
}: TrendItemProps) => {
  // Use provided sportStatline if available, otherwise generate from stats
  const calculatedStatline = sportStatline || (stats && stats.totalBets > 0
    ? `He is ${generateStatline(stats)}`
    : "No betting history");
  
  // Use fadeConfidence from stats if not explicitly provided
  const finalFadeConfidence = fadeConfidence ?? stats?.fadeConfidence ?? 75;
  
  // Calculate bet lines from database record
  const betLine = calculateBetLine(bet);
  const oppositeBet = getOppositeBetLine(bet);
  const matchup = getMatchupInfo(bet);
  
  // Handle bet button click
  const handleBetClick = () => {
    console.log("Bet button clicked for:", name, oppositeBet);
    showFadeNotification(name, oppositeBet);
  };
  
  return (
    <TrendVisibilityWrapper>
      {(isVisible, isMostVisible) => (
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
            sportStatline={calculatedStatline}
            fadeConfidence={finalFadeConfidence}
            oppositeBet={oppositeBet}
            onBetClick={handleBetClick}
            isMostVisible={isMostVisible}
          />
        </Card>
      )}
    </TrendVisibilityWrapper>
  );
};

export default TrendItem;
