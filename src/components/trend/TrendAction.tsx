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
  betDescription,
  bettorName,
  isMostVisible
}: TrendActionProps) => {
  // Always fade since we're fade-only now
  const actionText = "FADE";
  const buttonClass = isMostVisible 
    ? "bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black"
    : "bg-gray-600 hover:bg-gray-500";
  
  return (
    <div className="mb-4 mt-0">
      <Button 
        className={cn(
          "w-full font-bold py-3 px-2 rounded-md transition-all flex flex-col items-center justify-center h-auto max-w-[95%] mx-auto duration-300", 
          buttonClass,
          isMostVisible ? "text-black" : "text-gray-300"
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
