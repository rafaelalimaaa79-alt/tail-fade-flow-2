
import React from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type TrendChatIconProps = {
  isMostVisible: boolean;
  onClick: () => void;
};

const TrendChatIcon = ({ isMostVisible, onClick }: TrendChatIconProps) => {
  return (
    <button 
      onClick={onClick}
      className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors border border-white/20"
    >
      <MessageSquare 
        className={cn(
          "h-5 w-5",
          isMostVisible ? "text-white" : "text-white/60"
        )} 
      />
    </button>
  );
};

export default TrendChatIcon;
