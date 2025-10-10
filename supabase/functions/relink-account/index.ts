import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const SHARP_PUBLIC_KEY = Deno.env.get("SHARP_SPORT_API_KEY");

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json"
    }
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  try {
    const { internalId, bettorAccountId, action, redirectUrl } = await req.json();

    if (!internalId) {
      return json({ error: "internalId required" }, 400);
    }

    // Step 1: Optionally remove access (if bettorAccountId provided)
    if (action === "remove-and-relink" && bettorAccountId) {
      console.log(`Removing access for ${bettorAccountId}...`);
      
      const removeResponse = await fetch(
        `https://api.sharpsports.io/v1/bettorAccounts/${bettorAccountId}/access`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${SHARP_PUBLIC_KEY}`
          },
          body: JSON.stringify({ access: false })
        }
      );

      if (!removeResponse.ok) {
        console.error("Failed to remove access:", await removeResponse.text());
        // Continue anyway - user may still be able to relink
      } else {
        console.log("Access removed successfully");
      }
    }

    // Step 2: Generate context ID for linking
    console.log(`Generating link context for ${internalId}...`);
    
    const contextResponse = await fetch(
      "https://api.sharpsports.io/v1/context",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${SHARP_PUBLIC_KEY}`
        },
        body: JSON.stringify({ internalId })
      }
    );

    if (!contextResponse.ok) {
      const error = await contextResponse.text();
      console.error("Failed to generate context:", error);
      return json(
        { error: "Failed to generate link context", detail: error },
        500
      );
    }

    const { cid } = await contextResponse.json();

    // Step 3: Build link URLs
    const baseLinkUrl = `https://ui.sharpsports.io/link/${cid}`;
    
    // Add redirectUrl if provided
    const linkUrl = redirectUrl 
      ? `${baseLinkUrl}?redirectUrl=${encodeURIComponent(redirectUrl)}`
      : baseLinkUrl;

    console.log(`Link context generated: ${cid}`);

    return json({
      success: true,
      cid,
      linkUrl,
      message: "Open this URL in a popup or webview to relink account"
    });

  } catch (e) {
    console.error("Relink error:", e);
    return json({
      error: e?.message ?? "unknown"
    }, 500);
  }
});
