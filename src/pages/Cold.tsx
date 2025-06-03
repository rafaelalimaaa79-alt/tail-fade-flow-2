
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
        <header className="mb-8 flex items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
              alt="ONE TIME logo" 
              className="h-24"
            />
          </div>
          <div className="flex-grow" />
          <div className="flex items-center gap-2">
            <BriefcaseButton className="mr-4" />
            <ProfileIcon />
          </div>
        </header>

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
