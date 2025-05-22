
import React from "react";

type TrendReasonProps = {
  reason: string;
};

const TrendReason = ({ reason }: TrendReasonProps) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-center text-white/80">
        {reason}
      </p>
    </div>
  );
};

export default TrendReason;
