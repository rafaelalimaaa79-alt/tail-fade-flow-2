
import React from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import TrendsHeader from "@/components/trends/TrendsHeader";
import TrendsTitle from "@/components/trends/TrendsTitle";
import TrendsList from "@/components/trends/TrendsList";
import TrendsNotificationHandler from "@/components/trends/TrendsNotificationHandler";
import BadgeAnimationHandler from "@/components/dashboard/BadgeAnimationHandler";
import { trendData } from "@/data/trendData";

const Trends = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col bg-background font-rajdhani">
      <div className={`onetime-container ${isMobile ? "pb-24" : ""}`}>
        <TrendsHeader />
        <TrendsTitle />
        <TrendsList trendData={trendData} />
      </div>
      
      <TrendsNotificationHandler />
      <BadgeAnimationHandler />
      <BottomNav />
    </div>
  );
};

export default Trends;
