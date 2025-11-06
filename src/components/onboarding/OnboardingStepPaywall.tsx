import React, { useState } from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { triggerHaptic } from "@/utils/haptic-feedback";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SUBSCRIPTION_PLANS, getPriceIdForPlan } from "@/constants/stripe";
import StripeCheckoutModal from "./StripeCheckoutModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface OnboardingStepPaywallProps {
  onSelect: (plan: 'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual') => void;
}

const OnboardingStepPaywall: React.FC<OnboardingStepPaywallProps> = ({ onSelect }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual'>('monthly_sportsbook');
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handlePlanToggle = (plan: 'monthly_sportsbook' | 'monthly_no_sportsbook' | 'annual') => {
    triggerHaptic('selectionChanged');
    setSelectedPlan(plan);
  };

  const handleStartTrial = async () => {
    if (!termsAccepted) {
      toast.error('Please accept the Terms of Service to continue');
      return;
    }

    triggerHaptic('impactMedium');
    setIsLoading(true);

    try {
      // Use user from AuthContext instead of calling getUser() directly
      // This avoids the /auth/v1/user API call that was failing
      if (!user || !user.email) {
        toast.error('Please sign in to continue');
        // Clear invalid session and redirect to sign in
        await supabase.auth.signOut();
        navigate('/signin');
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
        
        // Handle specific auth errors
        if (error?.message?.includes('user_not_found') || error?.message?.includes('User not found')) {
          toast.error('Your session has expired. Please sign in again.');
          await supabase.auth.signOut();
          navigate('/signin');
        } else {
          toast.error(error?.message || 'Failed to create checkout session');
        }
        
        setIsLoading(false);
        return;
      }

      // Show checkout modal
      setClientSecret(data.clientSecret);
      setSessionId(data.sessionId);
      setShowCheckout(true);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      
      // Handle auth errors
      if (error?.message?.includes('user_not_found') || error?.code === 'user_not_found') {
        toast.error('Your session has expired. Please sign in again.');
        await supabase.auth.signOut();
        navigate('/signin');
      } else {
        toast.error('Failed to process payment');
      }
      
      setIsLoading(false);
    }
  };

  const handleCheckoutSuccess = () => {
    // Close modal
    setShowCheckout(false);
    setClientSecret(null);
    setSessionId(null);

    // Call onSelect to save subscription plan and continue onboarding
    console.log('Checkout success - calling onSelect with plan:', selectedPlan);
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

      {/* Terms of Service Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-bold">
              NoShot LLC — Terms of Service
            </DialogTitle>
          </DialogHeader>
          <div className="text-white/90 text-sm leading-relaxed space-y-4 pr-2">
            <div>
              <p className="text-white/70 text-xs mb-4">
                <strong>Effective Date:</strong> November 5, 2025
                <br />
                <strong>Last Updated:</strong> November 5, 2025
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Overview</h3>
              <p>
                NoShot provides sports betting analytics, insights, and informational tools. NoShot does not facilitate or accept wagers or gambling of any kind. All data and content are intended solely for informational and entertainment purposes.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Eligibility</h3>
              <p>
                By using the App, you represent and warrant that you are at least eighteen (18) years of age and have the legal capacity to enter into this Agreement.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">No Gambling or Wagering</h3>
              <p>
                NoShot does not operate as a sportsbook, gambling service, or wagering platform. Any data, insights, or predictions generated by the App are for informational purposes only and should not be interpreted as guarantees of any outcome. Users are solely responsible for any financial decisions made outside the App.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Account Registration</h3>
              <p>
                Users may be required to register for an account via email or supported single sign-on methods. You are responsible for maintaining the confidentiality of your credentials and agree to accept responsibility for all activities under your account.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Subscriptions and Payments</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Monthly:</strong> $14.99 (linked sportsbook), $24.99 (without linked sportsbook)</li>
                <li><strong>Annual:</strong> $69.99</li>
              </ul>
              <p className="mt-2">
                All payments are processed through third-party platforms such as Apple App Store or Google Play and are subject to their respective terms. Subscriptions automatically renew unless canceled at least 24 hours prior to renewal. No partial refunds shall be issued.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Third-Party Services</h3>
              <p>
                NoShot utilizes third-party providers, including Supabase and SharpSports, to manage and analyze user data securely. NoShot disclaims any liability for errors, omissions, or data practices of third-party providers.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Data and Analytics</h3>
              <p>
                You acknowledge and consent to the collection and use of user data, including betting data and activity metrics, as described in the NoShot Privacy Policy. All data processing is conducted in accordance with applicable privacy laws.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Intellectual Property</h3>
              <p>
                All content, logos, trade names, and materials contained in the App are the exclusive property of NoShot LLC. Users are prohibited from copying, modifying, distributing, or reproducing any materials without prior written consent.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Prohibited Conduct</h3>
              <p>Users shall not:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>attempt to hack, reverse engineer, or disrupt the App;</li>
                <li>use automated systems to exploit the App;</li>
                <li>share false or misleading betting data; or</li>
                <li>violate any applicable laws.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Disclaimer of Warranties</h3>
              <p className="italic">
                THE APP AND ALL CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE." NOSHOT DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. NOSHOT MAKES NO REPRESENTATION OR WARRANTY THAT THE APP WILL BE ERROR-FREE OR THAT RESULTS OBTAINED FROM USE WILL BE RELIABLE OR ACCURATE.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, NoShot LLC, its officers, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or exemplary damages arising out of or related to the use of the App or reliance on its content.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Indemnification</h3>
              <p>
                You agree to indemnify, defend, and hold harmless NoShot LLC and its affiliates from any claims, damages, liabilities, costs, or expenses arising from your violation of this Agreement or misuse of the App.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Governing Law</h3>
              <p>
                This Agreement shall be governed by and construed in accordance with the laws of the State of Florida, without regard to conflict of law principles.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Dispute Resolution</h3>
              <p>
                Any disputes arising under this Agreement shall be resolved exclusively through binding arbitration conducted in Florida. Users waive any right to a jury trial or participation in a class action.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Termination</h3>
              <p>
                NoShot reserves the right to suspend or terminate any user's access to the App for violation of these Terms or misuse of its services at its sole discretion.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-2">Contact Information</h3>
              <ul className="list-none space-y-1">
                <li><strong>Email:</strong> will@noshotapp.io</li>
                <li><strong>Entity:</strong> NoShot LLC</li>
                <li><strong>Jurisdiction:</strong> State of Florida</li>
              </ul>
            </div>

            <div className="border-t border-white/20 pt-4 mt-4">
              <p className="text-white/70 text-xs">
                <strong>NoShot LLC</strong>
                <br />
                <strong>By:</strong> Will Massey, Founder
                <br />
                <strong>Date:</strong> November 5, 2025
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-4 pt-4 border-t border-white/20">
            <Button
              onClick={() => setShowTermsModal(false)}
              className="bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
          disabled={isLoading || !termsAccepted}
          className={`w-full bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 animate-pulse-border ${
            isLoading || !termsAccepted ? 'opacity-50 cursor-not-allowed' : ''
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

        {/* Terms Agreement */}
        <div className="flex items-start gap-3 px-4">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            className="mt-0.5 border-white/40 data-[state=checked]:bg-[#AEE3F5] data-[state=checked]:border-[#AEE3F5]"
          />
          <label
            htmlFor="terms"
            className="text-xs text-gray-400 leading-relaxed cursor-pointer flex-1"
          >
            I agree to the{' '}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="text-[#AEE3F5] hover:underline font-medium"
            >
              Terms of Service
            </button>
            . Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.
          </label>
        </div>
      </div>
      </div>
    </>
  );
};

export default OnboardingStepPaywall;
