
import React from "react";
import { cn } from "@/lib/utils";

type TrendStatsProps = {
  wins: number;
  losses: number;
  betType: string;
  recentBetsLength: number;
  userCount: number;
  userAction: string;
  bettorName: string;
};

const TrendStats = ({
  wins,
  losses,
  betType,
  recentBetsLength,
  userCount,
  userAction,
  bettorName
}: TrendStatsProps) => {
  return (
    <div className="mb-4 flex flex-col justify-center items-center">
      {/* Container with padding for spacing */}
      <div className="flex flex-col items-center justify-center py-3 space-y-1">
        <span className="text-white text-sm">{userCount} users {userAction} @{bettorName}</span>
      </div>
    </div>
  );
};

export default TrendStats;
