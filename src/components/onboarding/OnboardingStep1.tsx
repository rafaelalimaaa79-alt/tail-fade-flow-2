import React from 'react';

interface OnboardingStep1Props {
  value: string[];
  onSelect: (leagues: string[]) => void;
}

const leagues = [
  { id: 'nfl', name: 'NFL', icon: '🏈' },
  { id: 'nba', name: 'NBA', icon: '🏀' },
  { id: 'wnba', name: 'WNBA', icon: '🏀' },
  { id: 'mlb', name: 'MLB', icon: '⚾' },
  { id: 'nhl', name: 'NHL', icon: '🏒' },
  { id: 'soccer', name: 'Soccer', icon: '⚽' },
  { id: 'ncaab', name: 'NCAAB', icon: '🏀' },
  { id: 'ncaaf', name: 'NCAAF', icon: '🏈' },
];

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ value, onSelect }) => {
  const toggleLeague = (leagueId: string) => {
    if (value.includes(leagueId)) {
      onSelect(value.filter(id => id !== leagueId));
    } else {
      onSelect([...value, leagueId]);
    }
  };

  return (
    <div className="text-left">
      <h1 className="text-3xl font-bold text-white mb-2">
        WHICH LEAGUES DO YOU BET ON?
      </h1>
      <p className="text-white/70 text-lg mb-8">Select as many as you'd like.</p>

      <div className="grid grid-cols-2 gap-3">
        {leagues.map((league) => (
          <button
            key={league.id}
            onClick={() => toggleLeague(league.id)}
            className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
              value.includes(league.id)
                ? 'border-[#0EA5E9] bg-[#0EA5E9]/20'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="text-3xl mb-1">{league.icon}</div>
            <div className="text-white font-semibold text-base">{league.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingStep1;
