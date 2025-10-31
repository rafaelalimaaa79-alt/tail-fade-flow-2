
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type TrendFadeButtonProps = {
  oppositeBet: string;
  fadeConfidence: number;
  onBetClick: () => void;
  isMostVisible: boolean;
  usersFading?: number;
  isFaded?: boolean;
  isLoading?: boolean;
};

const TrendFadeButton = ({ oppositeBet, fadeConfidence, onBetClick, isMostVisible, usersFading = 0, isFaded = false, isLoading = false }: TrendFadeButtonProps) => {
  return (
    <>
      {/* Fade confidence and Users Fading */}
      <div className="flex items-center justify-between px-4 py-1">
        <p className="text-lg font-semibold text-gray-300">
          Fade Confidence: <span className="text-[#AEE3F5] font-bold">{fadeConfidence.toFixed(2)}%</span>
        </p>
        <p className="text-lg font-semibold text-gray-300 inline-flex items-center gap-1">
          <p>Users Fading:&nbsp;</p>
          <span className="text-[#AEE3F5] font-bold">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              usersFading
            )}
          </span>
        </p>
      </div>

      {/* Spacer to push button to bottom */}
      <div className="flex-grow"></div>

      {/* Bet button with opposite bet */}
      <div className="w-full pt-1">
        <Button
          type="button"
          onClick={onBetClick}
          disabled={isLoading}
          className={cn(
            "w-full py-4 rounded-xl transition-all duration-300 text-lg font-bold border flex items-center justify-center gap-2",
            isLoading && "opacity-75 cursor-not-allowed",
            isFaded
              ? "bg-black text-[#AEE3F5] border-[#AEE3F5]/60 hover:bg-black/95 shadow-[0_0_12px_rgba(174,227,245,0.25)]"
              : isMostVisible
                ? "bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black border-transparent shadow-[0_0_16px_rgba(174,227,245,0.45)]"
                : "bg-gray-600 hover:bg-gray-500 text-gray-300 border-transparent"
          )}
          style={isMostVisible && !isLoading ? {
            boxShadow: "0 0 20px rgba(174, 227, 245, 0.8), 0 0 40px rgba(174, 227, 245, 0.4)"
          } : undefined}
        >
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          Bet {oppositeBet}
        </Button>
      </div>
    </>
  );
};

export default TrendFadeButton;
