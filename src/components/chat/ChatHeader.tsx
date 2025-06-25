
import React from "react";
import { X } from "lucide-react";

interface ChatHeaderProps {
  itemTitle?: string;
  onClose: () => void;
}

const ChatHeader = ({ itemTitle, onClose }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[#AEE3F5]/20 bg-black">
      <div className="flex items-center gap-2">
        <div className="text-sm">💬</div>
        <div className="text-[#AEE3F5] font-medium text-sm">Chat</div>
        {itemTitle && (
          <div className="text-[#AEE3F5]/60 text-xs">• {itemTitle}</div>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-[#AEE3F5]/60 hover:text-[#AEE3F5] transition-colors p-1 rounded-md hover:bg-[#AEE3F5]/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ChatHeader;
