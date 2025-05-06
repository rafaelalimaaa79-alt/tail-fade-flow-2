
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
    <div className="my-6">
      <h3 className="mb-2 text-sm font-semibold">Performance</h3>
      <BettorPerformanceGraph 
        data={graphData.data} 
        timeframe={timeframe}
        isPositive={isPositivePerformance} 
      />
      
      <div className="mb-4 flex justify-between text-sm">
        <span className="text-gray-500">Total Bets: {profile.stats.totalBets}</span>
      </div>
    </div>
  );
};

export default BettorPerformanceSection;
