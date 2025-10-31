
import React from "react";
import { cn } from "@/lib/utils";
import TrendGameHeader from "./TrendGameHeader";
import TrendBettorInfo from "./TrendBettorInfo";
import TrendStatLine from "./TrendStatLine";
import TrendFadeButton from "./TrendFadeButton";
import { useBetFadeToggle } from "@/hooks/useBetFadeToggle";

type TrendItemContentProps = {
  matchup: {
    game: string;
    teams: string[];
    sport: string;
  };
  name: string;
  betLine: string;
  sportStatline: string;
  fadeConfidence: number;
  oppositeBet: string;
  onBetClick: () => void;
  isMostVisible: boolean;
  betId?: string;
};

const TrendItemContent = ({
  matchup,
  name,
  betLine,
  sportStatline,
  fadeConfidence,
  oppositeBet,
  onBetClick,
  isMostVisible,
  betId
}: TrendItemContentProps) => {
  const { count: usersFading, isFaded, toggleFade, loading } = useBetFadeToggle(betId);

  const handleBetClick = async () => {
    await toggleFade();
  };
  return (
    <div 
      className="bg-black rounded-xl p-3 border border-[#AEE3F5]/30 animate-glow-pulse space-y-2 flex-grow flex flex-col"
      style={{
        boxShadow: isMostVisible ? '0 0 15px rgba(174, 227, 245, 0.3)' : 'none',
      }}
    >
      <TrendGameHeader matchup={matchup} isMostVisible={isMostVisible} />
      
      <TrendBettorInfo name={name} betLine={betLine} isMostVisible={isMostVisible} />
      
      <TrendStatLine sportStatline={sportStatline} isMostVisible={isMostVisible} />
      
      {/* Divider line */}
      <div className="flex justify-center py-1">
        <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#AEE3F5]/40 to-transparent"></div>
      </div>
      
      <TrendFadeButton
        oppositeBet={oppositeBet}
        fadeConfidence={fadeConfidence}
        onBetClick={handleBetClick}
        isMostVisible={isMostVisible}
        usersFading={usersFading}
        isFaded={isFaded}
        isLoading={loading}
      />
    </div>
  );
};

export default TrendItemContent;
