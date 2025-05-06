
import React from "react";
import { cn } from "@/lib/utils";

type TimeFrameOption = '1D' | '1W' | '1M' | '3M' | '1Y';

type BettorTimeFilterProps = {
  activeFilter: TimeFrameOption;
  onChange: (filter: TimeFrameOption) => void;
  className?: string;
};

const BettorTimeFilter: React.FC<BettorTimeFilterProps> = ({
  activeFilter,
  onChange,
  className
}) => {
  const filters: { value: TimeFrameOption; label: string }[] = [
    { value: '1D', label: '1D' },
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '1Y', label: '1Y' },
  ];

  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            activeFilter === filter.value
              ? "bg-onetime-purple text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
