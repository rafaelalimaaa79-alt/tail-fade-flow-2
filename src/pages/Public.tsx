
import React, { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import ProfileIcon from "@/components/common/ProfileIcon";
import PublicGamesList from "@/components/public/PublicGamesList";

const Public = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col bg-background font-rajdhani">
      <div className={`max-w-md mx-auto w-full px-2 ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-between items-center pt-2 mb-4">
          <img 
            src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
            alt="ONE TIME logo" 
            className="h-24"
          />
          <ProfileIcon />
        </div>
        
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Fade the Public?</h1>
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
