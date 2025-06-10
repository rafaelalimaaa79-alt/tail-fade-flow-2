
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

  // Function to generate NBA matchups
  const getMatchup = () => {
    const teams = [
      "Lakers vs Celtics",
      "Warriors vs Nets", 
      "Bucks vs Heat",
      "76ers vs Nuggets",
      "Suns vs Mavericks"
    ];
    return teams[Math.floor(Math.random() * teams.length)];
  };

  // Function to generate bet lines
  const getBetLine = () => {
    const lines = [
      "Over 220.5",
      "Under 48.5",
      "-3.5",
      "+7.5",
      "Over 112.5"
    ];
    return lines[Math.floor(Math.random() * lines.length)];
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
            const matchup = getMatchup();
            const betLine = getBetLine();
            
            return (
              <div 
                key={bet.id} 
                className="bg-black rounded-xl p-4 border border-[#AEE3F5]/30 animate-glow-pulse space-y-3"
                style={{
                  boxShadow: '0 0 15px rgba(174, 227, 245, 0.3)',
                }}
              >
                {/* Game header with icy blue underline */}
                <div className="text-center pb-2">
                  <h3 className="text-lg font-bold text-white relative inline-block">
                    {matchup}
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5] to-transparent opacity-80"></div>
                  </h3>
                </div>
                
                {/* Bettor's pick */}
                <div className="text-center">
                  <p className="text-base font-semibold">
                    <span className="text-[#AEE3F5]">@{profile.username}</span>
                    <span className="text-white"> is on {betLine}</span>
                  </p>
                </div>
                
                {/* Fade confidence */}
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-300">
                    Fade Confidence: <span className="text-[#AEE3F5] font-bold">{fadeConfidence}%</span>
                  </p>
                </div>
                
                {/* Fade button */}
                <div className="w-full pt-2">
                  <Button 
                    className="w-full bg-[#6C5CE7] hover:bg-[#5B4BD6] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
                    onClick={() => handleFade(bet)}
                  >
                    👎 Fade {betLine}
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
