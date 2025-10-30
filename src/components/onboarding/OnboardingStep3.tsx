import React from 'react';
import { Input } from '@/components/ui/input';

interface OnboardingStep3Props {
  value: string;
  onSelect: (name: string) => void;
}

const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ value, onSelect }) => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-white mb-2">
        Got a nickname?
      </h1>
      <p className="text-white/70 text-lg mb-6">What should we call you?</p>

      <Input
        type="text"
        placeholder="Enter your display name"
        value={value}
        onChange={(e) => onSelect(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 rounded-xl text-lg"
      />
    </div>
  );
};

export default OnboardingStep3;
