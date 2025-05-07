
import React from "react";
import { BettorBet } from "@/types/bettor";
import { cn } from "@/lib/utils";

type TodaysBetsProps = {
  todayBets: BettorBet[];
  className?: string;
};

const TodaysBets: React.FC<TodaysBetsProps> = ({ todayBets, className }) => {
  return (
    <div className={cn("rounded-xl bg-onetime-darkBlue p-4 shadow-md", className)}>
      <h3 className="mb-3 text-lg font-bold text-white">Today's Bets</h3>
      
      {todayBets.length > 0 ? (
        <div className="space-y-2">
          {todayBets.map(bet => (
            <div key={bet.id} className="rounded-md bg-white/10 p-3">
              <div className="flex justify-between">
                <span className="font-medium text-white">{bet.teams}</span>
                <span className={cn(
                  "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium",
                  bet.result === 'W' ? 'bg-green-100 text-green-800' : 
                  bet.result === 'L' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                )}>
                  {bet.result === 'W' ? 'Won' : bet.result === 'L' ? 'Lost' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <div className="text-sm text-white/80">
                  <span className="font-medium">{bet.betType}</span>
                  <span className="mx-1 text-white/60">•</span>
                  <span>{bet.odds}</span>
                </div>
                <span className="text-sm font-medium text-white/80">{bet.unitsRisked} units</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md bg-white/5 p-4 text-center">
          <p className="text-white/70">No bets placed today</p>
        </div>
      )}
    </div>
  );
};

export default TodaysBets;
