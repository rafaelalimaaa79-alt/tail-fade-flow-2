import React, { useState } from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { triggerHaptic } from "@/utils/haptic-feedback";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SUBSCRIPTION_PLANS, getPriceIdForPlan } from "@/constants/stripe";
import StripeCheckoutModal from "./StripeCheckoutModal";

interface OnboardingStepPaywallProps {
  onSelect: (plan: 'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual') => void;
}

const OnboardingStepPaywall: React.FC<OnboardingStepPaywallProps> = ({ onSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual'>('monthly_sportsbook');
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handlePlanToggle = (plan: 'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual') => {
    triggerHaptic('selectionChanged');
    setSelectedPlan(plan);
  };

  const handleStartTrial = async () => {
    triggerHaptic('impactMedium');
    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to continue');
        setIsLoading(false);
        return;
      }

      // Get the Stripe price ID for the selected plan
      const priceId = getPriceIdForPlan(selectedPlan);

      // Call Edge Function to create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          userId: user.id,
          email: user.email,
          priceId: priceId,
          plan: selectedPlan,
        }
      });

      if (error || !data?.clientSecret) {
        console.error('Error creating checkout session:', error);
        toast.error('Failed to create checkout session');
        setIsLoading(false);
        return;
      }

      // Show checkout modal
      setClientSecret(data.clientSecret);
      setSessionId(data.sessionId);
      setShowCheckout(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to process payment');
      setIsLoading(false);
    }
  };

  const handleCheckoutSuccess = () => {
    // Close modal
    setShowCheckout(false);
    setClientSecret(null);
    setSessionId(null);

    // Call onSelect to save subscription plan and continue onboarding
    onSelect(selectedPlan);
  };

  return (
    <>
      {/* Stripe Checkout Modal */}
      {clientSecret && sessionId && (
        <StripeCheckoutModal
          isOpen={showCheckout}
          clientSecret={clientSecret}
          sessionId={sessionId}
          onClose={() => {
            setShowCheckout(false);
            setClientSecret(null);
            setSessionId(null);
          }}
          onSuccess={handleCheckoutSuccess}
          plan={selectedPlan}
        />
      )}

      <div className="flex flex-col items-center justify-between h-full px-6 py-8">
      {/* Header */}
      <div className="text-center space-y-3 mt-8">
        <h1 className="text-white text-4xl font-bold leading-tight">
          See Who's Ice Cold Free for 7 Days
        </h1>
        <p className="text-gray-400 text-base">
          Start risk-free.
        </p>
      </div>

      {/* Pricing Cards - Dynamic */}
      <div className="w-full space-y-3 my-8">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => handlePlanToggle(plan.id)}
            className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 ${
              selectedPlan === plan.id
                ? 'border-[#AEE3F5] bg-[#AEE3F5]/10'
                : 'border-white/20 bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id
                    ? 'border-[#AEE3F5] bg-[#AEE3F5]'
                    : 'border-white/40'
                }`}>
                  {selectedPlan === plan.id && <Check className="w-4 h-4 text-black" />}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-lg font-semibold">{plan.name}</span>
                    {plan.badge && (
                      <span className="text-[#AEE3F5] text-xs font-medium px-2 py-0.5 bg-[#AEE3F5]/20 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-white text-2xl font-bold">{plan.price}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Feature Callouts */}
      <div className="w-full space-y-2 mb-6">
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Check className="w-4 h-4 text-[#AEE3F5]" />
          <span>Live Fade Confidence</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Check className="w-4 h-4 text-[#AEE3F5]" />
          <span>Weekly Cold Bettor Rankings</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Check className="w-4 h-4 text-[#AEE3F5]" />
          <span>Track Every Public Pick</span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full space-y-4">
        <button
          onClick={handleStartTrial}
          disabled={isLoading}
          className={`w-full bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 animate-pulse-border ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Start 7-Day Free Trial
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <button
          className="w-full bg-white/10 hover:bg-white/15 text-white font-medium text-base py-3 rounded-xl transition-all duration-200"
        >
          Restore Purchase
        </button>

        {/* Social Proof */}
        <p className="text-center text-gray-500 text-xs">
          Trusted by thousands of bettors who know when to fade.
        </p>

        {/* Terms */}
        <p className="text-center text-gray-500 text-xs leading-relaxed px-4">
          By subscribing, you agree to our{' '}
          <span className="text-[#AEE3F5]">Terms of Service</span> and{' '}
          <span className="text-[#AEE3F5]">Privacy Policy</span>. Subscriptions automatically
          renew unless auto-renew is turned off at least 24 hours before the end of the current period.
        </p>
      </div>
      </div>
    </>
  );
};

export default OnboardingStepPaywall;
