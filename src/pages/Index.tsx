
import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import BetOfTheDay from "@/components/BetOfTheDay";
import LeaderboardCarousel from "@/components/LeaderboardCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { WalletCards } from "lucide-react";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`onetime-container ${isMobile ? "pb-24" : ""}`}>
        <header className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
              alt="ONE TIME logo" 
              className="h-20"
            />
          </div>
          <button 
            className="rounded-full p-2 text-white/80 hover:text-white flex items-center gap-1"
            onClick={() => navigate('/portfolio')}
          >
            <span className="text-sm font-medium mr-1">Portfolio</span>
            <WalletCards className="h-5 w-5" />
          </button>
        </header>

        <BetOfTheDay />
        
        <div className="mt-4">
          <LeaderboardCarousel />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
