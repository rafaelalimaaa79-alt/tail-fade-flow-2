import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface OnboardingStep2Props {
  value: string[];
  selectedLeagues: string[];
  onSelect: (teams: string[]) => void;
}

const leagueFilters = [
  { id: 'nfl', name: 'NFL' },
  { id: 'nba', name: 'NBA' },
  { id: 'wnba', name: 'WNBA' },
];

// Sample teams - in real app, these would be filtered by league
const sampleTeams = [
  { id: '49ers', name: '49ers', league: 'nfl', logo: '🔴' },
  { id: 'bears', name: 'Bears', league: 'nfl', logo: '🐻' },
  { id: 'bengals', name: 'Bengals', league: 'nfl', logo: '🐯' },
  { id: 'bills', name: 'Bills', league: 'nfl', logo: '🦬' },
  { id: 'broncos', name: 'Broncos', league: 'nfl', logo: '🐴' },
  { id: 'browns', name: 'Browns', league: 'nfl', logo: '🟤' },
  { id: 'buccaneers', name: 'Buccaneers', league: 'nfl', logo: '🏴‍☠️' },
  { id: 'cardinals', name: 'Cardinals', league: 'nfl', logo: '🔴' },
  { id: 'chargers', name: 'Chargers', league: 'nfl', logo: '⚡' },
];

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ value, onSelect }) => {
  const [selectedLeague, setSelectedLeague] = useState('nfl');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleTeam = (teamId: string) => {
    if (value.includes(teamId)) {
      onSelect(value.filter(id => id !== teamId));
    } else {
      onSelect([...value, teamId]);
    }
  };

  const filteredTeams = sampleTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-left">
      <h1 className="text-3xl font-bold text-white mb-2">
        WHAT ARE YOUR FAVORITE TEAMS?
      </h1>
      <p className="text-white/70 text-lg mb-6">Select as many as you'd like.</p>

      {/* League filters */}
      <div className="flex gap-2 mb-4">
        {leagueFilters.map((league) => (
          <button
            key={league.id}
            onClick={() => setSelectedLeague(league.id)}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedLeague === league.id
                ? 'bg-[#AEE3F5] text-black'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">{league.id === 'nfl' ? '🏈' : league.id === 'nba' ? '🏀' : '🏀'}</span>
              {league.name}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input
          type="text"
          placeholder="Enter a team"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12 rounded-xl"
        />
      </div>

      {/* Teams grid */}
      <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
        {filteredTeams.map((team) => (
          <button
            key={team.id}
            onClick={() => toggleTeam(team.id)}
            className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              value.includes(team.id)
                ? 'border-[#AEE3F5] bg-[#AEE3F5]/20'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="text-3xl">{team.logo}</div>
            <div className="text-white text-sm font-medium text-center">{team.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingStep2;
