
import React from "react";
import { cn } from "@/lib/utils";
import ActionButton from "../ActionButton";

type TrendActionProps = {
  isTailRecommendation: boolean;
  betDescription: string;
  isMostVisible: boolean;
};

const TrendAction = ({
  isTailRecommendation,
  betDescription,
  isMostVisible
}: TrendActionProps) => {
  const actionText = isTailRecommendation ? "Tail" : "Fade";
  const glowColor = isTailRecommendation 
    ? "0 0 10px rgba(16, 185, 129, 0.7)" 
    : "0 0 10px rgba(239, 68, 68, 0.7)";
  
  return (
    <div className="mb-4">
      <ActionButton 
        variant={isTailRecommendation ? "tail" : "fade"}
        className={cn(
          "h-9 text-base font-bold w-full",
          isMostVisible && "animate-pulse-heartbeat"
        )}
        style={{
          boxShadow: isMostVisible ? glowColor : "none",
        }}
      >
        {`${actionText} ${betDescription}`}
      </ActionButton>
    </div>
  );
};

export default TrendAction;
