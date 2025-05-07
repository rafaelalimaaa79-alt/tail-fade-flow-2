
import React from "react";
import { BettorBet } from "@/types/bettor";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type PendingBetsProps = {
  pendingBets: BettorBet[];
  className?: string;
};

const PendingBets: React.FC<PendingBetsProps> = ({ pendingBets, className }) => {
  const formatTime = (isoString: string) => {
    return format(new Date(isoString), "h:mm a");
  };

  return (
    <div className={cn("rounded-xl bg-onetime-darkBlue p-4 shadow-md", className)}>
      <h3 className="mb-3 text-lg font-bold text-white">Pending Bets</h3>
      
      {pendingBets.length > 0 ? (
        <div className="space-y-2">
          {pendingBets.map(bet => (
            <div key={bet.id} className="rounded-md bg-white/10 p-3">
              <div className="flex justify-between">
                <span className="font-medium text-white">{bet.teams}</span>
                <span className="text-white/60">{formatTime(bet.timestamp)}</span>
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
          <p className="text-white/70">This user has no active bets right now</p>
        </div>
      )}
    </div>
  );
};

export default PendingBets;
