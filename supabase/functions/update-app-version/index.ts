import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdateVersionRequest {
  version: string;
  forceUpdate?: boolean;
  releaseNotes?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  console.log(`[${requestId}] 📝 [UPDATE-APP-VERSION] Request received`);

  try {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error(`[${requestId}] ❌ Missing Supabase configuration`);
      return new Response(
        JSON.stringify({
          error: "Service configuration error",
          message: "Supabase credentials not configured",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
      },
    });

    // Parse request body
    const body: UpdateVersionRequest = await req.json();
    const { version, forceUpdate = false, releaseNotes = `Auto-deployed version ${body.version}` } = body;

    if (!version) {
      console.error(`[${requestId}] ❌ Missing version in request`);
      return new Response(
        JSON.stringify({
          error: "Missing version",
          message: "Version is required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`[${requestId}] 📥 Updating to version: ${version}`);

    // Set all versions to not current
    const { error: updateError } = await supabase
      .from("app_versions")
      .update({ is_current: false })
      .eq("is_current", true);

    if (updateError) {
      console.error(`[${requestId}] ❌ Failed to update existing versions:`, updateError);
      return new Response(
        JSON.stringify({
          error: "Failed to update versions",
          message: updateError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert new version or update existing one
    const { data, error: insertError } = await supabase
      .from("app_versions")
      .upsert(
        {
          version,
          is_current: true,
          force_update: forceUpdate,
          release_notes: releaseNotes,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "version",
        }
      )
      .select()
      .single();

    if (insertError) {
      console.error(`[${requestId}] ❌ Failed to insert new version:`, insertError);
      return new Response(
        JSON.stringify({
          error: "Failed to insert version",
          message: insertError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const totalDuration = Date.now() - startTime;
    console.log(
      `[${requestId}] ✅ Successfully updated to version ${version} - Duration: ${totalDuration}ms`
    );

    return new Response(
      JSON.stringify({
        success: true,
        version: data.version,
        message: "Version updated successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(
      `[${requestId}] ❌ [UPDATE-APP-VERSION] Error - Duration: ${totalDuration}ms`,
      error
    );

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

