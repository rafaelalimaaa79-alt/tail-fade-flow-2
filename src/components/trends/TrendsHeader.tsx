
import React from "react";
import { usePortfolioStore } from "@/utils/portfolio-state";
import BriefcaseButton from "@/components/common/BriefcaseButton";

const TrendsHeader = () => {
  return (
    <header className="mb-4 flex items-center">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
          alt="ONE TIME logo" 
          className="h-20"
        />
      </div>
      <div className="flex-grow" />
      <BriefcaseButton className="mr-4" />
    </header>
  );
};

export default TrendsHeader;
