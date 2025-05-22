
import React from "react";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center py-3 space-y-2">
        {/* Bet record - Now with more prominent styling */}
        <p className="text-white font-bold text-lg tracking-wide">
          {wins}-{losses} record on {betType} bets
        </p>
        
        {/* User count information */}
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-white/70" />
          <span className="text-white/80 text-sm">{userCount} users {userAction} @{bettorName}</span>
        </div>
      </div>
    </div>
  );
};

export default TrendStats;
