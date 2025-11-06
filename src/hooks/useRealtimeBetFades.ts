import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useRealtimeBetFades(betId?: string) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const hasBetId = useMemo(() => Boolean(betId), [betId]);

  useEffect(() => {
    if (!betId) return;

    let isMounted = true;
    setLoading(true);

    const fetchCount = async () => {
      try {
        const { data, error } = await supabase
          .from("bets")
          .select("users_fading_count")
          .eq("id", betId)
          .single();
        
        if (!isMounted) return;
        if (error) {
          console.error("Failed to load users_fading_count:", error);
          setCount(0);
        } else {
          setCount(data?.users_fading_count ?? 0);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCount();

    const channel = supabase
      .channel(`bet-fades-${betId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bets", filter: `id=eq.${betId}` },
        (payload: any) => {
          const newCount = payload?.new?.users_fading_count;
          if (typeof newCount === "number") setCount(newCount);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [betId]);

  const increment = useCallback(async () => {
    if (!betId) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session) {
      // Let caller handle prompting; here we just no-op if unauthenticated
      return;
    }

    const { data, error } = await (supabase.rpc as any)("increment_users_fading_count", { bet_id: betId });
    if (error) {
      console.error("increment_users_fading_count failed:", error);
      return;
    }
    if (typeof data === "number") setCount(data);
  }, [betId]);

  return { count, loading, hasBetId, increment };
}


