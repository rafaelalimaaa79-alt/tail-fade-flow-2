
import React from "react";
import { cn } from "@/lib/utils";

type TrendStatsProps = {
  wins: number;
  losses: number;
  betType: string;
  userCount: number;
  userAction: string;
  bettorName: string;
};

const TrendStats = ({
  wins,
  losses,
  betType
}: TrendStatsProps) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2 mb-2">
      {/* Record info (in bold) - always display in the same format */}
      <p className="text-white font-extrabold text-base">
        {wins}-{losses} record with {betType} bets
      </p>
    </div>
  );
};

export default TrendStats;
