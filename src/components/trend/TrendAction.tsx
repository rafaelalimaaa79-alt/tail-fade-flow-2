
import React, { useRef } from "react";
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleTailClick = () => {
    showTailNotification(bettorName, betDescription, buttonRef.current);
  };

  const handleFadeClick = () => {
    showFadeNotification(bettorName, betDescription, buttonRef.current);
  };

  return (
    <div className="flex w-full flex-col space-y-2">
      {isTailRecommendation ? (
        <ActionButton
          variant="tail"
          onClick={() => handleTailClick()}
          className={cn(
            isMostVisible && "animate-pulse-heartbeat"
          )}
          ref={buttonRef}
        >
          {betDescription}
        </ActionButton>
      ) : (
        <ActionButton
          variant="fade"
          onClick={() => handleFadeClick()}
          className={cn(
            isMostVisible && "animate-pulse-heartbeat"
          )}
          ref={buttonRef}
        >
          {betDescription}
        </ActionButton>
      )}
    </div>
  );
};

export default TrendAction;
