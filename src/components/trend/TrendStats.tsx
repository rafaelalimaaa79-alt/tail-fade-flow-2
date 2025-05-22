
import React from "react";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

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
  betType,
  userCount,
  userAction,
  bettorName
}: TrendStatsProps) => {
  return (
    <div className="mb-4 flex flex-col justify-center items-center space-y-3">
      {/* Record info (in bold) */}
      <p className="text-white font-extrabold text-base">
        {wins}-{losses} record with {betType} bets
      </p>
      
      {/* User count information */}
      <div className="flex items-center gap-1.5">
        <Users className="h-4 w-4 text-white/70" />
        <span className="text-white/80 text-sm">{userCount} users {userAction} @{bettorName}</span>
      </div>
    </div>
  );
};

export default TrendStats;
