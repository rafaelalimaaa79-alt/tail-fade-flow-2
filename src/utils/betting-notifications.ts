
import { create } from "zustand";
import { usePortfolioStore } from "./portfolio-state";

type NotificationStore = {
  isOpen: boolean;
  message: string;
  variant: "tail" | "fade" | null;
  bettorName: string;
  betDescription: string;
  showFlyAnimation: boolean;
  sourceRect: DOMRect | null;
  openNotification: (params: { variant: "tail" | "fade", bettorName: string, betDescription: string, sourceRect?: DOMRect | null }) => void;
  closeNotification: () => void;
  startFlyAnimation: () => void;
  completeFlyAnimation: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  isOpen: false,
  message: "",
  variant: null,
  bettorName: "",
  betDescription: "",
  showFlyAnimation: false,
  sourceRect: null,
  openNotification: ({ variant, bettorName, betDescription, sourceRect = null }) => {
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
      betDescription,
      sourceRect,
      showFlyAnimation: false // Ensure animation is reset
    });
  },
  closeNotification: () => set(state => {
    console.log("Closing notification, will trigger animation");
    if (state.isOpen) {
      return {
        isOpen: false,
        // Immediately start the fly animation when notification closes
        showFlyAnimation: true
      };
    }
    return state;
  }),
  startFlyAnimation: () => {
    console.log("Start fly animation called manually");
    set({ showFlyAnimation: true });
  },
  completeFlyAnimation: () => {
    // When the animation completes, add the bet to the portfolio
    const { variant, bettorName, betDescription } = useNotificationStore.getState();
    const { addBet } = usePortfolioStore.getState();
    
    console.log("Animation complete, adding bet to portfolio");
    
    if (variant && bettorName && betDescription) {
      addBet(bettorName, betDescription, variant);
    }
    
    // Reset the fly animation state
    set({ 
      showFlyAnimation: false,
      sourceRect: null
    });
  }
}));

/**
 * Show a notification for tailing a bet
 */
export const showTailNotification = (bettorName: string, betDescription: string, sourceElement?: HTMLElement | null) => {
  let sourceRect: DOMRect | null = null;
  
  if (sourceElement) {
    sourceRect = sourceElement.getBoundingClientRect();
  }
  
  useNotificationStore.getState().openNotification({ 
    variant: "tail", 
    bettorName, 
    betDescription,
    sourceRect
  });
};

/**
 * Show a notification for fading a bet
 */
export const showFadeNotification = (bettorName: string, betDescription: string, sourceElement?: HTMLElement | null) => {
  let sourceRect: DOMRect | null = null;
  
  if (sourceElement) {
    sourceRect = sourceElement.getBoundingClientRect();
  }
  
  useNotificationStore.getState().openNotification({ 
    variant: "fade", 
    bettorName, 
    betDescription,
    sourceRect
  });
};
