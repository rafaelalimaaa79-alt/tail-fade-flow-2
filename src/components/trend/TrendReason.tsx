
import React from "react";

type TrendReasonProps = {
  reason: string;
};

const TrendReason = ({ reason }: TrendReasonProps) => {
  // Always render the container div to maintain consistent spacing,
  // even if there's no reason text
  return (
    <div className="mb-4">
      {reason && reason.trim() !== '' ? (
        <p className="text-sm text-center text-white/80 px-2 py-1">
          {reason}
        </p>
      ) : (
        <div className="py-1"></div> // Empty spacer to maintain consistent layout
      )}
    </div>
  );
};

export default TrendReason;
