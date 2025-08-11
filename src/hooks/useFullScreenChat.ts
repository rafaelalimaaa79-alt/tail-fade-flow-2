import { useState } from "react";

export const useFullScreenChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => {
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    openChat,
    closeChat,
    toggleChat,
  };
};