
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import BriefcaseButton from "@/components/common/BriefcaseButton";
import { usePortfolioStore } from "@/utils/portfolio-state";

interface DashboardHeaderProps {
  getPortfolioRect: () => DOMRect | null;
}

const DashboardHeader = ({ getPortfolioRect }: DashboardHeaderProps) => {
  const portfolioButtonRef = useRef<HTMLButtonElement>(null);
  
  return (
    <header className="mb-2 flex items-center">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
          alt="ONE TIME logo" 
          className="h-24"
        />
      </div>
      <div className="flex-grow" />
      <BriefcaseButton className="mr-4" />
    </header>
  );
};

export default DashboardHeader;
