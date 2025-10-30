import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { triggerHaptic } from "@/utils/haptic-feedback";

interface OnboardingStepPaywallProps {
  onSelect: () => void;
}

const OnboardingStepPaywall: React.FC<OnboardingStepPaywallProps> = ({ onSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  const handlePlanToggle = (plan: 'monthly' | 'annual') => {
    triggerHaptic('selectionChanged');
    setSelectedPlan(plan);
  };

  const handleStartTrial = () => {
    triggerHaptic('impactMedium');
    onSelect();
  };

  return (
    <div className="flex flex-col items-center justify-between h-full px-6 py-8">
      {/* Header */}
      <div className="text-center space-y-3 mt-8">
        <h1 className="text-white text-4xl font-bold leading-tight">
          See Who's Ice Cold Free for 7 Days
        </h1>
        <p className="text-gray-400 text-base">
          Know who's losing before you bet. Start risk-free.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="w-full space-y-3 my-8">
        {/* Monthly Plan */}
        <button
          onClick={() => handlePlanToggle('monthly')}
          className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 ${
            selectedPlan === 'monthly'
              ? 'border-[#AEE3F5] bg-[#AEE3F5]/10'
              : 'border-white/20 bg-white/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'monthly'
                  ? 'border-[#AEE3F5] bg-[#AEE3F5]'
                  : 'border-white/40'
              }`}>
                {selectedPlan === 'monthly' && <Check className="w-4 h-4 text-black" />}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg font-semibold">Monthly</span>
                  <span className="text-[#AEE3F5] text-xs font-medium px-2 py-0.5 bg-[#AEE3F5]/20 rounded-full">
                    Most Popular
                  </span>
                </div>
                <span className="text-white text-2xl font-bold">$19.99</span>
              </div>
            </div>
          </div>
        </button>

        {/* Annual Plan */}
        <button
          onClick={() => handlePlanToggle('annual')}
          className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 ${
            selectedPlan === 'annual'
              ? 'border-[#AEE3F5] bg-[#AEE3F5]/10'
              : 'border-white/20 bg-white/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'annual'
                  ? 'border-[#AEE3F5] bg-[#AEE3F5]'
                  : 'border-white/40'
              }`}>
                {selectedPlan === 'annual' && <Check className="w-4 h-4 text-black" />}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg font-semibold">Annually</span>
                  <span className="text-[#AEE3F5] text-xs font-medium px-2 py-0.5 bg-[#AEE3F5]/20 rounded-full">
                    Best Value
                  </span>
                </div>
                <span className="text-white text-2xl font-bold">$99.99</span>
              </div>
            </div>
          </div>
        </button>
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
          className="w-full bg-[#AEE3F5] hover:bg-[#AEE3F5]/90 text-black font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 animate-pulse-border"
        >
          Start 7-Day Free Trial
          <ArrowRight className="w-5 h-5" />
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
  );
};

export default OnboardingStepPaywall;
