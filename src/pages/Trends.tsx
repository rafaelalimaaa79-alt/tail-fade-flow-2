
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
      <div className={`onetime-container ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-between items-center pt-2 mb-2">
          <img 
            src="/lovable-uploads/c77c9dc5-a7dd-4c1c-9428-804d5d7a4a79.png" 
            alt="ONE TIME logo" 
            className="h-10"
          />
          <ProfileIcon />
        </div>
        
        <TrendsHeader />
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
