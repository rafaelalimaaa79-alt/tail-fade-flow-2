
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { usePortfolioStore } from "@/utils/portfolio-state";
import PortfolioBadge from "@/components/PortfolioBadge";

interface DashboardHeaderProps {
  getPortfolioRect: () => DOMRect | null;
}

const DashboardHeader = ({ getPortfolioRect }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const portfolioButtonRef = useRef<HTMLButtonElement>(null);
  const { pendingBets, showBadgeAnimation, stopVibration, viewed } = usePortfolioStore();
  
  const handlePortfolioClick = () => {
    stopVibration(); // Stop vibration when user clicks on portfolio
    navigate('/portfolio');
  };
  
  return (
    <header className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
          alt="ONE TIME logo" 
          className="h-24"
        />
      </div>
      <button 
        ref={portfolioButtonRef}
        className={`rounded-full p-2 text-white/80 hover:text-white flex items-center justify-center self-center relative ${pendingBets.length > 0 && !viewed ? "animate-vibrate" : ""}`}
        onClick={handlePortfolioClick}
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

export default DashboardHeader;
