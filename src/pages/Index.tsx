import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import BetOfTheDay from "@/components/BetOfTheDay";
import LeaderboardCarousel from "@/components/LeaderboardCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { BarChart2 } from "lucide-react";
import { playsOfTheDay } from "@/types/betTypes";
import { useNotificationStore } from "@/utils/betting-notifications";
import FullscreenNotification from "@/components/FullscreenNotification";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [topCarouselIndex, setTopCarouselIndex] = useState(0);
  const [bottomCarouselIndex, setBottomCarouselIndex] = useState(0);
  const topRotationRef = useRef<NodeJS.Timeout | null>(null);
  const bottomRotationRef = useRef<NodeJS.Timeout | null>(null);
  const topRotationPausedRef = useRef(false);
  const bottomRotationPausedRef = useRef(false);
  const { isOpen, message, variant, closeNotification, bettorName, betDescription } = useNotificationStore();
  
  // Setup top carousel auto-rotation (7 seconds)
  const setupTopAutoRotation = () => {
    // Clear any existing interval first
    if (topRotationRef.current) {
      clearInterval(topRotationRef.current);
    }
    
    // Set up a new interval
    topRotationRef.current = setInterval(() => {
      if (!topRotationPausedRef.current) {
        setTopCarouselIndex(prevIndex => (prevIndex + 1) % playsOfTheDay.length);
        console.log("Auto-rotating top carousel to next index");
      }
    }, 7000); // Top carousel rotates every 7 seconds
  };
  
  // Setup bottom carousel auto-rotation (4 seconds)
  const setupBottomAutoRotation = () => {
    // Clear any existing interval first
    if (bottomRotationRef.current) {
      clearInterval(bottomRotationRef.current);
    }
    
    // Set up a new interval
    bottomRotationRef.current = setInterval(() => {
      if (!bottomRotationPausedRef.current) {
        setBottomCarouselIndex(prevIndex => (prevIndex + 1) % 2); // Bottom carousel has 2 items
        console.log("Auto-rotating bottom carousel to next index");
      }
    }, 4000); // Bottom carousel rotates every 4 seconds
  };
  
  // Set up the auto-rotation on component mount
  useEffect(() => {
    setupTopAutoRotation();
    setupBottomAutoRotation();
    
    return () => {
      if (topRotationRef.current) {
        clearInterval(topRotationRef.current);
      }
      if (bottomRotationRef.current) {
        clearInterval(bottomRotationRef.current);
      }
    };
  }, []);
  
  // This function will handle the top carousel changes
  const handleTopCarouselChange = (index: number) => {
    // Pause auto-rotation temporarily when user interacts
    topRotationPausedRef.current = true;
    
    setTopCarouselIndex(index);
    console.log("Manual top carousel change to index:", index);
    
    // Resume auto-rotation after a delay
    setTimeout(() => {
      topRotationPausedRef.current = false;
      setupTopAutoRotation();
    }, 8000); // Resume auto-rotation after 8 seconds
  };
  
  // This function will handle the bottom carousel changes
  const handleBottomCarouselChange = (index: number) => {
    // Pause auto-rotation temporarily when user interacts
    bottomRotationPausedRef.current = true;
    
    setBottomCarouselIndex(index);
    console.log("Manual bottom carousel change to index:", index);
    
    // Resume auto-rotation after a delay
    setTimeout(() => {
      bottomRotationPausedRef.current = false;
      setupBottomAutoRotation();
    }, 8000); // Resume auto-rotation after 8 seconds
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`max-w-md mx-auto w-full px-2 ${isMobile ? "pb-24" : ""}`}>
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
      
      {/* Add the fullscreen notification component */}
      <FullscreenNotification 
        isOpen={isOpen}
        message={message}
        variant={variant || "tail"}
        onClose={closeNotification}
        bettorName={bettorName}
        betDescription={betDescription}
      />
      
      <BottomNav />
    </div>
  );
};

export default Dashboard;
