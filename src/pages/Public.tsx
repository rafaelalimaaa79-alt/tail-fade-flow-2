
import React, { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import ProfileIcon from "@/components/common/ProfileIcon";
import PublicGamesList from "@/components/public/PublicGamesList";

const Public = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col bg-background font-rajdhani">
      <div className={`onetime-container ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-end pt-4 mb-4">
          <ProfileIcon />
        </div>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Public Money</h1>
          <p className="text-white/70 text-sm">
            Real-time view of the most heavily bet teams across all sports
          </p>
        </div>
        
        <PublicGamesList />
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Public;
