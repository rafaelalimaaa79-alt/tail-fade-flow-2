import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// API Keys
const SPORTSDATAIO_API_KEY = Deno.env.get("SPORTSDATAIO_API_KEY");
const SHARP_PRIVATE_KEY = Deno.env.get("SHARP_SPORT_PRIVATE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json"
    }
  });
}

// Helper function to sleep
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch all users from auth.users table
async function fetchAllAuthUsers(supabase: any): Promise<any[]> {
  console.log("📋 Fetching all users from auth.users...");
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) {
    throw new Error(`Failed to fetch auth users: ${error.message}`);
  }
  console.log(`✅ Found ${users.users?.length || 0} users in auth.users`);
  return users.users || [];
}

// Fetch bet slips from SharpSports API for a single user with pagination
async function fetchBetSlipsForUser(
  internalId: string,
  status: "pending" = "pending",
  types: string[] = ["single", "parlay"],
  maxPages: number = 5
): Promise<any[]> {
  const allSlips: any[] = [];
  const limit = 200;
  
  for (const type of types) {
    let page = 1;
    
    while (page <= maxPages) {
      const qs = new URLSearchParams({
        status: status,
        type: type,
        // betType: "straight",
        limit: String(limit),
        page: String(page)
      });
      
      const url = `https://api.sharpsports.io/v1/bettors/${internalId}/betSlips?${qs.toString()}`;
      
      try {
        const res = await fetch(url, {
          headers: {
            accept: "application/json",
            Authorization: `Token ${SHARP_PRIVATE_KEY}`
          }
        });
        
        if (!res.ok) {
          if (res.status === 404) {
            break; // No more pages for this type
          }
          const errorText = await res.text();
          console.warn(`⚠️ Failed to fetch ${type} bet slips page ${page} for ${internalId}: ${errorText}`);
          break;
        }
        
        const data = await res.json();
        const slips = Array.isArray(data) ? data : (data.results || []);
        
        if (slips.length === 0) {
          break; // No more results
        }
        
        allSlips.push(...slips);
        
        // If we got fewer than limit, we've reached the end
        if (slips.length < limit) {
          break;
        }
        
        page++;
        
        // Rate limiting between pages
        await sleep(300);
      } catch (error) {
        console.error(`❌ Error fetching ${type} bet slips page ${page} for ${internalId}:`, error);
        break;
      }
    }
    
    // Rate limiting between types
    await sleep(300);
  }
  
  return allSlips;
}

// Extract game information from bet slips
interface GameInfo {
  sportsdataioId: string | null;
  eventName: string;
  awayTeam: string;
  homeTeam: string;
  league: string;
  startTime: string;
  startDate: string;
  bets: Array<{
    proposition: string;
    position: string | null;
    line: number | null;
  }>;
}

function extractGamesFromBetSlips(betSlips: any[]): Map<string, GameInfo> {
  const gameMap = new Map<string, GameInfo>();
  
  for (const slip of betSlips) {
    if (!slip.bets || !Array.isArray(slip.bets)) continue;
    
    for (const bet of slip.bets) {
      if (!bet.event) continue;
      
      const event = bet.event;
      const league = event.league || "";
      
      // Filter to only NFL and CFB
      if (league !== "NFL" && league !== "NCAAFB" && league !== "CFB") {
        continue;
      }
      
      // Create unique key for game
      const gameKey = event.sportsdataioId 
        ? `${league}-${event.sportsdataioId}`
        : `${league}-${event.name}-${event.startDate}`;
      
      if (!gameMap.has(gameKey)) {
        gameMap.set(gameKey, {
          sportsdataioId: event.sportsdataioId || null,
          eventName: event.name || "",
          awayTeam: event.contestantAway?.fullName || "",
          homeTeam: event.contestantHome?.fullName || "",
          league: league,
          startTime: event.startTime || "",
          startDate: event.startDate || "",
          bets: []
        });
      }
      
      const game = gameMap.get(gameKey)!;
      game.bets.push({
        proposition: bet.proposition || "",
        position: bet.position || null,
        line: bet.line || null
      });
    }
  }
  
  return gameMap;
}

// Fetch SportsDataIO Betting Splits
async function fetchSportsDataIOBettingSplits(
  sport: "NFL" | "CFB",
  gameId: string
): Promise<any | null> {
  if (!SPORTSDATAIO_API_KEY || !gameId) {
    return null;
  }
  
  try {
    let endpoint: string;
    
    // Determine endpoint based on sport
    if (sport === "NFL") {
      endpoint = `https://api.sportsdata.io/v3/nfl/odds/json/BettingSplitsByScoreId/${gameId}`;
    } else {
      // CFB
      endpoint = `https://api.sportsdata.io/v3/cfb/odds/json/BettingSplitsByGameId/${gameId}`;
    }
    
    console.log(`[SPORTSDATAIO] Fetching betting splits for ${sport} game ${gameId}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(endpoint, {
      headers: {
        "Ocp-Apim-Subscription-Key": SPORTSDATAIO_API_KEY,
        "Accept": "application/json"
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`[SPORTSDATAIO] Failed to fetch betting splits: ${response.status} - ${errorText}`);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[SPORTSDATAIO] Request timeout for game ${gameId}`);
    } else {
      console.error(`[SPORTSDATAIO] Error fetching betting splits:`, error);
    }
    return null;
  }
}

// Extract and normalize betting percentages from SportsDataIO data
interface MarketData {
  marketType: 'spread' | 'moneyline' | 'total';
  publicPercentage: number;
  team: string;
  opponent: string;
  line: string | null;
  betType: string;
}

function extractMarketData(
  splitsData: any,
  gameInfo: GameInfo
): MarketData[] {
  const markets: MarketData[] = [];
  
  if (!splitsData || !splitsData.BettingMarketSplits || !Array.isArray(splitsData.BettingMarketSplits)) {
    return markets;
  }
  
  // Filter for Full Game markets only (BettingPeriodTypeID: 2)
  const fullGameMarkets = splitsData.BettingMarketSplits.filter(
    (market: any) => market.BettingPeriodTypeID === 2
  );
  
  for (const market of fullGameMarkets) {
    const betTypeId = market.BettingBetTypeID;
    let marketType: 'spread' | 'moneyline' | 'total' | null = null;
    
    // Map BettingBetTypeID to market type
    if (betTypeId === 3) {
      marketType = 'spread';
    } else if (betTypeId === 5) {
      marketType = 'moneyline';
    } else if (betTypeId === 4) {
      marketType = 'total';
    }
    
    if (!marketType || !market.BettingSplits || !Array.isArray(market.BettingSplits)) {
      continue;
    }
    
    // Extract percentages
    let homePercentage = 0;
    let awayPercentage = 0;
    let overPercentage = 0;
    let underPercentage = 0;
    
    for (const split of market.BettingSplits) {
      const betPercentage = split.BetPercentage || 0;
      const outcomeType = split.BettingOutcomeType;
      const outcomeTypeID = split.BettingOutcomeTypeID;
      
      if (marketType === 'total') {
        // BettingOutcomeTypeID: 3 = Over, 4 = Under
        if (outcomeTypeID === 3 || (outcomeType && outcomeType.toLowerCase() === 'over')) {
          overPercentage = betPercentage;
        } else if (outcomeTypeID === 4 || (outcomeType && outcomeType.toLowerCase() === 'under')) {
          underPercentage = betPercentage;
        }
      } else {
        // Spread or Moneyline
        // BettingOutcomeTypeID: 1 = Home, 2 = Away
        if (outcomeTypeID === 1 || (outcomeType && outcomeType.toLowerCase() === 'home')) {
          homePercentage = betPercentage;
        } else if (outcomeTypeID === 2 || (outcomeType && outcomeType.toLowerCase() === 'away')) {
          awayPercentage = betPercentage;
        }
      }
    }
    
    // Normalize percentages to 100% if they don't already sum to 100%
    let publicPercentage: number;
    let team: string;
    let opponent: string;
    let line: string | null = null;
    
    if (marketType === 'total') {
      const total = overPercentage + underPercentage;
      if (total > 0 && total !== 100) {
        // Normalize to 100%
        overPercentage = Math.round((overPercentage / total) * 100);
        underPercentage = Math.round((underPercentage / total) * 100);
      }
      
      // Handle edge case where both are 0
      if (total === 0) {
        continue; // Skip this market if no data
      }
      
      // Always take the higher percentage
      if (overPercentage >= underPercentage) {
        publicPercentage = overPercentage;
        team = "Over";
        opponent = "Under";
      } else {
        publicPercentage = underPercentage;
        team = "Under";
        opponent = "Over";
      }
      
      // Get total line from market - check multiple possible locations
      if (market.Line !== undefined && market.Line !== null) {
        line = String(market.Line);
      } else {
        // Try to find line from gameInfo bets for totals
        const totalBet = gameInfo.bets.find(b => b.proposition === 'total' || b.proposition === 'over' || b.proposition === 'under');
        if (totalBet && totalBet.line !== null && totalBet.line !== undefined) {
          line = String(Math.abs(totalBet.line));
        }
      }
    } else {
      // Spread or Moneyline
      const total = homePercentage + awayPercentage;
      if (total > 0 && total !== 100) {
        // Normalize to 100%
        homePercentage = Math.round((homePercentage / total) * 100);
        awayPercentage = Math.round((awayPercentage / total) * 100);
      }
      
      // Handle edge case where both are 0
      if (total === 0) {
        continue; // Skip this market if no data
      }
      
      // Always take the higher percentage
      if (homePercentage >= awayPercentage) {
        publicPercentage = homePercentage;
        team = gameInfo.homeTeam;
        opponent = gameInfo.awayTeam;
      } else {
        publicPercentage = awayPercentage;
        team = gameInfo.awayTeam;
        opponent = gameInfo.homeTeam;
      }
      
      // Get spread line if available (for spread bets)
      // Try to get line from market data or from gameInfo bets
      if (marketType === 'spread') {
        if (market.Line !== undefined && market.Line !== null) {
          // Format spread line with + or - sign
          const spreadValue = Number(market.Line);
          line = spreadValue > 0 ? `+${spreadValue}` : String(spreadValue);
        } else {
          // Try to find line from gameInfo bets for this market type
          const spreadBet = gameInfo.bets.find(b => b.proposition === 'spread');
          if (spreadBet && spreadBet.line !== null && spreadBet.line !== undefined) {
            const spreadValue = Number(spreadBet.line);
            line = spreadValue > 0 ? `+${spreadValue}` : String(spreadValue);
          }
        }
      }
    }
    
    markets.push({
      marketType,
      publicPercentage,
      team,
      opponent,
      line,
      betType: marketType
    });
  }
  
  return markets;
}

serve(async (req) => {
  const requestId = crypto.randomUUID().substring(0, 8);
  const startTime = Date.now();
  
  console.log(`[${requestId}] 🚀 [GET-PUBLIC-BETTING] Request started - Method: ${req.method}`);
  
  if (req.method === "OPTIONS") {
    console.log(`[${requestId}] ✅ [GET-PUBLIC-BETTING] OPTIONS request handled`);
    return new Response(null, { headers: cors });
  }
  
  try {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error(`[${requestId}] ❌ [GET-PUBLIC-BETTING] Missing Supabase configuration`);
      return json(
        {
          error: "Service configuration error",
          message: "Supabase credentials not configured"
        },
        500
      );
    }
    
    if (!SHARP_PRIVATE_KEY) {
      console.error(`[${requestId}] ❌ [GET-PUBLIC-BETTING] Missing SharpSports API key`);
      return json(
        {
          error: "Service configuration error",
          message: "SharpSports API key not configured"
        },
        500
      );
    }
    
    if (!SPORTSDATAIO_API_KEY) {
      console.error(`[${requestId}] ❌ [GET-PUBLIC-BETTING] Missing SportsDataIO API key`);
      return json(
        {
          error: "Service configuration error",
          message: "SportsDataIO API key not configured"
        },
        500
      );
    }
    
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false
      }
    });
    
    // Parse optional query parameters
    let body: any = {};
    try {
      if (req.method === "POST") {
        body = await req.json();
      }
    } catch (e) {
      // Ignore JSON parse errors for GET requests
    }
    
    const limit = body.limit || 50;
    
    console.log(`[${requestId}] 📥 [GET-PUBLIC-BETTING] Fetching public betting data - Limit: ${limit}`);
    
    // Step 1: Fetch all users
    const users = await fetchAllAuthUsers(supabase);
    
    if (users.length === 0) {
      console.log(`[${requestId}] ⚠️  [GET-PUBLIC-BETTING] No users found`);
      return json({
        games: [],
        total: 0
      });
    }
    
    // Step 2: Fetch pending bet slips from SharpSports for all users
    console.log(`[${requestId}] 📡 [GET-PUBLIC-BETTING] Fetching bet slips from SharpSports for ${users.length} users...`);
    const allBetSlips: any[] = [];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      try {
        const slips = await fetchBetSlipsForUser(user.id, "pending", ["single", "parlay"], 5);
        allBetSlips.push(...slips);
        
        // Rate limiting between users
        if (i < users.length - 1) {
          await sleep(500);
        }
      } catch (error) {
        console.error(`[${requestId}] ⚠️  Error fetching bet slips for user ${user.id}:`, error);
        continue;
      }
    }
    
    console.log(`[${requestId}] ✅ [GET-PUBLIC-BETTING] Fetched ${allBetSlips.length} bet slips total`);
    
    // Step 3: Extract unique games from bet slips
    const gameMap = extractGamesFromBetSlips(allBetSlips);
    const games = Array.from(gameMap.values());
    
    console.log(`[${requestId}] 🎮 [GET-PUBLIC-BETTING] Found ${games.length} unique games`);
    
    if (games.length === 0) {
      return json({
        games: [],
        total: 0
      });
    }
    
    // Step 4: Fetch SportsDataIO betting splits for each game
    const processedGames: any[] = [];
    
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      
      // Skip if no sportsdataioId
      if (!game.sportsdataioId) {
        console.log(`[${requestId}] ⚠️  Skipping game ${game.eventName} - no sportsdataioId`);
        continue;
      }
      
      // Add delay between API calls to respect rate limits
      if (i > 0) {
        await sleep(500);
      }
      
      // Determine sport type
      const sport = game.league === "NFL" ? "NFL" : "CFB";
      
      // Fetch betting splits
      const splitsData = await fetchSportsDataIOBettingSplits(sport, game.sportsdataioId);
      
      if (!splitsData) {
        console.log(`[${requestId}] ⚠️  No betting splits data for game ${game.eventName}`);
        continue;
      }
      
      // Extract market data
      const markets = extractMarketData(splitsData, game);
      
      // Create entries for each market
      for (const market of markets) {
        const gameEntry = {
          id: `${game.sportsdataioId}-${market.marketType}`,
          event: game.eventName,
          away_team: game.awayTeam,
          home_team: game.homeTeam,
          sport: game.league,
          event_start_time: game.startTime,
          marketType: market.marketType,
          team: market.team,
          opponent: market.opponent,
          publicPercentage: market.publicPercentage,
          line: market.line || "",
          betType: market.betType,
          isLive: false,
          totalBets: 0
        };
        
        processedGames.push(gameEntry);
      }
    }
    
    // Step 5: Sort by publicPercentage descending
    processedGames.sort((a, b) => b.publicPercentage - a.publicPercentage);
    
    // Limit results
    const limitedGames = processedGames.slice(0, limit);
    
    const totalDuration = Date.now() - startTime;
    console.log(`[${requestId}] ✅ [GET-PUBLIC-BETTING] Successfully processed ${limitedGames.length} game entries - Duration: ${totalDuration}ms`);
    
    return json({
      games: limitedGames,
      total: limitedGames.length
    });
    
  } catch (e) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${requestId}] ❌ [GET-PUBLIC-BETTING] Unhandled error after ${totalDuration}ms:`, e);
    
    const errorMessage = e instanceof Error ? e.message : "unknown error";
    
    return json({
      error: "Failed to fetch public betting data",
      message: errorMessage
    }, 500);
  }
});
