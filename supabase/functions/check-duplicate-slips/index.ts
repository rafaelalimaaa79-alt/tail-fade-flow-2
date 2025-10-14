import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`🔍 [DIAGNOSTIC] Checking for duplicate slip_ids for user ${userId}...`);

    // Query to find duplicate slip_ids
    const { data: duplicates, error: duplicatesError } = await supabaseClient
      .rpc('find_duplicate_slip_ids', { p_user_id: userId });

    if (duplicatesError) {
      console.error(`❌ [DIAGNOSTIC] Error checking duplicates:`, duplicatesError);
      
      // Fallback: Manual query
      const { data: allBets, error: fetchError } = await supabaseClient
        .from('bets')
        .select('id, slip_id, bet_id, sport, bet_type, position, result')
        .eq('user_id', userId)
        .order('slip_id');

      if (fetchError) {
        throw fetchError;
      }

      // Group by slip_id
      const slipGroups = new Map();
      for (const bet of allBets || []) {
        if (!bet.slip_id) continue;
        
        if (!slipGroups.has(bet.slip_id)) {
          slipGroups.set(bet.slip_id, []);
        }
        slipGroups.get(bet.slip_id).push(bet);
      }

      // Find duplicates
      const duplicateSlips = [];
      for (const [slipId, bets] of slipGroups.entries()) {
        if (bets.length > 1) {
          duplicateSlips.push({
            slip_id: slipId,
            count: bets.length,
            bets: bets
          });
        }
      }

      console.log(`📊 [DIAGNOSTIC] Found ${duplicateSlips.length} slip_ids with multiple bets`);

      return new Response(
        JSON.stringify({
          userId,
          totalBets: allBets?.length || 0,
          duplicateSlips,
          hasDuplicates: duplicateSlips.length > 0,
          message: duplicateSlips.length > 0 
            ? `Found ${duplicateSlips.length} slip_ids with multiple bets. This is expected for parlays but NOT for single straight bets.`
            : "No duplicate slip_ids found. All slip_ids are unique."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(duplicates),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error(`❌ [DIAGNOSTIC] Error:`, error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

