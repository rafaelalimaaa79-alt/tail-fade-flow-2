
import React from "react";
import { Switch } from "@/components/ui/switch";
import { BettorBet } from "@/types/bettor";
import { cn } from "@/lib/utils";

type BettorBetListProps = {
  biggestWinners: BettorBet[];
  largestBets: BettorBet[];
  showLargestBets: boolean;
  onToggleChange: (value: boolean) => void;
  className?: string;
};

const BettorBetList: React.FC<BettorBetListProps> = ({
  biggestWinners,
  largestBets,
  showLargestBets,
  onToggleChange,
  className
}) => {
  const betsToShow = showLargestBets ? largestBets : biggestWinners;
  
  return (
    <div className={cn("rounded-xl bg-white p-4 shadow-md", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">
          {showLargestBets ? "Largest 10 Bets" : "Biggest Winners"}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className={`text-xs ${!showLargestBets ? 'font-bold' : 'text-gray-500'}`}>
            Big Winners
          </span>
          <Switch 
            checked={showLargestBets}
            onCheckedChange={onToggleChange}
            className="data-[state=checked]:bg-onetime-purple"
          />
          <span className={`text-xs ${showLargestBets ? 'font-bold' : 'text-gray-500'}`}>
            Largest Bets
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {betsToShow.map((bet, index) => (
          <div 
            key={bet.id}
            className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">
                {index + 1}
              </div>
              <div>
                <p className="font-medium">{bet.betType}</p>
                <p className="text-xs text-gray-500">{bet.odds}</p>
              </div>
            </div>
            
            <div className={cn(
              "font-bold",
              bet.unitsWonLost > 0 ? "text-onetime-green" : "text-onetime-red"
            )}>
              {bet.unitsWonLost > 0 ? '+' : ''}{bet.unitsWonLost}U
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BettorBetList;
