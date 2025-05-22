
import React from "react";
import { cn } from "@/lib/utils";

type TrendBetHistoryProps = {
  recentBets: number[];
  betType: string;
  categoryBets?: number[]; // Optional property for category-specific bets
  categoryName?: string; // Optional name of the specific category
};

const TrendBetHistory = ({
  recentBets,
  betType,
  categoryBets,
  categoryName
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
      <p className="text-xs text-white/40 uppercase font-medium text-center tracking-wide">
        {labelText}
      </p>
      
      {displayBets ? (
        <div className="flex justify-center space-x-1.5 mt-2">
          {displayBets.map((bet, index) => (
            <div 
              key={index} 
              className={cn(
                "h-6 w-6 rounded-sm flex items-center justify-center font-bold text-xs text-white",
                bet ? "bg-onetime-green" : "bg-onetime-red"
              )}
            >
              {bet ? 'W' : 'L'}
            </div>
          ))}
        </div>
      ) : (
        // Show message when not enough data is available
        <p className="text-xs text-white/50 text-center py-1">
          Not enough data for this category — check back later
        </p>
      )}
    </div>
  );
};

export default TrendBetHistory;
