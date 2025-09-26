import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { internalId } = await req.json();
    
    const sharpSportKey = Deno.env.get('SHARP_SPORT_API_KEY');
    if (!sharpSportKey) {
      throw new Error('SHARP_SPORT_API_KEY not configured');
    }

    console.log(`Fetching bet slips for bettor: ${internalId}`);

    const response = await fetch(
      `https://api.sharpsports.io/v1/bettors/${internalId}/betSlips?status=pending&limit=50`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Token ${sharpSportKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`SharpSport API error: ${response.status} ${response.statusText}`);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("BetSlips Response:", data);

    // Filter for pending bet slips with all pending bets
    const filteredData = (data || []).filter((slip: any) => 
      slip.status === "pending" && 
      slip.bets.every((bet: any) => bet.status === "pending")
    );

    console.log(`Filtered ${filteredData.length} pending bet slips from ${data?.length || 0} total`);

    return new Response(JSON.stringify(filteredData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-bet-slips function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});