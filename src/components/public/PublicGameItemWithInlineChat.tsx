
import React from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import InlineSmackTalk from "@/components/InlineSmackTalk";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";

interface PublicGameItemWithInlineChatProps {
  gameId: string;
  gameTitle: string;
  children: React.ReactNode;
  isMostVisible: boolean;
}

const PublicGameItemWithInlineChat = ({ 
  gameId, 
  gameTitle, 
  children, 
  isMostVisible 
}: PublicGameItemWithInlineChatProps) => {
  const { isOpen, smackTalkData, toggleSmackTalk, closeSmackTalk } = useInlineSmackTalk();

  const handleChatClick = () => {
    toggleSmackTalk(`public-game-${gameId}`, gameTitle);
  };

  const isThisChatOpen = isOpen && smackTalkData?.itemId === `public-game-${gameId}`;

  return (
    <div className="max-w-sm mx-auto mb-4">
      <div className="relative">
        {children}
        <button 
          onClick={handleChatClick}
          className="absolute top-1 right-3 z-10 p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors border border-white/20"
        >
          <MessageSquare 
            className={cn(
              "h-5 w-5",
              isMostVisible ? "text-white" : "text-white/60"
            )} 
          />
        </button>
      </div>

      {isThisChatOpen && (
        <InlineSmackTalk
          isOpen={true}
          onClose={closeSmackTalk}
          itemId={smackTalkData?.itemId || ""}
          itemTitle={smackTalkData?.itemTitle}
        />
      )}
    </div>
  );
};

export default PublicGameItemWithInlineChat;
