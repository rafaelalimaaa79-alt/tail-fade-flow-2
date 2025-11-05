import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers - must be included in ALL responses
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Custom json response function that includes CORS headers and proper status codes
function json(body: any, status = 200) {
  const responseBody = {
    ...body,
    statusCode: status
  };
  return new Response(JSON.stringify(responseBody), {
    status: 200, // Always return 200 to avoid CORS preflight issues
    headers: {
      ...cors,
      "Content-Type": "application/json"
    }
  });
}

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: cors
    });
  }

  try {
    const { userId, email, priceId, plan } = await req.json();

    // Validate required fields
    if (!userId || !email || !priceId || !plan) {
      console.error("Missing required fields:", { userId, email, priceId, plan });
      return json(
        {
          error: "Missing required fields",
          details: "userId, email, priceId, and plan are required"
        },
        400
      );
    }

    // Validate Stripe secret key is configured
    if (!STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not configured");
      return json(
        {
          error: "Payment service not configured",
          details: "Stripe API key is not set up"
        },
        500
      );
    }

    console.log(`Creating checkout session for user ${userId}, plan: ${plan}, priceId: ${priceId}`);

    // Create checkout session using Stripe API
    const checkoutResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[0]": "card",
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        "mode": "subscription",
        "subscription_data[trial_period_days]": "7", // 7-day free trial
        "client_reference_id": userId,
        "customer_email": email,
        "metadata[userId]": userId,
        "metadata[plan]": plan,
        // UI mode for embedded checkout (no redirects)
        "ui_mode": "embedded",
        "redirect_on_completion": "never", // Keep checkout in-app, no redirects
      }).toString(),
    });

    // Handle Stripe API errors
    if (!checkoutResponse.ok) {
      let stripeError: any = {};
      try {
        stripeError = await checkoutResponse.json();
      } catch (e) {
        const text = await checkoutResponse.text();
        console.error("Failed to parse Stripe error response:", text);
        stripeError = { message: text };
      }

      console.error("Stripe API error:", stripeError);
      return json(
        {
          error: "Failed to create checkout session",
          details: stripeError.error?.message || stripeError.message || "Unknown Stripe error"
        },
        400
      );
    }

    const session = await checkoutResponse.json();

    // Validate response has required fields
    if (!session.client_secret || !session.id) {
      console.error("Invalid Stripe response - missing client_secret or id:", session);
      return json(
        {
          error: "Invalid checkout session response",
          details: "Stripe response missing required fields"
        },
        500
      );
    }

    console.log(`✅ Checkout session created for user ${userId}, plan: ${plan}, sessionId: ${session.id}`);

    return json({
      success: true,
      clientSecret: session.client_secret,
      sessionId: session.id,
    }, 200);

  } catch (error) {
    console.error("Error creating checkout session:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return json(
      {
        error: "Internal server error",
        details: errorMessage
      },
      500
    );
  }
});

