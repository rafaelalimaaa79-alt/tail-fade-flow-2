
import React from "react";
import BottomNav from "@/components/BottomNav";
import ColdestBettors from "@/components/ColdestBettors";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import BriefcaseButton from "@/components/common/BriefcaseButton";
import ProfileIcon from "@/components/common/ProfileIcon";

const ColdPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`onetime-container ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-between items-center pt-2 mb-2">
          <img 
            src="/lovable-uploads/c77c9dc5-a7dd-4c1c-9428-804d5d7a4a79.png" 
            alt="ONE TIME logo" 
            className="h-10"
          />
          <div className="flex items-center gap-2">
            <BriefcaseButton className="mr-2" />
            <ProfileIcon />
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold text-white/90">Ice Cold Bettors</h2>
          <p className="mt-2 text-sm text-white/60">
            Bettors on their worst losing streaks. Consider fading them.
          </p>
          
          <div className="mt-6">
            <ColdestBettors />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ColdPage;
