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
const SITE_URL = Deno.env.get("SITE_URL") || "https://noshot.app";

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

    console.log(`Creating payment link for user ${userId}, plan: ${plan}, priceId: ${priceId}`);

    // Create payment link using Stripe API
    const paymentLinkResponse = await fetch("https://api.stripe.com/v1/payment_links", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        "mode": "subscription",
        "success_url": `${SITE_URL}/dashboard?payment=success`,
        "cancel_url": `${SITE_URL}/onboarding?payment=cancelled`,
        "client_reference_id": userId,
        "customer_email": email,
        "metadata[userId]": userId,
        "metadata[plan]": plan,
      }).toString(),
    });

    // Handle Stripe API errors
    if (!paymentLinkResponse.ok) {
      let stripeError: any = {};
      try {
        stripeError = await paymentLinkResponse.json();
      } catch (e) {
        const text = await paymentLinkResponse.text();
        console.error("Failed to parse Stripe error response:", text);
        stripeError = { message: text };
      }

      console.error("Stripe API error:", stripeError);
      return json(
        {
          error: "Failed to create payment link",
          details: stripeError.error?.message || stripeError.message || "Unknown Stripe error"
        },
        400
      );
    }

    const paymentLink = await paymentLinkResponse.json();

    // Validate response has required fields
    if (!paymentLink.url || !paymentLink.id) {
      console.error("Invalid Stripe response - missing url or id:", paymentLink);
      return json(
        {
          error: "Invalid payment link response",
          details: "Stripe response missing required fields"
        },
        500
      );
    }

    console.log(`✅ Payment link created for user ${userId}, plan: ${plan}, linkId: ${paymentLink.id}`);

    return json({
      success: true,
      paymentUrl: paymentLink.url,
      paymentLinkId: paymentLink.id,
    }, 200);

  } catch (error) {
    console.error("Error creating payment link:", error);
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

