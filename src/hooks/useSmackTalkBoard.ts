
import { useState } from "react";

interface SmackTalkData {
  itemId: string;
  itemTitle?: string;
}

export const useSmackTalkBoard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [smackTalkData, setSmackTalkData] = useState<SmackTalkData | null>(null);

  const openSmackTalk = (itemId: string, itemTitle?: string) => {
    setSmackTalkData({ itemId, itemTitle });
    setIsOpen(true);
  };

  const closeSmackTalk = () => {
    setIsOpen(false);
    setSmackTalkData(null);
  };

  return {
    isOpen,
    smackTalkData,
    openSmackTalk,
    closeSmackTalk,
  };
};
