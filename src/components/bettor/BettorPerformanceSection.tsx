
import React from "react";
import { BettorSummary } from "@/types/bettor";
import BettorPerformanceGraph from "@/components/BettorPerformanceGraph";
import BettorTimeFilter from "@/components/BettorTimeFilter";

type BettorPerformanceSectionProps = {
  summary: BettorSummary;
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y';
  onTimeframeChange: (filter: '1D' | '1W' | '1M' | '3M' | '1Y') => void;
};

const BettorPerformanceSection: React.FC<BettorPerformanceSectionProps> = ({ 
  summary, 
  timeframe,
  onTimeframeChange
}) => {
  const { profile, graphData } = summary;
  const isPositivePerformance = profile.stats.unitsGained >= 0;
  
  // Extract performance by timeframe
  const performanceByTimeframe = {
    '1D': profile.stats.performanceByTimeframe?.['1D'] || 0,
    '1W': profile.stats.performanceByTimeframe?.['1W'] || 0,
    '1M': profile.stats.performanceByTimeframe?.['1M'] || 0,
    '3M': profile.stats.performanceByTimeframe?.['3M'] || 0,
    '1Y': profile.stats.performanceByTimeframe?.['1Y'] || 0
  };

  return (
    <div className="my-2 pl-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Performance</h3>
        <BettorTimeFilter
          activeFilter={timeframe}
          onChange={onTimeframeChange}
          performanceByTimeframe={performanceByTimeframe}
          className="scale-90 origin-right"
        />
      </div>

      {/* Graph positioned first now */}
      <BettorPerformanceGraph 
        data={graphData.data} 
        timeframe={timeframe}
        isPositive={isPositivePerformance}
        className="h-32" // Reduced height
      />
    </div>
  );
};

export default BettorPerformanceSection;
