
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
  
  // Create a shared pulse class to sync animations
  const pulseClass = isMostVisible ? "animate-pulse-heartbeat" : "";
    
  return (
    <div className="mb-2 border-b border-white/10 pb-2">
      <div className="flex items-center justify-between">
        {/* Score percentage - left side with larger styling */}
        <div className={cn(
          "rounded-full bg-black/50 px-3 py-2 text-base font-bold backdrop-blur-sm border border-white/20 transition-colors duration-300",
          isMostVisible 
            ? (isTailRecommendation ? "text-emerald-300" : "text-rose-300")
            : "text-gray-400",
          pulseClass
        )}
        style={{
          boxShadow: isMostVisible ? glowColor : "none",
          textShadow: isMostVisible ? "0 0 5px rgba(255, 255, 255, 0.3)" : "none",
        }}>
          <span className={cn(
            "transition-colors duration-300",
            isMostVisible ? "text-white" : "text-gray-400"
          )}>{score}%</span>
        </div>
        
        {/* Recommendation Label - centered */}
        <span className={cn(
          "text-3xl font-bold transition-colors duration-300",
          isMostVisible 
            ? (isTailRecommendation ? "text-emerald-300" : "text-rose-300")
            : "text-gray-400",
          pulseClass
        )}>
          {isTailRecommendation ? "TAIL" : "FADE"}
        </span>
        
        {/* Right side - empty space for balance */}
        <div className="w-16"></div>
      </div>
    </div>
  );
};

export default TrendHeader;
