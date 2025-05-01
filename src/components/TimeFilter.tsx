
import React from "react";
import { cn } from "@/lib/utils";

type TimeFilterProps = {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
};

const TimeFilter: React.FC<TimeFilterProps> = ({
  activeFilter,
  setActiveFilter,
}) => {
  const filters = [
    { id: "today", label: "Today" },
    { id: "1w", label: "1W" },
    { id: "1m", label: "1M" },
    { id: "ytd", label: "YTD" },
  ];

  return (
    <div className="my-4 flex items-center justify-between gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={cn(
            "filter-button",
            activeFilter === filter.id && "active"
          )}
          onClick={() => setActiveFilter(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TimeFilter;
