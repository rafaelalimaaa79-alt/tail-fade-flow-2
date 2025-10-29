import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json",
    },
  });
}

serve(async (req) => {
  const requestId = crypto.randomUUID().substring(0, 8);
  const startTime = Date.now();

  console.log(`[${requestId}] 🚀 [GET-APP-VERSION] Request started - Method: ${req.method}`);

  if (req.method === "OPTIONS") {
    console.log(`[${requestId}] ✅ [GET-APP-VERSION] OPTIONS request handled`);
    return new Response(null, { headers: cors });
  }

  try {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error(`[${requestId}] ❌ [GET-APP-VERSION] Missing Supabase configuration`);
      return json(
        {
          error: "Service configuration error",
          message: "Supabase credentials not configured",
        },
        500
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false
      }
    });

    console.log(`[${requestId}] 📥 [GET-APP-VERSION] Fetching current app version from database...`);

    const { data, error } = await supabase
      .from("app_versions")
      .select("version, force_update, release_notes")
      .eq("is_current", true)
      .single();

    if (error) {
      console.error(`[${requestId}] ❌ [GET-APP-VERSION] Database query failed:`, error.message);
      return json(
        {
          error: "Failed to fetch app version",
          message: error.message,
        },
        500
      );
    }

    if (!data) {
      console.warn(`[${requestId}] ⚠️  [GET-APP-VERSION] No current version found in database`);
      return json(
        {
          error: "No current version found",
          message: "Please configure a current version in the app_versions table",
        },
        404
      );
    }

    const totalDuration = Date.now() - startTime;
    console.log(
      `[${requestId}] ✅ [GET-APP-VERSION] Successfully fetched version ${data.version} - Duration: ${totalDuration}ms`
    );

    return json({
      version: data.version,
      forceUpdate: data.force_update || false,
      releaseNotes: data.release_notes || "",
    });
  } catch (e) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${requestId}] ❌ [GET-APP-VERSION] Unhandled error after ${totalDuration}ms:`, e);

    const errorMessage = e instanceof Error ? e.message : "unknown error";
    const errorStack = e instanceof Error ? e.stack : undefined;

    if (errorStack) {
      console.error(`[${requestId}] 📚 [GET-APP-VERSION] Stack trace:`, errorStack);
    }

    return json(
      {
        error: "Failed to fetch app version",
        message: errorMessage,
      },
      500
    );
  }
});

