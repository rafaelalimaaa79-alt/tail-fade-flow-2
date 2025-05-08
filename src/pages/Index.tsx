
import React, { useRef } from "react";
import BottomNav from "@/components/BottomNav";
import BetOfTheDay from "@/components/BetOfTheDay";
import LeaderboardCarousel from "@/components/LeaderboardCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { playsOfTheDay } from "@/types/betTypes";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NotificationHandler from "@/components/dashboard/NotificationHandler";
import BadgeAnimationHandler from "@/components/dashboard/BadgeAnimationHandler";
import { useCarouselRotation } from "@/hooks/useCarouselRotation";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const portfolioButtonRef = useRef<HTMLButtonElement>(null);
  
  // Set up carousel rotations with custom hook
  const { 
    currentIndex: topCarouselIndex, 
    handleCarouselChange: handleTopCarouselChange 
  } = useCarouselRotation({
    itemsCount: playsOfTheDay.length,
    rotationInterval: 7000 // Top carousel rotates every 7 seconds
  });
  
  const { 
    currentIndex: bottomCarouselIndex, 
    handleCarouselChange: handleBottomCarouselChange 
  } = useCarouselRotation({
    itemsCount: 2, // Bottom carousel has 2 items
    rotationInterval: 4000 // Bottom carousel rotates every 4 seconds
  });
  
  // Calculate target rect for the animation
  const getPortfolioRect = () => {
    if (portfolioButtonRef.current) {
      return portfolioButtonRef.current.getBoundingClientRect();
    }
    return null;
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`max-w-md mx-auto w-full px-2 ${isMobile ? "pb-24" : ""}`}>
        <DashboardHeader getPortfolioRect={getPortfolioRect} />

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
