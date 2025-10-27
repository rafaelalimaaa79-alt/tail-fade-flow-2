import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SHARP_KEY = Deno.env.get("SHARP_SPORT_PRIVATE_API_KEY");

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json"
    }
  });
}

serve(async (req) => {
  const requestId = crypto.randomUUID().substring(0, 8);
  const startTime = Date.now();
  
  console.log(`[${requestId}] 🚀 [GET-ACCOUNTS] Request started - Method: ${req.method}`);

  if (req.method === "OPTIONS") {
    console.log(`[${requestId}] ✅ [GET-ACCOUNTS] OPTIONS request handled`);
    return new Response(null, { headers: cors });
  }

  try {
    // Parse request body
    console.log(`[${requestId}] 📥 [GET-ACCOUNTS] Parsing request body...`);
    const { internalId } = await req.json();

    if (!internalId) {
      console.error(`[${requestId}] ❌ [GET-ACCOUNTS] Missing required parameter: internalId`);
      return json({ error: "internalId is required" }, 400);
    }

    console.log(`[${requestId}] 🔍 [GET-ACCOUNTS] Fetching connected accounts for bettor: ${internalId}`);

    // Check if API key is configured
    if (!SHARP_KEY) {
      console.error(`[${requestId}] ❌ [GET-ACCOUNTS] SHARPSPORTS_PRIVATE_KEY not configured`);
      return json({ 
        error: "Service configuration error",
        message: "API key not configured" 
      }, 500);
    }

    // Fetch bettor accounts from SharpSports API
    const accountsUrl = `https://api.sharpsports.io/v1/bettors/${internalId}/bettorAccounts`;
    console.log(`[${requestId}] 📡 [GET-ACCOUNTS] Calling SharpSports API: ${accountsUrl}`);
    
    const apiStartTime = Date.now();
    const res = await fetch(accountsUrl, {
      headers: {
        accept: "application/json",
        Authorization: `Token ${SHARP_KEY}`
      }
    });
    const apiDuration = Date.now() - apiStartTime;
    
    console.log(`[${requestId}] ⏱️  [GET-ACCOUNTS] API response received - Status: ${res.status}, Duration: ${apiDuration}ms`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[${requestId}] ❌ [GET-ACCOUNTS] API request failed - Status: ${res.status} ${res.statusText}`);
      console.error(`[${requestId}] 📄 [GET-ACCOUNTS] Error response body: ${errorText}`);
      
      if (res.status === 404) {
        console.log(`[${requestId}] ℹ️  [GET-ACCOUNTS] No accounts found (404) - Returning empty array`);
        return json({ accounts: [] });
      }
      
      if (res.status === 401) {
        console.error(`[${requestId}] 🔐 [GET-ACCOUNTS] Authentication failed - Check API key`);
        return json({ 
          error: "Authentication failed",
          message: "Invalid or expired API key" 
        }, 401);
      }
      
      if (res.status === 403) {
        console.error(`[${requestId}] 🚫 [GET-ACCOUNTS] Forbidden - API key lacks permission for bettor ${internalId}`);
        return json({ 
          error: "Access denied",
          message: "API key does not have access to this bettor" 
        }, 403);
      }
      
      if (res.status === 429) {
        console.error(`[${requestId}] ⏸️  [GET-ACCOUNTS] Rate limited by SharpSports API`);
        return json({ 
          error: "Rate limited",
          message: "Too many requests. Please try again later." 
        }, 429);
      }
      
      return json({ 
        error: "Failed to fetch connected accounts",
        details: errorText 
      }, res.status);
    }

    // Parse response data
    console.log(`[${requestId}] 📦 [GET-ACCOUNTS] Parsing API response...`);
    const accounts = await res.json();

    // Log response structure
    if (!Array.isArray(accounts)) {
      console.warn(`[${requestId}] ⚠️  [GET-ACCOUNTS] Unexpected response format - Expected array, got: ${typeof accounts}`);
      console.warn(`[${requestId}] 📄 [GET-ACCOUNTS] Response keys: ${Object.keys(accounts || {}).join(', ')}`);
    }

    const accountCount = Array.isArray(accounts) ? accounts.length : 0;
    console.log(`[${requestId}] ✅ [GET-ACCOUNTS] Found ${accountCount} connected account(s)`);

    // Log account details for debugging
    if (Array.isArray(accounts) && accounts.length > 0) {
      accounts.forEach((account: any, index: number) => {
        const bookName = account.book?.name || 'Unknown';
        const regionName = account.bookRegion?.name || 'Unknown';
        console.log(`[${requestId}] 📋 [GET-ACCOUNTS] Account ${index + 1}: ${bookName} (${regionName}) - ID: ${account.id}, Verified: ${account.verified || false}`);
      });
    }

    const totalDuration = Date.now() - startTime;
    console.log(`[${requestId}] ✅ [GET-ACCOUNTS] Request completed successfully - Total duration: ${totalDuration}ms, Accounts: ${accountCount}`);

    // Return raw SharpSports response without transformation
    return json({
      accounts: Array.isArray(accounts) ? accounts : [],
      total: accountCount
    });

  } catch (e) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${requestId}] ❌ [GET-ACCOUNTS] Unhandled error after ${totalDuration}ms:`, e);
    
    const errorMessage = e instanceof Error ? e.message : "unknown error";
    const errorStack = e instanceof Error ? e.stack : undefined;
    
    if (errorStack) {
      console.error(`[${requestId}] 📚 [GET-ACCOUNTS] Stack trace:`, errorStack);
    }
    
    // Check for specific error types
    if (errorMessage.includes('JSON')) {
      console.error(`[${requestId}] 🔍 [GET-ACCOUNTS] JSON parsing error - Invalid request body`);
      return json({
        error: "Invalid request format",
        message: "Request body must be valid JSON"
      }, 400);
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      console.error(`[${requestId}] 🌐 [GET-ACCOUNTS] Network error - Failed to reach SharpSports API`);
      return json({
        error: "Network error",
        message: "Failed to connect to SharpSports API"
      }, 503);
    }
    
    return json({
      error: "Failed to fetch connected accounts",
      message: errorMessage
    }, 500);
  }
});

