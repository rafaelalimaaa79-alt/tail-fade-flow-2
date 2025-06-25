
import React from "react";
import TrendChatIcon from "@/components/trend/TrendChatIcon";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";

interface TrendItemWithInlineChatProps {
  trendId: string;
  trendTitle: string;
  children: React.ReactNode;
  isMostVisible: boolean;
}

const TrendItemWithInlineChat = ({ 
  trendId, 
  trendTitle, 
  children, 
  isMostVisible 
}: TrendItemWithInlineChatProps) => {
  const { isOpen, smackTalkData, toggleSmackTalk, closeSmackTalk } = useInlineSmackTalk();

  const handleChatClick = () => {
    toggleSmackTalk(`trend-${trendId}`, trendTitle);
  };

  return (
    <div className="mb-4">
      <div className="relative">
        {children}
        <TrendChatIcon 
          isMostVisible={isMostVisible} 
          onClick={handleChatClick}
        />
      </div>

      <InlineSmackTalk
        isOpen={isOpen && smackTalkData?.itemId === `trend-${trendId}`}
        onClose={closeSmackTalk}
        itemId={smackTalkData?.itemId || ""}
        itemTitle={smackTalkData?.itemTitle}
      />
    </div>
  );
};

export default TrendItemWithInlineChat;
