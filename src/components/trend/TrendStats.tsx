
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
    <div className="mb-4 flex flex-col justify-center items-center">
      {/* Container with padding to create space above and below */}
      <div className="flex flex-col items-center justify-center py-3">
        <span className="text-white text-sm">8-2 in last 10 bets with consistent NBA picks</span>
      </div>
    </div>
  );
};

export default TrendStats;
