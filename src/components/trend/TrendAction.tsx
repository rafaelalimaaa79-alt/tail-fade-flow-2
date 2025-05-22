
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type TrendActionProps = {
  isTailRecommendation: boolean;
  betDescription: string;
  bettorName: string;
  isMostVisible: boolean;
};

const TrendAction = ({
  isTailRecommendation,
  betDescription,
  bettorName,
  isMostVisible
}: TrendActionProps) => {
  // Use the same animation class as TrendHeader for synchronization
  const pulseClass = isMostVisible ? "animate-pulse-heartbeat" : "";
  
  return (
    <div className="mb-4 space-y-3">
      {/* Bet description */}
      <div className={cn(
        "text-center text-base font-medium",
        isTailRecommendation ? "text-emerald-300" : "text-rose-300",
        pulseClass // Using the same pulse class variable for synchronization
      )}>
        {betDescription}
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-center space-x-2">
        <Button 
          variant="outline"
          size="sm"
          className={cn(
            "border-white/20 bg-black/30 text-white hover:bg-black/50",
            isMostVisible && "border-white/40"
          )}
        >
          View @{bettorName}
        </Button>
        
        <Button 
          size="sm" 
          className={cn(
            isTailRecommendation 
              ? "bg-emerald-600 hover:bg-emerald-700" 
              : "bg-rose-600 hover:bg-rose-700"
          )}
        >
          {isTailRecommendation ? "Tail $25" : "Fade $25"}
        </Button>
      </div>
    </div>
  );
};

export default TrendAction;
