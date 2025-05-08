
import React from "react";
import { usePortfolioStore } from "@/utils/portfolio-state";
import BriefcaseButton from "@/components/common/BriefcaseButton";
import { ArrowUp, ArrowDown } from "lucide-react";

const TrendsHeader = () => {
  return (
    <header className="mb-4 flex items-center">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center p-1 bg-black/30 rounded-lg border border-purple-500/20">
          <ArrowUp className="h-6 w-6 text-green-400 animate-pulse drop-shadow-[0_0_6px_rgba(74,222,128,0.9)]" />
          <ArrowDown className="h-6 w-6 text-red-400 animate-pulse drop-shadow-[0_0_6px_rgba(248,113,113,0.9)]" />
        </div>
        <h1 className="text-2xl font-bold text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]">
          Trends
        </h1>
      </div>
      <div className="flex-grow" />
      <BriefcaseButton className="mr-4" />
    </header>
  );
};

export default TrendsHeader;
