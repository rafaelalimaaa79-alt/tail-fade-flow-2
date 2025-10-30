import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OnboardingStep8Props {
  value: { month: string; day: string; year: string };
  onSelect: (birthday: { month: string; day: string; year: string }) => void;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const years = Array.from({ length: 100 }, (_, i) => (2024 - i).toString());

const OnboardingStep8: React.FC<OnboardingStep8Props> = ({ value, onSelect }) => {
  return (
    <div className="text-left">
      <h1 className="text-3xl font-bold text-white mb-2">
        WHEN IS YOUR BIRTHDAY?
      </h1>
      <p className="text-white/70 text-base mb-6">
        We'd love to send you something on your special day! 🎉
      </p>

      <div className="space-y-3">
        <Select value={value.month} onValueChange={(month) => onSelect({ ...value, month })}>
          <SelectTrigger className="h-14 rounded-xl bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month.toLowerCase()}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={value.day} onValueChange={(day) => onSelect({ ...value, day })}>
          <SelectTrigger className="h-14 rounded-xl bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day}>{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={value.year} onValueChange={(year) => onSelect({ ...value, year })}>
          <SelectTrigger className="h-14 rounded-xl bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OnboardingStep8;
