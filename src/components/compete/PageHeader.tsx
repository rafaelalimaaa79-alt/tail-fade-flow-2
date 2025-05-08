
import React from "react";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePortfolioStore } from "@/utils/portfolio-state";
import PortfolioBadge from "@/components/PortfolioBadge";

const PageHeader: React.FC = () => {
  const navigate = useNavigate();
  const { pendingBets, showBadgeAnimation, stopVibration, viewed } = usePortfolioStore();
  
  const handlePortfolioClick = () => {
    stopVibration(); // Stop vibration when user clicks on portfolio button
    navigate('/portfolio');
  };

  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
            alt="ONE TIME logo" 
            className="h-20"
          />
        </div>
        <button 
          className={`rounded-full p-2 text-white/80 hover:text-white relative ${pendingBets.length > 0 && !viewed ? "animate-vibrate" : ""}`}
          onClick={handlePortfolioClick}
        >
          <Briefcase className="h-6 w-6" />
          <PortfolioBadge 
            count={pendingBets.length} 
            showAnimation={showBadgeAnimation}
          />
        </button>
      </header>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Compete</h1>
        <p className="text-sm text-muted-foreground mt-1">Challenge others and win big</p>
      </div>
    </>
  );
};

export default PageHeader;
