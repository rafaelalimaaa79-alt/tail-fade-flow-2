
import React from "react";
import { BettorBet, BettorProfile } from "@/types/bettor";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { showFadeNotification } from "@/utils/betting-notifications";
import ActionButton from "@/components/ActionButton";
import { ThumbsUp, ThumbsDown, Clock, Star } from "lucide-react";

type PendingBetsProps = {
  pendingBets: BettorBet[];
  profile: BettorProfile;
  className?: string;
};

const PendingBets: React.FC<PendingBetsProps> = ({ pendingBets, profile, className }) => {
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

  const handleFade = (bet: BettorBet) => {
    showFadeNotification("Bettor", bet.betType);
  };

  return (
    <div className={cn("rounded-xl bg-black p-6 shadow-2xl relative overflow-hidden border border-white/10", className)}>
      <h3 className="mb-6 text-xl font-bold text-cyan-400 text-center relative z-10">
        Pending Bets
      </h3>
      
      {pendingBets.length > 0 ? (
        <div className="space-y-4 relative z-10">
          {pendingBets.map((bet) => {
            const confidenceData = getConfidenceScore(bet);
            
            return (
              <div 
                key={bet.id} 
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-black via-gray-900/80 to-black/60 p-4 shadow-xl border border-white/10"
              >
                {/* Game information at the top */}
                <div className="mb-4 text-center">
                  <h4 className="text-xl font-bold text-white">
                    {bet.teams}
                  </h4>
                </div>
                
                {/* Username's bet */}
                <div className="mb-4 text-center">
                  <p className="text-sm text-cyan-400/80 mb-1">@{profile.username}'s Bet:</p>
                  <p className="text-lg font-bold text-white">
                    {bet.betType}
                  </p>
                </div>
                
                {/* Fade Confidence line */}
                <div className="mb-4 text-center">
                  <p className="text-base text-white/80">
                    Fade Confidence: <span className={`font-bold ${confidenceData.colorClass}`}>{confidenceData.score}%</span>
                  </p>
                </div>
                
                {/* Action button */}
                <div className="flex gap-2 mt-4 justify-center">
                  <ActionButton 
                    variant="fade" 
                    className="h-10 py-0 text-sm"
                    onClick={() => handleFade(bet)}
                  >
                    <span className="text-center font-bold">Fade {bet.betType}</span>
                  </ActionButton>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-black/30 p-6 text-center border border-white/10">
          <p className="text-white/70">@{profile.username} has no active bets right now</p>
        </div>
      )}
    </div>
  );
};

export default PendingBets;
