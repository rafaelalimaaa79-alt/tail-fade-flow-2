
import React from "react";
import { cn } from "@/lib/utils";

type TrendBetHistoryProps = {
  recentBets: number[];
  betType: string;
};

const TrendBetHistory = ({
  recentBets,
  betType
}: TrendBetHistoryProps) => {
  return (
    <div>
      <p className="text-xs text-white/50 mb-2 text-center">Last {recentBets.length} {betType} bets</p>
      <div className="flex justify-center space-x-1.5">
        {recentBets.map((bet, index) => (
          <div 
            key={index} 
            className={cn(
              "h-6 w-6 rounded-sm flex items-center justify-center font-bold text-xs text-white",
              bet ? "bg-onetime-green" : "bg-onetime-red"
            )}
          >
            {bet ? 'W' : 'L'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendBetHistory;
