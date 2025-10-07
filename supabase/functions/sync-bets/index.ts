import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHARP_KEY = Deno.env.get("SHARP_SPORT_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const { internalId, userId } = await req.json();
    if (!internalId || !userId) {
      return json({ error: "internalId and userId required" }, 400);
    }

    console.log(`Syncing bets for bettor ${internalId}, user ${userId}`);

    // Step 1: Get bettorAccount to retrieve refreshResponse
    const accountsUrl = `https://api.sharpsports.io/v1/bettorAccounts?bettor=${internalId}`;
    console.log('Fetching bettorAccounts from:', accountsUrl);

    const accountsRes = await fetch(accountsUrl, {
      headers: { 
        accept: "application/json", 
        Authorization: `Token ${SHARP_KEY}` 
      }
    });

    let refreshResponse = null;
    if (accountsRes.ok) {
      const accounts = await accountsRes.json();
      console.log(`Found ${accounts.length} bettor accounts`);
      
      if (accounts.length > 0) {
        refreshResponse = accounts[0].refreshResponse;
        if (refreshResponse) {
          console.log('Using refreshResponse from bettorAccount');
        } else {
          console.log('No refreshResponse available in bettorAccount');
        }
      }
    } else {
      console.log('Failed to fetch bettorAccounts, proceeding without refreshResponse');
    }

    // Step 2: Fetch bet slips using the filters
    const now = new Date();
    const nowFormatted = now.toISOString().split('.')[0]; // Remove milliseconds and Z
    
    const qs = new URLSearchParams({
      status: "pending",
      type: "single",
      betType: "straight",
      eventStartTimeStart: nowFormatted,
      limit: "200",
    });

    const res = await fetch(
      `https://api.sharpsports.io/v1/bettors/${internalId}/betSlips?${qs.toString()}`,
      { headers: { accept: "application/json", Authorization: `Token ${SHARP_KEY}` } }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error("SharpSports API error:", detail);
      return json({ error: "sharpsports_failed", detail }, 502);
    }

    const slips = await res.json();
    const rows: any[] = [];

    for (const s of slips ?? []) {
      if (s.status !== "pending") continue;
      for (const b of s.bets ?? []) {
        if (b.status !== "pending") continue;
        rows.push({
          user_id:         userId,
          sportsbook_id:   s.sportsbook?.id ?? null,
          sportsbook_name: s.sportsbook?.name ?? null,
          slip_id:         String(s.id),
          bet_id:          String(b.id),
          parsed_email_id: null,
          event:           b.eventName ?? b.selectionName ?? null,
          bet_type:        b.betType ?? "straight",
          odds:            String(b.oddsAmerican ?? b.oddsDecimal ?? ""),
          units_risked:    b.risk ?? null,
          event_start_time:b.eventStartTime ? new Date(b.eventStartTime).toISOString() : null,
          result:          "Pending",
          units_won_lost:  0,
          is_processed:    false,
          timestamp:       new Date().toISOString(),
          created_at:      new Date().toISOString(),
          updated_at:      new Date().toISOString(),
        });
      }
    }

    console.log(`Found ${rows.length} pending bets to sync`);

    if (!rows.length) return json({ inserted: 0 });

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    // Upsert idempotently (avoids duplicates if user logs in twice)
    const { error } = await supabase
      .from("bets")
      .upsert(rows, { onConflict: "user_id,slip_id,bet_id", ignoreDuplicates: false });

    if (error) {
      console.error("Database upsert error:", error);
      return json({ error: "db_upsert_failed", detail: error.message }, 500);
    }

    console.log(`Successfully synced ${rows.length} bets`);
    return json({ 
      inserted: rows.length,
      refreshResponse: refreshResponse ? 'available' : 'not_available'
    });
  } catch (e) {
    console.error("Sync error:", e);
    return json({ error: (e as Error).message ?? "unknown" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
