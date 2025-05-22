
import React from "react";

type TrendReasonProps = {
  reason: string;
};

const TrendReason = ({ reason }: TrendReasonProps) => {
  // We'll remove this component's own spacing since we want exactly
  // 2 lines between header and action button
  return (
    <div className="hidden">
      {reason && reason.trim() !== '' ? (
        <p className="text-sm text-center text-white/80 px-2 py-1">
          {reason}
        </p>
      ) : null}
    </div>
  );
};

export default TrendReason;
