import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const SharpSportKey = Deno.env.get('SHARP_SPORT_API_KEY');
    if (!SharpSportKey) {
      throw new Error('SharpSport API key not configured');
    }

    const internalId = user.id;
    console.log(`Fetching bet slips for user: ${internalId}`);

    const response = await fetch(
      `https://api.sharpsports.io/v1/bettors/${internalId}/betSlips?status=pending&limit=50`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Token ${SharpSportKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`SharpSports API error: ${response.status} ${response.statusText}`);
    }

    const betSlips = await response.json();
    console.log(`Fetched ${betSlips.length} bet slips`);

    // Filter for pending bet slips with all pending bets and future start times
    const filteredBetSlips = (betSlips || []).filter(
      (slip: any) =>
        slip.status === 'pending' &&
        slip.bets.every(
          (bet: any) =>
            bet.status === 'pending' &&
            bet.event?.startTime &&
            new Date(bet.event.startTime) > new Date()
        )
    );

    console.log(`Filtered to ${filteredBetSlips.length} valid bet slips`);

    // Store each bet in Supabase
    const betsToInsert = [];
    for (const slip of filteredBetSlips) {
      for (const bet of slip.bets) {
        betsToInsert.push({
          user_id: user.id,
          event: `${bet.event?.name || ''} - ${bet.position || ''} ${bet.line || ''}`,
          bet_type: bet.type || slip.type,
          odds: bet.oddsAmerican?.toString() || '',
          units_risked: slip.atRisk,
          units_won_lost: 0,
          result: 'Pending',
          timestamp: bet.event?.startTime || new Date().toISOString(),
          is_processed: false,
        });
      }
    }

    if (betsToInsert.length > 0) {
      // Delete existing pending bets for this user first
      const { error: deleteError } = await supabase
        .from('bets')
        .delete()
        .eq('user_id', user.id)
        .eq('result', 'Pending');

      if (deleteError) {
        console.error('Error deleting old bets:', deleteError);
      }

      // Insert new bets
      const { error: insertError } = await supabase
        .from('bets')
        .insert(betsToInsert);

      if (insertError) {
        console.error('Error inserting bets:', insertError);
        throw insertError;
      }

      console.log(`Inserted ${betsToInsert.length} bets into Supabase`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        betsStored: betsToInsert.length,
        message: `Successfully synced ${betsToInsert.length} pending bets`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-bet-slips:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
