
import React, { useRef } from "react";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PortfolioBadge from "@/components/PortfolioBadge";
import { usePortfolioStore } from "@/utils/portfolio-state";

const TrendsHeader = () => {
  const navigate = useNavigate();
  const portfolioButtonRef = useRef<HTMLButtonElement>(null);
  const { pendingBets, showBadgeAnimation } = usePortfolioStore();
  
  return (
    <header className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
          alt="ONE TIME logo" 
          className="h-16"
        />
      </div>
      <button 
        ref={portfolioButtonRef}
        className="rounded-full p-2 text-white/80 hover:text-white relative"
        onClick={() => navigate('/portfolio')}
      >
        <Briefcase className="h-6 w-6" />
        <PortfolioBadge 
          count={pendingBets.length} 
          showAnimation={showBadgeAnimation}
        />
      </button>
    </header>
  );
};

export default TrendsHeader;
