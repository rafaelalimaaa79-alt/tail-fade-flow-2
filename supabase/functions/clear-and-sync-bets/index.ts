import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const SHARP_KEY = Deno.env.get("SHARP_SPORT_API_KEY");
const SHARP_PRIVATE_KEY = Deno.env.get("SHARP_SPORT_PRIVATE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const ADMIN_SECRET = Deno.env.get("ADMIN_SECRET") || "secret";

// --- helpers ---
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json"
    }
  });
}

// Fetch all bettors from the SharpSports organization
async function fetchAllBettors(): Promise<any[]> {
  console.log("📋 Fetching all bettors from organization...");
  
  // Correct endpoint: /bettors (not /bettorAccounts)
  const url = "https://api.sharpsports.io/v1/bettors";
  
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      // Use PRIVATE key for listing bettors
      Authorization: `Token ${SHARP_PRIVATE_KEY}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch bettors: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  // API returns array directly or { results: [...] }
  const bettors = Array.isArray(data) ? data : data.results || [];
  
  console.log(`✅ Found ${bettors.length} bettors in organization`);
  return bettors;
}

// Get or create user profile for a bettor (initial creation only)
async function getOrCreateUserProfile(supabase: any, bettor: any): Promise<string> {
  // Bettor object has: id (BTTR_*), internalId (your custom ID)
  const bettorId = bettor.id; // BTTR_* format
  const internalId = bettor.internalId; // Your custom ID
  
  // Use internalId if available, otherwise use bettor ID
  const userId = internalId || `bettor-${bettorId}`;
  
  console.log(`  👤 Processing bettor: ${bettorId} (userId: ${userId})`);
  
  // Check if profile already exists to preserve existing data
  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('avatar_url, bio, created_at')
    .eq('id', userId)
    .single();
  
  // Generate username from internalId or bettor ID
  const username = internalId || `Bettor${bettorId.substring(5, 11)}`;
  
  // Upsert user_profiles (preserving avatar_url and bio if they exist)
  const { error: profileError } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      username: username,
      avatar_url: existingProfile?.avatar_url ?? null,
      bio: existingProfile?.bio ?? null,
      created_at: existingProfile?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id',
      ignoreDuplicates: false
    });
  
  if (profileError) {
    console.error(`  ⚠️  Error creating profile for ${bettorId}:`, profileError);
  }
  
  return userId;
}

// Calculate stats from bet rows (similar to calculateStatsFromArray)
function calculateBettorStats(completedBets: any[]): {
  total_bets: number;
  win_rate: number;
  roi: number;
  units_gained: number;
} {
  if (!completedBets || completedBets.length === 0) {
    return {
      total_bets: 0,
      win_rate: 0,
      roi: 0,
      units_gained: 0
    };
  }

  // Filter only graded bets (Win, Loss, Push)
  const gradedBets = completedBets.filter(bet => 
    bet.result === "Win" || bet.result === "Loss" || bet.result === "Push"
  );

  const wins = gradedBets.filter(bet => bet.result === "Win").length;
  const losses = gradedBets.filter(bet => bet.result === "Loss").length;
  const totalBets = wins + losses; // Exclude pushes from win rate

  const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;

  // Calculate net profit (units gained/lost)
  const unitsGained = gradedBets.reduce((sum, bet) => {
    const wonLost = parseFloat(String(bet.units_won_lost)) || 0;
    return sum + wonLost;
  }, 0);

  // Calculate total units risked for ROI
  const totalRisked = gradedBets.reduce((sum, bet) => {
    const risked = parseFloat(String(bet.units_risked)) || 0;
    return sum + risked;
  }, 0);

  // ROI = (net profit / total risked) * 100
  const roi = totalRisked > 0 ? (unitsGained / totalRisked) * 100 : 0;

  return {
    total_bets: totalBets,
    win_rate: parseFloat(winRate.toFixed(1)),
    roi: parseFloat(roi.toFixed(2)),
    units_gained: parseFloat(unitsGained.toFixed(2))
  };
}

// Update user profile with calculated stats
async function updateUserProfileStats(supabase: any, userId: string): Promise<void> {
  try {
    // Fetch all completed bets for this user
    const { data: bets, error: fetchError } = await supabase
      .from('bets')
      .select('result, units_won_lost, units_risked')
      .eq('user_id', userId)
      .eq('is_processed', true);

    if (fetchError) {
      console.error(`  ⚠️  Error fetching bets for stats calculation:`, fetchError.message);
      return;
    }

    if (!bets || bets.length === 0) {
      console.log(`  📊 No completed bets to calculate stats from`);
      return;
    }

    // Calculate stats
    const stats = calculateBettorStats(bets);

    // Update user profile with stats
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        total_bets: stats.total_bets,
        win_rate: stats.win_rate,
        roi: stats.roi,
        units_gained: stats.units_gained,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error(`  ⚠️  Error updating profile stats:`, updateError.message);
    } else {
      console.log(`  📊 Updated profile stats: ${stats.total_bets} bets, ${stats.win_rate}% WR, ${stats.units_gained} units`);
    }
  } catch (error: any) {
    console.error(`  ⚠️  Error in updateUserProfileStats:`, error.message);
  }
}

// Trigger refresh for a bettor
async function triggerRefresh({ bettorId }: { 
  bettorId: string;
}) {
  // Use bettor refresh endpoint (refreshes all bettorAccounts for this bettor)
  const endpoint = `https://api.sharpsports.io/v1/bettors/${bettorId}/refresh`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      accept: "application/json",
      // Use PUBLIC key for refresh operations
      Authorization: `Token ${SHARP_KEY}`
    }
  });

  if (res.ok) return;

  const text = await res.text();
  const detail = `status=${res.status} endpoint=${endpoint} body=${text}`;
  
  if (res.status === 401) {
    throw new Error(`refresh_unauthorized: Check API key. ${detail}`);
  }
  if (res.status === 403) {
    throw new Error(`refresh_forbidden: Permission denied. ${detail}`);
  }
  if (res.status === 404) {
    console.warn(`  ⚠️  Bettor ${bettorId} not found, skipping refresh`);
    return; // Don't fail the entire process
  }
  if (res.status === 429) {
    console.warn(`  ⚠️  Rate limited on ${bettorId}, waiting...`);
    await sleep(5000);
    return;
  }
  
  console.warn(`  ⚠️  Refresh failed for ${bettorId}: ${detail}`);
}

// Wait for data freshness after refresh (removed - not reliable indicator)
async function waitForFreshness({ 
  bettorId,
  timeoutMs = 10_000
}: { 
  bettorId: string;
  timeoutMs?: number;
}) {
  // Simple wait after refresh to allow data to propagate
  console.log(`  ⏳ Waiting for data freshness...`);
  await sleep(timeoutMs);
}

// Fetch bet slips with pagination support
async function fetchAllBetSlips(
  bettorId: string,  // BTTR_* format
  status: "pending" | "completed" = "completed",
  maxPages: number = 10
): Promise<any[]> {
  const allSlips: any[] = [];
  let page = 1;
  const limit = 200;

  while (page <= maxPages) {
    const qs = new URLSearchParams({
      status: status,
      type: "single",
      betType: "straight",
      limit: String(limit),
      page: String(page)
    });

    // Correct endpoint uses bettor ID (BTTR_*)
    const url = `https://api.sharpsports.io/v1/bettors/${bettorId}/betSlips?${qs.toString()}`;
    
    try {
      const res = await fetch(url, {
        headers: {
          accept: "application/json",
          // Use PRIVATE key for fetching bet slips
          Authorization: `Token ${SHARP_PRIVATE_KEY}`
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          console.warn(`  ℹ️  No ${status} bet slips found for bettor ${bettorId}`);
          break;
        }
        const errorText = await res.text();
        console.error(`  ❌ Failed to fetch ${status} page ${page}:`, errorText);
        break;
      }

      const data = await res.json();
      const slips = Array.isArray(data) ? data : data.results || [];
      
      if (slips.length === 0) break;
      
      allSlips.push(...slips);
      
      if (slips.length < limit) break;
      
      page++;
      await sleep(300); // Rate limiting
    } catch (error) {
      console.error(`  ❌ Error fetching ${status} slips page ${page}:`, error);
      break;
    }
  }

  return allSlips;
}

// Transform slip to database rows
function transformSlipToRows(slip: any, userId: string, isPending = true) {
  const slipRows = [];
  
  // Determine result based on outcome
  let result = "Pending";
  if (!isPending) {
    switch (slip.outcome) {
      case "win":
        result = "Win";
        break;
      case "loss":
        result = "Loss";
        break;
      case "push":
        result = "Push";
        break;
      case "void":
        result = "Cancelled";
        break;
      case "cashout":
        result = "Cashout";
        break;
      case "halfwin":
        result = "Win"; // Treat as win for stats
        break;
      case "halfloss":
        result = "Loss"; // Treat as loss for stats
        break;
      default:
        result = "Pending";
        console.warn(`  ⚠️  Unknown outcome: ${slip.outcome}`, { slipId: slip.id });
    }
  }
  
  for (const b of slip.bets ?? []) {
    // Skip invalid bets
    if (!slip.id || !b.id) {
      console.warn("  ⚠️  Skipping bet with missing ID", { slipId: slip.id, betId: b.id });
      continue;
    }
    
    // Calculate units won/lost - netProfit is source of truth (in cents)
    let unitsWonLost = 0;
    if (slip.netProfit !== null && slip.netProfit !== undefined) {
      // Convert cents to units (cents / 100 = dollars = units)
      unitsWonLost = parseFloat(String(slip.netProfit)) / 100;
    } else if (!isPending) {
      // Fallback calculation if netProfit not provided
      const odds = b.oddsAmerican ?? -110;
      const atRiskDollars = (slip.atRisk ?? 100) / 100; // Convert cents to dollars
      
      switch (slip.outcome) {
        case "win":
          unitsWonLost = odds < 0 
            ? atRiskDollars * (100 / Math.abs(odds))
            : atRiskDollars * (odds / 100);
          break;
        case "loss":
          unitsWonLost = -atRiskDollars;
          break;
        case "halfwin":
          unitsWonLost = (odds < 0 
            ? atRiskDollars * (100 / Math.abs(odds))
            : atRiskDollars * (odds / 100)) / 2;
          break;
        case "halfloss":
          unitsWonLost = -atRiskDollars / 2;
          break;
        case "push":
        case "void":
          unitsWonLost = 0;
          break;
        default:
          unitsWonLost = 0;
      }
    }
    
    // Convert money values from cents to dollars (units)
    const unitsRisked = slip.atRisk ? slip.atRisk / 100 : null;
    const unitsToWin = slip.toWin ? slip.toWin / 100 : null;
    
    slipRows.push({
      user_id: userId,
      sportsbook_id: slip.book?.id ?? null,
      sportsbook_name: slip.book?.name ?? null,
      slip_id: String(slip.id),
      bet_id: String(b.id),
      parsed_email_id: null,
      event: b.event?.name ?? null,
      sport: b.event?.league ?? null,
      position: b.position ?? null,
      line: b.line ?? null,
      bet_type: b.proposition ?? "straight",
      odds: String(b.oddsAmerican ?? b.oddsDecimal ?? ""),
      units_risked: unitsRisked,
      units_to_win: unitsToWin,
      units_won_lost: unitsWonLost,
      event_start_time: b.event?.startTime 
        ? new Date(b.event.startTime).toISOString() 
        : null,
      away_team: b.event?.contestantAway?.fullName ?? null,
      home_team: b.event?.contestantHome?.fullName ?? null,
      result: result,
      is_processed: !isPending,
      updated_at: new Date().toISOString()
    });
  }
  
  return slipRows;
}

// Sync a single bettor's data
async function syncBettorData(supabase: any, bettor: any): Promise<any> {
  const bettorId = bettor.id; // BTTR_* format
  const bettorName = bettor.internalId || bettorId;
  
  console.log(`\n🔄 Syncing bettor: ${bettorName} (${bettorId})`);
  
  try {
    // Get or create user profile
    const userId = await getOrCreateUserProfile(supabase, bettor);
    
    // Trigger refresh for this bettor
    await triggerRefresh({ bettorId: bettorId });
    await waitForFreshness({ bettorId: bettorId });
    
    // Fetch bet slips using bettor ID
    console.log(`  📥 Fetching bet slips...`);
    const [pendingSlips, completedSlips] = await Promise.all([
      fetchAllBetSlips(bettorId, "pending", 5),
      fetchAllBetSlips(bettorId, "completed", 10)
    ]);
    
    console.log(`  📊 Found ${pendingSlips.length} pending + ${completedSlips.length} completed slips`);
    
    // Transform to rows
    const pendingRows = [];
    for (const slip of pendingSlips) {
      if (slip.status === "pending") {
        pendingRows.push(...transformSlipToRows(slip, userId, true));
      }
    }
    
    const completedRows = [];
    for (const slip of completedSlips) {
      if (slip.status !== "pending") {
        completedRows.push(...transformSlipToRows(slip, userId, false));
      }
    }
    
    const allRows = [...pendingRows, ...completedRows];
    
    if (allRows.length === 0) {
      console.log(`  ⚠️  No bets to insert for ${bettorName}`);
      // Still update profile stats (will set to 0)
      await updateUserProfileStats(supabase, userId);
      return {
        bettorId,
        bettorName,
        success: true,
        inserted: 0
      };
    }
    
    // Insert in batches
    const batchSize = 1000;
    let totalInserted = 0;
    
    for (let i = 0; i < allRows.length; i += batchSize) {
      const batch = allRows.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from("bets")
        .insert(batch);

      if (insertError) {
        console.error(`  ❌ Insert error for ${bettorName}:`, insertError.message);
        return {
          bettorId,
          bettorName,
          success: false,
          error: insertError.message,
          inserted: totalInserted
        };
      }
      
      totalInserted += batch.length;
    }
    
    console.log(`  ✅ Inserted ${totalInserted} bets for ${bettorName}`);
    
    // Calculate and update user profile stats based on inserted bets
    await updateUserProfileStats(supabase, userId);
    
    return {
      bettorId,
      bettorName,
      success: true,
      inserted: totalInserted,
      pending: pendingRows.length,
      completed: completedRows.length
    };
    
  } catch (error: any) {
    console.error(`  ❌ Error syncing ${bettorName}:`, error.message);
    return {
      bettorId,
      bettorName,
      success: false,
      error: error.message
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  try {
    // ADMIN AUTHENTICATION
    const { adminSecret } = await req.json().catch(() => ({}));
    
    if (adminSecret !== ADMIN_SECRET) {
      return json({ 
        error: "unauthorized",
        message: "Invalid admin secret"
      }, 401);
    }

    console.log("🔐 Admin authenticated");
    console.log("�️  Starting clear and sync for ALL bettors...");
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
      auth: { persistSession: false }
    });

    // STEP 1: CLEAR ALL BETS
    console.log("\n🗑️  Clearing ALL bets from database...");
    const { error: deleteError, count: deletedCount } = await supabase
      .from("bets")
      .delete({ count: 'exact' })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (dummy condition)

    if (deleteError) {
      console.error("❌ Delete error:", deleteError);
      return json({ 
        error: "delete_failed", 
        detail: deleteError.message 
      }, 500);
    }

    console.log(`✅ Deleted ${deletedCount ?? 0} existing bets`);

    // STEP 2: FETCH ALL BETTORS
    const bettors = await fetchAllBettors();
    
    if (bettors.length === 0) {
      return json({
        message: "No bettors found in organization",
        deleted: deletedCount ?? 0,
        bettors: []
      });
    }

    // STEP 3: SYNC EACH BETTOR
    console.log(`\n� Syncing ${bettors.length} bettors...`);
    
    const results = [];
    for (let i = 0; i < bettors.length; i++) {
      const bettor = bettors[i];
      console.log(`\n[${i + 1}/${bettors.length}]`);
      
      const result = await syncBettorData(supabase, bettor);
      results.push(result);
      
      // Rate limiting between bettors
      if (i < bettors.length - 1) {
        await sleep(1000);
      }
    }

    // Calculate totals
    const totalInserted = results.reduce((sum, r) => sum + (r.inserted || 0), 0);
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.length - successCount;

    console.log("\n" + "=".repeat(50));
    console.log("🎉 SYNC COMPLETE");
    console.log("=".repeat(50));
    console.log(`✅ Successful: ${successCount}/${results.length} bettors`);
    console.log(`❌ Failed: ${failedCount}/${results.length} bettors`);
    console.log(`📊 Total bets inserted: ${totalInserted}`);
    console.log(`🗑️  Bets deleted: ${deletedCount ?? 0}`);
    console.log("=".repeat(50));

    return json({
      message: "Clear and sync completed",
      deleted: deletedCount ?? 0,
      totalBettors: bettors.length,
      successfulBettors: successCount,
      failedBettors: failedCount,
      totalBetsInserted: totalInserted,
      results: results
    });

  } catch (e: any) {
    console.error("❌ Clear and sync error:", e);
    return json({ 
      error: e?.message ?? "unknown",
      stack: e?.stack
    }, 500);
  }
});