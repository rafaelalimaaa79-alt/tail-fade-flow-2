import React from 'react';
import { Instagram, MessageCircle, Twitter, Search, Users } from 'lucide-react';

type OnboardingStepReferralProps = {
  value: string | null;
  onSelect: (source: string) => void;
};

const referralSources = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E1306C' },
  { id: 'tiktok', label: 'TikTok', icon: MessageCircle, color: '#000000' },
  { id: 'x', label: 'X', icon: Twitter, color: '#000000' },
  { id: 'google', label: 'Google', icon: Search, color: '#4285F4' },
  { id: 'friend', label: 'Friend Referral', icon: Users, color: '#AEE3F5' },
];

const OnboardingStepReferral: React.FC<OnboardingStepReferralProps> = ({ value, onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-white text-3xl font-bold mb-8 text-center">
        How did you hear about us?
      </div>
      <div className="space-y-3 w-full">
        {referralSources.map((source) => {
          const IconComponent = source.icon;
          return (
            <button
              key={source.id}
              onClick={() => onSelect(source.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                value === source.id
                  ? 'border-[#AEE3F5] bg-[#AEE3F5]/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                value === source.id ? 'bg-[#AEE3F5]' : 'bg-white/10'
              }`}>
                <IconComponent className={`w-5 h-5 ${
                  value === source.id ? 'text-black' : 'text-white'
                }`} />
              </div>
              <span className="text-white text-lg font-medium">{source.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingStepReferral;
