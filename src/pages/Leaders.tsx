import React, { useMemo } from "react";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import TabsContainer from "@/components/leaders/TabsContainer";
import ProfileIcon from "@/components/common/ProfileIcon";
import HeaderChatIcon from "@/components/common/HeaderChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";
import { coldestBettors } from "@/components/leaders/mockData";
import { useNavigate } from "react-router-dom";

const Leaders = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isOpen, smackTalkData, closeSmackTalk } = useInlineSmackTalk();

  // Memoize the data to prevent unnecessary recalculations
  const memoizedColdestBettors = useMemo(() => coldestBettors, []);

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  // Memoize the entire component output for optimal performance
  return (
    <div className="flex min-h-screen flex-col bg-background">
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
        
        <TabsContainer
          activeTab="cold"
          onTabChange={() => {}}
          showAll={false}
          setShowAll={() => {}}
          hottestBettors={[]}
          coldestBettors={memoizedColdestBettors}
        />
        
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

export default Leaders;
