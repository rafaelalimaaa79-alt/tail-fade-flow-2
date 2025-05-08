
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PortfolioBadgeProps {
  count: number;
  className?: string;
  showAnimation: boolean;
}

const PortfolioBadge = ({ count, className, showAnimation }: PortfolioBadgeProps) => {
  if (count === 0) return null;
  
  return (
    <Badge 
      variant="purple"
      className={cn(
        "absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs font-bold",
        showAnimation && "animate-bounce-once",
        className
      )}
    >
      {count}
    </Badge>
  );
};

export default PortfolioBadge;
