
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
    <div className="mb-6"> {/* Increased from mb-4 to mb-6 for more spacing */}
      <p className="text-center text-lg font-semibold mb-3 text-white">
        {betDescription}
      </p>
      <Button 
        className={cn(
          "w-full text-white font-bold py-2 rounded transition-all", 
          buttonClass,
          isMostVisible && "animate-pulse-heartbeat"
        )}
      >
        {actionText} {bettorName.toUpperCase()}
      </Button>
    </div>
  );
};

export default TrendAction;
