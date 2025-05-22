
import React from "react";

type TrendReasonProps = {
  reason: string;
};

const TrendReason = ({ reason }: TrendReasonProps) => {
  // Check if the reason is already containing bet record information
  // If it does, we'll display it; if not, we'll display the original reason
  return (
    <div className="mb-4">
      <p className="text-sm text-center text-white/80">
        {reason}
      </p>
    </div>
  );
};

export default TrendReason;
