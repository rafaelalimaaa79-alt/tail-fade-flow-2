
import React from "react";

type TrendStatLineProps = {
  sportStatline: string;
  isMostVisible: boolean;
};

const TrendStatLine = ({ sportStatline, isMostVisible }: TrendStatLineProps) => {
  // Remove "the" before team names (capitalized words) in statline
  const cleanedStatline = sportStatline?.replace(/\bthe\s+(?=[A-Z][a-zA-Z]+)/g, '') || sportStatline;
  
  return (
    <div className="text-center py-1">
      <p className="text-lg font-medium text-gray-400 italic">
        {cleanedStatline}
      </p>
    </div>
  );
};

export default TrendStatLine;
