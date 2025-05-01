
import React from "react";

interface PaginationIndicatorProps {
  currentIndex: number;
  totalItems: number;
}

const PaginationIndicator: React.FC<PaginationIndicatorProps> = ({
  currentIndex,
  totalItems,
}) => {
  return (
    <div className="mt-4 flex justify-center gap-1">
      {Array.from({ length: totalItems }).map((_, index) => (
        <div 
          key={index}
          className={`h-1.5 rounded-full transition-all ${
            index === currentIndex ? "w-4 bg-primary" : "w-1.5 bg-white/20"
          }`}
        />
      ))}
    </div>
  );
};

export default PaginationIndicator;
