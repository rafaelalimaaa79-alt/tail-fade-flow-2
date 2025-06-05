
import React from "react";
import { BettorBet } from "@/types/bettor";
import { cn } from "@/lib/utils";

type TodaysBetsProps = {
  todayBets: BettorBet[];
  className?: string;
};

const TodaysBets: React.FC<TodaysBetsProps> = ({ todayBets, className }) => {
  return (
    <div className={cn("rounded-xl bg-black border border-white/10 p-4 shadow-md", className)}>
      <h3 className="mb-3 text-lg font-bold text-white">Today's Bets</h3>
      
      {todayBets.length > 0 ? (
        <div className="space-y-2">
          {todayBets.map(bet => (
            <div key={bet.id} className="rounded-md bg-black/50 border border-white/10 p-3">
              <div className="flex justify-between">
                <span className="font-medium text-white">{bet.teams}</span>
                <span className={cn(
                  "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium",
                  bet.result === 'W' ? 'bg-black/50 text-white border border-white' : 
                  bet.result === 'L' ? 'bg-[#AEE3F5]/20 text-[#AEE3F5] border border-[#AEE3F5]/30' : 
                  'bg-yellow-900/60 text-yellow-400 border border-yellow-500/30'
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
        <div className="rounded-md bg-black/50 border border-white/10 p-4 text-center">
          <p className="text-white/70">No bets placed today</p>
        </div>
      )}
    </div>
  );
};

export default TodaysBets;
