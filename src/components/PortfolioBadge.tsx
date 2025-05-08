
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
        "absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center px-1 text-xs font-bold",
        showAnimation && "animate-bullseye shadow-glow",
        className
      )}
    >
      {count}
    </Badge>
  );
};

export default PortfolioBadge;
