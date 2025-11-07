import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WeeklyLeaderboardUser {
  id: string;
  username: string | null;
  totalBets: number;
  winRate: number;
  roi: number;
  unitsGained: number;
  isCurrentUser: boolean;
}

// Get the start of the current week (Monday 00:00:00)
function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // Calculate days to subtract to get to Monday
  // If Sunday (0), subtract 6 days; otherwise subtract (day - 1) days
  const daysToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0); // Set to start of Monday
  return monday;
}

// Calculate weekly stats for a user
async function calculateWeeklyStats(
  supabase: any,
  userId: string
): Promise<{ totalBets: number; winRate: number; roi: number; unitsGained: number } | null> {
  try {
    // Get bets from current week (Monday to Sunday)
    const weekStart = getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7); // End of Sunday

    const { data: bets, error } = await supabase
      .from("bets")
      .select("result, units_won_lost, units_risked")
      .eq("user_id", userId)
      .in("result", ["Win", "Loss", "Push"])
      .gte("created_at", weekStart.toISOString())
      .lt("created_at", weekEnd.toISOString());

    if (error) {
      console.error(`Error fetching weekly bets for user ${userId}:`, error);
      return null;
    }

    if (!bets || bets.length === 0) {
      return null;
    }

    // Filter only graded bets (Win, Loss) - exclude Push
    const gradedBets = bets.filter((bet) => bet.result === "Win" || bet.result === "Loss");

    if (gradedBets.length === 0) {
      return null;
    }

    const wins = bets.filter((bet) => bet.result === "Win").length;
    const losses = bets.filter((bet) => bet.result === "Loss").length;
    const totalBets = wins + losses;

    const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;

    // Calculate net profit (units gained/lost)
    const unitsGained = bets.reduce((sum, bet) => {
      const wonLost = parseFloat(String(bet.units_won_lost)) || 0;
      return sum + wonLost;
    }, 0);

    // Calculate total units risked for ROI
    const totalRisked = bets.reduce((sum, bet) => {
      const risked = parseFloat(String(bet.units_risked)) || 0;
      return sum + risked;
    }, 0);

    // ROI = (net profit / total risked) * 100
    const roi = totalRisked > 0 ? (unitsGained / totalRisked) * 100 : 0;

    return {
      totalBets,
      winRate: parseFloat(winRate.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
      unitsGained: parseFloat(unitsGained.toFixed(2)),
    };
  } catch (error) {
    console.error(`Error calculating weekly stats for user ${userId}:`, error);
    return null;
  }
}

// Main function to get weekly leaderboard
async function getWeeklyLeaderboard(
  supabase: any,
  currentUserId?: string
): Promise<WeeklyLeaderboardUser[]> {
  try {
    console.log("📊 [WEEKLY_LEADERBOARD] Fetching all user profiles...");

    // Get all user profiles
    const { data: profiles, error: profileError } = await supabase
      .from("user_profiles")
      .select("id, username, total_bets, win_rate, roi, units_gained");

    if (profileError) {
      console.error("Error fetching user profiles:", profileError);
      return [];
    }

    if (!profiles || profiles.length === 0) {
      console.log("No user profiles found");
      return [];
    }

    console.log(`📊 [WEEKLY_LEADERBOARD] Found ${profiles.length} user profiles`);

    // Calculate weekly stats for each user
    const leaderboardData: WeeklyLeaderboardUser[] = [];

    for (const profile of profiles) {
      const weeklyStats = await calculateWeeklyStats(supabase, profile.id);

      // Only include users with 5+ bets in the current week
      if (weeklyStats && weeklyStats.totalBets >= 5) {
        leaderboardData.push({
          id: profile.id,
          username: profile.username,
          totalBets: weeklyStats.totalBets,
          winRate: weeklyStats.winRate,
          roi: weeklyStats.roi,
          unitsGained: weeklyStats.unitsGained,
          isCurrentUser: currentUserId ? profile.id === currentUserId : false,
        });
      }
    }

    // Sort by win rate ascending (worst first, lowest win rate at #1)
    leaderboardData.sort((a, b) => a.winRate - b.winRate);

    console.log(
      `📊 [WEEKLY_LEADERBOARD] Found ${leaderboardData.length} users with 5+ bets this week (Monday-Sunday)`
    );

    return leaderboardData;
  } catch (error) {
    console.error("Error in getWeeklyLeaderboard:", error);
    return [];
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role
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

    const { currentUserId } = await req.json();

    console.log(`Fetching weekly leaderboard for currentUserId=${currentUserId}`);

    const leaderboard = await getWeeklyLeaderboard(supabaseClient, currentUserId);

    return new Response(JSON.stringify({ data: leaderboard }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in calculate-weekly-leaderboard function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

