
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
    <div className={cn("rounded-xl bg-black p-6 shadow-2xl relative animate-glow-pulse-icy overflow-hidden border-2 border-cyan-400/50", className)}>
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-purple-600/10 backdrop-blur-sm pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"></div>
      
      <h3 className="mb-6 text-2xl font-bold text-cyan-400 text-center relative z-10 tracking-wide">
        🔥 PENDING BETS 🔥
        <div className="h-1.5 w-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full mx-auto mt-2 shadow-lg shadow-cyan-400/50"></div>
      </h3>
      
      {pendingBets.length > 0 ? (
        <div className="space-y-5 relative z-10">
          {pendingBets.map((bet) => {
            const confidenceData = getConfidenceScore(bet);
            
            return (
              <div 
                key={bet.id} 
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-black via-gray-900/80 to-black/60 p-5 shadow-2xl border-2 border-cyan-400/30 transition-all duration-300 hover:border-cyan-400/70 hover:shadow-cyan-400/20"
              >
                {/* Enhanced interactive blob effects */}
                <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-cyan-400/30 blur-xl"></div>
                <div className="absolute bottom-0 left-8 h-24 w-24 rounded-full bg-blue-500/20 blur-xl"></div>
                
                {/* Game information at the top - larger and different font */}
                <div className="mb-5 text-center">
                  <h4 className="text-3xl font-bold text-white tracking-tight relative z-10 font-exo drop-shadow-lg">
                    {bet.teams}
                  </h4>
                </div>
                
                {/* Username's bet with clarification */}
                <div className="mb-4 text-center">
                  <p className="text-sm text-cyan-400/80 mb-2 relative z-10 font-semibold">@{profile.username}'s Bet:</p>
                  <p className="text-2xl font-extrabold text-white tracking-tight relative z-10 font-rajdhani drop-shadow-lg">
                    {bet.betType}
                    <div className="h-1.5 w-20 bg-gradient-to-r from-cyan-400 via-cyan-400/80 to-transparent rounded-full mx-auto mt-2 shadow-lg shadow-cyan-400/30"></div>
                  </p>
                </div>
                
                {/* Fade Confidence line with larger font */}
                <div className="mb-5 text-center relative z-10">
                  <p className="text-xl text-white/80 font-semibold">
                    Fade Confidence: <span className={`font-bold text-2xl ${confidenceData.colorClass} drop-shadow-lg`}>{confidenceData.score}%</span>
                  </p>
                </div>
                
                {/* Bottom row: Action button with enhanced styling - fade only */}
                <div className="flex gap-2 mt-4 justify-center relative z-10">
                  <ActionButton 
                    variant="fade" 
                    className="h-12 py-0 text-base shadow-2xl shadow-onetime-red/20 group relative overflow-hidden border border-onetime-red/50 hover:border-onetime-red/80"
                    onClick={() => handleFade(bet)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-center font-bold">Fade {bet.betType}</span>
                  </ActionButton>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-black/30 p-8 text-center border-2 border-cyan-400/20 relative z-10">
          <p className="text-white/70 text-lg">@{profile.username} has no active bets right now</p>
        </div>
      )}
    </div>
  );
};

export default PendingBets;
