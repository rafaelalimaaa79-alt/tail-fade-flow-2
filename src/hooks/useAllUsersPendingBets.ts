import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  getAllUsersPendingBets,
  calculateBetStatline,
  BetRecord 
} from "@/services/userDataService";
import { calculateBetLine, getOppositeBetLine, getMatchupInfo } from "@/utils/betLineParser";

export interface AllUsersPendingBet {
  id: string;
  userId: string;
  username: string;
  bet: BetRecord;
  fadeConfidence: number;
  statline: string;
  betLine: string;
  oppositeBet: string;
  matchup: {
    game: string;
    teams: string[];
    sport: string;
  };
  userConfidenceScore: number;
  userUnitsGained: number;
  userWinRate: number;
  userTotalBets: number;
}

export function useAllUsersPendingBets() {
  const [bets, setBets] = useState<AllUsersPendingBet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBets = async () => {
    try {
      setLoading(true);
      
      // Fetch all users' pending bets
      const allPendingBets = await getAllUsersPendingBets();
      
      console.log("All users' pending bets from database:", allPendingBets.length);
      
      // If no bets, return empty array
      if (!allPendingBets || allPendingBets.length === 0) {
        console.log("No pending bets found from any user");
        setBets([]);
        setLoading(false);
        return;
      }
      
      // Calculate bet-specific statlines in parallel
      const betsWithStatlines = await Promise.all(
        allPendingBets.map(async (bet) => {
          const statlineData = bet.slip_id
            ? await calculateBetStatline(bet.user_id, bet.slip_id)
            : null;
          
          return {
            id: bet.id || "",
            userId: bet.user_id,
            username: bet.username,
            bet: bet,
            fadeConfidence: statlineData?.fadeConfidence || bet.userConfidenceScore,
            statline: statlineData?.statline || "Loading...",
            betLine: calculateBetLine(bet),
            oppositeBet: getOppositeBetLine(bet),
            matchup: getMatchupInfo(bet),
            userConfidenceScore: bet.userConfidenceScore,
            userUnitsGained: bet.userUnitsGained,
            userWinRate: bet.userWinRate,
            userTotalBets: bet.userTotalBets,
          };
        })
      );
      
      // Sort by fade confidence (highest first)
      const sorted = betsWithStatlines.sort((a, b) => b.fadeConfidence - a.fadeConfidence);

      console.log(`Showing ${sorted.length} pending bets from all users, sorted by confidence`);
      setBets(sorted);
    } catch (error) {
      console.error("Error fetching all users' pending bets:", error);
      setBets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();

    // Listen for sync events
    const handleBetsSynced = () => {
      console.log('Bets synced event received in useAllUsersPendingBets, refetching...');
      fetchBets();
    };

    window.addEventListener('bets-synced', handleBetsSynced);

    // Set up realtime subscription for live bet updates from ALL users
    const channel = supabase
      .channel("all-pending-bets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bets",
        },
        (payload) => {
          console.log("Bet change detected in useAllUsersPendingBets:", payload);

          // Only update the specific bet that changed, don't refetch all
          if (payload.new) {
            const changedBet = payload.new as BetRecord;
            setBets(prevBets => {
              // Find and update the specific bet
              const updatedBets = prevBets.map(bet => {
                if (bet.bet.id === changedBet.id) {
                  // Update only the users_fading_count field
                  return {
                    ...bet,
                    bet: {
                      ...bet.bet,
                      users_fading_count: changedBet.users_fading_count
                    }
                  };
                }
                return bet;
              });
              return updatedBets;
            });
          }
        },
      )
      .subscribe();

    return () => {
      window.removeEventListener('bets-synced', handleBetsSynced);
      supabase.removeChannel(channel);
    };
  }, []);

  return { bets, loading, refetch: fetchBets };
}

