import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type HookState = {
  count: number;
  isFaded: boolean;
  loading: boolean;
  toggleFade: () => Promise<void>;
};

export function useBetFadeToggle(betId?: string): HookState {
  const [count, setCount] = useState(0);
  const [isFaded, setIsFaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const enabled = useMemo(() => Boolean(betId), [betId]);

  useEffect(() => {
    let cancelled = false;
    if (!betId) return;

    const load = async () => {
      const [{ data: sessionData }, { data: betRow, error: betErr }] = await Promise.all([
        supabase.auth.getSession(),
        supabase.from("bets").select("users_fading_count").eq("id", betId).single(),
      ]);

      if (!cancelled) {
        if (betErr) {
          console.error("Failed to fetch users_fading_count", betErr);
        }
        setCount(betRow?.users_fading_count ?? 0);
      }

      const userId = sessionData.session?.user.id;
      if (!userId || cancelled) return;

      const { data: fadeRow, error: fadeErr } = await supabase
        .from("bets_fades")
        .select("id")
        .eq("bet_id", betId)
        .eq("user_id", userId)
        .maybeSingle();
      if (!cancelled) {
        if (fadeErr) {
          console.error("Failed to fetch user fade", fadeErr);
        }
        setIsFaded(Boolean(fadeRow));
      }
    };

    load();

    // Realtime subscriptions
    const betsChannel = supabase
      .channel(`bet-count-${betId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bets", filter: `id=eq.${betId}` },
        (payload: any) => {
          const newCount = payload?.new?.users_fading_count;
          if (typeof newCount === "number") setCount(newCount);
        }
      )
      .subscribe();

    let fadesChannel: ReturnType<typeof supabase.channel> | undefined;
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id;
      if (!uid) return;
      fadesChannel = supabase
        .channel(`bet-fade-${betId}-${uid}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "bets_fades", filter: `bet_id=eq.${betId}` },
          (payload: any) => {
            if (payload.eventType === "INSERT" && payload.new?.user_id === uid) {
              setIsFaded(true);
            } else if (payload.eventType === "DELETE" && payload.old?.user_id === uid) {
              setIsFaded(false);
            }
          }
        )
        .subscribe();
    });

    return () => {
      cancelled = true;
      supabase.removeChannel(betsChannel);
      if (fadesChannel) supabase.removeChannel(fadesChannel);
    };
  }, [betId]);

  const toggleFade = useCallback(async () => {
    if (!betId || loading) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user.id;
      if (!userId) {
        toast("Please sign in to place this fade.");
        return;
      }

      if (isFaded) {
        const { error } = await supabase
          .from("bets_fades")
          .delete()
          .eq("bet_id", betId)
          .eq("user_id", userId);
        if (error) throw error;
        // Realtime will update state; optimistically:
        setIsFaded(false);
      } else {
        const { error } = await supabase
          .from("bets_fades")
          .insert({ bet_id: betId, user_id: userId });
        if (error && error.code !== "23505") throw error; // ignore unique violation
        setIsFaded(true);
      }
    } catch (e) {
      console.error("toggleFade failed", e);
    } finally {
      setLoading(false);
    }
  }, [betId, isFaded, loading]);

  return { count, isFaded, loading, toggleFade };
}


