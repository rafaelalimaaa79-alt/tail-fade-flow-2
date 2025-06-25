
import React from "react";

type TrendBettorInfoProps = {
  name: string;
  betLine: string;
  isMostVisible: boolean;
};

const TrendBettorInfo = ({ name, betLine, isMostVisible }: TrendBettorInfoProps) => {
  return (
    <div className="text-center py-1">
      <p className="text-lg font-bold">
        <span className="text-[#AEE3F5]">@{name}</span>
        <span className="text-white"> is on {betLine}</span>
      </p>
    </div>
  );
};

export default TrendBettorInfo;
