import React from 'react';
import nflLogo from '@/assets/leagues/nfl-logo.png';
import nbaLogo from '@/assets/leagues/nba-logo.png';
import wnbaLogo from '@/assets/leagues/wnba-logo.png';
import mlbLogo from '@/assets/leagues/mlb-logo.png';
import nhlLogo from '@/assets/leagues/nhl-logo.png';
import soccerLogo from '@/assets/leagues/soccer-logo.png';
import ncaabLogo from '@/assets/leagues/ncaab-logo.png';
import ncaafLogo from '@/assets/leagues/ncaaf-logo.png';

interface OnboardingStep1Props {
  value: string[];
  onSelect: (leagues: string[]) => void;
}

const leagues = [
  { id: 'nfl', name: 'NFL', logo: nflLogo },
  { id: 'nba', name: 'NBA', logo: nbaLogo },
  { id: 'mlb', name: 'MLB', logo: mlbLogo },
  { id: 'nhl', name: 'NHL', logo: nhlLogo },
  { id: 'ncaab', name: 'NCAAB', logo: ncaabLogo },
  { id: 'ncaaf', name: 'NCAAF', logo: ncaafLogo },
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
            className={`p-3 rounded-2xl border-2 transition-all duration-200 ${
              value.includes(league.id)
                ? 'border-[#AEE3F5] bg-[#AEE3F5]/20'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-center mb-1 h-14">
              <img 
                src={league.logo} 
                alt={`${league.name} logo`}
                className={`max-w-full max-h-full object-contain ${league.id === 'mlb' ? 'scale-75' : ''}`}
              />
            </div>
            <div className="text-white font-semibold text-sm">{league.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingStep1;
