
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface OnboardingStep1Props {
  selectedLeagues: string[];
  onSelect: (leagues: string[]) => void;
  onNext: () => void;
}

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ selectedLeagues, onSelect, onNext }) => {
  const leagues = [
    { id: 'nfl', name: 'NFL', logo: '🏈' },
    { id: 'nba', name: 'NBA', logo: '🏀' },
    { id: 'wnba', name: 'WNBA', logo: '🏀' },
    { id: 'mlb', name: 'MLB', logo: '⚾' },
    { id: 'nhl', name: 'NHL', logo: '🏒' },
    { id: 'soccer', name: 'Soccer', logo: '⚽' },
    { id: 'ncaab', name: 'NCAAB', logo: '🏀' },
    { id: 'ncaaf', name: 'NCAAF', logo: '🏈' },
  ];

  const toggleLeague = (leagueId: string) => {
    if (selectedLeagues.includes(leagueId)) {
      onSelect(selectedLeagues.filter(id => id !== leagueId));
    } else {
      onSelect([...selectedLeagues, leagueId]);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-3">
          WHICH LEAGUES DO YOU BET ON?
        </h1>
        <p className="text-xl text-white/70">
          Select as many as you'd like.
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {leagues.map((league, index) => (
          <motion.button
            key={league.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => toggleLeague(league.id)}
            className={`aspect-square rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
              selectedLeagues.includes(league.id)
                ? 'border-[#0066FF] bg-[#0066FF]/10'
                : 'border-white/20 bg-gray-900/50 hover:border-white/40'
            }`}
          >
            <span className="text-5xl">{league.logo}</span>
            <span className="text-white font-medium text-lg">{league.name}</span>
          </motion.button>
        ))}
      </div>

      <Button
        onClick={onNext}
        disabled={selectedLeagues.length === 0}
        className="w-full h-14 text-lg font-semibold bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </Button>
    </div>
  );
};

export default OnboardingStep1;
