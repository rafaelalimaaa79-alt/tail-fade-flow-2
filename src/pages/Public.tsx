
import React, { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import ProfileIcon from "@/components/common/ProfileIcon";
import PublicGamesList from "@/components/public/PublicGamesList";
import TrendsNotificationHandler from "@/components/trends/TrendsNotificationHandler";

const Public = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col bg-background font-rajdhani">
      <div className={`max-w-md mx-auto w-full px-2 ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-between items-center pt-2 mb-4">
          <img 
            src="/lovable-uploads/548c9fc2-64d6-4972-9b5f-ca71a4784f83.png" 
            alt="NoShot logo" 
            className="h-32"
          />
          <ProfileIcon />
        </div>
        
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#AEE3F5] mb-2 drop-shadow-[0_0_8px_rgba(174,227,245,0.7)] font-rajdhani uppercase tracking-wide">
            Fade the Public
          </h1>
        </div>
        
        <PublicGamesList />
      </div>
      
      <BottomNav />
      <TrendsNotificationHandler />
    </div>
  );
};

export default Public;
