
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
  isMostVisible
}: TrendActionProps) => {
  // Determine text and style based on recommendation type
  const actionText = isTailRecommendation ? "TAIL" : "FADE";
  const buttonClass = isMostVisible 
    ? (isTailRecommendation ? "bg-onetime-green hover:bg-onetime-green/90" : "bg-onetime-red hover:bg-onetime-red/90")
    : "bg-gray-600 hover:bg-gray-500";
  
  return (
    <div className="mb-4 mt-0">
      <Button 
        className={cn(
          "w-full font-bold py-3 px-2 rounded-md transition-all flex flex-col items-center justify-center h-auto max-w-[95%] mx-auto duration-300", 
          buttonClass,
          isMostVisible ? "text-white" : "text-gray-300"
        )}
      >
        <div className="text-center">
          <div className="text-lg">{betDescription}</div>
        </div>
      </Button>
    </div>
  );
};

export default TrendAction;
