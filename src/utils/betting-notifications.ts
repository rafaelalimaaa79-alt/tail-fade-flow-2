
import { create } from "zustand";

// Arrays of notification messages for tailing and fading
const TAIL_MESSAGES = [
  "If this hits, you're a genius. If not, blame them.",
  "Following greatness… or chaos. We'll find out soon.",
  "You better hope they're hot and not hallucinating.",
  "Welcome to the bandwagon. No seatbelts.",
  "Tailed it. Now it's out of your hands."
];

const FADE_MESSAGES = [
  "If they lose again, you win. Beautiful.",
  "Cold streak insurance… locked in.",
  "You're betting against the mess. Respect.",
  "One man's trash is another man's treasure.",
  "You faded. Now we pray."
];

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
    const baseMessage = variant === "tail" 
      ? getRandomMessage(TAIL_MESSAGES)
      : getRandomMessage(FADE_MESSAGES);
    
    const formattedMessage = `You're ${variant === "tail" ? "tailing" : "fading"} @${bettorName}'s play: ${betDescription}. ${baseMessage}`;
    
    set({
      isOpen: true,
      message: formattedMessage,
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
