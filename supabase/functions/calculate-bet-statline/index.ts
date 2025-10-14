import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to calculate stats from bet array
function calculateStats(bets: any[]) {
  const gradedBets = bets.filter(b => b.result !== "Push");
  const wins = bets.filter(b => b.result === "Win").length;
  const losses = bets.filter(b => b.result === "Loss").length;
  const total = gradedBets.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  return { wins, losses, total, winRate };
}

// Main function to calculate bet-specific statline
async function calculateBetStatline(supabase: any, userId: string, betSlipId: string) {
  try {
    console.log(`Calculating statline for user ${userId}, betSlip ${betSlipId}`);

    // 1. Get the specific bet details
    const { data: targetBet, error: betError } = await supabase
      .from('bets')
      .select('sport, bet_type, position, home_team, away_team')
      .eq('slip_id', betSlipId)
      .eq('user_id', userId)
      .single();

    if (betError || !targetBet) {
      console.error('Error fetching target bet:', betError?.message);
      return {
        statline: "No bet data available",
        fadeConfidence: 50,
        metric: "error"
      };
    }

    const { sport, bet_type, position, home_team, away_team } = targetBet;

    console.log(`Target bet: sport=${sport}, bet_type=${bet_type}, position=${position}`);

    // 2. Fetch all historical graded bets for this user
    const { data: allBets, error: fetchError } = await supabase
      .from('bets')
      .select('sport, bet_type, position, home_team, away_team, result, timestamp')
      .eq('user_id', userId)
      .in('result', ['Win', 'Loss', 'Push'])
      .order('timestamp', { ascending: false });

    if (fetchError) {
      console.error('Error fetching historical bets:', fetchError.message);
      return {
        statline: "Error fetching bet history",
        fadeConfidence: 50,
        metric: "error"
      };
    }

    if (!allBets || allBets.length === 0) {
      return {
        statline: "No betting history yet",
        fadeConfidence: 50,
        metric: "no_history"
      };
    }

    console.log(`Found ${allBets.length} historical bets`);

    // 3. Calculate candidate metrics
    const metrics: any[] = [];

    // METRIC 1: Team Record (user's record betting on this specific team)
    if (position && sport) {
      // Determine which team the user bet on
      let targetTeam = null;
      const pos = position.toLowerCase();

      if (pos.includes("home") && home_team) {
        targetTeam = home_team;
      } else if (pos.includes("away") && away_team) {
        targetTeam = away_team;
      } else {
        // For moneylines, position might be the team name directly
        if (home_team && pos.includes(home_team.toLowerCase())) {
          targetTeam = home_team;
        } else if (away_team && pos.includes(away_team.toLowerCase())) {
          targetTeam = away_team;
        }
      }

      if (targetTeam) {
        const teamBets = allBets.filter(b => {
          if (b.sport !== sport) return false;
          
          const betPos = (b.position || '').toLowerCase();
          const betHomeTeam = b.home_team || '';
          const betAwayTeam = b.away_team || '';
          
          // Check if this bet was on the same team
          if (betPos.includes("home") && betHomeTeam === targetTeam) return true;
          if (betPos.includes("away") && betAwayTeam === targetTeam) return true;
          if (betHomeTeam && betPos.includes(betHomeTeam.toLowerCase()) && betHomeTeam === targetTeam) return true;
          if (betAwayTeam && betPos.includes(betAwayTeam.toLowerCase()) && betAwayTeam === targetTeam) return true;
          
          return false;
        });

        if (teamBets.length >= 3) {
          const stats = calculateStats(teamBets);
          metrics.push({
            type: 'team_record',
            ...stats,
            label: `betting on ${targetTeam}`,
            priority: 1 // Highest priority
          });
          console.log(`Team metric: ${stats.wins}-${stats.losses} (${stats.winRate}%) on ${targetTeam}`);
        } else {
          console.log(`Team metric skipped: only ${teamBets.length} bets on ${targetTeam}`);
        }
      }
    }

    // METRIC 2: Market Record (user's record on this market type in this sport)
    if (sport && bet_type) {
      const marketBets = allBets.filter(b => 
        b.sport === sport && b.bet_type === bet_type
      );

      if (marketBets.length >= 3) {
        const stats = calculateStats(marketBets);
        const marketLabel = bet_type === 'moneyline' ? 'moneylines' : 
                           bet_type === 'spread' ? 'spreads' : 
                           bet_type === 'total' ? 'totals' : bet_type;
        metrics.push({
          type: 'market_record',
          ...stats,
          label: `${sport} ${marketLabel}`,
          priority: 2
        });
        console.log(`Market metric: ${stats.wins}-${stats.losses} (${stats.winRate}%) on ${sport} ${marketLabel}`);
      } else {
        console.log(`Market metric skipped: only ${marketBets.length} bets on ${sport} ${bet_type}`);
      }
    }

    // METRIC 3: Sport Record (user's overall record in this sport)
    if (sport) {
      const sportBets = allBets.filter(b => b.sport === sport);

      if (sportBets.length >= 3) {
        const stats = calculateStats(sportBets);
        metrics.push({
          type: 'sport_record',
          ...stats,
          label: `${sport} bets`,
          priority: 3
        });
        console.log(`Sport metric: ${stats.wins}-${stats.losses} (${stats.winRate}%) on ${sport}`);
      } else {
        console.log(`Sport metric skipped: only ${sportBets.length} bets on ${sport}`);
      }
    }

    // METRIC 4: Recent Form (last 10 bets in this sport)
    if (sport) {
      const sportBets = allBets.filter(b => b.sport === sport);
      const recentBets = sportBets.slice(0, 10); // Already sorted by timestamp desc

      if (recentBets.length >= 3) {
        const stats = calculateStats(recentBets);
        metrics.push({
          type: 'recent_form',
          ...stats,
          label: `last ${recentBets.length} ${sport} bets`,
          priority: 4
        });
        console.log(`Recent form metric: ${stats.wins}-${stats.losses} (${stats.winRate}%) in last ${recentBets.length} ${sport} bets`);
      } else {
        console.log(`Recent form metric skipped: only ${recentBets.length} bets in ${sport}`);
      }
    }

    // 4. Choose the most specific metric available (highest priority)
    if (metrics.length === 0) {
      console.log('No sport-specific metrics available, using overall fallback');
      // Fallback: Overall last 10 across all sports
      const overallRecent = allBets.slice(0, 10);
      const stats = calculateStats(overallRecent);

      return {
        statline: `He's ${stats.wins}-${stats.losses} in last ${stats.total} bets`,
        fadeConfidence: Math.max(50, Math.min(99, 100 - stats.winRate)),
        metric: 'fallback_overall'
      };
    }

    // Sort by priority (ascending) to get most specific metric
    // Priority 1 (team) > Priority 2 (market) > Priority 3 (sport) > Priority 4 (recent form)
    const mostSpecificMetric = metrics.sort((a, b) => a.priority - b.priority)[0];

    console.log(`Most specific metric selected: ${mostSpecificMetric.type} (priority ${mostSpecificMetric.priority}) with ${mostSpecificMetric.winRate}% win rate`);

    const statline = `He's ${mostSpecificMetric.wins}-${mostSpecificMetric.losses} ${mostSpecificMetric.label}`;
    const fadeConfidence = Math.max(50, Math.min(99, 100 - mostSpecificMetric.winRate));

    return {
      statline,
      fadeConfidence,
      metric: mostSpecificMetric.type
    };

  } catch (error: any) {
    console.error('Error in calculateBetStatline:', error.message);
    return {
      statline: "Error calculating statline",
      fadeConfidence: 50,
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

