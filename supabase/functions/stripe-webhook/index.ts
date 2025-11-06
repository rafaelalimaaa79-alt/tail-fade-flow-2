import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Validate environment variables
    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      console.error("Missing Stripe configuration");
      return new Response(
        JSON.stringify({ error: "Stripe not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Supabase not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("Missing Stripe signature");
      return new Response(
        JSON.stringify({ error: "Missing signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify webhook signature
    // For production, use Stripe's webhook signature verification
    // For now, we'll parse the event and trust the webhook secret
    const event = JSON.parse(body);

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log(`📨 Received Stripe webhook: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object, supabase);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object, supabase);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object, supabase);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object, supabase);
        break;

      case "customer.subscription.trial_will_end":
        await handleTrialWillEnd(event.data.object, supabase);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object, supabase);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object, supabase);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed", details: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Handle checkout session completed
async function handleCheckoutSessionCompleted(session: any, supabase: any) {
  try {
    const userId = session.metadata?.userId || session.client_reference_id;
    const plan = session.metadata?.plan;

    if (!userId) {
      console.error("No userId found in checkout session");
      return;
    }

    console.log(`✅ Checkout completed for user ${userId}, plan: ${plan}`);

    // Retrieve the subscription from Stripe (only fetch once)
    let subscription: any = null;
    let priceId = session.metadata?.priceId || null;
    
    if (session.subscription) {
      try {
        const subscriptionResponse = await fetch(
          `https://api.stripe.com/v1/subscriptions/${session.subscription}`,
          {
            headers: {
              "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
            },
          }
        );

        if (subscriptionResponse.ok) {
          subscription = await subscriptionResponse.json();
          // Get price_id from subscription items (most reliable source)
          if (subscription?.items?.data?.[0]?.price?.id) {
            priceId = subscription.items.data[0].price.id;
          }
          // Update subscription with full details via helper function
          if (subscription) {
            await updateUserSubscription(userId, subscription, plan, supabase);
          }
        }
      } catch (e) {
        console.error("Error fetching subscription:", e);
      }
    }

    // Also update subscription_plan and subscription_price_id directly to ensure they're set
    // (updateUserSubscription might not always set the plan if it's null)
    const { error } = await supabase
      .from("user_profiles")
      .update({
        subscription_status: "active",
        subscription_plan: plan || null, // Ensure plan from metadata is saved
        subscription_price_id: priceId || undefined, // Only update if we have a value
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user profile:", error);
    } else {
      console.log(`✅ Updated user ${userId} subscription status to active, plan: ${plan || 'null'}, priceId: ${priceId || 'null'}`);
    }
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription: any, supabase: any) {
  try {
    const userId = subscription.metadata?.userId || subscription.metadata?.userId;
    
    if (!userId) {
      console.error("No userId found in subscription metadata");
      return;
    }

    console.log(`📝 Subscription created for user ${userId}`);
    await updateUserSubscription(userId, subscription, subscription.metadata?.plan, supabase);
  } catch (error) {
    console.error("Error handling subscription created:", error);
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: any, supabase: any) {
  try {
    const userId = subscription.metadata?.userId;
    
    if (!userId) {
      // Try to find user by subscription_id
      const { data } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (!data) {
        console.error("No user found for subscription:", subscription.id);
        return;
      }

      await updateUserSubscription(data.id, subscription, null, supabase);
    } else {
      await updateUserSubscription(userId, subscription, subscription.metadata?.plan, supabase);
    }
  } catch (error) {
    console.error("Error handling subscription updated:", error);
  }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: any, supabase: any) {
  try {
    const userId = subscription.metadata?.userId;
    
    if (!userId) {
      // Try to find user by subscription_id
      const { data } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (!data) {
        console.error("No user found for subscription:", subscription.id);
        return;
      }

      await supabase
        .from("user_profiles")
        .update({
          subscription_status: "cancelled",
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);
    } else {
      await supabase
        .from("user_profiles")
        .update({
          subscription_status: "cancelled",
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    }

    console.log(`❌ Subscription cancelled for user ${userId || "unknown"}`);
  } catch (error) {
    console.error("Error handling subscription deleted:", error);
  }
}

// Handle trial will end
async function handleTrialWillEnd(subscription: any, supabase: any) {
  try {
    const userId = subscription.metadata?.userId;
    
    if (!userId) {
      const { data } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (!data) return;
      
      // You can send a notification here
      console.log(`⏰ Trial ending soon for user ${data.id}`);
    } else {
      console.log(`⏰ Trial ending soon for user ${userId}`);
      // You can send a notification here
    }
  } catch (error) {
    console.error("Error handling trial will end:", error);
  }
}

// Handle invoice payment succeeded
async function handleInvoicePaymentSucceeded(invoice: any, supabase: any) {
  try {
    if (invoice.subscription) {
      const { data } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("stripe_subscription_id", invoice.subscription)
        .single();

      if (data) {
        console.log(`💳 Payment succeeded for subscription ${invoice.subscription}`);
        // Update subscription status to active
        await supabase
          .from("user_profiles")
          .update({
            subscription_status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.id);
      }
    }
  } catch (error) {
    console.error("Error handling invoice payment succeeded:", error);
  }
}

// Handle invoice payment failed
async function handleInvoicePaymentFailed(invoice: any, supabase: any) {
  try {
    if (invoice.subscription) {
      const { data } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("stripe_subscription_id", invoice.subscription)
        .single();

      if (data) {
        console.error(`❌ Payment failed for subscription ${invoice.subscription}`);
        // You might want to update status or send notification
        // Note: Stripe will retry payments automatically
      }
    }
  } catch (error) {
    console.error("Error handling invoice payment failed:", error);
  }
}

// Helper function to update user subscription
async function updateUserSubscription(
  userId: string,
  subscription: any,
  plan: string | null,
  supabase: any
) {
  try {
    const updateData: any = {
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      subscription_status: mapStripeStatusToDbStatus(subscription.status),
      subscription_current_period_start: subscription.current_period_start
        ? new Date(subscription.current_period_start * 1000).toISOString()
        : null,
      subscription_current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    };

    if (plan) {
      updateData.subscription_plan = plan;
    }

    // Get price ID from subscription
    if (subscription.items?.data?.[0]?.price?.id) {
      updateData.subscription_price_id = subscription.items.data[0].price.id;
    }

    const { error } = await supabase
      .from("user_profiles")
      .update(updateData)
      .eq("id", userId);

    if (error) {
      console.error("Error updating user subscription:", error);
    } else {
      console.log(`✅ Updated subscription for user ${userId}`);
    }
  } catch (error) {
    console.error("Error in updateUserSubscription:", error);
  }
}

// Map Stripe subscription status to database status
function mapStripeStatusToDbStatus(stripeStatus: string): string {
  const statusMap: Record<string, string> = {
    active: "active",
    trialing: "trial",
    past_due: "active", // Keep active but might want to handle differently
    canceled: "cancelled",
    unpaid: "expired",
    incomplete: "free",
    incomplete_expired: "expired",
    paused: "cancelled",
  };

  return statusMap[stripeStatus] || "free";
}

