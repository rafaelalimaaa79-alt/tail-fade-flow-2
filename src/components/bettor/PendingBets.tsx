
import React, { useRef } from "react";
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
    if (units >= 5) return { label: "High", score: 85, color: "bg-onetime-green/20 text-onetime-green border-onetime-green/30" };
    if (units >= 3) return { label: "Medium", score: 65, color: "bg-onetime-orange/20 text-onetime-orange border-onetime-orange/30" };
    return { label: "Low", score: 40, color: "bg-white/10 text-white/80 border-white/20" };
  };

  const handleTail = (bet: BettorBet, buttonElement: HTMLButtonElement | null) => {
    showTailNotification("Bettor", bet.betType, buttonElement);
  };

  const handleFade = (bet: BettorBet, buttonElement: HTMLButtonElement | null) => {
    showFadeNotification("Bettor", bet.betType, buttonElement);
  };

  return (
    <div className={cn("rounded-xl bg-onetime-darkBlue p-4 shadow-md", className)}>
      <h3 className="mb-4 text-xl font-bold text-white">Pending Bets</h3>
      
      {pendingBets.length > 0 ? (
        <div className="space-y-4">
          {pendingBets.map((bet) => {
            const confidence = getConfidenceLevel(bet.unitsRisked);
            // Calculate potential win amount (simple calculation for demonstration)
            const potentialWin = parseFloat(bet.odds) > 0 
              ? (bet.unitsRisked * parseFloat(bet.odds) / 100).toFixed(1)
              : (bet.unitsRisked * 100 / Math.abs(parseFloat(bet.odds))).toFixed(1);
            
            const tailButtonRef = useRef<HTMLButtonElement>(null);
            const fadeButtonRef = useRef<HTMLButtonElement>(null);
            
            return (
              <div 
                key={bet.id} 
                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-white/10 to-white/5 p-4 shadow-lg border border-white/10 animate-pulse-heartbeat"
              >
                {/* Accent light effect */}
                <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-onetime-purple/30 blur-xl"></div>
                
                {/* Top row: Bet Type as header & Time */}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold text-white tracking-tight">{bet.betType}</h4>
                  <span className="text-xs text-white/60">
                    {formatTime(bet.timestamp)}
                  </span>
                </div>
                
                {/* Middle row: Units and potential win */}
                <div className="flex flex-wrap items-center justify-between mb-3">
                  <div className="text-sm text-white/80">
                    <span className="font-medium">{bet.unitsRisked} units to win {potentialWin}</span>
                  </div>
                  <Badge variant="outline" className={cn("border", confidence.color)}>
                    {confidence.score}%
                  </Badge>
                </div>
                
                {/* Bottom row: Action buttons */}
                <div className="flex gap-2 mt-2">
                  <ActionButton 
                    ref={tailButtonRef}
                    variant="tail" 
                    className="h-9 py-0 text-sm"
                    onClick={() => handleTail(bet, tailButtonRef.current)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" /> Tail
                  </ActionButton>
                  
                  <ActionButton 
                    ref={fadeButtonRef}
                    variant="fade" 
                    className="h-9 py-0 text-sm"
                    onClick={() => handleFade(bet, fadeButtonRef.current)}
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
