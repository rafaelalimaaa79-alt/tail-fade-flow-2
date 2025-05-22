
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
      {/* Empty container with padding preserved for spacing */}
      <div className="flex flex-col items-center justify-center py-3">
        {/* Text line removed */}
      </div>
    </div>
  );
};

export default TrendStats;
