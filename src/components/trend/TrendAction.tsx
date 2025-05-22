
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TrendActionProps = {
  isTailRecommendation: boolean;
  betDescription: string;
  bettorName: string;
  isMostVisible: boolean;
  wins: number;
  losses: number;
  betType: string;
};

const TrendAction = ({
  isTailRecommendation,
  betDescription,
  bettorName,
  isMostVisible,
  wins,
  losses,
  betType
}: TrendActionProps) => {
  // Determine text and style based on recommendation type
  const actionText = isTailRecommendation ? "TAIL" : "FADE";
  const buttonClass = isTailRecommendation ? "bg-onetime-green hover:bg-onetime-green/90" : "bg-onetime-red hover:bg-onetime-red/90";
  
  return (
    <div className="mb-4">
      <Button 
        className={cn(
          "w-full text-white font-bold py-3 px-2 rounded-md transition-all flex flex-col items-center justify-center h-auto max-w-[95%] mx-auto", 
          buttonClass,
          isMostVisible && "animate-pulse-heartbeat"
        )}
      >
        <div className="text-center space-y-1">
          <div className="text-lg">{betDescription}</div>
          <div className="text-white/90 font-bold text-sm">
            {wins}-{losses} record on {betType} bets
          </div>
        </div>
      </Button>
    </div>
  );
};

export default TrendAction;
