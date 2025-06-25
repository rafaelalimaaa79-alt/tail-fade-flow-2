
import React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type TrendChatIconProps = {
  isMostVisible: boolean;
};

const TrendChatIcon = ({ isMostVisible }: TrendChatIconProps) => {
  return (
    <button className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors">
      <MessageCircle 
        className={cn(
          "h-4 w-4",
          isMostVisible ? "text-white" : "text-white/60"
        )} 
      />
    </button>
  );
};

export default TrendChatIcon;
