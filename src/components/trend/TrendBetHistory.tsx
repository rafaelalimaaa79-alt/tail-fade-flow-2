
import React from "react";
import { cn } from "@/lib/utils";

type TrendBetHistoryProps = {
  recentBets: number[];
  betType: string;
  categoryBets?: number[]; // Optional property for category-specific bets
  categoryName?: string; // Optional name of the specific category
  isMostVisible: boolean;
};

const TrendBetHistory = ({
  recentBets,
  betType,
  categoryBets,
  categoryName,
  isMostVisible
}: TrendBetHistoryProps) => {
  // Use category-specific bets if available, otherwise fall back to general recentBets
  const betsToShow = categoryBets || recentBets;
  const displayBets = betsToShow.length > 0 ? betsToShow : null;
  
  // Create the label text based on available data and actual number of bets
  const labelText = categoryName 
    ? `LAST ${betsToShow.length} ${categoryName.toUpperCase()} BETS`
    : `LAST ${betsToShow.length} ${betType} BETS`;
  
  return (
    <div>
      {/* Dynamic label above the bet history */}
      <p className={cn(
        "text-xs uppercase font-medium text-center tracking-wide mb-1 transition-colors duration-300",
        isMostVisible ? "text-white/40" : "text-gray-500"
      )}>
        {labelText}
      </p>
      
      {displayBets ? (
        <div className="flex justify-center space-x-1.5">
          {displayBets.map((bet, index) => (
            <div 
              key={index} 
              className={cn(
                "h-6 w-6 rounded-sm flex items-center justify-center font-bold text-xs transition-all duration-300",
                isMostVisible 
                  ? (bet ? "bg-[#C4D7DC] text-black" : "bg-[#AEE3F5] text-black")
                  : (bet ? "bg-gray-600 text-gray-300" : "bg-gray-700 text-gray-400")
              )}
            >
              {bet ? 'W' : 'L'}
            </div>
          ))}
        </div>
      ) : (
        // Show message when not enough data is available
        <p className={cn(
          "text-xs text-center py-1 transition-colors duration-300",
          isMostVisible ? "text-white/50" : "text-gray-500"
        )}>
          Not enough data for this category — check back later
        </p>
      )}
    </div>
  );
};

export default TrendBetHistory;
