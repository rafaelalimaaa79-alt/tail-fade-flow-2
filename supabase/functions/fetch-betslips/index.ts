import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Fetch betslips from Sharp Sports API
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Token ${Deno.env.get('SHARP_SPORTS_API_TOKEN')}`
      }
    }

    const response = await fetch(
      `https://api.sharpsports.io/v1/bettors/${user.id}/betSlips?status=pending&limit=50`,
      options
    )

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error fetching betslips:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch betslips' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})