import React from 'react';
import { Input } from '@/components/ui/input';

interface OnboardingStep5Props {
  value: string;
  onSelect: (amount: string) => void;
}

const quickAmounts = ['50', '100', '150', '200', '250', '300', '400', '500', '750'];

const OnboardingStep5: React.FC<OnboardingStep5Props> = ({ value, onSelect }) => {
  return (
    <div className="text-left">
      <h1 className="text-3xl font-bold text-white mb-2">
        What's the average you go down each week?
      </h1>
      <p className="text-white/70 text-lg mb-6">No lying allowed</p>

      <div className="relative mb-4">
        <Input
          type="number"
          placeholder=""
          value={value}
          onChange={(e) => onSelect(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 rounded-xl text-lg pr-12"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-xl">$</span>
      </div>

      <div className="grid grid-cols-3 gap-2 max-h-[300px]">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => onSelect(amount)}
            className="px-4 py-3 rounded-xl border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            ${amount}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingStep5;
