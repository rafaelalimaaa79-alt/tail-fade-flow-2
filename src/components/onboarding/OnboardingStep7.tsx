import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OnboardingStep7Props {
  country: string;
  state: string;
  onSelect: (country: string, state: string) => void;
}

const OnboardingStep7: React.FC<OnboardingStep7Props> = ({ country, state, onSelect }) => {
  return (
    <div className="text-left">
      <h1 className="text-3xl font-bold text-white mb-2">
        WHERE ARE YOU LOCATED?
      </h1>
      <p className="text-white/70 text-base mb-6">
        Let us know where you're located so we can show odds and promos from apps in your area.
      </p>

      <div className="space-y-3">
        <Select value={country} onValueChange={(value) => onSelect(value, state)}>
          <SelectTrigger className="h-14 rounded-xl bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="United States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
          </SelectContent>
        </Select>

        <Select value={state} onValueChange={(value) => onSelect(country, value)}>
          <SelectTrigger className="h-14 rounded-xl bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select your state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ny">New York</SelectItem>
            <SelectItem value="ca">California</SelectItem>
            <SelectItem value="tx">Texas</SelectItem>
            <SelectItem value="fl">Florida</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OnboardingStep7;
