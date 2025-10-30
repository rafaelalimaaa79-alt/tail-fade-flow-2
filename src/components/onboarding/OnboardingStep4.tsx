import React from 'react';

interface OnboardingStep4Props {
  value: string;
  onSelect: (experience: string) => void;
}

const experiences = [
  { id: 'beginner', label: 'Beginner', description: 'Just getting started' },
  { id: 'experienced', label: 'Experienced', description: 'I know what I\'m doing' },
];

const OnboardingStep4: React.FC<OnboardingStep4Props> = ({ value, onSelect }) => {
  return (
    <div className="text-left">
      <h1 className="text-3xl font-bold text-white mb-2">
        HOW EXPERIENCED OF A BETTOR ARE YOU?
      </h1>
      <p className="text-white/70 text-lg mb-8">Select one.</p>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <button
            key={exp.id}
            onClick={() => onSelect(exp.id)}
            className={`w-full p-8 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
              value === exp.id
                ? 'border-[#AEE3F5] bg-[#AEE3F5]/20'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              value === exp.id ? 'border-[#AEE3F5]' : 'border-white/40'
            }`}>
              {value === exp.id && (
                <div className="w-4 h-4 rounded-full bg-[#AEE3F5]" />
              )}
            </div>
            <div className="text-center">
              <div className="text-white text-2xl font-bold mb-1">{exp.label}</div>
              <div className="text-white/60 text-base">{exp.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingStep4;
