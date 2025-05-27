
import React from "react";
import { cn } from "@/lib/utils";

type TrendStatsProps = {
  wins: number;
  losses: number;
  betType: string;
  userCount: number;
  userAction: string;
  bettorName: string;
};

const TrendStats = ({
  wins,
  losses,
  betType,
  bettorName
}: TrendStatsProps) => {
  // Generate dynamic status line based on performance and bet type
  const generateStatusLine = () => {
    const total = wins + losses;
    const winRate = total > 0 ? (wins / total) : 0;
    
    // Hot streak indicators
    if (winRate >= 0.8 && total >= 5) {
      const hotPhrases = [
        "Auto-Tail Mode Engaged.",
        "cooking.",
        "might be onto something.",
        "print factory.",
        "safe but scary accurate.",
        "specialist vibes.",
        "might be rigging games.",
        "might be on a heater from heaven.",
        "ice cold and right every time."
      ];
      return hotPhrases[Math.floor(Math.random() * hotPhrases.length)];
    }
    
    // Cold streak indicators
    if (winRate <= 0.3 && total >= 5) {
      const coldPhrases = [
        "Fade Fuel Certified.",
        "what are we doing.",
        "he's donating again.",
        "tail at your own risk.",
        "legend in the wrong direction.",
        "he's due. Or cursed.",
        "doesn't help him win though."
      ];
      return coldPhrases[Math.floor(Math.random() * coldPhrases.length)];
    }
    
    // Moderate performance
    if (winRate >= 0.4 && winRate <= 0.6) {
      return "beautiful chaos.";
    }
    
    // Good but not great
    if (winRate > 0.6 && winRate < 0.8) {
      const decentPhrases = [
        "respect the grind.",
        "never doubt the system.",
        "variance or violence?"
      ];
      return decentPhrases[Math.floor(Math.random() * decentPhrases.length)];
    }
    
    // Default fallback
    return "the numbers don't lie.";
  };

  const statusLine = generateStatusLine();
  
  return (
    <div className="flex flex-col justify-center items-center space-y-2 mb-2">
      {/* Record info (in bold) - always display in the same format */}
      <p className="text-white font-extrabold text-base">
        {wins}-{losses} record with {betType} bets
      </p>
      
      {/* Dynamic status line */}
      <p className="text-white/80 text-sm italic text-center px-2">
        @{bettorName} — {statusLine}
      </p>
    </div>
  );
};

export default TrendStats;
