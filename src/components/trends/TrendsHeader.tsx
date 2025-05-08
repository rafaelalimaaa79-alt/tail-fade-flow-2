
import React from "react";
import { usePortfolioStore } from "@/utils/portfolio-state";
import BriefcaseButton from "@/components/common/BriefcaseButton";
import { ArrowUp, ArrowDown } from "lucide-react";

const TrendsHeader = () => {
  return (
    <header className="mb-4 flex items-center">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
          alt="ONE TIME logo" 
          className="h-12"
        />
        <div className="flex items-center space-x-1 ml-1">
          <ArrowUp className="h-5 w-5 text-green-400 animate-pulse drop-shadow-[0_0_6px_rgba(74,222,128,0.9)]" />
          <ArrowDown className="h-5 w-5 text-red-400 animate-pulse drop-shadow-[0_0_6px_rgba(248,113,113,0.9)]" />
        </div>
      </div>
      <div className="flex-grow" />
      <BriefcaseButton className="mr-4" />
    </header>
  );
};

export default TrendsHeader;
