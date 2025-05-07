
import React from "react";
import { cn } from "@/lib/utils";

type TimeFrameOption = '1D' | '1W' | '1M' | '3M' | '1Y';

type BettorTimeFilterProps = {
  activeFilter: TimeFrameOption;
  onChange: (filter: TimeFrameOption) => void;
  className?: string;
  performanceByTimeframe?: Record<TimeFrameOption, number>;
};

const BettorTimeFilter: React.FC<BettorTimeFilterProps> = ({
  activeFilter,
  onChange,
  className,
  performanceByTimeframe = {}
}) => {
  const filters: { value: TimeFrameOption; label: string }[] = [
    { value: '1D', label: '1D' },
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '1Y', label: '1Y' },
  ];

  const getButtonColorClass = (timeframe: TimeFrameOption): string => {
    // Only apply performance-based coloring to the active filter
    if (activeFilter === timeframe) {
      const performance = performanceByTimeframe[timeframe];
      if (performance !== undefined) {
        if (performance > 0) return "bg-onetime-green text-white";
        if (performance < 0) return "bg-onetime-red text-white";
      }
      // Default active color if no performance data
      return "bg-onetime-purple text-white";
    }
    
    // All inactive filters have the same background color
    return "bg-gray-100 text-gray-600 hover:bg-gray-200";
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={cn(
            "min-w-8 px-1.5 py-0.5 rounded-full text-xs font-medium transition-colors",
            getButtonColorClass(filter.value)
          )}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default BettorTimeFilter;
