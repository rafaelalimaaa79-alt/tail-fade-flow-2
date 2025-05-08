
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
          className="h-24"
        />
        <div className="flex flex-col">
          <ArrowUp className="h-6 w-6 text-onetime-green animate-pulse-heartbeat" />
          <ArrowDown className="h-6 w-6 text-onetime-red animate-pulse-heartbeat" />
        </div>
      </div>
      <div className="flex-grow" />
      <BriefcaseButton className="mr-4" />
    </header>
  );
};

export default TrendsHeader;
