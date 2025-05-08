
import { create } from "zustand";
import { usePortfolioStore } from "./portfolio-state";

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
    
    // Log for debugging
    console.log("Opening notification:", { variant, bettorName, betDescription });
    
    set({
      isOpen: true,
      message: "", // No longer needed but keeping the property for compatibility
      variant,
      bettorName,
      betDescription
    });
  },
  closeNotification: () => {
    // When closing, add the bet to the portfolio directly
    const { variant, bettorName, betDescription } = useNotificationStore.getState();
    const { addBet } = usePortfolioStore.getState();
    
    if (variant && bettorName && betDescription) {
      console.log("Adding bet to portfolio:", { variant, bettorName, betDescription });
      addBet(bettorName, betDescription, variant);
    }
    
    set({ isOpen: false });
  }
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
