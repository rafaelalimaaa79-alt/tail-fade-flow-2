
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import BetOfTheDay from "@/components/BetOfTheDay";
import LeaderboardCarousel from "@/components/LeaderboardCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { BarChart2 } from "lucide-react";
import { playsOfTheDay } from "@/types/betTypes";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const autoRotationRef = useRef<NodeJS.Timeout | null>(null);
  const rotationPausedRef = useRef(false);
  
  // Setup auto-rotation with improved timing
  const setupAutoRotation = () => {
    // Clear any existing interval first
    if (autoRotationRef.current) {
      clearInterval(autoRotationRef.current);
    }
    
    // Set up a new interval
    autoRotationRef.current = setInterval(() => {
      if (!rotationPausedRef.current) {
        setCarouselIndex(prevIndex => (prevIndex + 1) % playsOfTheDay.length);
        console.log("Auto-rotating carousel to next index");
      }
    }, 8000); // Increased to 8 seconds to give more time to view the slower animations
  };
  
  // Set up the auto-rotation on component mount
  useEffect(() => {
    setupAutoRotation();
    
    return () => {
      if (autoRotationRef.current) {
        clearInterval(autoRotationRef.current);
      }
    };
  }, []);
  
  // This function will be shared between both carousels
  const handleCarouselChange = (index: number) => {
    // Pause auto-rotation temporarily when user interacts
    rotationPausedRef.current = true;
    
    setCarouselIndex(index);
    console.log("Manual carousel change to index:", index);
    
    // Resume auto-rotation after a delay
    setTimeout(() => {
      rotationPausedRef.current = false;
      setupAutoRotation();
    }, 5000); // Increased to 5 seconds before resuming auto-rotation
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
