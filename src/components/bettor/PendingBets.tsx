
import React from "react";
import { BettorBet, BettorProfile } from "@/types/bettor";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { showFadeNotification } from "@/utils/betting-notifications";
import ActionButton from "@/components/ActionButton";
import { ThumbsUp, ThumbsDown, Clock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PendingBetsProps = {
  pendingBets: BettorBet[];
  profile: BettorProfile;
  className?: string;
};

const PendingBets: React.FC<PendingBetsProps> = ({ pendingBets, profile, className }) => {
  const handleFade = (bet: BettorBet) => {
    showFadeNotification("Bettor", bet.betType);
  };

  // Function to get the opposite bet that we're fading
  const getFadedBet = (betDescription: string) => {
    if (betDescription.includes("Yankees ML")) {
      return "Red Sox ML";
    } else if (betDescription.includes("Lakers -5.5")) {
      return "Celtics +5.5";
    } else if (betDescription.includes("Over 220")) {
      return "Under 220";
    } else if (betDescription.includes("Dodgers -1.5")) {
      return "Giants +1.5";
    } else if (betDescription.includes("-")) {
      return betDescription.replace("-", "+");
    } else if (betDescription.includes("+")) {
      return betDescription.replace("+", "-");
    }
    
    return "Opposite bet";
  };

  return (
    <div className={cn("rounded-xl bg-black p-6 shadow-2xl relative overflow-hidden border border-white/10", className)}>
      <h3 className="mb-6 text-xl font-bold text-cyan-400 text-center relative z-10">
        Pending Bets
      </h3>
      
      {pendingBets.length > 0 ? (
        <div className="space-y-4 relative z-10">
          {pendingBets.map((bet) => {
            const fadedBet = getFadedBet(bet.betType);
            
            return (
              <div 
                key={bet.id} 
                className="rounded-2xl bg-gray-800 p-6 border border-gray-600"
              >
                {/* Bet Description as main header */}
                <div className="mb-4 text-center">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {bet.betType}
                  </h3>
                  <div className="h-0.5 w-16 bg-cyan-400 mx-auto"></div>
                </div>
                
                {/* Fading info */}
                <div className="mb-6 text-center">
                  <p className="text-lg text-gray-300">
                    Fading <span className="text-cyan-400">@{profile.username}</span>'s {fadedBet} pick
                  </p>
                </div>
                
                {/* Action button */}
                <div className="flex justify-center">
                  <div className="w-full">
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 text-lg rounded-xl flex items-center justify-center gap-2"
                      onClick={() => handleFade(bet)}
                    >
                      Bet Now on Hard Rock
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
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
