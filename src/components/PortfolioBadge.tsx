
import React from "react";
import { cn } from "@/lib/utils";

interface PortfolioBadgeProps {
  count: number;
  className?: string;
  showAnimation: boolean;
}

const PortfolioBadge = ({ count, className, showAnimation }: PortfolioBadgeProps) => {
  if (count === 0) return null;
  
  return (
    <div 
      className={cn(
        "absolute -top-2 -left-2 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold text-white",
        showAnimation && "animate-bounce-once",
        className
      )}
    >
      {count}
    </div>
  );
};

export default PortfolioBadge;
