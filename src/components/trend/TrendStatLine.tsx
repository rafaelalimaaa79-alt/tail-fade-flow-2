
import React from "react";

type TrendStatLineProps = {
  sportStatline: string;
  isMostVisible: boolean;
};

const TrendStatLine = ({ sportStatline, isMostVisible }: TrendStatLineProps) => {
  return (
    <div className="text-center py-1">
      <p className="text-lg font-medium text-gray-400 italic">
        {sportStatline}
      </p>
    </div>
  );
};

export default TrendStatLine;
