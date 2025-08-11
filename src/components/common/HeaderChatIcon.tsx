import React from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInlineSmackTalk } from "@/hooks/useInlineSmackTalk";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderChatIconProps {
  className?: string;
}

const HeaderChatIcon = ({ className }: HeaderChatIconProps) => {
  const { isOpen, toggleSmackTalk } = useInlineSmackTalk();

  const handleChatClick = () => {
    toggleSmackTalk("global-chat", "General Discussion");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleChatClick}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full bg-[#AEE3F5]/20 border border-[#AEE3F5]/30 hover:bg-[#AEE3F5]/30 transition-all duration-300",
              "text-[#AEE3F5] hover:text-[#AEE3F5]/80",
              isOpen && "bg-[#AEE3F5]/30",
              className
            )}
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chat</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HeaderChatIcon;