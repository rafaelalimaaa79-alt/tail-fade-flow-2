import React from "react";
import { cn } from "@/lib/utils";

type TrendStatsProps = {
  wins: number;
  losses: number;
  betType: string;
  userCount: number;
  userAction: string;
  bettorName: string;
  isMostVisible: boolean;
};

const TrendStats = ({
  wins,
  losses,
  betType,
  bettorName,
  isMostVisible
}: TrendStatsProps) => {
  // Generate data-driven status line based on actual performance
  const generateStatusLine = () => {
    const total = wins + losses;
    const winRate = total > 0 ? (wins / total) : 0;

    // Not enough data
    if (total < 3) {
      return "not enough data yet.";
    }

    // Perfect or near-perfect hot streak (80%+)
    if (winRate >= 0.8 && total >= 5) {
      if (winRate === 1.0) {
        return `${total}-0 run. Auto-Tail Mode Engaged.`;
      }
      return `${wins}-${losses} on fire. cooking.`;
    }

    // Very cold streak (30% or worse)
    if (winRate <= 0.3 && total >= 5) {
      if (winRate === 0) {
        return `0-${total}. Fade Fuel Certified.`;
      }
      return `${wins}-${losses}. what are we doing.`;
    }

    // Moderate performance (40-60%)
    if (winRate >= 0.4 && winRate <= 0.6) {
      return `${wins}-${losses}. beautiful chaos.`;
    }

    // Good but not great (60-80%)
    if (winRate > 0.6 && winRate < 0.8) {
      return `${wins}-${losses}. respect the grind.`;
    }

    // Poor but not terrible (30-40%)
    if (winRate > 0.3 && winRate < 0.4) {
      return `${wins}-${losses}. tail at your own risk.`;
    }

    // Default fallback
    return `${wins}-${losses}. the numbers don't lie.`;
  };

  const statusLine = generateStatusLine();
  
  return (
    <div className="flex flex-col justify-center items-center space-y-2 mb-2">
      {/* Record info (in bold) - increased font size */}
      <p className={cn(
        "font-extrabold text-lg transition-colors duration-300",
        isMostVisible ? "text-white" : "text-gray-400"
      )}>
        {wins}-{losses} record with {betType} bets
      </p>
      
      {/* Dynamic status line - made smaller and italic */}
      <p className={cn(
        "font-medium text-sm italic text-center px-2 transition-colors duration-300",
        isMostVisible ? "text-white" : "text-gray-400"
      )}>
        @{bettorName} — {statusLine}
      </p>
    </div>
  );
};

export default TrendStats;
