import React, { useRef, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import BetOfTheDay from "@/components/BetOfTheDay";
import LeaderboardCarousel from "@/components/LeaderboardCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { playsOfTheDay } from "@/types/betTypes";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NotificationHandler from "@/components/dashboard/NotificationHandler";
import BadgeAnimationHandler from "@/components/dashboard/BadgeAnimationHandler";
import ProfileIcon from "@/components/common/ProfileIcon";
import { useCarouselRotation } from "@/hooks/useCarouselRotation";
import { usePortfolioStore } from "@/utils/portfolio-state";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const portfolioButtonRef = useRef<HTMLButtonElement>(null);
  const { resetViewedState } = usePortfolioStore();
  
  // Set up carousel rotations with custom hook
  const { 
    currentIndex: topCarouselIndex, 
    handleCarouselChange: handleTopCarouselChange 
  } = useCarouselRotation({
    itemsCount: playsOfTheDay.length,
    rotationInterval: 5000, // Updated to 5 seconds (5000ms)
    pauseDuration: 5000 // Keep pause duration at 5 seconds (5000ms)
  });
  
  const { 
    currentIndex: bottomCarouselIndex, 
    handleCarouselChange: handleBottomCarouselChange 
  } = useCarouselRotation({
    itemsCount: 2, // Bottom carousel has 2 items
    rotationInterval: 5000, // Updated to 5 seconds (5000ms)
    pauseDuration: 5000 // Keep pause duration at 5 seconds (5000ms)
  });
  
  // Calculate target rect for the animation
  const getPortfolioRect = () => {
    if (portfolioButtonRef.current) {
      return portfolioButtonRef.current.getBoundingClientRect();
    }
    return null;
  };
  
  // For testing purposes - simulate a bet after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      resetViewedState(); // Reset the viewed state to make the briefcase glow
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [resetViewedState]);
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`max-w-md mx-auto w-full px-2 ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-between items-center pt-2 mb-4">
          <img 
            src="/lovable-uploads/7b63dfa5-820d-4bd0-82f2-9e01001a0364.png" 
            alt="NoShot logo" 
            className="h-40"
          />
          <ProfileIcon />
        </div>

        <div className="w-full mb-4">
          <BetOfTheDay 
            currentIndex={topCarouselIndex}
            onIndexChange={handleTopCarouselChange}
          />
        </div>
        
        <div className="w-full">
          <LeaderboardCarousel 
            currentIndex={bottomCarouselIndex}
            onIndexChange={handleBottomCarouselChange}
          />
        </div>
      </div>
      
      <BadgeAnimationHandler />
      <NotificationHandler getPortfolioRect={getPortfolioRect} />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
