
import React from "react";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePortfolioStore } from "@/utils/portfolio-state";
import PortfolioBadge from "@/components/PortfolioBadge";

interface BriefcaseButtonProps {
  className?: string;
}

const BriefcaseButton: React.FC<BriefcaseButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  const { pendingBets, showBadgeAnimation, stopVibration, viewed } = usePortfolioStore();
  
  const handlePortfolioClick = () => {
    stopVibration(); // Stop pulse when user clicks on portfolio
    navigate('/portfolio');
  };
  
  return (
    <button 
      className={`relative rounded-full p-2 text-white/80 hover:text-white ${pendingBets.length > 0 && !viewed ? "animate-glow-pulse" : ""} ${className || ""}`}
      onClick={handlePortfolioClick}
    >
      <Briefcase className="h-6 w-6" />
      <PortfolioBadge 
        count={pendingBets.length} 
        showAnimation={showBadgeAnimation}
      />
    </button>
  );
};

export default BriefcaseButton;
