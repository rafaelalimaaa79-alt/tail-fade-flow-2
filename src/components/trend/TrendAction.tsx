
import React from "react";
import { cn } from "@/lib/utils";
import ActionButton from "@/components/ActionButton";
import { showTailNotification, showFadeNotification } from "@/utils/betting-notifications";

type TrendActionProps = {
  isTailRecommendation: boolean;
  betDescription: string;
  bettorName: string;
  isMostVisible?: boolean;
};

const TrendAction = ({
  isTailRecommendation,
  betDescription,
  bettorName,
  isMostVisible = false,
}: TrendActionProps) => {
  const handleTailClick = () => {
    showTailNotification(bettorName, betDescription);
  };

  const handleFadeClick = () => {
    showFadeNotification(bettorName, betDescription);
  };

  // Create a shared pulse class to sync animations with header
  const pulseClass = isMostVisible ? "animate-pulse-heartbeat" : "";

  return (
    <div className="flex w-full flex-col space-y-2">
      {isTailRecommendation ? (
        <ActionButton
          variant="tail"
          onClick={() => handleTailClick()}
          className={cn(pulseClass)}
        >
          {betDescription}
        </ActionButton>
      ) : (
        <ActionButton
          variant="fade"
          onClick={() => handleFadeClick()}
          className={cn(pulseClass)}
        >
          {betDescription}
        </ActionButton>
      )}
    </div>
  );
};

export default TrendAction;
