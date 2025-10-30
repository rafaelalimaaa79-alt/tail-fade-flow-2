import React from 'react';

interface OnboardingStep9Props {
  value: string[];
  onSelect: (sources: string[]) => void;
}

const sources = [
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { id: 'google', name: 'Google search', icon: '🔍', color: 'bg-white' },
  { id: 'friend', name: 'Friend/referral', icon: '👥', color: 'bg-yellow-500' },
  { id: 'x', name: 'X', icon: '✖️', color: 'bg-black border border-white/20' },
  { id: 'chatgpt', name: 'ChatGPT/AI', icon: '🤖', color: 'bg-teal-500' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black' },
  { id: 'podcast', name: 'Podcast', icon: '🎙️', color: 'bg-purple-600' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: 'bg-red-600' },
  { id: 'appstore', name: 'App Store Google Play', icon: '📱', color: 'bg-blue-600' },
];

const OnboardingStep9: React.FC<OnboardingStep9Props> = ({ value, onSelect }) => {
  const toggleSource = (sourceId: string) => {
    if (value.includes(sourceId)) {
      onSelect(value.filter(id => id !== sourceId));
    } else if (value.length < 2) {
      onSelect([...value, sourceId]);
    }
  };

  return (
    <div className="text-left">
      <h1 className="text-3xl font-bold text-white mb-2">
        HOW DID YOU HEAR ABOUT US?
      </h1>
      <p className="text-white/70 text-lg mb-6">Select up to 2</p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => toggleSource(source.id)}
            disabled={!value.includes(source.id) && value.length >= 2}
            className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              value.includes(source.id)
                ? 'border-[#AEE3F5] bg-[#AEE3F5]/20'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            } ${!value.includes(source.id) && value.length >= 2 ? 'opacity-40' : ''}`}
          >
            <div className={`w-12 h-12 rounded-xl ${source.color} flex items-center justify-center text-2xl`}>
              {source.icon}
            </div>
            <div className="text-white text-xs font-medium text-center leading-tight">
              {source.name}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => toggleSource('other')}
        className={`w-full p-4 rounded-2xl border-2 transition-all ${
          value.includes('other')
            ? 'border-[#AEE3F5] bg-[#AEE3F5]/20'
            : 'border-white/20 bg-white/5 hover:bg-white/10'
        }`}
      >
        <span className="text-white text-lg font-medium">Other</span>
      </button>
    </div>
  );
};

export default OnboardingStep9;
