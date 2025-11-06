import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to calculate win rate from bet array
function calculateWinRate(bets: any[]): number {
  const gradedBets = bets.filter(b => b.result !== "Push");
  if (gradedBets.length === 0) return 0;

  const wins = bets.filter(b => b.result === "Win").length;
  const winRate = (wins / gradedBets.length) * 100;

  return winRate;
}

// Helper to calculate stats from bet array (for statline display)
function calculateStats(bets: any[]) {
  const gradedBets = bets.filter(b => b.result !== "Push");
  const wins = bets.filter(b => b.result === "Win").length;
  const losses = bets.filter(b => b.result === "Loss").length;
  const total = gradedBets.length;
  const winRate = total > 0 ? (wins / total) * 100 : 0;

  return { wins, losses, total, winRate };
}

// Helper to format statline in "won/lost X of his last Y" format
function formatStatline(wins: number, losses: number, label: string): string {
  const total = wins + losses;

  if (wins > losses) {
    return `He's won ${wins} of his last ${total} ${label}`;
  } else if (losses > wins) {
    return `He's lost ${losses} of his last ${total} ${label}`;
  } else {
    // Equal wins and losses
    return `He's split ${wins}-${losses} in his last ${total} ${label}`;
  }
}

// Main function to calculate bet-specific statline
async function calculateBetStatline(supabase: any, userId: string, betSlipId: string) {
  try {
    console.log(`🔍 [STATLINE] Calculating for user ${userId}, betSlip ${betSlipId}`);

    // 1. Get the specific bet details
    const { data: targetBet, error: betError } = await supabase
      .from('bets')
      .select('id, slip_id, bet_id, sport, bet_type, position, home_team, away_team, units_risked')
      .eq('slip_id', betSlipId)
      .eq('user_id', userId)
      .single();

    if (betError) {
      console.error(`❌ [STATLINE] Error fetching target bet:`, betError);
      console.error(`❌ [STATLINE] Error code: ${betError.code}, message: ${betError.message}`);

      // Check if error is due to multiple rows
      if (betError.code === 'PGRST116') {
        console.error(`❌ [STATLINE] Multiple bets found with slip_id ${betSlipId} - this should not happen for single straight bets!`);
      }

      return {
        statline: "No statline available",
        fadeConfidence: 0,
        metric: "error"
      };
    }

    if (!targetBet) {
      console.error(`❌ [STATLINE] No bet found with slip_id ${betSlipId}`);
      return {
        statline: "No bet data available",
        fadeConfidence: 0,
        metric: "error"
      };
    }

    const { id, slip_id, bet_id, sport, bet_type, position, home_team, away_team } = targetBet;

    console.log(`✅ [STATLINE] Target bet found:`, {
      id,
      slip_id,
      bet_id,
      sport,
      bet_type,
      position,
      home_team,
      away_team
    });

    // 2. Fetch all historical graded bets for this user
    console.log(`📊 [STATLINE] Fetching historical bets for user ${userId}...`);

    const { data: allBets, error: fetchError } = await supabase
      .from('bets')
      .select('sport, bet_type, position, home_team, away_team, result, timestamp, units_risked')
      .eq('user_id', userId)
      .in('result', ['Win', 'Loss', 'Push'])
      .order('timestamp', { ascending: false });

    if (fetchError) {
      console.error(`❌ [STATLINE] Error fetching historical bets:`, fetchError);
      return {
        statline: "Error fetching bet history",
        fadeConfidence:50,
        metric: "error"
      };
    }

    if (!allBets || allBets.length === 0) {
      console.log(`⚠️ [STATLINE] No betting history found for user ${userId}`);
      return {
        statline: "No betting history yet",
        fadeConfidence: 0,
        metric: "no_history"
      };
    }

    console.log(`✅ [STATLINE] Found ${allBets.length} historical bets for analysis`);

    // 3. Calculate the 4 metrics per PDF specification (ALL SPORT-SPECIFIC)

    // First, filter all bets to this sport only
    const sportBets = allBets.filter(b => b.sport === sport);
    console.log(`📊 Found ${sportBets.length} historical ${sport} bets for sport-specific metrics`);

    // METRIC 1: Recent Form (last 10 bets IN THIS SPORT) - 40% weight
    const recentBets = sportBets.slice(0, 10);
    const recentFormWinRate = calculateWinRate(recentBets);
    console.log(`📊 Recent Form: ${recentFormWinRate.toFixed(1)}% over last ${recentBets.length} ${sport} bets`);

    // METRIC 2: Sport Win Rate (lifetime in this sport) - 30% weight
    const sportLifetimeWinRate = calculateWinRate(sportBets);
    console.log(`📊 Sport Lifetime: ${sportLifetimeWinRate.toFixed(1)}% over ${sportBets.length} ${sport} bets`);

    // METRIC 3: Market Type Record (in this sport) - 20% weight
    const marketBets = sportBets.filter(b => b.bet_type === bet_type);
    const marketTypeWinRate = calculateWinRate(marketBets);
    const marketLabel = bet_type === 'moneyline' ? 'moneylines' :
                       bet_type === 'spread' ? 'spreads' :
                       bet_type === 'total' ? 'totals' : bet_type;
    console.log(`📊 Market Type: ${marketTypeWinRate.toFixed(1)}% over ${marketBets.length} ${sport} ${marketLabel}`);

    // METRIC 4: Big Bet Record (>2 units IN THIS SPORT) - 10% weight
    const bigBets = sportBets.filter(b => {
      const units = parseFloat(String(b.units_risked || 0));
      return units > 2;
    });
    const bigBetWinRate = calculateWinRate(bigBets);
    console.log(`📊 Big Bets: ${bigBetWinRate.toFixed(1)}% over ${bigBets.length} ${sport} bets >2 units`);

    // 4. Calculate weighted fade confidence per PDF formula
    // fade_confidence = 100 - ((0.4 * recent_form) + (0.3 * sport_lifetime) + (0.2 * market_type) + (0.1 * big_bet))
    const weightedWinRate = (
      (0.4 * recentFormWinRate) +
      (0.3 * sportLifetimeWinRate) +
      (0.2 * marketTypeWinRate) +
      (0.1 * bigBetWinRate)
    );

    // Round to 1 decimal place for display
    const fadeConfidence = Math.max(1, Math.min(99, 100 - weightedWinRate));

    console.log(`🎯 Weighted Win Rate (Sport-Specific): ${weightedWinRate.toFixed(1)}%`);
    console.log(`🎯 Fade Confidence: ${fadeConfidence.toFixed(1)}%`);

    // 5. Find lowest-performing category for statline (per PDF spec, SPORT-SPECIFIC)
    const statlineCategories: any[] = [];

    // Category 1: Team Record (in this sport only)
    if (position && sport) {
      let targetTeam = null;
      const pos = position.toLowerCase();

      if (pos.includes("home") && home_team) {
        targetTeam = home_team;
      } else if (pos.includes("away") && away_team) {
        targetTeam = away_team;
      } else {
        if (home_team && pos.includes(home_team.toLowerCase())) {
          targetTeam = home_team;
        } else if (away_team && pos.includes(away_team.toLowerCase())) {
          targetTeam = away_team;
        }
      }

      if (targetTeam) {
        // Use sportBets (already filtered to this sport) instead of allBets
        const teamBets = sportBets.filter((b: any) => {
          const betPos = (b.position || '').toLowerCase();
          const betHomeTeam = b.home_team || '';
          const betAwayTeam = b.away_team || '';

          if (betPos.includes("home") && betHomeTeam === targetTeam) return true;
          if (betPos.includes("away") && betAwayTeam === targetTeam) return true;
          if (betHomeTeam && betPos.includes(betHomeTeam.toLowerCase()) && betHomeTeam === targetTeam) return true;
          if (betAwayTeam && betPos.includes(betAwayTeam.toLowerCase()) && betAwayTeam === targetTeam) return true;

          return false;
        });

        if (teamBets.length >= 3) {
          const stats = calculateStats(teamBets);
          // Remove "the" from team name if present
          const teamName = targetTeam.replace(/^the\s+/i, '').trim();
          statlineCategories.push({
            type: 'team',
            ...stats,
            label: `betting on ${teamName}`
          });
          console.log(`📊 Team category: ${stats.wins}-${stats.losses} (${stats.winRate.toFixed(1)}%) on ${teamName}`);
        }
      }
    }

    // Category 2: Market Type Record
    if (marketBets.length >= 3) {
      const stats = calculateStats(marketBets);
      statlineCategories.push({
        type: 'market',
        ...stats,
        label: `${sport} ${marketLabel}`
      });
      console.log(`📊 Market category: ${stats.wins}-${stats.losses} (${stats.winRate.toFixed(1)}%) on ${sport} ${marketLabel}`);
    }

    // Category 3: Sport Record
    if (sportBets.length >= 3) {
      const stats = calculateStats(sportBets);
      statlineCategories.push({
        type: 'sport',
        ...stats,
        label: `${sport} bets`
      });
      console.log(`📊 Sport category: ${stats.wins}-${stats.losses} (${stats.winRate.toFixed(1)}%) on ${sport}`);
    }

    // 6. Select lowest-performing category for statline
    let statline: string;
    let statlineMetric: string;

    if (statlineCategories.length === 0) {
      // Fallback: use recent form
      const stats = calculateStats(recentBets);
      statline = formatStatline(stats.wins, stats.losses, 'bets');
      statlineMetric = 'recent_form_fallback';
      console.log(`� Using fallback statline: recent form`);
    } else {
      // Sort by win rate (ascending) to get lowest-performing
      const lowestPerforming = statlineCategories.sort((a, b) => a.winRate - b.winRate)[0];
      statline = formatStatline(lowestPerforming.wins, lowestPerforming.losses, lowestPerforming.label);
      statlineMetric = lowestPerforming.type;
      console.log(`📊 Lowest-performing category: ${lowestPerforming.type} with ${lowestPerforming.winRate.toFixed(1)}% win rate`);
    }

    const result = {
      statline,
      fadeConfidence: fadeConfidence,
      metric: statlineMetric
    };

    console.log(`📤 [STATLINE] Returning result for slip_id ${betSlipId}:`, result);
    return result;

  } catch (error: any) {
    console.error(`❌ [STATLINE] Unexpected error in calculateBetStatline:`, error);
    console.error(`❌ [STATLINE] Error stack:`, error.stack);
    return {
      statline: "Error calculating statline",
      fadeConfidence: 0,
      metric: "error"
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role for testing (no auth required)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { userId, betSlipId } = await req.json();

    if (!userId || !betSlipId) {
      return new Response(
        JSON.stringify({ error: "Missing userId or betSlipId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Calculating statline for userId=${userId}, betSlipId=${betSlipId}`);

    const result = await calculateBetStatline(supabaseClient, userId, betSlipId);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in calculate-bet-statline function:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

