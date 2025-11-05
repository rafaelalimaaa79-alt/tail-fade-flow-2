import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getPlanDisplayName, getPriceInDollars, getBillingPeriod } from "@/constants/stripe";

interface SubscriptionData {
  subscription_plan: string | null;
  subscription_status: string | null;
  subscription_price_id: string | null;
  stripe_subscription_id: string | null;
  subscription_current_period_start: string | null;
  subscription_current_period_end: string | null;
}

const SubscriptionSection = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select(
          "subscription_plan, subscription_status, subscription_price_id, stripe_subscription_id, subscription_current_period_start, subscription_current_period_end"
        )
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching subscription:", error);
        toast.error("Failed to load subscription data");
      } else {
        setSubscription(data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      toast.error("Failed to load subscription data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period."
    );

    if (!confirmed) return;

    setIsCancelling(true);

    try {
      const { data, error } = await supabase.functions.invoke("cancel-subscription");

      if (error || !data?.success) {
        console.error("Error cancelling subscription:", error || data);
        toast.error(error?.message || data?.error || "Failed to cancel subscription");
        setIsCancelling(false);
        return;
      }

      toast.success("Subscription cancelled successfully");
      await fetchSubscriptionData(); // Refresh subscription data
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusDisplay = (status: string | null) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      active: { text: "Active", color: "text-green-400" },
      trial: { text: "Trial", color: "text-blue-400" },
      cancelled: { text: "Cancelled", color: "text-yellow-400" },
      expired: { text: "Expired", color: "text-red-400" },
      free: { text: "Free", color: "text-gray-400" },
    };

    return statusMap[status || "free"] || { text: status || "Free", color: "text-gray-400" };
  };

  if (isLoading) {
    return (
      <Card className="bg-black border border-white/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#AEE3F5]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusDisplay = getStatusDisplay(subscription?.subscription_status);
  const hasActiveSubscription = subscription?.subscription_status === "active" || subscription?.subscription_status === "trial";
  const planDisplay = subscription?.subscription_plan
    ? getPlanDisplayName(subscription.subscription_plan as any)
    : "Free Tier";
  const priceDisplay = subscription?.subscription_plan
    ? `${getPriceInDollars(subscription.subscription_plan as any)}${getBillingPeriod(subscription.subscription_plan as any)}`
    : "";

  return (
    <Card className="bg-black border border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl font-rajdhani">Subscription</CardTitle>
        <CardDescription className="text-gray-400">
          Manage your subscription and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-medium">Current Plan</p>
            <p className="text-gray-400 text-sm">{planDisplay}</p>
            {priceDisplay && (
              <p className="text-gray-400 text-xs mt-1">{priceDisplay}</p>
            )}
            <p className={`text-sm mt-1 ${statusDisplay.color}`}>
              {statusDisplay.text}
            </p>
          </div>
          {!hasActiveSubscription && (
            <Button className="bg-[#AEE3F5] hover:bg-[#AEE3F5]/80 text-black font-medium">
              Upgrade
            </Button>
          )}
        </div>

        {hasActiveSubscription && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Period:</span>
              <span className="text-white">
                {formatDate(subscription?.subscription_current_period_start)} - {formatDate(subscription?.subscription_current_period_end)}
              </span>
            </div>
          </div>
        )}

        <Separator className="bg-gray-700" />

        <div className="space-y-3">
          {hasActiveSubscription && (
            <>
              <Button
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800 hover:border-[#AEE3F5]"
                onClick={() => {
                  // TODO: Implement payment method update
                  toast.info("Payment method update coming soon");
                }}
              >
                Update Payment Method
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-500/10 hover:border-red-400"
                onClick={handleCancelSubscription}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Subscription"
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSection;