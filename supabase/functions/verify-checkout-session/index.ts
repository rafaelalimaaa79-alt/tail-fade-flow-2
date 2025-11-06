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
    const { sessionId } = await req.json();

    // Validate required fields
    if (!sessionId) {
      console.error("Missing sessionId");
      return json(
        {
          error: "Missing required fields",
          details: "sessionId is required"
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

    console.log(`Verifying checkout session: ${sessionId}`);

    // Retrieve checkout session from Stripe
    const sessionResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
      },
    });

    if (!sessionResponse.ok) {
      let stripeError: any = {};
      try {
        stripeError = await sessionResponse.json();
      } catch (e) {
        const text = await sessionResponse.text();
        console.error("Failed to parse Stripe error response:", text);
        stripeError = { message: text };
      }

      console.error("Stripe API error:", stripeError);
      return json(
        {
          error: "Failed to verify checkout session",
          details: stripeError.error?.message || stripeError.message || "Unknown Stripe error"
        },
        400
      );
    }

    const session = await sessionResponse.json();

    // Check if payment was successful
    const isSuccess = session.payment_status === "paid" && session.status === "complete";

    console.log(`✅ Checkout session verified: ${sessionId}, payment_status: ${session.payment_status}, status: ${session.status}`);

    return json({
      success: true,
      verified: isSuccess,
      session: {
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        subscription: session.subscription,
        customer: session.customer,
        metadata: session.metadata,
      }
    }, 200);

  } catch (error) {
    console.error("Error verifying checkout session:", error);
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

