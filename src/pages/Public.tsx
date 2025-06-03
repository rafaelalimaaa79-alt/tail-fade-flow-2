
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
        <div className="flex justify-between items-center pt-2 mb-2">
          <img 
            src="/lovable-uploads/c77c9dc5-a7dd-4c1c-9428-804d5d7a4a79.png" 
            alt="ONE TIME logo" 
            className="h-10"
          />
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
