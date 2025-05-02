
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
      <div className="flex justify-center items-center">
        <h2 className="font-rajdhani text-xl font-bold text-white text-center">@{name}</h2>
      </div>
      <div className="flex justify-center mt-1">
        <span 
          className={cn(
            "font-bold text-base px-3 py-0.5 rounded",
            isTailRecommendation ? "bg-onetime-green/20 text-onetime-green" : "bg-onetime-red/20 text-onetime-red",
            isMostVisible && "animate-pulse-heartbeat"
          )}
          style={{
            boxShadow: isMostVisible ? glowColor : "none",
          }}
        >
          Confidence Score: {score}%
        </span>
      </div>
    </div>
  );
};

export default TrendHeader;
