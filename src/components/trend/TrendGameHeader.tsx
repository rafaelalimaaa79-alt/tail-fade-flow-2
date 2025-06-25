
import React from "react";

type TrendGameHeaderProps = {
  matchup: {
    game: string;
    teams: string[];
    sport: string;
  };
  isMostVisible: boolean;
};

const TrendGameHeader = ({ matchup, isMostVisible }: TrendGameHeaderProps) => {
  return (
    <div className="text-center pb-1">
      <h3 className="text-2xl font-bold text-white relative inline-block">
        {matchup.game}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#AEE3F5] opacity-90"></div>
      </h3>
    </div>
  );
};

export default TrendGameHeader;
