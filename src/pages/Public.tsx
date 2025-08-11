
import React, { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import ProfileIcon from "@/components/common/ProfileIcon";
import HeaderChatIcon from "@/components/common/HeaderChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";
import PublicGamesList from "@/components/public/PublicGamesList";
import TrendsNotificationHandler from "@/components/trends/TrendsNotificationHandler";
import { useNavigate } from "react-router-dom";

const Public = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isOpen, smackTalkData, closeSmackTalk } = useInlineSmackTalk();
  
  const handleLogoClick = () => {
    navigate("/dashboard");
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-background font-rajdhani">
      <div className={`max-w-md mx-auto w-full px-2 ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-between items-center pt-2 mb-4">
          <img 
            src="/lovable-uploads/7b63dfa5-820d-4bd0-82f2-9e01001a0364.png" 
            alt="NoShot logo" 
            className="h-40 cursor-pointer"
            onClick={handleLogoClick}
          />
          <div className="flex items-center gap-2">
            <HeaderChatIcon />
            <ProfileIcon />
          </div>
        </div>
        
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#AEE3F5] mb-2 drop-shadow-[0_0_8px_rgba(174,227,245,0.7)] font-rajdhani uppercase tracking-wide">
            Fade the Public
          </h1>
        </div>
        
        <PublicGamesList />
        
        {isOpen && (
          <InlineSmackTalk
            isOpen={isOpen}
            onClose={closeSmackTalk}
            itemId={smackTalkData?.itemId || ""}
            itemTitle={smackTalkData?.itemTitle}
          />
        )}
      </div>
      
      <BottomNav />
      <TrendsNotificationHandler />
    </div>
  );
};

export default Public;
