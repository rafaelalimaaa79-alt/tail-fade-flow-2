
import React from "react";

type TrendReasonProps = {
  reason: string;
};

const TrendReason = ({ reason }: TrendReasonProps) => {
  return (
    <div className="mb-4 px-2">
      <div className="text-center">
        <span 
          className="font-bold text-lg text-white"
          style={{ 
            letterSpacing: "0.5px"
          }}
        >
          {reason}
        </span>
      </div>
    </div>
  );
};

export default TrendReason;
