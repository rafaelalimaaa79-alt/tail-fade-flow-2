
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
import HeaderChatIcon from "@/components/common/HeaderChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";
import { trendData } from "@/data/trendData";
import { useNavigate } from "react-router-dom";

const Trends = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showTopTen, setShowTopTen] = useState(false);
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
        
        <TrendsTitle />
        
        {showTopTen ? (
          <TopTenReveal isRevealed={showTopTen} />
        ) : (
          <TrendsList trendData={trendData} />
        )}
        
        {isOpen && (
          <InlineSmackTalk
            isOpen={isOpen}
            onClose={closeSmackTalk}
            itemId={smackTalkData?.itemId || ""}
            itemTitle={smackTalkData?.itemTitle}
          />
        )}
      </div>
      
      <TrendsNotificationHandler />
      <BadgeAnimationHandler />
      <BottomNav />
    </div>
  );
};

export default Trends;
