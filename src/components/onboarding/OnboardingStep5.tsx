import React from 'react';
import { Input } from '@/components/ui/input';

interface OnboardingStep5Props {
  value: string;
  onSelect: (bankroll: string) => void;
}

const quickAmounts = ['100', '200', '300', '500', '1000'];

const OnboardingStep5: React.FC<OnboardingStep5Props> = ({ value, onSelect }) => {
  return (
    <div className="text-left">
      <h1 className="text-3xl font-bold text-white mb-2">
        What's your total bankroll?
      </h1>
      <p className="text-white/70 text-lg mb-6">Enter in your total bankroll amount.</p>

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

      <div className="flex gap-2 overflow-x-auto pb-2">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => onSelect(amount)}
            className="px-6 py-3 rounded-xl border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white whitespace-nowrap transition-all"
          >
            ${amount}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingStep5;
