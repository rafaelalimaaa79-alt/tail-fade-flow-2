
import React from "react";
import { BettorSummary } from "@/types/bettor";
import BettorPerformanceGraph from "@/components/BettorPerformanceGraph";

type BettorPerformanceSectionProps = {
  summary: BettorSummary;
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y';
};

const BettorPerformanceSection: React.FC<BettorPerformanceSectionProps> = ({ 
  summary, 
  timeframe 
}) => {
  const { profile, graphData } = summary;
  const isPositivePerformance = profile.stats.unitsGained >= 0;

  return (
    <div className="my-3">
      <h3 className="mb-1 text-sm font-semibold">Performance</h3>
      <BettorPerformanceGraph 
        data={graphData.data} 
        timeframe={timeframe}
        isPositive={isPositivePerformance}
        className="h-32" // Reduced height
      />
      
      <div className="mt-1 text-xs text-gray-400">
        Total Bets: {profile.stats.totalBets}
      </div>
    </div>
  );
};

export default BettorPerformanceSection;
