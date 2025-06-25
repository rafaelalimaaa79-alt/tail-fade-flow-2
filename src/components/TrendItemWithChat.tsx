
import React from "react";
import TrendChatIcon from "@/components/trend/TrendChatIcon";
import SmackTalkBoard from "@/components/SmackTalkBoard";
import { useSmackTalkBoard } from "@/hooks/useSmackTalkBoard";

interface TrendItemWithChatProps {
  trendId: string;
  trendTitle: string;
  children: React.ReactNode;
  isMostVisible: boolean;
}

const TrendItemWithChat = ({ 
  trendId, 
  trendTitle, 
  children, 
  isMostVisible 
}: TrendItemWithChatProps) => {
  const { isOpen, smackTalkData, openSmackTalk, closeSmackTalk } = useSmackTalkBoard();

  const handleChatClick = () => {
    openSmackTalk(`trend-${trendId}`, trendTitle);
  };

  return (
    <>
      <div className="relative">
        {children}
        <TrendChatIcon 
          isMostVisible={isMostVisible} 
          onClick={handleChatClick}
        />
      </div>

      <SmackTalkBoard
        isOpen={isOpen}
        onClose={closeSmackTalk}
        itemId={smackTalkData?.itemId || ""}
        itemTitle={smackTalkData?.itemTitle}
      />
    </>
  );
};

export default TrendItemWithChat;
