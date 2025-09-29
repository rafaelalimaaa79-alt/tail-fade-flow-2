
import React from "react";
import TrendItem from "@/components/TrendItem";

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
};

type TrendsListProps = {
  trendData: TrendData[];
};

const TrendsList = ({ trendData }: TrendsListProps) => {
  // Sort the trend data by confidence score (either tailScore or fadeScore)
  const sortedTrendData = [...trendData].sort((a, b) => {
    const scoreA = a.isTailRecommendation ? a.tailScore : a.fadeScore;
    const scoreB = b.isTailRecommendation ? b.tailScore : b.fadeScore;
    return scoreB - scoreA; // Sort in descending order
  });
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mx-auto">
      {sortedTrendData.map((trend) => (
        <TrendItem
          key={trend.id}
          id={trend.id}
          name={trend.name}
          betDescription={trend.betDescription}
          betType={trend.betType}
          reason={trend.reason}
          isTailRecommendation={trend.isTailRecommendation}
          recentBets={trend.recentBets}
          unitPerformance={trend.unitPerformance}
          tailScore={trend.tailScore}
          fadeScore={trend.fadeScore}
          userCount={trend.userCount}
          categoryBets={trend.categoryBets}
          categoryName={trend.categoryName}
        />
      ))}
    </div>
  );
};

export default TrendsList;
