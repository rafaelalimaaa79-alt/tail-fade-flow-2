
import React from "react";
import TrendItem from "@/components/TrendItem";
import { DbBetRecord } from "@/utils/betLineParser";
import { BettorStats } from "@/utils/bettorStatsCalculator";

export type TrendData = {
  id: string;
  name: string;
  betDescription: string;
  betType: string;
  isTailRecommendation: boolean;
  reason: string;
  recentBets: number[];
  unitPerformance: number;
  tailScore?: number;
  fadeScore?: number;
  userCount?: number;
  categoryBets?: number[]; // Added for category-specific bets
  categoryName?: string;   // Added for the category name
  bet?: DbBetRecord;       // Full bet record from database
  stats?: BettorStats;     // Bettor statistics
  sportStatline?: string;  // Stat line
};

type TrendsListProps = {
  trendData: TrendData[];
};

const TrendsList = ({ trendData }: TrendsListProps) => {
  // Sort the trend data by confidence score (either tailScore or fadeScore)
  const sortedTrendData = [...trendData].sort((a, b) => {
    const scoreA = a.isTailRecommendation ? (a.tailScore || 0) : (a.fadeScore || 0);
    const scoreB = b.isTailRecommendation ? (b.tailScore || 0) : (b.fadeScore || 0);
    return scoreB - scoreA; // Sort in descending order
  });
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mx-auto">
      {sortedTrendData.map((trend) => {
        // Skip if no bet record
        if (!trend.bet) {
          console.warn("Skipping trend without bet record:", trend.id);
          return null;
        }

        return (
          <TrendItem
            key={trend.id}
            id={trend.id}
            name={trend.name}
            bet={trend.bet}
            stats={trend.stats}
            fadeConfidence={trend.fadeScore}
            sportStatline={trend.sportStatline}
            unitPerformance={trend.unitPerformance}
          />
        );
      })}
    </div>
  );
};

export default TrendsList;
