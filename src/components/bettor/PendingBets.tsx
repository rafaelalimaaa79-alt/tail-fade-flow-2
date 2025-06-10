
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

  // Function to get fade confidence (mock data for now)
  const getFadeConfidence = () => {
    return Math.floor(Math.random() * 30) + 70; // Random between 70-99%
  };

  return (
    <div className={cn("rounded-xl bg-black p-6 shadow-2xl relative overflow-hidden border border-white/10", className)}>
      <h3 className="mb-6 text-xl font-bold text-cyan-400 text-center relative z-10">
        Pending Bets
      </h3>
      
      {pendingBets.length > 0 ? (
        <div className="space-y-4 relative z-10">
          {pendingBets.map((bet) => {
            const fadeConfidence = getFadeConfidence();
            
            return (
              <div 
                key={bet.id} 
                className="bg-black rounded-xl p-6 border border-[#AEE3F5]/30 animate-glow-pulse"
                style={{
                  boxShadow: '0 0 15px rgba(174, 227, 245, 0.3)',
                }}
              >
                {/* Username */}
                <div className="text-center mb-4">
                  <p className="text-lg font-medium text-[#AEE3F5]">
                    @{profile.username}
                  </p>
                </div>
                
                {/* Bet line */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {bet.betType}
                  </h3>
                  <div className="w-12 h-0.5 bg-[#AEE3F5] mx-auto"></div>
                </div>
                
                {/* Fade confidence */}
                <div className="text-center mb-4">
                  <p className="text-lg font-semibold text-gray-300">
                    Fade Confidence: <span className="text-[#AEE3F5] font-bold text-xl">{fadeConfidence}%</span>
                  </p>
                </div>
                
                {/* Fade button */}
                <div className="w-full">
                  <Button 
                    className="w-full bg-[#6C5CE7] hover:bg-[#5B4BD6] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
                    onClick={() => handleFade(bet)}
                  >
                    👎 Fade
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-black p-6 text-center border border-white/10">
          <p className="text-gray-400">@{profile.username} has no active bets right now</p>
        </div>
      )}
    </div>
  );
};

export default PendingBets;
