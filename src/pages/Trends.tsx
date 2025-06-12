import React, { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import TrendsHeader from "@/components/trends/TrendsHeader";
import TrendsTitle from "@/components/trends/TrendsTitle";
import TrendsList from "@/components/trends/TrendsList";
import TrendsNotificationHandler from "@/components/trends/TrendsNotificationHandler";
import BadgeAnimationHandler from "@/components/dashboard/BadgeAnimationHandler";
import TopTenReveal from "@/components/trends/TopTenReveal";
import ProfileIcon from "@/components/common/ProfileIcon";
import { trendData } from "@/data/trendData";

const Trends = () => {
  const isMobile = useIsMobile();
  const [showTopTen, setShowTopTen] = useState(false);
  
  return (
    <div className="flex min-h-screen flex-col bg-background font-rajdhani">
      <div className={`max-w-md mx-auto w-full px-2 ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-between items-center pt-2 mb-4">
          <img 
            src="/lovable-uploads/15b68287-6284-47fd-b7cf-1c67129dec0b.png" 
            alt="Fade Zone logo" 
            className="h-32"
          />
          <ProfileIcon />
        </div>
        
        <TrendsTitle />
        
        {showTopTen ? (
          <TopTenReveal isRevealed={showTopTen} />
        ) : (
          <TrendsList trendData={trendData} />
        )}
      </div>
      
      <TrendsNotificationHandler />
      <BadgeAnimationHandler />
      <BottomNav />
    </div>
  );
};

export default Trends;
