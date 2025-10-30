import React from 'react';

interface OnboardingStep4Props {
  value: string;
  onSelect: (experience: string) => void;
}

const experiences = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

const OnboardingStep4: React.FC<OnboardingStep4Props> = ({ value, onSelect }) => {
  return (
    <div className="text-left">
      <h1 className="text-3xl font-bold text-white mb-2">
        HOW EXPERIENCED OF A BETTOR ARE YOU?
      </h1>
      <p className="text-white/70 text-lg mb-8">Select one.</p>

      <div className="space-y-3">
        {experiences.map((exp) => (
          <button
            key={exp.id}
            onClick={() => onSelect(exp.id)}
            className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
              value === exp.id
                ? 'border-[#0EA5E9] bg-[#0EA5E9]/20'
                : 'border-white/20 bg-black hover:bg-white/5'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              value === exp.id ? 'border-[#0EA5E9]' : 'border-white/40'
            }`}>
              {value === exp.id && (
                <div className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
              )}
            </div>
            <span className="text-white text-lg font-medium">{exp.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingStep4;
