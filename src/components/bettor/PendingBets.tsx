
import React from "react";
import { BettorBet } from "@/types/bettor";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { showTailNotification, showFadeNotification } from "@/utils/betting-notifications";
import ActionButton from "@/components/ActionButton";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type PendingBetsProps = {
  pendingBets: BettorBet[];
  className?: string;
};

const PendingBets: React.FC<PendingBetsProps> = ({ pendingBets, className }) => {
  const formatTime = (isoString: string) => {
    return format(new Date(isoString), "h:mm a");
  };

  const getConfidenceLevel = (units: number) => {
    if (units >= 5) return { label: "High", color: "bg-onetime-green/20 text-onetime-green border-onetime-green/30" };
    if (units >= 3) return { label: "Medium", color: "bg-onetime-orange/20 text-onetime-orange border-onetime-orange/30" };
    return { label: "Low", color: "bg-white/10 text-white/80 border-white/20" };
  };

  const handleTail = (bet: BettorBet) => {
    showTailNotification("Bettor", bet.teams);
  };

  const handleFade = (bet: BettorBet) => {
    showFadeNotification("Bettor", bet.teams);
  };

  return (
    <div className={cn("rounded-xl bg-onetime-darkBlue p-4 shadow-md", className)}>
      <h3 className="mb-4 text-xl font-bold text-white">Pending Bets</h3>
      
      {pendingBets.length > 0 ? (
        <div className="space-y-4">
          {pendingBets.map((bet) => {
            const confidence = getConfidenceLevel(bet.unitsRisked);
            return (
              <div 
                key={bet.id} 
                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-white/10 to-white/5 p-4 shadow-lg border border-white/10 animate-pulse-heartbeat"
              >
                {/* Accent light effect */}
                <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-onetime-purple/30 blur-xl"></div>
                
                {/* Top row: Teams & Time */}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold text-white tracking-tight">{bet.teams}</h4>
                  <span className="text-xs text-white/60">
                    {formatTime(bet.timestamp)}
                  </span>
                </div>
                
                {/* Middle row: Bet type, odds, and units */}
                <div className="flex flex-wrap items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <span className="font-medium">{bet.betType}</span>
                    <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">{bet.odds}</span>
                    <Badge variant="outline" className={cn("border", confidence.color)}>
                      {confidence.label} Confidence
                    </Badge>
                  </div>
                  <span className="font-bold text-onetime-purple">{bet.unitsRisked} units</span>
                </div>
                
                {/* Bottom row: Action buttons */}
                <div className="flex gap-2 mt-2">
                  <ActionButton 
                    variant="tail" 
                    className="h-9 py-0 text-sm"
                    onClick={() => handleTail(bet)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" /> Tail
                  </ActionButton>
                  
                  <ActionButton 
                    variant="fade" 
                    className="h-9 py-0 text-sm"
                    onClick={() => handleFade(bet)}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" /> Fade
                  </ActionButton>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-white/5 p-6 text-center border border-white/10">
          <p className="text-white/70">This user has no active bets right now</p>
        </div>
      )}
    </div>
  );
};

export default PendingBets;
