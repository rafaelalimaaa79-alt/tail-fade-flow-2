
import { create } from "zustand";

/**
 * Get a random message from an array of messages
 */
const getRandomMessage = (messages: string[]): string => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

type NotificationStore = {
  isOpen: boolean;
  message: string;
  variant: "tail" | "fade" | null;
  bettorName: string;
  betDescription: string;
  openNotification: (params: { variant: "tail" | "fade", bettorName: string, betDescription: string }) => void;
  closeNotification: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  isOpen: false,
  message: "",
  variant: null,
  bettorName: "",
  betDescription: "",
  openNotification: ({ variant, bettorName, betDescription }) => {
    // Trigger haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }
    
    set({
      isOpen: true,
      message: "", // No longer needed but keeping the property for compatibility
      variant,
      bettorName,
      betDescription
    });
  },
  closeNotification: () => set({ isOpen: false }),
}));

/**
 * Show a notification for tailing a bet
 */
export const showTailNotification = (bettorName: string, betDescription: string) => {
  useNotificationStore.getState().openNotification({ 
    variant: "tail", 
    bettorName, 
    betDescription 
  });
};

/**
 * Show a notification for fading a bet
 */
export const showFadeNotification = (bettorName: string, betDescription: string) => {
  useNotificationStore.getState().openNotification({ 
    variant: "fade", 
    bettorName, 
    betDescription 
  });
};
