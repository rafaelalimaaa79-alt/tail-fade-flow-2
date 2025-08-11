
import React from "react";
import BottomNav from "@/components/BottomNav";
import ColdestBettors from "@/components/ColdestBettors";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import BriefcaseButton from "@/components/common/BriefcaseButton";
import ProfileIcon from "@/components/common/ProfileIcon";
import HeaderChatIcon from "@/components/common/HeaderChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";

const ColdPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isOpen, smackTalkData, closeSmackTalk } = useInlineSmackTalk();
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className={`max-w-md mx-auto w-full px-2 ${isMobile ? "pb-24" : ""}`}>
        <div className="flex justify-between items-center pt-2 mb-4">
          <img 
            src="/lovable-uploads/57cb1fb4-7471-451e-bf49-d4d5fa12bdcb.png" 
            alt="ONE TIME logo" 
            className="h-24"
          />
          <div className="flex items-center gap-2">
            <HeaderChatIcon />
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
    </div>
  );
};

export default ColdPage;
