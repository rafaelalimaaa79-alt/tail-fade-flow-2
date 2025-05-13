
import React from "react";
import { cn } from "@/lib/utils";

type TrendHeaderProps = {
  name: string;
  score: number;
  isTailRecommendation: boolean;
  isMostVisible: boolean;
};

const TrendHeader = ({
  name,
  score,
  isTailRecommendation,
  isMostVisible
}: TrendHeaderProps) => {
  const glowColor = isTailRecommendation 
    ? "0 0 10px rgba(16, 185, 129, 0.7)" 
    : "0 0 10px rgba(239, 68, 68, 0.7)";
    
  return (
    <div className="mb-2 border-b border-white/10 pb-2">
      <div className="flex justify-center items-center relative">
        <h2 className="font-rajdhani text-xl font-bold text-white text-center">@{name}</h2>
        
        {/* Score percentage in top right with styled badge */}
        <div className={cn(
          "absolute top-0 right-0 rounded-full bg-black/30 px-2 py-1 text-xs backdrop-blur-sm border border-white/10",
          isTailRecommendation ? "text-onetime-green" : "text-onetime-red",
          isMostVisible && "animate-pulse-heartbeat"
        )}
        style={{
          boxShadow: isMostVisible ? glowColor : "none",
        }}>
          <span>{score}%</span>
        </div>
      </div>
    </div>
  );
};

export default TrendHeader;
