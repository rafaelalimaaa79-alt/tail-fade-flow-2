
import React from "react";
import { cn } from "@/lib/utils";

type TrendStatsProps = {
  wins: number;
  losses: number;
  betType: string;
  recentBetsLength: number;
  userCount: number;
  userAction: string;
};

const TrendStats = ({
  wins,
  losses,
  betType,
  recentBetsLength,
  userCount,
  userAction
}: TrendStatsProps) => {
  return (
    <div className="my-6 flex justify-center">
      <div 
        className="px-4 py-2 rounded-md bg-black/40 backdrop-blur-sm border border-white/10"
      >
        <span 
          className="font-rajdhani text-white/90 text-lg tracking-wider font-medium"
          style={{ 
            textShadow: "0 0 8px rgba(255, 255, 255, 0.3)"
          }}
        >
          {wins}-{losses} record on {betType} bets
        </span>
      </div>
    </div>
  );
};

export default TrendStats;
