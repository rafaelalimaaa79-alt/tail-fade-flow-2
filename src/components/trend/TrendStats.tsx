
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
  const georgiaFontStyle = { fontFamily: "Georgia, serif" };
  
  return (
    <div className="mb-4">
      <div>
        <div className="flex items-center gap-1.5 mt-2">
          <Users className="h-4 w-4 text-white/70" />
          <span className="text-base text-white/90" style={georgiaFontStyle}>
            {userCount} users {userAction}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrendStats;
