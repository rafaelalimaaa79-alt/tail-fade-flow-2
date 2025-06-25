
import { useState } from "react";

interface SmackTalkData {
  itemId: string;
  itemTitle?: string;
}

export const useInlineSmackTalk = () => {
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

  const toggleSmackTalk = (itemId: string, itemTitle?: string) => {
    if (isOpen && smackTalkData?.itemId === itemId) {
      closeSmackTalk();
    } else {
      openSmackTalk(itemId, itemTitle);
    }
  };

  return {
    isOpen,
    smackTalkData,
    openSmackTalk,
    closeSmackTalk,
    toggleSmackTalk,
  };
};
