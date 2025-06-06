
import React, { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import ProfileIcon from "@/components/common/ProfileIcon";
import PublicGamesList from "@/components/public/PublicGamesList";

const Public = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col bg-background font-rajdhani">
      <div className={`max-w-md mx-auto w-full px-4 ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-between items-center pt-4 mb-6">
          <img 
            src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
            alt="ONE TIME logo" 
            className="h-20"
          />
          <ProfileIcon />
        </div>
        
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#AEE3F5] mb-2 drop-shadow-[0_0_8px_rgba(174,227,245,0.7)] font-rajdhani">
            Fade the Public
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Live public betting percentages • Find the most heavily bet teams to fade
          </p>
        </div>
        
        <PublicGamesList />
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Public;
