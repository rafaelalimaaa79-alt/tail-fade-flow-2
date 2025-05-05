
import { toast } from "sonner";

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

/**
 * Show a toast notification for tailing a bet
 */
export const showTailNotification = () => {
  toast(getRandomMessage(TAIL_MESSAGES), {
    duration: 3000,
    className: "bg-onetime-green text-white font-medium border-none",
    position: "top-center",
    icon: "👍",
  });
};

/**
 * Show a toast notification for fading a bet
 */
export const showFadeNotification = () => {
  toast(getRandomMessage(FADE_MESSAGES), {
    duration: 3000,
    className: "bg-onetime-red text-white font-medium border-none",
    position: "top-center",
    icon: "👎",
  });
};
