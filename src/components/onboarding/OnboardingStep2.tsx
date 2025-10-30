
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface OnboardingStep2Props {
  selectedTeams: string[];
  selectedLeague: string;
  onSelect: (teams: string[]) => void;
  onNext: () => void;
}

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ selectedTeams, onSelect, onNext }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLeague, setActiveLeague] = useState('NFL');

  const leagues = ['NFL', 'NBA', 'WNBA', 'MLB'];
  
  const nflTeams = [
    { id: '49ers', name: '49ers', logo: '🔴' },
    { id: 'bears', name: 'Bears', logo: '🐻' },
    { id: 'bengals', name: 'Bengals', logo: '🐯' },
    { id: 'bills', name: 'Bills', logo: '🦬' },
    { id: 'broncos', name: 'Broncos', logo: '🐴' },
    { id: 'browns', name: 'Browns', logo: '🟤' },
    { id: 'buccaneers', name: 'Buccaneers', logo: '🏴‍☠️' },
    { id: 'cardinals', name: 'Cardinals', logo: '🦅' },
  ];

  const teams = nflTeams;

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTeam = (teamId: string) => {
    if (selectedTeams.includes(teamId)) {
      onSelect(selectedTeams.filter(id => id !== teamId));
    } else {
      onSelect([...selectedTeams, teamId]);
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
          WHAT ARE YOUR FAVORITE TEAMS?
        </h1>
        <p className="text-xl text-white/70">
          Select as many as you'd like.
        </p>
      </motion.div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {leagues.map(league => (
          <button
            key={league}
            onClick={() => setActiveLeague(league)}
            className={`px-6 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
              activeLeague === league
                ? 'bg-[#0066FF] text-white'
                : 'bg-gray-900 text-white/70 hover:text-white'
            }`}
          >
            {league}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
        <input
          type="text"
          placeholder="Enter a team"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/50 focus:outline-none focus:border-[#0066FF]"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 max-h-96 overflow-y-auto">
        {filteredTeams.map((team, index) => (
          <motion.button
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => toggleTeam(team.id)}
            className={`aspect-square rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
              selectedTeams.includes(team.id)
                ? 'border-[#0066FF] bg-[#0066FF]/10'
                : 'border-white/20 bg-gray-900/50 hover:border-white/40'
            }`}
          >
            <span className="text-4xl">{team.logo}</span>
            <span className="text-white font-medium text-sm">{team.name}</span>
          </motion.button>
        ))}
      </div>

      <Button
        onClick={onNext}
        disabled={selectedTeams.length === 0}
        className="w-full h-14 text-lg font-semibold bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </Button>
    </div>
  );
};

export default OnboardingStep2;
