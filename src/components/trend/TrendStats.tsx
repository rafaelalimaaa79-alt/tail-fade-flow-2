
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
};

const TrendStats = ({
  wins,
  losses,
  betType,
  recentBetsLength,
  userCount,
  userAction
}: TrendStatsProps) => {
  const recordText = `${wins}–${losses} in last ${recentBetsLength} ${betType} bets`;
  
  return (
    <div className="mb-4">
      <div className="flex flex-col space-y-2">
        <div>
          <div className="font-medium">
            <span className={cn(
              "font-bold",
              wins > losses ? "text-onetime-green" : "text-onetime-red"
            )}>
              {recordText}
            </span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-white/70" />
            <span className="text-sm text-white/90">{userCount} users {userAction}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendStats;
