
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Bet {
  id: string;
  bettorName: string;
  betDescription: string;
  variant: "tail" | "fade";
  timestamp: string;
}

interface PortfolioState {
  pendingBets: Bet[];
  showBadgeAnimation: boolean;
  viewed: boolean;
  addBet: (bettorName: string, betDescription: string, variant: "tail" | "fade") => void;
  resetBadgeAnimation: () => void;
  stopVibration: () => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      pendingBets: [],
      showBadgeAnimation: false,
      viewed: true,
      addBet: (bettorName: string, betDescription: string, variant: "tail" | "fade") => set((state) => {
        const newBet = {
          id: Date.now().toString(),
          bettorName,
          betDescription,
          variant,
          timestamp: new Date().toISOString()
        };
        
        return {
          pendingBets: [...state.pendingBets, newBet],
          showBadgeAnimation: true,
          viewed: false
        };
      }),
      resetBadgeAnimation: () => set({ showBadgeAnimation: false }),
      stopVibration: () => set({ viewed: true })
    }),
    {
      name: "portfolio-storage"
    }
  )
);
