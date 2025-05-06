
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import BetOfTheDay from "@/components/BetOfTheDay";
import LeaderboardCarousel from "@/components/LeaderboardCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { BarChart2 } from "lucide-react";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // This function will be shared between both carousels
  const handleCarouselChange = (index: number) => {
    setCarouselIndex(index);
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`onetime-container ${isMobile ? "pb-24" : ""}`}>
        <header className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
              alt="ONE TIME logo" 
              className="h-24"
            />
          </div>
          <button 
            className="rounded-full p-2 text-white/80 hover:text-white flex items-center justify-center self-center"
            onClick={() => navigate('/portfolio')}
          >
            <BarChart2 className="h-6 w-6" />
          </button>
        </header>

        <BetOfTheDay 
          currentIndex={carouselIndex}
          onIndexChange={handleCarouselChange}
        />
        
        <div className="mt-4">
          <LeaderboardCarousel 
            currentIndex={carouselIndex}
            onIndexChange={handleCarouselChange}
          />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
