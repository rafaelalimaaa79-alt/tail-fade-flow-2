import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  getCurrentUserPendingBets, 
  getCurrentUserConfidenceScore,
  calculateBetStatline,
  BetRecord 
} from "@/services/userDataService";
import { calculateBetLine, getOppositeBetLine, getMatchupInfo } from "@/utils/betLineParser";

export interface PendingBetWithStatline {
  id: string;
  name: string;
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
}

export function usePendingBets() {
  const [bets, setBets] = useState<PendingBetWithStatline[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBets = async () => {
    try {
      setLoading(true);
      
      // Fetch pending bets
      const pendingBets = await getCurrentUserPendingBets();
      
      console.log("Pending bets from database:", pendingBets);
      
      // If no bets, return empty array
      if (!pendingBets || pendingBets.length === 0) {
        console.log("No pending bets found");
        setBets([]);
        setLoading(false);
        return;
      }
      
      // Fetch global confidence score as fallback
      const confidenceData = await getCurrentUserConfidenceScore();
      const globalFadeConfidence = confidenceData?.score ?? 50;
      
      // Calculate bet-specific statlines in parallel
      const betsWithStatlines = await Promise.all(
        pendingBets.map(async (bet) => {
          const statlineData = bet.slip_id
            ? await calculateBetStatline(bet.user_id, bet.slip_id)
            : null;
          
          return {
            id: bet.id || "",
            name: "You",
            bet: bet,
            fadeConfidence: statlineData?.fadeConfidence || globalFadeConfidence,
            statline: statlineData?.statline || "Loading...",
            betLine: calculateBetLine(bet),
            oppositeBet: getOppositeBetLine(bet),
            matchup: getMatchupInfo(bet)
          };
        })
      );
      
      // Sort by fade confidence (highest first)
      const sorted = betsWithStatlines.sort((a, b) => b.fadeConfidence - a.fadeConfidence);

      // Take only top 10 bets (or all if less than 10)
      const top10 = sorted.slice(0, 10);

      console.log(`Showing top ${top10.length} bets (out of ${sorted.length} total pending bets)`);
      setBets(top10);
    } catch (error) {
      console.error("Error fetching pending bets:", error);
      setBets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
    
    // Listen for sync events
    const handleBetsSynced = () => {
      console.log('Bets synced event received in usePendingBets, refetching...');
      fetchBets();
    };
    
    window.addEventListener('bets-synced', handleBetsSynced);
    
    // Set up realtime subscription for live bet updates
    supabase.auth.getSession().then(({ data }) => {
      const userId = data.session?.user.id;
      if (!userId) return;

      const channel = supabase
        .channel("pending-bets-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bets",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("Bet change detected in usePendingBets:", payload);
            fetchBets();
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    });
    
    return () => {
      window.removeEventListener('bets-synced', handleBetsSynced);
    };
  }, []);

  return { bets, loading, refetch: fetchBets };
}

