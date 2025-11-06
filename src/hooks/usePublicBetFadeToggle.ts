import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type HookState = {
  count: number;
  loading: boolean;
  recordFade: () => Promise<void>;
  userFadeCount: number;
  canFadeMore: boolean;
};

export function usePublicBetFadeToggle(publicBetId?: string): HookState {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userFadeCount, setUserFadeCount] = useState(0);
  const canFadeMore = useMemo(() => userFadeCount < 3, [userFadeCount]);

  useEffect(() => {
    let cancelled = false;
    if (!publicBetId) return;

    const load = async () => {
      const [{ data: sessionData }, { data: fadesData, error: fadesErr }] = await Promise.all([
        supabase.auth.getSession(),
        supabase.from("public_bets_fades").select("fade_count").eq("public_bet_id", publicBetId),
      ]);

      if (!cancelled) {
        if (fadesErr) {
          console.error("Failed to fetch public bet fades", fadesErr);
        }
        // Calculate total fades by summing all fade_count values
        const totalFades = (fadesData as any[])?.reduce((sum, fade) => sum + (fade.fade_count ?? 0), 0) ?? 0;
        setCount(totalFades);
      }

      const userId = sessionData.session?.user.id;
      if (!userId || cancelled) return;

      const { data: fadeRow, error: fadeErr } = await supabase
        .from("public_bets_fades")
        .select("id, fade_count")
        .eq("public_bet_id", publicBetId)
        .eq("user_id", userId)
        .maybeSingle();
      if (!cancelled) {
        if (fadeErr) {
          console.error("Failed to fetch user public bet fade", fadeErr);
        }
        const fadeData = fadeRow as any;
        setUserFadeCount(fadeData?.fade_count ?? 0);
      }
    };

    load();

    // Realtime subscriptions - listen for changes in public_bets_fades to update total fades count
    const betsChannel = supabase
      .channel(`public-bet-fades-count-${publicBetId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "public_bets_fades", filter: `public_bet_id=eq.${publicBetId}` },
        async () => {
          // Recalculate total fades when any fade record changes
          const { data: fadesData } = await supabase
            .from("public_bets_fades")
            .select("fade_count")
            .eq("public_bet_id", publicBetId);
          const totalFades = (fadesData as any[])?.reduce((sum, fade) => sum + (fade.fade_count ?? 0), 0) ?? 0;
          setCount(totalFades);
        }
      )
      .subscribe();

    let fadesChannel: ReturnType<typeof supabase.channel> | undefined;
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id;
      if (!uid) return;
      fadesChannel = supabase
        .channel(`public-bet-fade-${publicBetId}-${uid}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "public_bets_fades", filter: `public_bet_id=eq.${publicBetId}` },
          (payload: any) => {
            if (payload.new?.user_id === uid) {
              // Track fade count
              setUserFadeCount(payload.new?.fade_count ?? 0);
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
  }, [publicBetId]);

  const recordFade = useCallback(async () => {
    if (!publicBetId || loading) return;

    // Check if user has already faded 3 times
    if (userFadeCount >= 3) {
      toast("You've reached the maximum of 3 fades for this public bet.");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user.id;
      if (!userId) {
        toast("Please sign in to place this fade.");
        return;
      }

      // Check if user already has a fade record for this public bet
      const { data: existingFade, error: checkError } = await supabase
        .from("public_bets_fades")
        .select("id, fade_count")
        .eq("public_bet_id", publicBetId)
        .eq("user_id", userId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingFade) {
        // Increment fade_count
        const newFadeCount = (existingFade.fade_count ?? 0) + 1;
        const { error: updateError } = await (supabase
          .from("public_bets_fades")
          .update({ fade_count: newFadeCount } as any)
          .eq("id", existingFade.id) as any);
        if (updateError) throw updateError;
        setUserFadeCount(newFadeCount);
        
        // Manually refresh the total count after update
        const { data: fadesData } = await supabase
          .from("public_bets_fades")
          .select("fade_count")
          .eq("public_bet_id", publicBetId);
        const totalFades = (fadesData as any[])?.reduce((sum, fade) => sum + (fade.fade_count ?? 0), 0) ?? 0;
        setCount(totalFades);
      } else {
        // First time fading - insert new record with fade_count = 1
        const { error: insertError } = await supabase
          .from("public_bets_fades")
          .insert({ public_bet_id: publicBetId, user_id: userId, fade_count: 1 });
        if (insertError) throw insertError;
        setUserFadeCount(1);
        
        // Manually refresh the total count after insert
        const { data: fadesData } = await supabase
          .from("public_bets_fades")
          .select("fade_count")
          .eq("public_bet_id", publicBetId);
        const totalFades = (fadesData as any[])?.reduce((sum, fade) => sum + (fade.fade_count ?? 0), 0) ?? 0;
        setCount(totalFades);
      }
    } catch (e) {
      console.error("recordFade failed", e);
      toast.error("Failed to record fade. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [publicBetId, loading, userFadeCount]);

  return { count, loading, recordFade, userFadeCount, canFadeMore };
}

