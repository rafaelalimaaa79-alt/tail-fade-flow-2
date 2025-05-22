
import React from "react";

type TrendReasonProps = {
  reason: string;
};

const TrendReason = ({ reason }: TrendReasonProps) => {
  if (!reason || reason.trim() === '') return null;
  
  return (
    <div className="mb-4">
      <p className="text-sm text-center text-white/80 px-2 py-1">
        {reason}
      </p>
    </div>
  );
};

export default TrendReason;
