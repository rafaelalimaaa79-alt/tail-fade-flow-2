import React, { useState } from 'react';

interface OnboardingStep7Props {
  value: string[];
  onSelect: (sportsbooks: string[]) => void;
}

const tabs = ['All', 'Sportsbooks', 'DFS Platforms'];

const sportsbooks = [
  { id: 'fanduel', name: 'FanDuel', icon: '🔷', category: 'both' },
  { id: 'draftkings', name: 'DraftKings', icon: '🟢', category: 'both' },
  { id: 'caesars', name: 'Caesars', icon: '🏛️', category: 'sportsbook' },
  { id: 'betmgm', name: 'BetMGM', icon: '🦁', category: 'sportsbook' },
  { id: 'prizepicks', name: 'PrizePicks', icon: '🟣', category: 'dfs' },
  { id: 'underdog', name: 'Underdog Fantasy', icon: '🐶', category: 'dfs' },
  { id: 'espnbet', name: 'ESPN BET', icon: '📺', category: 'sportsbook' },
  { id: 'sleeper', name: 'Sleeper', icon: '😴', category: 'dfs' },
];

const OnboardingStep7: React.FC<OnboardingStep7Props> = ({ value, onSelect }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectAll, setSelectAll] = useState(false);

  const toggleSportsbook = (sportsbookId: string) => {
    if (value.includes(sportsbookId)) {
      onSelect(value.filter(id => id !== sportsbookId));
    } else {
      onSelect([...value, sportsbookId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      onSelect([]);
      setSelectAll(false);
    } else {
      onSelect(sportsbooks.map(s => s.id));
      setSelectAll(true);
    }
  };

  const filteredSportsbooks = sportsbooks.filter(sb => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Sportsbooks') return sb.category === 'sportsbook' || sb.category === 'both';
    if (activeTab === 'DFS Platforms') return sb.category === 'dfs' || sb.category === 'both';
    return true;
  });

  return (
    <div className="text-left">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            WHICH SPORTSBOOK APPS DO YOU USE?
          </h1>
        </div>
        <button
          onClick={handleSelectAll}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#0EA5E9] text-[#0EA5E9] text-sm"
        >
          <div className={`w-4 h-4 rounded border-2 ${selectAll ? 'bg-[#0EA5E9] border-[#0EA5E9]' : 'border-[#0EA5E9]'}`} />
          Select All
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 bg-white/5 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg transition-all text-sm ${
              activeTab === tab
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sportsbooks list */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredSportsbooks.map((sportsbook) => (
          <button
            key={sportsbook.id}
            onClick={() => toggleSportsbook(sportsbook.id)}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
              value.includes(sportsbook.id)
                ? 'border-[#0EA5E9] bg-[#0EA5E9]/20'
                : 'border-white/20 bg-black hover:bg-white/5'
            }`}
          >
            <div className="text-3xl">{sportsbook.icon}</div>
            <span className="text-white text-lg font-medium flex-1 text-left">{sportsbook.name}</span>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              value.includes(sportsbook.id) ? 'border-[#0EA5E9] bg-[#0EA5E9]' : 'border-white/40'
            }`}>
              {value.includes(sportsbook.id) && (
                <div className="w-3 h-3 rounded-full bg-white" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingStep7;
