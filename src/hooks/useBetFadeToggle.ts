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
        .select("id, deleted_at")
        .eq("bet_id", betId)
        .eq("user_id", userId)
        .maybeSingle();
      if (!cancelled) {
        if (fadeErr) {
          console.error("Failed to fetch user fade", fadeErr);
        }
        // Only consider it faded if the record exists and is not soft deleted
        const fadeData = fadeRow as any;
        setIsFaded(Boolean(fadeRow && fadeData?.deleted_at === null));
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
            if (payload.new?.user_id === uid) {
              // Check if fade is active (deleted_at is null)
              const isActive = payload.new?.deleted_at === null;
              setIsFaded(isActive);
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
        // Soft delete: set deleted_at instead of hard delete
        const { error } = await (supabase
          .from("bets_fades")
          .update({ deleted_at: new Date().toISOString() } as any)
          .eq("bet_id", betId)
          .eq("user_id", userId)
          .is("deleted_at", null) as any); // Only update if not already soft deleted
        if (error) throw error;
        setIsFaded(false);
      } else {
        // Try to re-activate a soft-deleted fade first
        const { data: existingFade, error: checkError } = await supabase
          .from("bets_fades")
          .select("id")
          .eq("bet_id", betId)
          .eq("user_id", userId)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingFade) {
          // Re-activate soft-deleted fade (clear deleted_at)
          const { error: updateError } = await (supabase
            .from("bets_fades")
            .update({ deleted_at: null } as any)
            .eq("id", existingFade.id) as any);
          if (updateError) throw updateError;
        } else {
          // First time fading - insert new record
          const { error: insertError } = await supabase
            .from("bets_fades")
            .insert({ bet_id: betId, user_id: userId });
          if (insertError) throw insertError;
        }
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


