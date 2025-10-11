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
// --- helpers ---
const sleep = (ms)=>new Promise((r)=>setTimeout(r, ms));
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json"
    }
  });
}
// refresh scope: "bettor" (default) or "account"
// Returns the parsed refresh response for status checking
async function triggerRefresh({ internalId, bettorAccountId }) {
  const endpoint = bettorAccountId
    ? `https://api.sharpsports.io/v1/bettorAccounts/${bettorAccountId}/refresh`
    : `https://api.sharpsports.io/v1/bettors/${internalId}/refresh`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Token ${SHARP_KEY}`
    }
  });

  // Parse response body for status checking
  let responseData;
  try {
    responseData = await res.json();
  } catch (e) {
    const text = await res.text();
    throw new Error(`refresh_parse_failed: Could not parse response. status=${res.status} body=${text}`);
  }

  if (!res.ok) {
    const detail = `status=${res.status} endpoint=${endpoint} body=${JSON.stringify(responseData)}`;
    if (res.status === 401) {
      throw new Error(`refresh_unauthorized: Check API key or auth scheme. ${detail}`);
    }
    if (res.status === 403) {
      throw new Error(`refresh_forbidden: Your key likely lacks refresh permission or does not own this bettor/account. ${detail}`);
    }
    if (res.status === 404) {
      throw new Error(`refresh_not_found: Bettor or account id is invalid or not visible. ${detail}`);
    }
    if (res.status === 429) {
      throw new Error(`refresh_rate_limited: Back off and retry later. ${detail}`);
    }
    throw new Error(`refresh_failed: ${detail}`);
  }

  return responseData;
}

// Get a new context ID for account linking
async function getBetSyncContext(internalId) {
  const res = await fetch('https://api.sharpsports.io/v1/context', {
    method: 'POST',
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Token ${SHARP_KEY}`
    },
    body: JSON.stringify({ internalId })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`context_failed: status=${res.status} body=${text}`);
  }

  return res.json();
}
// quick poll to give the backend time to ingest new data
async function waitForFreshness({ internalId, timeoutMs = 30_000, intervalMs = 1500 }) {
  const deadline = Date.now() + timeoutMs;
  while(Date.now() < deadline){
    // lightweight “are we alive” check — re-list accounts
    const accountsUrl = `https://api.sharpsports.io/v1/bettorAccounts?bettor=${internalId}`;
    const res = await fetch(accountsUrl, {
      headers: {
        accept: "application/json",
        Authorization: `Token ${SHARP_KEY}`
      }
    });
    if (res.ok) {
      // You could inspect fields like updatedAt/lastSync if the API exposes them.
      // For now, a single successful round-trip after refresh is a decent signal.
      return;
    }
    await sleep(intervalMs);
  }
  // soft timeout; proceed anyway (don’t fail the whole sync)
  console.warn("Freshness wait timed out; proceeding to fetch slips.");
}
// Generalized function to fetch bet slips with retry logic
async function fetchBetSlips(internalId, status = "pending", limit = 200) {
  const qs = new URLSearchParams({
    status: status,
    type: "single",
    betType: "straight",
    limit: String(limit)
  });
  const url = `https://api.sharpsports.io/v1/bettors/${internalId}/betSlips?${qs.toString()}`;
  const attempt = async ()=>{
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Token ${SHARP_PRIVATE_KEY}`
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };
  // retry 3x with backoff
  const backoffs = [
    0,
    1000,
    2500
  ];
  let lastErr = null;
  for (const wait of backoffs){
    if (wait) await sleep(wait);
    try {
      return await attempt();
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(`sharpsports_failed: ${String(lastErr)}`);
}

// Fetch pending bets
async function fetchPendingSingles(internalId) {
  return fetchBetSlips(internalId, "pending", 200);
}

// Fetch historical/completed bets for statistics
async function fetchHistoricalBets(internalId, limit = 50) {
  return fetchBetSlips(internalId, "completed", limit);
}

// Calculate stats from bet rows
function calculateBettorStats(completedBets) {
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
async function updateUserProfileStats(supabase, userId) {
  try {
    // Fetch all completed bets for this user
    const { data: bets, error: fetchError } = await supabase
      .from('bets')
      .select('result, units_won_lost, units_risked')
      .eq('user_id', userId)
      .eq('is_processed', true);

    if (fetchError) {
      console.error(`Error fetching bets for stats calculation:`, fetchError.message);
      return;
    }

    if (!bets || bets.length === 0) {
      console.log(`No completed bets to calculate stats from`);
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
      console.error(`Error updating profile stats:`, updateError.message);
    } else {
      console.log(`Updated profile stats: ${stats.total_bets} bets, ${stats.win_rate}% WR, ${stats.units_gained} units`);
    }
  } catch (error) {
    console.error(`Error in updateUserProfileStats:`, error.message);
  }
}

// Calculate fade confidence score and statline
async function calculateFadeConfidence(supabase, userId) {
  try {
    console.log(`Calculating fade confidence for user ${userId}...`);

    // Fetch all completed bets with detailed info for fade confidence
    const { data: allBets, error: fetchError } = await supabase
      .from('bets')
      .select('result, units_won_lost, units_risked, sport, bet_type, home_team, away_team, position, timestamp')
      .eq('user_id', userId)
      .eq('is_processed', true)
      .order('timestamp', { ascending: true });

    if (fetchError) {
      console.error(`Error fetching bets for fade confidence:`, fetchError.message);
      return;
    }

    if (!allBets || allBets.length === 0) {
      console.log(`No bets to calculate fade confidence from`);
      // Set default values for users with no bets
      await supabase
        .from('confidence_scores')
        .upsert({
          user_id: userId,
          score: 0,
          worst_bet_id: null,
          statline: "No betting history yet",
          last_calculated: new Date().toISOString()
        }, { onConflict: 'user_id' });
      return;
    }

    // Filter only graded bets (exclude pending/cancelled)
    const gradedBets = allBets.filter(bet =>
      bet.result === "Win" || bet.result === "Loss" || bet.result === "Push"
    );

    if (gradedBets.length === 0) {
      console.log(`No graded bets for fade confidence`);
      await supabase
        .from('confidence_scores')
        .upsert({
          user_id: userId,
          score: 0,
          worst_bet_id: null,
          statline: "No completed bets yet",
          last_calculated: new Date().toISOString()
        }, { onConflict: 'user_id' });
      return;
    }

    // 1. RECENT FORM (last 10 bets) - 40% weight
    const recentBets = gradedBets.slice(-10);
    const recentWins = recentBets.filter(b => b.result === "Win").length;
    const recentTotal = recentBets.filter(b => b.result !== "Push").length;
    const recentFormScore = recentTotal > 0 ? (recentWins / recentTotal) * 100 : 0;

    // 2. SPORT WIN RATE (lifetime) - 30% weight
    // Calculate win rate for each sport
    const sportStats = {};
    gradedBets.forEach(bet => {
      const sport = bet.sport || "Unknown";
      if (!sportStats[sport]) {
        sportStats[sport] = { wins: 0, losses: 0, total: 0 };
      }
      if (bet.result === "Win") sportStats[sport].wins++;
      if (bet.result === "Loss") sportStats[sport].losses++;
      if (bet.result !== "Push") sportStats[sport].total++;
    });

    // Find sport with most bets (primary sport)
    let primarySport = null;
    let maxBets = 0;
    Object.entries(sportStats).forEach(([sport, stats]) => {
      if (stats.total > maxBets) {
        maxBets = stats.total;
        primarySport = sport;
      }
    });

    const sportLifetimeScore = primarySport && sportStats[primarySport].total > 0
      ? (sportStats[primarySport].wins / sportStats[primarySport].total) * 100
      : 0;

    // 3. MARKET TYPE RECORD - 20% weight
    // Calculate win rate by bet type (spread, total, moneyline)
    const marketStats = {};
    gradedBets.forEach(bet => {
      const marketType = bet.bet_type || "Unknown";
      if (!marketStats[marketType]) {
        marketStats[marketType] = { wins: 0, losses: 0, total: 0 };
      }
      if (bet.result === "Win") marketStats[marketType].wins++;
      if (bet.result === "Loss") marketStats[marketType].losses++;
      if (bet.result !== "Push") marketStats[marketType].total++;
    });

    // Calculate average market type win rate
    const marketWinRates = Object.values(marketStats)
      .filter(stats => stats.total > 0)
      .map(stats => (stats.wins / stats.total) * 100);
    const marketTypeScore = marketWinRates.length > 0
      ? marketWinRates.reduce((sum, rate) => sum + rate, 0) / marketWinRates.length
      : 0;

    // 4. BIG BET RECORD (>2 units) - 10% weight
    const bigBets = gradedBets.filter(bet =>
      bet.units_risked && parseFloat(bet.units_risked) > 2
    );
    const bigBetWins = bigBets.filter(b => b.result === "Win").length;
    const bigBetTotal = bigBets.filter(b => b.result !== "Push").length;
    const bigBetScore = bigBetTotal > 0 ? (bigBetWins / bigBetTotal) * 100 : 0;

    // CALCULATE FADE CONFIDENCE (clamped between 0-100)
    const fadeConfidence = Math.max(0, Math.min(100, 100 - (
      (0.4 * recentFormScore) +
      (0.3 * sportLifetimeScore) +
      (0.2 * marketTypeScore) +
      (0.1 * bigBetScore)
    )));

    // FIND WORST PERFORMING CATEGORY FOR STATLINE
    const worstCategory = findWorstCategory(gradedBets, sportStats, marketStats);

    console.log(`Fade confidence: ${fadeConfidence.toFixed(1)}, Statline: ${worstCategory.statline}`);

    // Store in database
    const { error: upsertError } = await supabase
      .from('confidence_scores')
      .upsert({
        user_id: userId,
        score: parseFloat(fadeConfidence.toFixed(1)),
        worst_bet_id: worstCategory.id,
        statline: worstCategory.statline,
        last_calculated: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (upsertError) {
      console.error(`Error upserting confidence score:`, upsertError.message);
    } else {
      console.log(`✅ Fade confidence calculated and stored`);
    }

  } catch (error) {
    console.error(`Error in calculateFadeConfidence:`, error.message);
  }
}

// Helper: Find worst performing category (sport, market type, or team)
function findWorstCategory(gradedBets, sportStats, marketStats) {
  const categories = [];

  // 1. Check sports
  Object.entries(sportStats).forEach(([sport, stats]) => {
    if (stats.total >= 5) { // Only consider if at least 5 bets
      const winRate = (stats.wins / stats.total) * 100;
      categories.push({
        type: "sport",
        id: sport,
        wins: stats.wins,
        losses: stats.losses,
        total: stats.total,
        winRate: winRate,
        statline: `He's ${stats.wins}-${stats.losses} betting on ${sport}`
      });
    }
  });

  // 2. Check market types
  Object.entries(marketStats).forEach(([marketType, stats]) => {
    if (stats.total >= 5) { // Only consider if at least 5 bets
      const winRate = (stats.wins / stats.total) * 100;
      categories.push({
        type: "market",
        id: marketType,
        wins: stats.wins,
        losses: stats.losses,
        total: stats.total,
        winRate: winRate,
        statline: `He's ${stats.wins}-${stats.losses} on ${marketType} bets`
      });
    }
  });

  // 3. Check teams (both home and away)
  const teamStats = {};
  gradedBets.forEach(bet => {
    // Determine which team the user bet on based on position field
    let team = null;

    if (bet.position) {
      const pos = bet.position.toLowerCase();

      // Check if position contains "home" or "away"
      if (pos.includes("home") && bet.home_team) {
        team = bet.home_team;
      } else if (pos.includes("away") && bet.away_team) {
        team = bet.away_team;
      } else {
        // For moneylines, position might be the team name directly
        // Check if position matches either team name
        if (bet.home_team && pos.includes(bet.home_team.toLowerCase())) {
          team = bet.home_team;
        } else if (bet.away_team && pos.includes(bet.away_team.toLowerCase())) {
          team = bet.away_team;
        }
      }
    }

    // Only track if we successfully identified a team
    if (team) {
      if (!teamStats[team]) {
        teamStats[team] = { wins: 0, losses: 0, total: 0 };
      }
      if (bet.result === "Win") teamStats[team].wins++;
      if (bet.result === "Loss") teamStats[team].losses++;
      if (bet.result !== "Push") teamStats[team].total++;
    }
  });

  Object.entries(teamStats).forEach(([team, stats]) => {
    if (stats.total >= 3) { // Only consider if at least 3 bets on this team
      const winRate = (stats.wins / stats.total) * 100;
      categories.push({
        type: "team",
        id: team,
        wins: stats.wins,
        losses: stats.losses,
        total: stats.total,
        winRate: winRate,
        statline: `He's ${stats.wins}-${stats.losses} betting on the ${team}`
      });
    }
  });

  // Find the category with lowest win rate
  if (categories.length === 0) {
    return {
      type: "none",
      id: null,
      statline: "Not enough data for analysis"
    };
  }

  categories.sort((a, b) => a.winRate - b.winRate);
  return categories[0];
}

serve(async (req)=>{
  if (req.method === "OPTIONS") return new Response(null, {
    headers: cors
  });
  try {
    const { internalId, userId, bettorAccountId, forceRefresh = true } = await req.json();
    if (!internalId || !userId) {
      return json({
        error: "internalId and userId required"
      }, 400);
    }
    console.log(`Syncing bets for bettor ${internalId}, user ${userId}, scope: ${bettorAccountId ? `bettorAccount ${bettorAccountId}` : "bettor"}, forceRefresh: ${forceRefresh}`);

    // 1) REFRESH (optional based on forceRefresh parameter)
    let refreshResponse = null;

    if (forceRefresh) {
      console.log("Triggering refresh...");
      refreshResponse = await triggerRefresh({
        internalId,
        bettorAccountId
      });
      console.log("Refresh response:", JSON.stringify(refreshResponse));
    } else {
      console.log("Skipping refresh (forceRefresh=false)");
    }

    // 2) CHECK FOR 2FA/OTP REQUIRED (only if refresh was triggered)
    if (refreshResponse && refreshResponse.otpRequired && refreshResponse.otpRequired.length > 0) {
      console.log(`OTP required for accounts: ${refreshResponse.otpRequired.join(', ')}`);
      return json({
        status: "otp_required",
        cid: refreshResponse.cid,
        accounts: refreshResponse.otpRequired,
        otpUrl: `https://ui.sharpsports.io/otp/${refreshResponse.cid}`,
        message: "2FA verification required. Please enter the code sent to your sportsbook account."
      });
    }

    // 3) CHECK FOR UNVERIFIED ACCOUNTS (need re-linking)
    if (refreshResponse && refreshResponse.unverified && refreshResponse.unverified.length > 0) {
      console.log(`Unverified accounts detected: ${refreshResponse.unverified.join(', ')}`);
      // Get a new context ID for re-linking
      const contextData = await getBetSyncContext(internalId);
      return json({
        status: "relink_required",
        cid: contextData.cid,
        accounts: refreshResponse.unverified,
        linkUrl: `https://ui.sharpsports.io/link/${contextData.cid}`,
        message: "Account verification expired. Please re-link your sportsbook account."
      });
    }

    // 4) CHECK FOR NO ACCESS (credentials invalid - need re-linking)
    if (refreshResponse && refreshResponse.noAccess && refreshResponse.noAccess.length > 0) {
      console.log(`No access to accounts: ${refreshResponse.noAccess.join(', ')}`);
      const contextData = await getBetSyncContext(internalId);
      return json({
        status: "relink_required",
        cid: contextData.cid,
        accounts: refreshResponse.noAccess,
        linkUrl: `https://ui.sharpsports.io/link/${contextData.cid}`,
        message: "Account access lost. Please re-link your sportsbook account."
      });
    }

    // 5) CHECK FOR RATE LIMITING
    if (refreshResponse && refreshResponse.rateLimited && refreshResponse.rateLimited.length > 0) {
      console.log(`Rate limited accounts: ${refreshResponse.rateLimited.join(', ')}`);
      return json({
        status: "rate_limited",
        accounts: refreshResponse.rateLimited,
        message: "Too many refresh requests. Please wait a moment and try again.",
        retryAfter: 60
      }, 429);
    }

    // 6) CHECK FOR UNVERIFIABLE ACCOUNTS
    if (refreshResponse && refreshResponse.isUnverifiable && refreshResponse.isUnverifiable.length > 0) {
      console.log(`Unverifiable accounts: ${refreshResponse.isUnverifiable.join(', ')}`);
      return json({
        status: "unverifiable",
        accounts: refreshResponse.isUnverifiable,
        message: "These accounts cannot be verified. Please contact support."
      }, 400);
    }

    // 7) CHECK FOR INACTIVE BOOKS/REGIONS
    if (refreshResponse && refreshResponse.bookInactive && refreshResponse.bookInactive.length > 0) {
      console.log(`Inactive book accounts: ${refreshResponse.bookInactive.join(', ')}`);
      return json({
        status: "book_inactive",
        accounts: refreshResponse.bookInactive,
        message: "This sportsbook is currently inactive."
      }, 400);
    }

    if (refreshResponse && refreshResponse.bookRegionInactive && refreshResponse.bookRegionInactive.length > 0) {
      console.log(`Inactive region accounts: ${refreshResponse.bookRegionInactive.join(', ')}`);
      return json({
        status: "region_inactive",
        accounts: refreshResponse.bookRegionInactive,
        message: "This sportsbook region is currently inactive."
      }, 400);
    }

    // 8) CHECK FOR SDK/AUTH PARAMETER REQUIRED
    if (refreshResponse && refreshResponse.authParameterRequired && refreshResponse.authParameterRequired.length > 0) {
      console.log(`Auth parameter required: ${refreshResponse.authParameterRequired.join(', ')}`);
      return json({
        status: "sdk_required",
        accounts: refreshResponse.authParameterRequired,
        message: "This sportsbook requires SDK authentication."
      }, 400);
    }

    // 9) CHECK FOR EXTENSION UPDATE REQUIRED
    if (refreshResponse && refreshResponse.extensionUpdateRequired && refreshResponse.extensionUpdateRequired.length > 0) {
      console.log(`Extension update required: ${refreshResponse.extensionUpdateRequired.join(', ')}`);
      return json({
        status: "extension_update_required",
        accounts: refreshResponse.extensionUpdateRequired,
        extensionDownloadUrl: refreshResponse.extensionDownloadUrl,
        message: "Browser extension update required."
      }, 400);
    }

    // 10) CHECK IF ANY ACCOUNTS SUCCESSFULLY REFRESHED (only if refresh was triggered)
    if (forceRefresh && (!refreshResponse || !refreshResponse.refresh || refreshResponse.refresh.length === 0)) {
      console.log("No accounts were successfully refreshed");
      return json({
        status: "no_accounts_refreshed",
        message: "No accounts were available to refresh. Please check account status."
      }, 400);
    }

    if (refreshResponse && refreshResponse.refresh) {
      console.log(`Successfully refreshed accounts: ${refreshResponse.refresh.join(', ')}`);
    }

    // 11) WAIT FOR FRESHNESS (only if refresh was triggered)
    if (forceRefresh) {
      await waitForFreshness({
        internalId
      });
    }

    // 12) FETCH both pending and historical slips
    console.log("Fetching pending and historical bets...");
    const [pendingSlips, historicalSlips] = await Promise.all([
      fetchPendingSingles(internalId),
      fetchHistoricalBets(internalId, 50) // Fetch last 50 historical bets for statistics
    ]);

    // 13) Transform rows - helper function to avoid duplication
    const transformSlipToRows = (slip, isPending = true) => {
      const slipRows = [];

      // Determine result based on outcome
      let result = "Pending";
      if (!isPending) {
        if (slip.outcome === "win") result = "Win";
        else if (slip.outcome === "loss") result = "Loss";
        else if (slip.outcome === "push") result = "Push";
        else if (slip.outcome === "void") result = "Cancelled";
        else if (slip.outcome === "cashout") result = "Cancelled"; // Treat cashout as cancelled
        else if (slip.outcome === "halfwin") result = "Win"; // Half win counts as win
        else if (slip.outcome === "halfloss") result = "Loss"; // Half loss counts as loss
        else result = "Pending"; // Fallback
      }

      for (const b of slip.bets ?? []) {
        // Skip invalid bets
        if (!slip.id || !b.id) {
          console.warn("Skipping bet with missing ID", { slipId: slip.id, betId: b.id });
          continue;
        }

        // Use timePlaced as timestamp, fallback to current time
        const timestamp = slip.timePlaced
          ? new Date(slip.timePlaced).toISOString()
          : new Date().toISOString();

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
          bet_type: b.proposition ?? "unknown",
          odds: String(b.oddsAmerican ?? b.oddsDecimal ?? ""),
          units_risked: slip.atRisk ?? null,
          units_to_win: slip.toWin ?? null,
          units_won_lost: parseFloat(slip.netProfit ?? 0),
          event_start_time: b.event?.startTime
            ? new Date(b.event.startTime).toISOString()
            : null,
          away_team: b.event?.contestantAway?.fullName ?? null,
          home_team: b.event?.contestantHome?.fullName ?? null,
          result: result,
          is_processed: !isPending,
          timestamp: timestamp, // Add timestamp field
          updated_at: new Date().toISOString()
        });
      }

      return slipRows;
    };

    // 14) Process pending bets
    const pendingRows = [];
    for (const slip of pendingSlips ?? []) {
      if (slip.status === "pending") {
        pendingRows.push(...transformSlipToRows(slip, true));
      }
    }

    // 15) Process historical bets
    const historicalRows = [];
    for (const slip of historicalSlips ?? []) {
      if (slip.status !== "pending") {
        historicalRows.push(...transformSlipToRows(slip, false));
      }
    }

    // 16) Combine all rows
    const rows = [...pendingRows, ...historicalRows];

    console.log(`Found ${pendingRows.length} pending bets and ${historicalRows.length} historical bets to sync`);

    if (!rows.length) {
      console.log("No bets to sync");
      return json({
        status: "success",
        message: "No bets found to sync",
        inserted: 0,
        pending: 0,
        historical: 0
      });
    }

    // 17) UPSERT to database
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false
      }
    });

    const { error } = await supabase.from("bets").upsert(rows, {
      onConflict: "user_id,slip_id,bet_id",
      ignoreDuplicates: false
    });

    if (error) {
      console.error("Database upsert error:", error);
      return json({
        status: "error",
        error: "db_upsert_failed",
        detail: error.message
      }, 500);
    }

    console.log(`Successfully synced ${rows.length} bets (${pendingRows.length} pending, ${historicalRows.length} historical)`);

    // 18) UPDATE USER PROFILE STATS
    console.log("Updating user profile stats...");
    await updateUserProfileStats(supabase, userId);

    // 19) CALCULATE FADE CONFIDENCE SCORE AND STATLINE
    console.log("Calculating fade confidence...");
    await calculateFadeConfidence(supabase, userId);

    return json({
      status: "success",
      message: "Bets synced successfully",
      inserted: rows.length,
      pending: pendingRows.length,
      historical: historicalRows.length,
      scope: bettorAccountId ? "bettorAccount" : "bettor",
      refreshedAccounts: refreshResponse.refresh
    });
  } catch (e) {
    console.error("Sync error:", e);
    const errorMessage = e instanceof Error ? e.message : "unknown";
    return json({
      status: "error",
      error: errorMessage
    }, 500);
  }
});
