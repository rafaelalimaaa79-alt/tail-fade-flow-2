
import React from "react";
import { usePortfolioStore } from "@/utils/portfolio-state";
import BriefcaseButton from "@/components/common/BriefcaseButton";

const TrendsHeader = () => {
  return (
    <header className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
          alt="ONE TIME logo" 
          className="h-16"
        />
      </div>
      <BriefcaseButton />
    </header>
  );
};

export default TrendsHeader;
