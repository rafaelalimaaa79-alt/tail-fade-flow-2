
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TrendFadeButtonProps = {
  oppositeBet: string;
  fadeConfidence: number;
  onBetClick: () => void;
  isMostVisible: boolean;
};

const TrendFadeButton = ({ oppositeBet, fadeConfidence, onBetClick, isMostVisible }: TrendFadeButtonProps) => {
  return (
    <>
      {/* Fade confidence */}
      <div className="text-center py-1">
        <p className="text-lg font-semibold text-gray-300">
          Fade Confidence: <span className="text-[#AEE3F5] font-bold">{fadeConfidence.toFixed(2)}%</span>
        </p>
      </div>
      
      {/* Spacer to push button to bottom */}
      <div className="flex-grow"></div>
      
      {/* Bet button with opposite bet */}
      <div className="w-full pt-1">
        <Button 
          onClick={onBetClick}
          className={cn(
            "w-full py-4 rounded-xl transition-all duration-300 text-lg font-bold",
            isMostVisible 
              ? "bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black"
              : "bg-gray-600 hover:bg-gray-500 text-gray-300"
          )}
          style={isMostVisible ? {
            boxShadow: "0 0 20px rgba(174, 227, 245, 0.8), 0 0 40px rgba(174, 227, 245, 0.4)"
          } : undefined}
        >
          Bet {oppositeBet}
        </Button>
      </div>
    </>
  );
};

export default TrendFadeButton;
