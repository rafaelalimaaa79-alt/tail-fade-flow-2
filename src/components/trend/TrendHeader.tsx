
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
        <div className="flex items-center gap-2">
          {/* Recommendation Label - without background block */}
          <span className={cn(
            "text-xs font-bold",
            isTailRecommendation 
              ? "text-emerald-300" 
              : "text-rose-300"
          )}>
            {isTailRecommendation ? "TAIL" : "FADE"}
          </span>
          
          <h2 className="font-rajdhani text-xl font-bold text-white text-center">@{name}</h2>
        </div>
        
        {/* Score percentage in top right with improved visibility */}
        <div className={cn(
          "absolute top-0 right-0 rounded-full bg-black/50 px-2 py-1 text-xs font-medium backdrop-blur-sm border border-white/20",
          isTailRecommendation ? "text-emerald-300" : "text-rose-300",
          isMostVisible && "animate-pulse-heartbeat"
        )}
        style={{
          boxShadow: isMostVisible ? glowColor : "none",
          textShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
        }}>
          <span className="text-white">{score}%</span>
        </div>
      </div>
    </div>
  );
};

export default TrendHeader;
