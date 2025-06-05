
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Bet {
  id: string;
  bettorName: string;
  betDescription: string;
  variant: "fade";
  timestamp: string;
  isPlaced: boolean;
  sportsbook?: string;
}

interface BetState {
  pendingBets: Bet[];
  addBet: (bettorName: string, betDescription: string, variant: "fade") => void;
  markBetAsPlaced: (id: string, sportsbook?: string) => void;
  clearBets: () => void;
  // Add these properties to fix the build errors
  showBadgeAnimation?: boolean;
  resetBadgeAnimation?: () => void;
  resetViewedState?: () => void;
}

export const useBetStore = create<BetState>()(
  persist(
    (set) => ({
      pendingBets: [],
      addBet: (bettorName: string, betDescription: string, variant: "fade") => set((state) => {
        const newBet = {
          id: Date.now().toString(),
          bettorName,
          betDescription,
          variant,
          timestamp: new Date().toISOString(),
          isPlaced: false
        };
        
        return {
          pendingBets: [...state.pendingBets, newBet],
        };
      }),
      markBetAsPlaced: (id: string, sportsbook?: string) => set((state) => ({
        pendingBets: state.pendingBets.map(bet => 
          bet.id === id ? { ...bet, isPlaced: true, sportsbook } : bet
        )
      })),
      clearBets: () => set({ pendingBets: [] }),
      // Add empty implementations for the missing properties
      resetBadgeAnimation: () => set({ showBadgeAnimation: false }),
      resetViewedState: () => {} // Empty implementation to avoid errors
    }),
    {
      name: "bet-storage"
    }
  )
);

// For backwards compatibility during transition
export const usePortfolioStore = useBetStore;
