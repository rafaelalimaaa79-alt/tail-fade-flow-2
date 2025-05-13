
import React from "react";
import { BettorBet } from "@/types/bettor";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { showTailNotification, showFadeNotification } from "@/utils/betting-notifications";
import ActionButton from "@/components/ActionButton";
import { ThumbsUp, ThumbsDown, Clock, Star } from "lucide-react";

type PendingBetsProps = {
  pendingBets: BettorBet[];
  className?: string;
};

const PendingBets: React.FC<PendingBetsProps> = ({ pendingBets, className }) => {
  const formatTime = (isoString: string) => {
    return format(new Date(isoString), "h:mm a");
  };

  // Function to generate a confidence score and its styling
  const getConfidenceScore = (bet: BettorBet) => {
    // In a real app, this would come from actual confidence scores stored in the bet data
    // For now, we'll use units risked as a proxy for confidence
    const unitsRisked = bet.unitsRisked;
    
    // Calculate a score based on units risked (1-5 -> 0-100%)
    const score = Math.min(Math.round((unitsRisked / 5) * 100), 100);
    
    let colorClass = "";
    if (score >= 70) {
      colorClass = "text-onetime-green";
    } else if (score >= 50) {
      colorClass = "text-onetime-orange"; 
    } else {
      colorClass = "text-onetime-red";
    }
    
    return {
      score,
      colorClass
    };
  };

  const handleTail = (bet: BettorBet) => {
    showTailNotification("Bettor", bet.betType);
  };

  const handleFade = (bet: BettorBet) => {
    showFadeNotification("Bettor", bet.betType);
  };

  return (
    <div className={cn("rounded-xl bg-black/30 p-4 shadow-md relative animate-glow-pulse-purple overflow-hidden border border-onetime-purple/30", className)}>
      <div className="absolute inset-0 bg-onetime-purple/5 backdrop-blur-sm pointer-events-none"></div>
      <h3 className="mb-5 text-xl font-bold text-white text-center relative inline-block left-1/2 transform -translate-x-1/2 z-10">
        Pending Bets
        <div className="h-1 w-20 bg-gradient-to-r from-onetime-purple/80 to-transparent rounded-full mx-auto mt-1"></div>
      </h3>
      
      {pendingBets.length > 0 ? (
        <div className="space-y-4 relative z-10">
          {pendingBets.map((bet) => {
            const confidenceData = getConfidenceScore(bet);
            
            return (
              <div 
                key={bet.id} 
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-black/40 via-black/30 to-transparent p-4 shadow-lg border border-white/10 transition-all duration-300 hover:border-onetime-purple/50"
              >
                {/* Interactive blob effects in background */}
                <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-onetime-purple/20 blur-xl"></div>
                <div className="absolute bottom-0 left-6 h-20 w-20 rounded-full bg-onetime-orange/10 blur-xl"></div>
                
                {/* Bet Type as prominent header */}
                <div className="mb-4 text-center">
                  <h4 className="text-xl font-extrabold text-white tracking-tight relative z-10 font-rajdhani">
                    {bet.betType}
                    <div className="h-1 w-16 bg-gradient-to-r from-onetime-purple via-onetime-purple/80 to-transparent rounded-full mx-auto mt-1"></div>
                  </h4>
                </div>
                
                {/* Confidence percentage in top right with same style as time was */}
                <div className={`absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5 text-xl font-bold backdrop-blur-sm border border-white/10 ${confidenceData.colorClass}`}>
                  <span>{confidenceData.score}%</span>
                </div>
                
                {/* Middle row with enhanced styling - REMOVED confidence score since it's now in top right */}
                <div className="flex flex-wrap items-center justify-center mb-4 relative z-10">
                  <div className="flex flex-col items-center">
                    {/* Removed confidence score display as it's now in the top right */}
                  </div>
                </div>
                
                {/* Bottom row: Action buttons with enhanced styling */}
                <div className="flex gap-2 mt-3 justify-center relative z-10">
                  <ActionButton 
                    variant="tail" 
                    className="h-10 py-0 text-sm shadow-lg shadow-onetime-purple/10 group relative overflow-hidden"
                    onClick={() => handleTail(bet)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <ThumbsUp className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform" /> Tail
                  </ActionButton>
                  
                  <ActionButton 
                    variant="fade" 
                    className="h-10 py-0 text-sm shadow-lg shadow-onetime-purple/10 group relative overflow-hidden"
                    onClick={() => handleFade(bet)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <ThumbsDown className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform" /> Fade
                  </ActionButton>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-black/20 p-6 text-center border border-white/10 relative z-10">
          <p className="text-white/70">This user has no active bets right now</p>
        </div>
      )}
    </div>
  );
};

export default PendingBets;
