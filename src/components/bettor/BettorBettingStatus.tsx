
import React from "react";
import { BettorBet } from "@/types/bettor";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type BettorBettingStatusProps = {
  className?: string;
  todayBets: BettorBet[];
  pendingBets: BettorBet[];
  upcomingBets: BettorBet[];
};

const BettorBettingStatus: React.FC<BettorBettingStatusProps> = ({
  className,
  todayBets,
  pendingBets,
  upcomingBets,
}) => {
  const formatTime = (isoString: string) => {
    return format(new Date(isoString), "h:mm a");
  };
  
  return (
    <div className={cn("rounded-xl bg-black/30 border border-white/10 p-4 shadow-md", className)}>
      <h3 className="mb-3 text-base font-bold text-white">Bettor's Activity</h3>
      
      <div className="space-y-4">
        {/* Today's bets */}
        <div>
          <h4 className="text-sm font-semibold text-white/80">Today's Bets ({todayBets.length})</h4>
          {todayBets.length > 0 ? (
            <div className="mt-2 space-y-2">
              {todayBets.map(bet => (
                <div key={bet.id} className="rounded-md bg-white/5 p-2 text-xs">
                  <div className="flex justify-between">
                    <span>{bet.teams}</span>
                    <span className={bet.result === 'W' ? 'text-green-400' : bet.result === 'L' ? 'text-red-400' : 'text-gray-400'}>
                      {bet.result === 'W' ? 'Win' : bet.result === 'L' ? 'Loss' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-white/60">{bet.betType} ({bet.odds})</span>
                    <span>{bet.unitsRisked} units</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs text-white/50">No bets placed today</p>
          )}
        </div>
        
        {/* Pending bets */}
        <div>
          <h4 className="text-sm font-semibold text-white/80">Pending Bets ({pendingBets.length})</h4>
          {pendingBets.length > 0 ? (
            <div className="mt-2 space-y-2">
              {pendingBets.map(bet => (
                <div key={bet.id} className="rounded-md bg-white/5 p-2 text-xs">
                  <div className="flex justify-between">
                    <span>{bet.teams}</span>
                    <span className="text-white/60">{formatTime(bet.timestamp)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-white/60">{bet.betType} ({bet.odds})</span>
                    <span>{bet.unitsRisked} units</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs text-white/50">No pending bets</p>
          )}
        </div>
        
        {/* Upcoming bets */}
        <div>
          <h4 className="text-sm font-semibold text-white/80">Plans to Bet ({upcomingBets.length})</h4>
          {upcomingBets.length > 0 ? (
            <div className="mt-2 space-y-2">
              {upcomingBets.map(bet => (
                <div key={bet.id} className="rounded-md bg-white/5 p-2 text-xs">
                  <div className="flex justify-between">
                    <span>{bet.teams}</span>
                    <span className="text-white/60">{formatTime(bet.timestamp)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-white/60">{bet.betType} ({bet.odds})</span>
                    <span>{bet.unitsRisked} units</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs text-white/50">No upcoming bets announced</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BettorBettingStatus;
