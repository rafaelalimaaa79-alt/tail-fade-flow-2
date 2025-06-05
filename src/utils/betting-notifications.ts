
import { create } from "zustand";
import { useBetStore } from "./portfolio-state";

type NotificationStore = {
  isOpen: boolean;
  message: string;
  variant: "fade" | null;
  bettorName: string;
  betDescription: string;
  sourceRect: DOMRect | null;
  showFlyAnimation: boolean;
  openNotification: (params: { variant: "fade", bettorName: string, betDescription: string }) => void;
  closeNotification: () => void;
  completeFlyAnimation: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  isOpen: false,
  message: "",
  variant: null,
  bettorName: "",
  betDescription: "",
  sourceRect: null,
  showFlyAnimation: false,
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
    // When closing, add the bet to the profile directly
    const { variant, bettorName, betDescription } = useNotificationStore.getState();
    const { addBet } = useBetStore.getState();
    
    if (variant && bettorName && betDescription) {
      console.log("Adding bet to profile:", { variant, bettorName, betDescription });
      addBet(bettorName, betDescription, variant);
    }
    
    set({ isOpen: false });
  },
  completeFlyAnimation: () => {
    set({ showFlyAnimation: false });
  }
}));

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
