
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  // Determine text and style based on recommendation type
  const actionText = isTailRecommendation ? "TAIL" : "FADE";
  const buttonClass = isTailRecommendation ? "bg-onetime-green hover:bg-onetime-green/90" : "bg-onetime-red hover:bg-onetime-red/90";
  
  return (
    <div className="mb-4">
      <Button 
        className={cn(
          "w-full text-white font-bold py-6 px-4 rounded-md transition-all flex flex-col items-center justify-center h-auto", 
          buttonClass,
          isMostVisible && "animate-pulse-heartbeat"
        )}
      >
        <div className="text-center">
          <div className="text-lg mb-1">{betDescription}</div>
        </div>
      </Button>
    </div>
  );
};

export default TrendAction;
