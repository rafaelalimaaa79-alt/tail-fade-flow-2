
import React from "react";
import { cn } from "@/lib/utils";
import ActionButton from "@/components/ActionButton";
import { showTailNotification, showFadeNotification } from "@/utils/betting-notifications";

type TrendActionProps = {
  isTailRecommendation: boolean;
  betDescription: string;
  isMostVisible?: boolean;
};

const TrendAction = ({
  isTailRecommendation,
  betDescription,
  isMostVisible = false,
}: TrendActionProps) => {
  const handleTailClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation from parent Link
    e.stopPropagation(); // Prevent event bubbling
    showTailNotification();
  };

  const handleFadeClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation from parent Link
    e.stopPropagation(); // Prevent event bubbling
    showFadeNotification();
  };

  return (
    <div className="flex w-full flex-col space-y-2">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center justify-center">
          <div
            className={cn(
              "text-lg font-medium",
              isTailRecommendation
                ? "text-onetime-green"
                : "text-onetime-red"
            )}
          >
            {betDescription}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ActionButton
          variant="tail"
          onClick={(e) => handleTailClick(e)}
          className={cn(
            isMostVisible && isTailRecommendation && "animate-pulse-heartbeat"
          )}
        >
          Tail
        </ActionButton>
        <ActionButton
          variant="fade"
          onClick={(e) => handleFadeClick(e)}
          className={cn(
            isMostVisible && !isTailRecommendation && "animate-pulse-heartbeat"
          )}
        >
          Fade
        </ActionButton>
      </div>
    </div>
  );
};

export default TrendAction;
