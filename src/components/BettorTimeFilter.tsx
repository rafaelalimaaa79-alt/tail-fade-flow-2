
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

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={cn(
            "min-w-8 px-1.5 py-0.5 rounded-full text-xs font-medium transition-colors",
            activeFilter === filter.value
              ? "bg-onetime-darkBlue text-white border border-white/10" // Active button: bluish background (matching container)
              : "bg-gray-100 text-gray-600 hover:bg-gray-200" // Inactive buttons: lighter gray
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
