import React, { createContext, useContext } from "react";
import { useFullScreenChat } from "@/hooks/useFullScreenChat";
import FullScreenChat from "@/components/chat/FullScreenChat";

interface ChatContextValue {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const chatHook = useFullScreenChat();

  return (
    <ChatContext.Provider value={chatHook}>
      {children}
      <FullScreenChat 
        isOpen={chatHook.isOpen} 
        onClose={chatHook.closeChat} 
      />
    </ChatContext.Provider>
  );
};