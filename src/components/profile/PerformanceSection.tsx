import React from "react";
import BettorTimeFilter from "@/components/BettorTimeFilter";
import BettorPerformanceGraph from "@/components/BettorPerformanceGraph";
import { BetHistoryPoint } from "@/types/bettor";

interface PerformanceSectionProps {
  winRate: number;
  roi: number;
  profit: number;
  chartData: BetHistoryPoint[];
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y';
  setTimeframe: (timeframe: '1D' | '1W' | '1M' | '3M' | '1Y') => void;
  performanceByTimeframe: Record<'1D' | '1W' | '1M' | '3M' | '1Y', number>;
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  winRate,
  roi,
  profit,
  chartData,
  timeframe,
  setTimeframe,
  performanceByTimeframe
}) => {
  return (
    <div className="my-4 rounded-xl bg-black p-4 shadow-md border border-white/10">
      <div className="my-2">
        <div className="flex items-center justify-center mb-2">
          <h3 className="text-sm font-semibold">How You've Done Fading Other Users</h3>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="rounded-lg bg-black/30 border border-white/10 p-3 text-center">
            <p className="text-xs text-gray-400">Win Rate</p>
            <p className="text-lg font-bold text-white">{winRate}%</p>
          </div>
          <div className="rounded-lg bg-black/30 border border-white/10 p-3 text-center">
            <p className="text-xs text-gray-400">ROI</p>
            <p
              className={`text-lg font-bold ${
                roi >= 0 ? "text-onetime-green" : "text-onetime-red"
              }`}
            >
              {roi > 0 && "+"}
              {roi}%
            </p>
          </div>
          <div className="rounded-lg bg-black/30 border border-white/10 p-3 text-center">
            <p className="text-xs text-gray-400">Profit</p>
            <p
              className={`text-lg font-bold ${
                profit >= 0 ? "text-onetime-green" : "text-onetime-red"
              }`}
            >
              {profit > 0 && "+"}
              {profit}U
            </p>
          </div>
        </div>

        <div className="w-full -ml-0.5 pr-0.5">
          <BettorPerformanceGraph 
            data={chartData} 
            timeframe={timeframe}
            isPositive={profit >= 0}
            className="h-44" 
          />
        </div>

        <div className="flex justify-center mt-3">
          <BettorTimeFilter
            activeFilter={timeframe}
            onChange={setTimeframe}
            performanceByTimeframe={performanceByTimeframe}
          />
        </div>
      </div>
    </div>
  );
};

export default PerformanceSection;
